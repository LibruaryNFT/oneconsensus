"use client"

import { ReactNode } from "react"
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Network configuration for OneChain testnet (using Sui testnet as fallback)
const { networkConfig } = createNetworkConfig({
  testnet: {
    url: "https://fullnode.testnet.sui.io",
    network: "testnet",
  },
})

// Create a single QueryClient instance
const queryClient = new QueryClient()

export function WalletProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
