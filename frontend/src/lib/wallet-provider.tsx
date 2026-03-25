"use client"

import { ReactNode } from "react"
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@onelabs/dapp-kit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ONECHAIN_CONFIG } from "./contracts"

// Network configuration for OneChain testnet
const { networkConfig } = createNetworkConfig({
  testnet: {
    url: ONECHAIN_CONFIG.rpc,
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
