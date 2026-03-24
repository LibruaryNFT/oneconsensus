"use client"

import { useState } from "react"
import { useCurrentAccount, useDisconnectWallet, useWallets } from "@mysten/dapp-kit"
import { ChevronDown, Wallet, LogOut } from "lucide-react"

export default function WalletButton() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const wallets = useWallets()
  const [isOpen, setIsOpen] = useState(false)

  // Format address to show first 4 and last 4 characters
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle connect wallet
  const handleConnect = async () => {
    if (wallets.length > 0) {
      // Trigger wallet connection modal
      // The @mysten/dapp-kit provides built-in UI, but we can also use the custom hook
      setIsOpen(false)
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
  }

  if (currentAccount) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg"
        >
          <Wallet className="h-4 w-4" />
          {formatAddress(currentAccount.address)}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg">
            <div className="p-3 border-b border-border">
              <p className="text-sm text-muted-foreground">Connected Account</p>
              <p className="text-sm font-mono break-all">{currentAccount.address}</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-border/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  // Show connect button when not connected
  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </button>
  )
}
