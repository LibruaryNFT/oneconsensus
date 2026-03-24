#!/bin/bash
# Contract Testing & Validation Script
# Tests Move contract syntax and structure before deployment

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Move Contract Testing & Validation                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌${NC} $2"
        ((TESTS_FAILED++))
    fi
}

# Test 1: Check Move.toml exists
echo "${BLUE}Test 1: Move.toml validation${NC}"
[ -f Move.toml ]
test_result $? "Move.toml exists"

# Test 2: Validate Move.toml syntax
echo ""
echo "${BLUE}Test 2: Move.toml structure${NC}"
grep -q "^\[package\]" Move.toml
test_result $? "[package] section exists"

grep -q "^name = " Move.toml
test_result $? "Package name defined"

grep -q "^\[dependencies\]" Move.toml
test_result $? "[dependencies] section exists"

grep -q "One = " Move.toml
test_result $? "OneChain dependency declared"

# Test 3: Check contract files exist
echo ""
echo "${BLUE}Test 3: Contract files${NC}"

FILES=(
    "sources/prediction_pool.move"
    "sources/leaderboard.move"
    "sources/rewards.move"
)

for file in "${FILES[@]}"; do
    [ -f "$file" ]
    test_result $? "$file exists"
done

# Test 4: Validate contract structure
echo ""
echo "${BLUE}Test 4: Contract syntax validation${NC}"

for file in "${FILES[@]}"; do
    # Check for module declaration
    grep -q "^module " "$file"
    test_result $? "$file has module declaration"

    # Check for use statements
    grep -q "^use " "$file" || grep -q "^    use " "$file"
    test_result $? "$file has use statements"
done

# Test 5: Sui CLI check
echo ""
echo "${BLUE}Test 5: Sui CLI availability${NC}"

if command -v sui &> /dev/null; then
    SUI_VERSION=$(sui --version)
    test_result 0 "Sui CLI available: $SUI_VERSION"

    # Try move check
    if sui move check 2>/dev/null; then
        test_result 0 "sui move check passed"
    else
        test_result 1 "sui move check failed (syntax error)"
    fi
else
    test_result 1 "Sui CLI not found (required for deployment)"
fi

# Test 6: File integrity
echo ""
echo "${BLUE}Test 6: File integrity${NC}"

for file in "${FILES[@]}"; do
    # Count matching braces
    OPEN=$(grep -o "{" "$file" | wc -l)
    CLOSE=$(grep -o "}" "$file" | wc -l)

    if [ "$OPEN" -eq "$CLOSE" ]; then
        test_result 0 "$file: $OPEN/$CLOSE braces balanced"
    else
        test_result 1 "$file: $OPEN open, $CLOSE close braces (MISMATCH)"
    fi
done

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Test Results                                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Contracts are ready for deployment."
    echo ""
    echo "Next steps:"
    echo "  1. Install Sui CLI if not already done"
    echo "  2. Configure OneChain testnet: sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443"
    echo "  3. Build contracts: sui move build"
    echo "  4. Deploy: sui client publish --gas-budget 200000000"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    exit 1
fi
