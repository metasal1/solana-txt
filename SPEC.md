# solana.txt Specification

**Version:** 0.1 (Draft)  
**Status:** Proposal  
**Authors:** Metasal  
**Created:** 2026-02-03  

## Abstract

This document specifies `solana.txt`, a plain text file format for websites to declare their association with Solana blockchain addresses. The primary use case is verifying that a domain officially owns or represents a token mint address.

## 1. File Location

The file MUST be accessible at one of these URLs:

**Primary:**
```
https://<domain>/solana.txt
```

**Alternative:**
```
https://<domain>/.well-known/solana.txt
```

Clients SHOULD check the primary location first, then fall back to `.well-known`.

## 2. File Format

### 2.1 Encoding

- Character encoding: UTF-8
- Line endings: LF (`\n`) or CRLF (`\r\n`)
- MIME type: `text/plain`

### 2.2 Syntax

```
# This is a comment
directive: value
```

- Lines starting with `#` are comments
- Empty lines are ignored
- Directives are case-insensitive (`mint:` = `MINT:` = `Mint:`)
- Values are case-sensitive (addresses are base58)
- Whitespace around `:` is trimmed

### 2.3 Grammar (ABNF)

```abnf
file        = *(line LF)
line        = comment / directive / empty
comment     = "#" *VCHAR
directive   = name ":" SP value
name        = 1*ALPHA
value       = 1*VCHAR
empty       = *WSP
```

## 3. Directives

### 3.1 mint

Declares a token mint address owned by this domain.

```
mint: <base58-encoded-address>
```

Multiple `mint` directives are allowed:

```
mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
mint: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
```

### 3.2 wallet

Declares an official wallet address (e.g., for payments, treasury).

```
wallet: <base58-encoded-address>
```

### 3.3 collection

Declares an NFT collection address owned by this domain.

```
collection: <base58-encoded-address>
```

### 3.4 program

Declares an on-chain program deployed by this domain.

```
program: <base58-encoded-address>
```

### 3.5 actions

Declares the Solana Actions (Blinks) endpoint URL.

```
actions: <url>
```

### 3.6 contact

Declares a security or support contact.

```
contact: <email-or-url>
```

## 4. Validation

### 4.1 Address Validation

All address values MUST be:
- Valid base58 encoding
- 32-44 characters in length
- Decodable to 32 bytes

### 4.2 URL Validation

URL values (e.g., `actions`) MUST be:
- Valid absolute URLs
- HTTPS scheme (HTTP not allowed)

## 5. Verification

### 5.1 Basic Verification

1. Extract domain from token metadata URI
2. Fetch `https://<domain>/solana.txt`
3. Parse file and extract `mint` values
4. If token's mint address is listed → **VERIFIED**

### 5.2 Bidirectional Verification (Recommended)

For stronger verification:

1. Token metadata URI points to `https://example.com/token.json`
2. `example.com/solana.txt` lists the token's mint address
3. Both directions match → **STRONGLY VERIFIED**

This prevents:
- Malicious domains claiming tokens they don't own
- Tokens claiming domains that don't acknowledge them

## 6. Caching

Clients SHOULD:
- Cache responses for at least 1 hour
- Respect `Cache-Control` headers if present
- Re-fetch on user request ("refresh verification")

Clients MUST NOT:
- Cache failures for more than 5 minutes
- Trust cached data older than 24 hours without refresh

## 7. Security Considerations

### 7.1 Transport Security

- File MUST be served over HTTPS
- Clients MUST reject HTTP responses
- Clients SHOULD verify TLS certificates

### 7.2 Domain Security

Domain owners are responsible for:
- Securing their web hosting
- Monitoring for unauthorized changes
- Revoking compromised addresses promptly

### 7.3 Trust Model

This specification provides **domain-based verification only**. It proves:
- ✅ "Domain X claims to own mint Y"
- ❌ Does NOT prove the domain itself is trustworthy
- ❌ Does NOT prove the token is safe to trade

Clients SHOULD combine with other signals (audits, reputation, etc.).

## 8. IANA Considerations

### 8.1 Well-Known URI Registration

If adopted, register with IANA:

- URI suffix: `solana.txt`
- Change controller: Solana Foundation
- Reference: This specification
- Status: Provisional

## 9. Examples

### 9.1 Minimal

```
mint: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
```

### 9.2 Token Project

```
# USDC - Circle
# https://www.circle.com

mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
wallet: 7VHUFJHWu2CuExkJcJrzhQPJ2oygupTWkL2A2For4BmE
contact: security@circle.com
```

### 9.3 NFT Project

```
# Mad Lads by Backpack

collection: J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w
wallet: MLADsNjknqNvXe3GpTT3i6b4wTEm51r5hP4PVQGTHBD
actions: https://madlads.com/api/actions
contact: support@backpack.exchange
```

### 9.4 Protocol

```
# Jupiter Aggregator

program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4
mint: JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
wallet: JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
actions: https://jup.ag/api/actions
contact: security@jup.ag
```

## 10. Future Extensions

Potential additions (not in v0.1):
- `signature`: Cryptographic proof signed by wallet
- `expires`: Expiration date for time-limited verification
- `canonical`: Canonical domain if multiple exist

## Appendix A: Reference Implementation

```javascript
async function verifySolanaTxt(domain, mintAddress) {
  const urls = [
    `https://${domain}/solana.txt`,
    `https://${domain}/.well-known/solana.txt`
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      
      const text = await res.text();
      const mints = text
        .split('\n')
        .filter(line => line.toLowerCase().startsWith('mint:'))
        .map(line => line.split(':')[1].trim());
      
      if (mints.includes(mintAddress)) {
        return { verified: true, domain, url };
      }
    } catch (e) {
      continue;
    }
  }
  
  return { verified: false };
}
```

## Appendix B: Changelog

- **0.1** (2026-02-03): Initial draft
