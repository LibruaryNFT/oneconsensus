# OneChain Deployment - Quick Start Guide

**TL;DR:** Install Sui CLI → Build → Deploy to OneChain testnet

## 60-Second Overview

Your 3 Move contracts are **ready to deploy**:
- **prediction_pool.move** - Prediction markets with staking
- **leaderboard.move** - Player rankings and stats
- **rewards.move** - ARENA token distribution

All contracts are syntactically valid and properly configured for OneChain.

## Install Sui CLI (5 minutes)

**macOS:**
```bash
brew install sui
```

**Linux/WSL:**
```bash
curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui
```

**Verify installation:**
```bash
sui --version
```

## Generate Keypair (1 minute)

```bash
sui keytool generate ed25519
sui keytool list
```

## Configure OneChain Testnet (2 minutes)

```bash
sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443
sui client switch --env onechain-testnet
```

## Get Testnet Tokens (varies)

Request tokens from OneChain faucet (check their docs for exact URL):
```bash
# After getting tokens, verify balance
sui client gas
```

**Need at least ~500M (≈ 0.5 SUI equivalent) for gas.**

## Build & Deploy (3 minutes)

```bash
cd contracts
sui move build
sui client publish --gas-budget 200000000 --json > deployment_output.json
```

## Extract Package ID

```bash
# Linux/macOS
cat deployment_output.json | grep -A2 '"objectId"' | head -3

# Or with jq (if installed)
cat deployment_output.json | jq '.effects.created[0].reference.objectId'

# Save this value - you'll need it for the frontend!
```

## Update Frontend

```typescript
// frontend/.env.local
NEXT_PUBLIC_PACKAGE_ID=<your-package-id>
NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443
```

## Verify Deployment

```bash
# Check transaction succeeded
cat deployment_output.json | grep '"status"'

# Should see: "status": "success"
```

## What Was Deployed?

| Module | Functions | Purpose |
|--------|-----------|---------|
| **prediction_pool** | create_pool, make_prediction, resolve_pool | On-chain prediction markets |
| **leaderboard** | create_leaderboard, record_result, get_stats | Player tracking & rankings |
| **rewards** | mint_reward, burn_tokens, supply | ARENA token system |

## If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| `sui: command not found` | Install Sui CLI (see above) |
| `Could not connect` | Check RPC URL, try Sui testnet RPC |
| `Insufficient gas` | Increase `--gas-budget 500000000` |
| `Build failed` | Run `sui move check` to see errors |
| `No tokens` | Request from OneChain faucet |

## Fallback Option

If OneChain testnet is down, deploy to Sui testnet instead (same Move VM):

```bash
sui client new-env --alias sui-testnet --rpc https://rpc.testnet.sui.io
sui client switch --env sui-testnet

# Get Sui testnet tokens: https://faucet.testnet.sui.io

# Deploy with same command
sui client publish --gas-budget 200000000 --json
```

## Files You'll Create

- `deployment_output.json` - Contains package ID and transaction details
- `.env` or `.env.local` - Deployment config for frontend
- `sui.keystore` - Your keypair (keep safe!)

## Next: Frontend Integration

Once deployed, update your frontend to use the package ID:

```typescript
import { Transaction } from "@onelabs/sui";

const createPool = async () => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::prediction_pool::create_pool`,
    arguments: [
      tx.pure.string("BTC/USD"),
      tx.pure.u64(50000n),
      tx.pure.u64(3600n), // 1 hour
    ]
  });

  const result = await wallet.signAndExecuteTransaction({ transaction: tx });
  return result;
};
```

## Complete Reference Docs

- Full deployment guide: [DEPLOY_ONECHAIN.md](./DEPLOY_ONECHAIN.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Summary: [deployment-summary.md](./deployment-summary.md)

---

**Status:** ✅ All contracts validated and ready
**Est. Time to Deploy:** 15-20 minutes total (including Sui CLI installation)
