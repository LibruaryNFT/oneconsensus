# OneChain Move Contract Deployment Summary

## Current Status

✅ **Contract Validation:** All 3 contracts are syntactically valid and ready for deployment
- `contracts/sources/prediction_pool.move` - 160 lines
- `contracts/sources/leaderboard.move` - 114 lines
- `contracts/sources/rewards.move` - 80 lines

✅ **Dependencies:** Correctly configured for OneChain
- Move edition: `2024.beta`
- Framework dependency: OneChain (`rev = "1.0.4"`)

✅ **Build Configuration:** Move.toml is properly structured

## What These Contracts Do

### 1. **prediction_pool.move** - Market Creation & Resolution
Creates on-chain prediction markets where players:
- Stake coins on price direction (UP/DOWN)
- Pay gas for making predictions
- Get rewards through external settlement

**Key Functions:**
- `create_pool<T>()` - Admin creates new market
- `make_prediction<T>()` - Player stakes coins
- `resolve_pool<T>()` - Admin settles with final price
- `get_direction()` - Determine if UP or DOWN prediction wins

### 2. **leaderboard.move** - Player Statistics Tracking
Maintains on-chain leaderboards showing:
- Win/loss records
- Current winning streaks
- Best streaks achieved
- Total earnings

**Key Functions:**
- `create_leaderboard()` - Create new leaderboard
- `record_result()` - Update player stats after prediction resolves
- `get_stats()` - Query player's ranking data
- `player_exists()` - Check if player is on leaderboard

### 3. **rewards.move** - ARENA Token System
Custom token for rewarding successful predictions:
- Mints ARENA tokens to winners
- Tracks total supply
- Enables future burning/staking mechanics

**Key Functions:**
- `mint_reward()` - Admin mints tokens to winners
- `burn_tokens()` - Remove tokens from circulation
- `supply()` - Query current token supply

## How to Deploy

### Prerequisites
1. **Sui CLI** - Install from https://docs.sui.io/guides/developer/getting-started
2. **Keypair** - Generate via `sui keytool generate ed25519`
3. **Testnet tokens** - Request from OneChain faucet
4. **OneChain testnet configured** - Point to https://rpc-testnet.onelabs.cc:443

### Deployment Steps

```bash
# 1. Navigate to contracts
cd contracts

# 2. Build contracts
sui move build

# 3. Configure OneChain testnet (if not done)
sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443
sui client switch --env onechain-testnet

# 4. Verify you have tokens
sui client gas

# 5. Deploy all 3 contracts
sui client publish --gas-budget 200000000 --json > deployment_output.json

# 6. Extract and save these from output:
# - digest (transaction digest)
# - effects.created[0].reference.objectId (package ID)
# - effects.created[1,2,3...].reference.objectId (object IDs for pools, leaderboard, etc.)
```

### Expected Output Format

```json
{
  "digest": "0x...",
  "transaction": { ... },
  "effects": {
    "status": { "status": "success" },
    "gasUsed": {
      "computationCost": "1000000",
      "storageCost": "5000000",
      "storageRebate": "0"
    },
    "transactionDigest": "0x...",
    "created": [
      {
        "reference": {
          "objectId": "0x...",
          "version": 1,
          "digest": "0x..."
        },
        "owner": {
          "Immutable": {}
        }
      }
    ]
  }
}
```

## Integration with Frontend

After deployment, save the package ID and use in frontend:

```typescript
// frontend/.env
NEXT_PUBLIC_PACKAGE_ID=0x...
NEXT_PUBLIC_PREDICTION_POOL_ID=0x...
NEXT_PUBLIC_LEADERBOARD_ID=0x...
NEXT_PUBLIC_REWARDS_ID=0x...
NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443
```

Then use in transactions:

```typescript
import { getFullnodeUrl, SuiClient } from "@onelabs/sui";

const rpcUrl = getFullnodeUrl("testnet"); // Or your custom OneChain RPC
const client = new SuiClient({ url: rpcUrl });

// Create prediction pool
const tx = new Transaction();
tx.moveCall({
  target: `${packageId}::prediction_pool::create_pool`,
  arguments: [
    tx.pure.string("BTC/USD"),  // market
    tx.pure.u64(50000n),         // start_price
    tx.pure.u64(3600n),          // duration (1 hour)
  ]
});

const result = await client.signAndExecuteTransaction({
  signer: wallet,
  transaction: tx,
});
```

## Fallback: Sui Testnet Deployment

If OneChain testnet is unavailable, the same contracts can deploy to standard Sui testnet (same Move VM):

```bash
# Configure Sui testnet
sui client new-env --alias sui-testnet --rpc https://rpc.testnet.sui.io
sui client switch --env sui-testnet

# Get Sui testnet tokens: https://faucet.testnet.sui.io

# Deploy (same command)
sui client publish --gas-budget 200000000 --json
```

**Note:** Contract addresses will differ, but functionality is identical since both use the same Move VM.

## Files Generated

After deployment, you'll have:
- `contracts/build/` - Compiled Move bytecode
- `deployment_output.json` - Transaction details and object IDs
- `.env` files with deployed addresses

## Verification

After deployment, verify contracts are live:

```bash
# Query leaderboard structure
sui client call --package <PACKAGE_ID> --module leaderboard \
  --function get_stats --args <LEADERBOARD_ID> <PLAYER_ADDRESS>

# Get pool status
sui client call --package <PACKAGE_ID> --module prediction_pool \
  --function pool_is_open --args <POOL_ID>

# Check ARENA token supply
sui client call --package <PACKAGE_ID> --module rewards \
  --function supply --args <TREASURY_ID>
```

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "Connection refused" | RPC unreachable | Verify OneChain RPC is online, try Sui testnet |
| "Insufficient gas" | Not enough tokens | Increase `--gas-budget`, request more from faucet |
| "Module not found" | Deployment failed | Check deployment_output.json for errors |
| "Invalid Move syntax" | Contract has issues | Run `sui move check` in contracts/ |
| "Unknown framework" | Move.toml dependency error | Verify OneChain version in Move.toml |

## Next Steps

1. ✅ Deploy contracts (follow steps above)
2. ⏳ Save package ID and object IDs to `.env`
3. ⏳ Update frontend to use deployed addresses
4. ⏳ Test contract functions via SDK or CLI
5. ⏳ Monitor gas costs and optimize budgets

## References

- [Sui Move Developer Guide](https://docs.sui.io/guides/developer)
- [OneChain Docs](https://onechain-docs.onelabs.cc)
- [Sui CLI Reference](https://docs.sui.io/references/cli)
- [Move Language Reference](https://move-language.github.io)

---

**Status:** Ready for deployment
**Last Updated:** 2026-03-24
**Contracts:** 3 modules, 354 total lines
