#!/bin/bash
# OneChain Move Contract Build & Deployment Script
# This script compiles and prepares contracts for deployment

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   OneChain Move Contract Build & Deployment Guide          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check prerequisites
echo ""
log_info "Step 1: Checking Prerequisites"
echo "─────────────────────────────────────────────────────────────"

# Check sui CLI
if command -v sui &> /dev/null; then
    SUI_VERSION=$(sui --version 2>/dev/null || echo "unknown")
    log_success "Sui CLI found: $SUI_VERSION"
else
    log_error "Sui CLI not found"
    echo ""
    echo "Install Sui CLI:"
    echo "  macOS:   brew install sui"
    echo "  Linux:   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui"
    echo "  Windows: Use WSL or Cargo"
    echo ""
    exit 1
fi

# Check active key
ACTIVE_ADDR=$(sui client active-address 2>/dev/null || echo "")
if [ -z "$ACTIVE_ADDR" ]; then
    log_warning "No active keypair found"
    echo "  Generate one: sui keytool generate ed25519"
else
    log_success "Active address: $ACTIVE_ADDR"
fi

# Display contract files
echo ""
log_info "Step 2: Contract Files"
echo "─────────────────────────────────────────────────────────────"
ls -lh sources/*.move | awk '{print "  "$9" ("$5")"}'

# Build contracts
echo ""
log_info "Step 3: Building Contracts"
echo "─────────────────────────────────────────────────────────────"

if sui move build 2>&1; then
    log_success "Build completed successfully!"
    echo ""
    log_info "Build artifacts:"
    ls -lh build/
else
    log_error "Build failed"
    exit 1
fi

# Display deployment instructions
echo ""
log_info "Step 4: Deployment Instructions"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "Before deploying, ensure you:"
echo "  1. Have selected the correct environment:"
echo "     sui client switch --env onechain-testnet"
echo ""
echo "  2. Have testnet tokens:"
echo "     sui client gas"
echo ""
echo "  3. Have configured OneChain testnet:"
echo "     sui client new-env --alias onechain-testnet \\"
echo "       --rpc https://rpc-testnet.onelabs.cc:443"
echo ""

# Check current environment
CURRENT_ENV=$(sui client active-env 2>/dev/null || echo "")
log_info "Current environment: ${CURRENT_ENV:-default}"

# Propose deployment command
echo ""
log_info "Deploy contracts with:"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "  sui client publish --gas-budget 200000000 --json"
echo ""
echo "Or for custom paths:"
echo "  sui client publish --gas-budget 200000000 --path . --json"
echo ""

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║ Build Artifacts Ready                                      ║"
echo "║ Next: Configure testnet and deploy                         ║"
echo "╚════════════════════════════════════════════════════════════╝"

