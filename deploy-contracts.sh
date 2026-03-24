#!/bin/bash
set -e

echo "=== OneChain Contract Deployment ==="
echo ""
echo "Step 1: Checking Move contract syntax..."

cd contracts

# Try to validate contracts using @onelabs/sui if available
if npm list @onelabs/sui 2>/dev/null | grep -q "@onelabs/sui"; then
    echo "✓ @onelabs/sui SDK is available"
else
    echo "⚠ @onelabs/sui not installed, attempting to install..."
    npm install @onelabs/sui
fi

echo ""
echo "Step 2: Contract files to deploy:"
ls -lh sources/

echo ""
echo "Step 3: Checking Move.toml configuration..."
cat Move.toml

echo ""
echo "Step 4: Setting up OneChain environment..."
echo "OneChain Testnet RPC: https://rpc-testnet.onelabs.cc:443"

echo ""
echo "❌ Currently unable to deploy (needs Sui CLI with OneChain support)"
echo ""
echo "OPTIONS:"
echo "1. Install @onelabs/sui SDK via npm and use programmatic deployment"
echo "2. Use standard Sui CLI pointing to OneChain testnet RPC"
echo "3. Deploy to Sui testnet instead (same Move VM)"
