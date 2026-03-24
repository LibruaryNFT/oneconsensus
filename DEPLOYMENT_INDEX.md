# OneChain Smart Contract Deployment Index

**Status:** ✅ All 3 contracts validated and ready for deployment
**Date:** 2026-03-24
**Project:** OnePredict Arena

---

## Quick Navigation

### 🚀 For the Impatient (Start Here!)
→ **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)** (5 min read)
- Install Sui CLI
- Get testnet tokens
- Build & deploy
- Extract package ID

### 📋 For Step-by-Step Deployment
→ **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** (10 min read)
- Pre-deployment verification
- Detailed deployment steps
- Post-deployment verification
- Troubleshooting

### 📖 For Complete Documentation
→ **[DEPLOY_ONECHAIN.md](./DEPLOY_ONECHAIN.md)** (20 min read)
- Detailed prerequisite guide
- Multiple deployment options
- Integration examples
- Reference materials

### 📊 For Technical Details
→ **[deployment-summary.md](./deployment-summary.md)** (15 min read)
- Contract specifications
- Function signatures
- Event definitions
- Integration patterns

### 🎯 For Executive Summary
→ **[FINAL_DEPLOYMENT_REPORT.md](./FINAL_DEPLOYMENT_REPORT.md)** (20 min read)
- Executive overview
- Contract architecture
- Gas estimation
- Verification procedures

---

## What's Being Deployed?

### 3 Move Smart Contracts

| Contract | Lines | Purpose |
|----------|-------|---------|
| **prediction_pool.move** | 160 | On-chain prediction markets with staking |
| **leaderboard.move** | 114 | Player rankings and statistics |
| **rewards.move** | 80 | ARENA token rewards system |

**Total:** 354 lines of Move code, all validated ✅

---

## Deployment Checklist at a Glance

- [ ] **Install Sui CLI** (5 minutes)
  - macOS: `brew install sui`
  - Other: Cargo installation (see DEPLOY_ONECHAIN.md)

- [ ] **Generate keypair** (1 minute)
  - `sui keytool generate ed25519`

- [ ] **Configure OneChain testnet** (1 minute)
  - `sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443`

- [ ] **Get testnet tokens** (varies)
  - Request from OneChain faucet
  - Need ~500M for gas

- [ ] **Build contracts** (1 minute)
  - `cd contracts && sui move build`

- [ ] **Deploy** (2 minutes)
  - `sui client publish --gas-budget 200000000 --json > deployment_output.json`

- [ ] **Extract package ID** (1 minute)
  - `cat deployment_output.json | jq '.effects.created[0].reference.objectId'`

- [ ] **Update frontend** (2 minutes)
  - Add package ID to `.env.local`

**Total time:** ~15-20 minutes (including Sui CLI installation)

---

## Contract Details

### prediction_pool.move
Creates on-chain prediction markets where players:
- Stake coins on price direction (UP/DOWN)
- Get outcomes determined by oracle
- Receive rewards through settlement

**Key Functions:**
- `create_pool<T>()` - Create new market
- `make_prediction<T>()` - Place prediction
- `resolve_pool<T>()` - Settle market
- `pool_is_open<T>()` - Check status

### leaderboard.move
Tracks player rankings and performance:
- Win/loss records
- Current streaks
- Best streaks ever
- Total earnings

**Key Functions:**
- `create_leaderboard()` - Create leaderboard
- `record_result()` - Update stats
- `get_stats()` - Query player data
- `total_players()` - Count players

### rewards.move
Custom ARENA token for rewards:
- Mints tokens to winners
- Tracks supply
- Future: staking mechanics

**Key Functions:**
- `mint_reward()` - Admin mints tokens
- `burn_tokens()` - Remove from circulation
- `supply()` - Check total supply

---

## After Deployment

### 1. You'll Have
- Package ID (hex address like `0x...`)
- Treasury object ID
- Leaderboard object ID
- Transaction digest for verification

### 2. Update Frontend
```typescript
// frontend/.env.local
NEXT_PUBLIC_PACKAGE_ID=0x...
NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443
```

### 3. Use in Transactions
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::prediction_pool::create_pool`,
  arguments: [/* args */]
});
```

---

## If Something Goes Wrong

### Issue: Sui CLI not found
→ See **[DEPLOY_ONECHAIN.md](./DEPLOY_ONECHAIN.md)** - Installation section

### Issue: Connection refused
→ See **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Troubleshooting section

### Issue: Contract syntax error
→ See **[deployment-summary.md](./deployment-summary.md)** - Contract specs

### Issue: Gas budget too low
→ See **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Post-deployment section

---

## Deployment Options

### Option 1: OneChain Testnet (PREFERRED)
- RPC: `https://rpc-testnet.onelabs.cc:443`
- Faucet: OneChain docs/community
- Matches production network

### Option 2: Sui Testnet (FALLBACK)
- RPC: `https://rpc.testnet.sui.io`
- Faucet: https://faucet.testnet.sui.io
- Same Move VM as OneChain
- Same contracts, different addresses

---

## File Reference

```
one-predict-arena/
├── DEPLOYMENT_INDEX.md              ← You are here
├── DEPLOYMENT_QUICK_START.md        ← Start here for quick deployment
├── DEPLOYMENT_CHECKLIST.md          ← Use this for step-by-step
├── DEPLOY_ONECHAIN.md               ← Full reference documentation
├── deployment-summary.md            ← Technical specifications
├── FINAL_DEPLOYMENT_REPORT.md       ← Executive summary
├── contracts/
│   ├── Move.toml                    ← Package config
│   ├── sources/
│   │   ├── prediction_pool.move     ← Prediction markets
│   │   ├── leaderboard.move         ← Player tracking
│   │   └── rewards.move             ← Token rewards
│   ├── build-and-deploy.sh          ← Build script
│   └── test-contracts.sh            ← Validation script
└── frontend/
    └── .env.local                   ← Update with package ID after deploy
```

---

## Support Resources

### Official Documentation
- [Sui Docs](https://docs.sui.io) - Move language reference
- [OneChain Docs](https://onechain-docs.onelabs.cc) - OneChain specifics
- [Move Language](https://move-language.github.io) - Move language guide

### CLI Help
```bash
sui --help
sui client --help
sui client publish --help
```

### Testing Deployment
```bash
# After deployment, verify:
sui client call --package <ID> --module prediction_pool \
  --function pool_is_open --args 0x...
```

---

## Next Steps

1. **Choose your guide:**
   - Quick? → [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)
   - Detailed? → [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
   - Complete? → [DEPLOY_ONECHAIN.md](./DEPLOY_ONECHAIN.md)

2. **Install Sui CLI** (~5 min)

3. **Deploy contracts** (~10 min after Sui is installed)

4. **Update frontend** with package ID

5. **Test functions** via CLI or SDK

---

**Last Updated:** 2026-03-24
**Status:** ✅ Ready for Production Deployment
**Contracts:** 3 modules, 354 lines of code, all validated
