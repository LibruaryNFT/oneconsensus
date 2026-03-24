/**
 * OneChain Testnet Contract Configuration
 * Deployed contracts for OneConsensus RWA Risk Assessment
 */

export const ONECHAIN_CONFIG = {
  rpc: 'https://rpc-testnet.onelabs.cc:443',
  packageId: '0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e',
  explorer: 'https://onescan.cc/testnet',
  modules: {
    leaderboard: 'leaderboard',
    prediction_pool: 'prediction_pool',
    rewards: 'rewards',
  },
  network: 'OneChain Testnet',
}

/**
 * Generate an explorer link for an object or transaction
 * @param type - 'object' or 'tx'
 * @param id - The object ID or transaction hash
 * @returns Full explorer URL
 */
export function getExplorerLink(type: 'object' | 'tx', id: string): string {
  return `${ONECHAIN_CONFIG.explorer}/${type}/${id}`
}

/**
 * Format a contract address for display (abbreviated)
 * @param address - Full address
 * @param chars - Number of characters to show at start and end
 * @returns Abbreviated address
 */
export function formatContractAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) {
    return address
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Validate a OneChain address format
 * @param address - Address to validate
 * @returns True if valid
 */
export function isValidOneChainAddress(address: string): boolean {
  // OneChain addresses start with 0x and are hex
  return /^0x[a-fA-F0-9]+$/.test(address)
}
