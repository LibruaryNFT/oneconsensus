# Deploy Move Contracts to OneChain Testnet

## Prerequisites

You need:
1. **Sui CLI** - The command-line interface for Move contract deployment
2. **A keypair** - For signing transactions
3. **Testnet tokens** - To pay for gas
4. **OneChain testnet RPC** - https://rpc-testnet.onelabs.cc:443

## Option 1: Using Standard Sui CLI (RECOMMENDED)

OneChain is a fork of Sui, so the standard Sui CLI works with OneChain testnet by specifying a different RPC.

### Step 1: Install Sui CLI

**On macOS/Linux (via Homebrew):**
```bash
brew install sui
```

**On Windows/All platforms (via Cargo):**
```bash
# Requires Rust - install from https://rustup.rs/
curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui
```

**Via Docker (no local installation needed):**
```bash
docker run --rm -v $(pwd):/app -w /app -it mysten/sui:latest sui --version
```

### Step 2: Create/Import Keypair

```bash
# Generate a new keypair
sui keytool generate ed25519

# Or import existing:
sui keytool import-key ed25519 <your-private-key>

# List available keys
sui keytool list
```

### Step 3: Configure OneChain Testnet

```bash
# Add OneChain testnet as an RPC endpoint
sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443

# Switch to this environment
sui client switch --env onechain-testnet

# Verify connection
sui client call --gas-budget 10000000 2>&1 | head -5
```

### Step 4: Get Testnet Tokens

OneChain testnet faucet:
- **Endpoint:** https://faucet-testnet.onelabs.cc or check OneChain docs
- **Request format:** Usually POST to `/gas` or `/faucet`

```bash
# Get the address of your active key
ADDR=$(sui client active-address)

# Request tokens via curl
curl -X POST https://faucet-testnet.onelabs.cc/gas \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"$ADDR\"}"
```

If faucet endpoint differs, check [OneChain docs](https://onechain-docs.onelabs.cc) or community channels.

### Step 5: Build Contracts

```bash
cd contracts

# Build the Move project
sui move build

# Check for errors
echo "Build status: $?"
```

**Expected output:**
```
BUILDING one_predict_arena
Compiling dependencies...
Building modules...
Build completed successfully
```

### Step 6: Deploy to OneChain Testnet

```bash
# Publish the package
sui client publish \
  --gas-budget 200000000 \
  --json

# Save the output (contains package ID and object IDs)
# Example output:
# {
#   "digest": "...",
#   "transaction": {
#     "data": {
#       "messageVersion": "v1",
#       ...
#     }
#   },
#   "effects": {
#     "messageVersion": "v1",
#     "status": {
#       "status": "success"
#     },
#     "gasUsed": {
#       "computationCost": "1000000",
#       ...
#     },
#     "transactionDigest": "...",
#     "created": [
#       {
#         "reference": {
#           "objectId": "<PACKAGE_ID>",
#           ...
#         }
#       }
#     ]
#   }
# }
```

### Step 7: Verify Deployment

```bash
# Check transaction status
sui client call --package <PACKAGE_ID> --module prediction_pool --function pool_is_open --args <POOL_ID>

# Or query events
sui client events --transaction <TRANSACTION_DIGEST>
```

## Option 2: Using Docker

If you don't want to install Sui locally:

```bash
# Build Sui CLI in a container
docker build -f Dockerfile.sui -t onechain-deployer .

# Build contracts
docker run --rm -v $(pwd):/app onechain-deployer

# Copy build artifacts
cp contracts/build/* contracts/artifacts/
```

## Option 3: Fallback - Deploy to Sui Testnet

If OneChain testnet is unavailable, you can deploy to standard Sui testnet. The Move VM is the same:

```bash
# Configure Sui testnet
sui client new-env --alias sui-testnet --rpc https://rpc.testnet.sui.io

sui client switch --env sui-testnet

# Continue with steps 4-6 above, using Sui's faucet:
# https://faucet.testnet.sui.io
```

## Contract Overview

**3 contracts deployed:**

| Contract | Purpose | Key Functions |
|----------|---------|---|
| **prediction_pool.move** | Create & resolve prediction markets | `create_pool()`, `make_prediction()`, `resolve_pool()` |
| **leaderboard.move** | Track player stats & rankings | `create_leaderboard()`, `record_result()`, `get_stats()` |
| **rewards.move** | ARENA token for rewards | `mint_reward()`, `burn_tokens()`, `supply()` |

## Deployment Output

After successful deployment, save these values:

```yaml
Network: OneChain Testnet
RPC: https://rpc-testnet.onelabs.cc:443

# From sui client publish output:
Package ID: 0x...
Prediction Pool Object ID: 0x...
Leaderboard Object ID: 0x...
Rewards Treasury ID: 0x...
ARENA Currency ID: 0x...
AdminCap ID: 0x...

# Transaction digest for verification
Digest: 0x...

# Timestamp
Deployed: 2026-03-24
```

## Troubleshooting

### Error: "Could not connect to RPC"
- Check OneChain testnet RPC is online: `curl https://rpc-testnet.onelabs.cc:443`
- Try switching to Sui testnet fallback
- Verify your firewall allows outbound HTTPS

### Error: "Insufficient gas"
- Increase `--gas-budget` (try 500000000)
- Request more testnet tokens from faucet
- Check account balance: `sui client gas`

### Error: "Module is missing dependencies"
- Verify Move.toml correctly points to OneChain framework
- Run `sui move check` for detailed error messages
- Ensure you're using Sui CLI version compatible with Move 2024 edition

### Error: "Transaction failed"
- Check account balance has tokens
- Verify active address: `sui client active-address`
- Review transaction details: `sui client tx-block <DIGEST>`

## Next Steps

1. **Save deployed addresses** to `.env` or deployment config
2. **Update frontend** to use package ID and object IDs
3. **Test on-chain functions** via client SDK or CLI
4. **Monitor transaction costs** to optimize gas budgets

## References

- [Sui Move Developer Guide](https://docs.sui.io/guides/developer)
- [OneChain Documentation](https://onechain-docs.onelabs.cc)
- [Sui CLI Reference](https://docs.sui.io/references/cli)
