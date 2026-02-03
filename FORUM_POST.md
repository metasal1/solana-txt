# [Proposal] solana.txt — Domain Verification for Solana Tokens

## TL;DR

A simple `robots.txt`-style file that lets domains prove they own a token mint address.

```
# example.com/solana.txt
mint: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
```

**GitHub:** https://github.com/metasal1/solana-txt

---

## The Problem

Scam tokens are everywhere. They copy names, logos, and even metadata URIs from legitimate projects. Users get rugged because there's no easy way to verify:

> "Is this actually the official token?"

Token metadata can claim any website. But there's no reverse verification — no way for the *domain* to say "yes, this mint is ours."

---

## The Solution

**solana.txt** — a plain text file in your website root that declares which Solana addresses belong to you.

### How It Works

1. Project creates `example.com/solana.txt`:
   ```
   mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
   ```

2. Wallet/explorer fetches token, sees metadata URI points to example.com

3. Wallet fetches `example.com/solana.txt`

4. Mint address matches → ✅ **"Verified by example.com"**

### Why Plain Text?

- **Dead simple** — create with notepad
- **No dependencies** — no JSON parsing needed
- **Battle-tested format** — same as robots.txt (30 years old)
- **Human readable** — anyone can verify manually

---

## Spec Overview

**Location:** `/solana.txt` or `/.well-known/solana.txt`

**Directives:**
- `mint:` — Token mint address
- `wallet:` — Official wallet address
- `collection:` — NFT collection address
- `program:` — On-chain program address
- `actions:` — Solana Actions endpoint
- `contact:` — Security contact

**Full Example:**
```
# Jupiter Aggregator
# https://jup.ag

program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4
mint: JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
wallet: JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
actions: https://jup.ag/api/actions
contact: security@jup.ag
```

---

## What We Need

For this to work:

1. **Projects** adopt solana.txt on their domains
2. **Wallets** (Phantom, Backpack, etc.) fetch and display verification
3. **Explorers** (Solscan, Solana FM) show "verified by domain" badges
4. **DEXs/Aggregators** check solana.txt before listing

---

## Prior Art

| Standard | Purpose | Age |
|----------|---------|-----|
| robots.txt | Crawler rules | 1994 |
| security.txt | Security contacts | 2022 (RFC 9116) |
| nostr.json | Nostr identity | 2023 |
| assetlinks.json | App linking | 2015 |

All use simple files at well-known locations. This is proven infrastructure.

---

## Open Questions

1. **Bidirectional verification?** — Should token metadata be required to point back to the domain?
2. **Signature support?** — Optional wallet signature to cryptographically prove ownership?
3. **DNS TXT records?** — Alternative: `_solana.example.com TXT "mint=..."`
4. **Who maintains this?** — Community standard? Solana Foundation?

---

## Get Involved

- **GitHub:** https://github.com/metasal1/solana-txt
- **Spec:** [SPEC.md](https://github.com/metasal1/solana-txt/blob/main/SPEC.md)
- **Examples:** [/examples](https://github.com/metasal1/solana-txt/tree/main/examples)

PRs and feedback welcome. Let's make token verification simple.

---

*What do you think? Would your project adopt this? What's missing?*
