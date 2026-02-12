#!/usr/bin/env node

/**
 * solana-txt checker
 * Validates a domain's .well-known/solana.txt against sRFC-35
 * 
 * Usage: node index.mjs <domain> [address]
 */

const domain = process.argv[2];
const checkAddress = process.argv[3];

if (!domain) {
  console.log(`
  solana-txt checker — Verify domain/address associations per sRFC-35

  Usage:
    node index.mjs <domain>              List all associations
    node index.mjs <domain> <address>    Check specific address

  Examples:
    node index.mjs metasal.xyz
    node index.mjs bonkcoin.com DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
  `);
  process.exit(1);
}

const TAGS = ['solana-mint-address', 'solana-program-address', 'solana-address'];

function parseRecord(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const parts = trimmed.split(/\s+/);
  const record = {};

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (!key || value === undefined) continue;

    if (TAGS.includes(key)) {
      record.tag = key;
      record.address = value;
    } else {
      record[key] = value;
    }
  }

  if (!record.tag || !record.address) return null;

  // Defaults
  if (!record.deny && !record.allow) record.allow = 'true';
  if (!record.network) record.network = 'mainnet';

  record.isDeny = record.deny === '1' || record.deny === 'true';
  record.isAllow = !record.isDeny;
  record.isDenyAll = record.address === 'denyall';

  return record;
}

async function fetchSolanaTxt(domain) {
  const urls = [
    `https://${domain}/.well-known/solana.txt`,
    `https://${domain}/solana.txt`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { 
        redirect: 'follow',
        headers: { 'User-Agent': 'solana-txt-checker/1.0' }
      });
      if (res.ok) {
        const text = await res.text();
        return { url, text };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

async function main() {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  console.log(`\n🔍 Checking ${cleanDomain}...\n`);

  const result = await fetchSolanaTxt(cleanDomain);

  if (!result) {
    console.log(`❌ No solana.txt found at ${cleanDomain}`);
    console.log(`   Checked:`);
    console.log(`   - https://${cleanDomain}/.well-known/solana.txt`);
    console.log(`   - https://${cleanDomain}/solana.txt`);
    process.exit(1);
  }

  console.log(`✅ Found: ${result.url}\n`);

  const lines = result.text.split('\n');
  const records = lines.map(parseRecord).filter(Boolean);

  // Check for deny-all
  const denyAll = records.find(r => r.isDenyAll);
  if (denyAll) {
    console.log(`🚫 DENY ALL — ${cleanDomain} denies ALL Solana associations\n`);
    process.exit(0);
  }

  if (records.length === 0) {
    console.log(`⚠️  File found but no valid association records\n`);
    process.exit(1);
  }

  // Display all records
  console.log(`📋 ${records.length} association record(s):\n`);

  for (const rec of records) {
    const status = rec.isDeny ? '🚫 DENY' : '✅ ALLOW';
    const type = rec.tag.replace('solana-', '').replace('-address', '');
    const net = rec.network !== 'mainnet' ? ` (${rec.network})` : '';
    console.log(`   ${status} ${type}: ${rec.address}${net}`);
  }

  // Check specific address if provided
  if (checkAddress) {
    console.log(`\n🔎 Checking address: ${checkAddress}`);
    const match = records.find(r => r.address === checkAddress);
    
    if (match) {
      if (match.isAllow) {
        console.log(`   ✅ VERIFIED — ${cleanDomain} claims this address`);
      } else {
        console.log(`   🚫 DENIED — ${cleanDomain} explicitly denies this address`);
      }
    } else {
      console.log(`   ⚠️  NOT FOUND — address not listed in solana.txt`);
    }
  }

  console.log('');
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
