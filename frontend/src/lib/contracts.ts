/**
 * OneChain Testnet Contract Configuration
 * Display-only — SDK removed, contracts no longer active
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

export function getExplorerLink(type: 'object' | 'tx', id: string): string {
  return `${ONECHAIN_CONFIG.explorer}/${type}/${id}`
}

export function formatContractAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) {
    return address
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}
