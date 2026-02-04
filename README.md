# solana.txt

A simple standard for linking domains to Solana addresses — based on [sRFC-35](https://forum.solana.com/t/srfc-35-address-domain-association-specification/3155).

## The Problem

- Scam tokens impersonate legitimate projects
- No easy way to verify "is this the real token?"
- Users get rugged by fake mints with similar names
- sRFC-35 exists but adoption is low

## The Solution

A plain text file at `example.com/.well-known/solana.txt` that declares:

> "This domain officially owns mint address X"

Like `robots.txt` for Solana verification.

## Quick Start

Create `/.well-known/solana.txt` on your website:

```
solana-mint-address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

That's it.

## Format (sRFC-35)

One association record per line, using tag=value pairs:

```
# Token association
solana-mint-address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263

# Program association
solana-program-address=JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4

# General address
solana-address=MTSLZDJppGh6xUcnrSSbSQE5fgbvCtQ496MqgQTv8c1

# Deny association (fight scams)
solana-mint-address=FakeTokenMintAddress123 deny=1

# Deny ALL associations
solana-address=denyall
```

## Tags

| Tag | Purpose |
|-----|---------|
| `solana-mint-address` | Associate a token mint |
| `solana-program-address` | Associate a program |
| `solana-address` | Associate any address |

## Qualifiers

| Qualifier | Purpose | Default |
|-----------|---------|---------|
| `allow=1` | Explicitly allow association | Default if omitted |
| `deny=1` | Explicitly deny association | |
| `network=mainnet` | Specify network | mainnet |

## Example: bonkcoin.com/.well-known/solana.txt

```
# Official BONK token
solana-mint-address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
```

## Alternative: DNS TXT Records

sRFC-35 also supports DNS TXT records (recommended for higher security):

```
TXT "solana-mint-address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
```

## Checker Tool

Verify any domain's solana.txt:

```bash
npx solana-txt check bonkcoin.com
```

See [checker/](./checker/) for the tool.

## Adoption

For this to work, we need:

1. **Projects** → Add solana.txt to their domains ← **you are here**
2. **Wallets** → Fetch and display verification badges
3. **Explorers** → Show "verified by domain" on token pages
4. **DEXs** → Check solana.txt before listing tokens

## Who's using it?

- [metasal.xyz](https://metasal.xyz/.well-known/solana.txt) ✓

*Add your site via PR!*

## Specification

Full spec: [sRFC-35 on Solana Forums](https://forum.solana.com/t/srfc-35-address-domain-association-specification/3155)

## Contributing

Open an issue or PR. Let's drive adoption.

## License

CC0 — Public Domain
