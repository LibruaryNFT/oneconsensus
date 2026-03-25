# OneChain Integration - Quick Start

## What's New

The OneConsensus frontend now displays RWA risk assessments on the OneChain testnet.

## Key Files

### Configuration
- **`src/lib/contracts.ts`** - Central config for contract addresses and RPC endpoints

### Components
- **`src/components/OnChainBadge.tsx`** - "Verified on OneChain" badge

### Hooks
- **`src/lib/useBlockchain.ts`** - Wallet connection and transaction submission

## Using the Components

### OnChainBadge
```tsx
import OnChainBadge from '@/components/OnChainBadge'

// In your component
<OnChainBadge size="md" link={true} />
```

Options:
- `size`: "sm" | "md" | "lg"
- `link`: true (opens explorer) | false (non-clickable)
- `onClick`: optional handler

### useBlockchain Hook
```tsx
import { useBlockchain } from '@/lib/useBlockchain'

export function MyComponent() {
  const { connected, currentAccount, recordAssessmentOnChain } = useBlockchain()

  const handleSubmit = async () => {
    const result = await recordAssessmentOnChain('asset_123', 42, 'APPROVE')
    console.log(result.explorerLink) // Opens in onescan
  }

  return (
    <button onClick={handleSubmit} disabled={!connected}>
      {connected ? 'Submit' : 'Connect Wallet'}
    </button>
  )
}
```

## Explorer Links

All assessment transactions appear on:
```
https://onescan.cc/testnet/tx/[transaction-hash]
```

The deployed contract:
```
https://onescan.cc/testnet/object/0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e
```

## Testing Without Wallet

The mock mode works without a connected wallet:

1. Open `http://localhost:3000/arena`
2. Select an asset
3. Click "Record Assessment On-Chain"
4. See simulated transaction hash and success message
5. Click hash to view on explorer (uses mock data)

## For Real Transactions

To enable actual OneChain transactions:

1. User connects wallet via dApp kit
2. `useBlockchain()` detects connection
3. `recordAssessmentOnChain()` calls real contract
4. Transaction gets executed and confirmed

See `ONECHAIN_INTEGRATION.md` for implementation details.

## Common Tasks

### Show Explorer Link
```tsx
import { getExplorerLink } from '@/lib/contracts'

const link = getExplorerLink('object', contractAddress)
window.open(link, '_blank')
```

### Format Contract Address
```tsx
import { formatContractAddress } from '@/lib/contracts'

// Converts 0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e
// To: 0x1f0b...974e
const short = formatContractAddress(address, 4)
```

### Validate OneChain Address
```tsx
import { isValidOneChainAddress } from '@/lib/contracts'

if (isValidOneChainAddress(userInput)) {
  // Valid OneChain address
}
```

## Environment

OneChain testnet is automatically configured in:
- `src/lib/contracts.ts` (hardcoded)
- `src/lib/wallet-provider.tsx` (RPC endpoint)

No `.env` changes needed for demo mode.

## Troubleshooting

**"Assessment recorded on OneChain testnet (simulated)"**
- Normal in demo mode - user doesn't have wallet connected
- Real transaction will show actual tx hash

**Explorer link doesn't work**
- Make sure network is OneChain testnet (`onescan.cc/testnet`)
- OneChain testnet only

**Wallet not detected**
- Make sure user has dApp-compatible wallet installed
- Reload page after wallet connection

## Next Steps

For production:
1. Enable real transaction signing in `useBlockchain.ts`
2. Wire up leaderboard module calls
3. Test with actual OneChain testnet accounts
4. Add error handling for transaction failures
5. Track on-chain state and events

---

**Status**: ✓ Ready for testnet
**Last Updated**: 2026-03-24
