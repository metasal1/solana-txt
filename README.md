# solana.txt

A simple standard for linking domains to Solana addresses.

## The Problem

- Scam tokens impersonate legitimate projects
- No easy way to verify "is this the real token?"
- Users get rugged by fake mints with similar names
- Token metadata can claim any website

## The Solution

A plain text file at `example.com/solana.txt` that declares:

> "This domain officially owns mint address X"

Like `robots.txt` for Solana verification.

## Quick Start

Create a file called `solana.txt` in your website root:

```
mint: YourTokenMintAddressHere123456789abcdef
```

That's it.

## Example

**bonkcoin.com/solana.txt:**
```
# Official BONK token
mint: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
```

**Verification flow:**
1. Wallet sees a BONK token with metadata pointing to bonkcoin.com
2. Wallet fetches `bonkcoin.com/solana.txt`
3. Mint address matches → ✅ "Verified by bonkcoin.com"

## Specification

See [SPEC.md](./SPEC.md) for the full technical specification.

## Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `mint` | Token mint address | `mint: EPjFWdd...` |
| `wallet` | Official wallet | `wallet: 5ZiE3v...` |
| `collection` | NFT collection | `collection: J1S9H3...` |
| `program` | On-chain program | `program: Tokenkeg...` |
| `actions` | Solana Actions URL | `actions: https://...` |
| `contact` | Security contact | `contact: security@...` |

## Why Plain Text?

- **Simple**: Create with notepad, no devs needed
- **Readable**: Humans can verify at a glance
- **Proven**: Same format as robots.txt (30 years old)
- **Lightweight**: No parsing libraries required

## Adoption

For this to work, we need:

1. **Projects** → Add solana.txt to their domains
2. **Wallets** → Fetch and display verification badges
3. **Explorers** → Show "verified by domain" on token pages
4. **DEXs** → Check solana.txt before listing tokens

## FAQ

**Q: Why not JSON?**  
A: Simplicity. One line of text is easier than a JSON schema.

**Q: Where should I put the file?**  
A: Root directory (`/solana.txt`) or `/.well-known/solana.txt`

**Q: Can I list multiple tokens?**  
A: Yes, one `mint:` line per token.

**Q: What if someone hacks my domain?**  
A: Same risk as any domain-based verification. Use good security practices.

## Contributing

Open an issue or PR. This is a community standard.

## License

CC0 — Public Domain
