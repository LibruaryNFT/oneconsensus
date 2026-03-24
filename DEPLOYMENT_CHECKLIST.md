# OneChain Move Contract Deployment Checklist

## Pre-Deployment Verification

### Contract Files
- [x] `contracts/sources/prediction_pool.move` - ✓ Valid (160 lines)
- [x] `contracts/sources/leaderboard.move` - ✓ Valid (114 lines)
- [x] `contracts/sources/rewards.move` - ✓ Valid (80 lines)
- [x] `contracts/Move.toml` - ✓ Properly configured for OneChain

### Contract Validation
- [x] Syntax check passed
- [x] Module declarations present
- [x] Dependencies correctly specified
- [x] Brace matching verified
- [x] Use statements correct

## Deployment Requirements

Before deploying, ensure you have:

### Software
- [ ] **Sui CLI** - Download from https://docs.sui.io/guides/developer/getting-started
- [ ] **Compatible version** - Supports Move 2024 edition
- [ ] **Git** (for dependency fetching)

### Network Configuration
- [ ] **OneChain Testnet RPC** - https://rpc-testnet.onelabs.cc:443
- [ ] **Environment configured** - `sui client new-env --alias onechain-testnet --rpc <RPC_URL>`

### Wallet & Keys
- [ ] **Keypair generated** - `sui keytool generate ed25519`
- [ ] **Active address set** - `sui client active-address`
- [ ] **Key imported or created** - Check with `sui keytool list`

### Funds
- [ ] **Testnet tokens acquired** - Request from OneChain faucet
- [ ] **Balance verified** - `sui client gas`
- [ ] **Sufficient balance** - At least 500M for gas (0.5 SUI equivalent)

## Deployment Steps

### Step 1: Environment Setup
```bash
# Navigate to contracts directory
cd contracts

# Configure OneChain testnet (one-time setup)
sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443

# Switch to OneChain environment
sui client switch --env onechain-testnet

# Verify connection
sui client active-address
```

### Step 2: Build Contracts
```bash
# Build all Move contracts
sui move build

# Expected output:
# BUILDING one_predict_arena
# Compiling dependencies...
# Building modules...
# Build completed successfully
```

### Step 3: Deploy to Testnet
```bash
# Deploy contracts (saves output to deployment_output.json)
sui client publish --gas-budget 200000000 --json > deployment_output.json

# Verify success
cat deployment_output.json | grep -i "success"
```

### Step 4: Extract Deployment Info
```bash
# After successful deployment, save these values:

# Package ID (main identifier for your contracts)
PACKAGE_ID=$(cat deployment_output.json | jq -r '.effects.created[0].reference.objectId')

# Transaction digest (for verification)
DIGEST=$(cat deployment_output.json | jq -r '.transactionDigest')

# Save to .env
echo "NEXT_PUBLIC_PACKAGE_ID=$PACKAGE_ID" >> .env
echo "NEXT_PUBLIC_DEPLOY_DIGEST=$DIGEST" >> .env
echo "NEXT_PUBLIC_DEPLOY_DATE=$(date)" >> .env
```

## Post-Deployment Verification

### Verify Contracts Are Live
```bash
# Check if package exists on chain
sui client call --package $PACKAGE_ID --module prediction_pool \
  --function get_total_predictions --args 0x... 2>&1

# Query leaderboard
sui client call --package $PACKAGE_ID --module leaderboard \
  --function total_players --args 0x...
```

### Monitor Gas Usage
```bash
# Check transaction details
sui client tx-block $DIGEST

# Review gas costs:
# - Computation cost: How much processing
# - Storage cost: Blockchain storage
# - Storage rebate: Credit for data reuse
```

## Fallback Plan

If OneChain testnet is unavailable:

1. **Switch to Sui Testnet:**
   ```bash
   sui client new-env --alias sui-testnet --rpc https://rpc.testnet.sui.io
   sui client switch --env sui-testnet
   ```

2. **Get Sui testnet tokens:** https://faucet.testnet.sui.io

3. **Deploy with same command:** `sui client publish --gas-budget 200000000 --json`

4. **Update frontend .env** with new package ID

## Troubleshooting

### Issue: "sui: command not found"
**Solution:** Install Sui CLI
- macOS: `brew install sui`
- Other: `cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui`

### Issue: "Could not connect to RPC"
**Solution:** 
- Verify RPC is reachable: `curl https://rpc-testnet.onelabs.cc:443`
- Try Sui testnet RPC: `https://rpc.testnet.sui.io`
- Check firewall/network settings

### Issue: "Insufficient gas"
**Solution:**
- Increase budget: `--gas-budget 500000000`
- Request more testnet tokens from faucet
- Check account balance: `sui client gas`

### Issue: "Transaction execution failed"
**Solution:**
- Check detailed error: Look at `deployment_output.json`
- Verify active address has tokens
- Run `sui move check` for syntax errors
- Check OneChain framework version in Move.toml

## Frontend Integration

After deployment:

1. **Save deployment info:**
   ```
   Package ID: 0x...
   Deployment Date: 2026-03-24
   Network: OneChain Testnet
   RPC: https://rpc-testnet.onelabs.cc:443
   ```

2. **Update frontend:**
   ```typescript
   // frontend/.env.local
   NEXT_PUBLIC_PACKAGE_ID=0x...
   NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443
   ```

3. **Use in transactions:**
   ```typescript
   import { Transaction } from "@onelabs/sui";
   
   const tx = new Transaction();
   tx.moveCall({
     target: `${packageId}::prediction_pool::create_pool`,
     arguments: [
       tx.pure.string("BTC/USD"),
       tx.pure.u64(50000n),
     ]
   });
   ```

## Success Criteria

After deployment, verify:
- [ ] Transaction succeeded (check deployment_output.json)
- [ ] Package ID obtained and saved
- [ ] Contracts are callable (test with sui client call)
- [ ] Gas usage is reasonable (~50-100M for 3 contracts)
- [ ] No errors in transaction effects
- [ ] Frontend .env updated with package ID

## Estimated Timeline

- Sui CLI installation: 5-10 minutes
- Contract compilation: < 1 minute
- Contract deployment: 2-3 minutes
- Total: ~10-15 minutes (one-time setup)

## Support Resources

- [Sui Documentation](https://docs.sui.io)
- [OneChain Documentation](https://onechain-docs.onelabs.cc)
- [Move Language Docs](https://move-language.github.io)
- [Sui CLI Reference](https://docs.sui.io/references/cli)

---

**Contract Status:** ✅ Ready for Deployment
**Last Updated:** 2026-03-24
**Contracts:** 3 modules (354 LOC total)
