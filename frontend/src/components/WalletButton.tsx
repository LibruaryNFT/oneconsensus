"use client"

import { useState } from "react"
import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@onelabs/dapp-kit"
import "@onelabs/dapp-kit/dist/index.css"
import { ChevronDown, Wallet, LogOut } from "lucide-react"

export default function WalletButton() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

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

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg z-50">
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

  return (
    <ConnectModal
      trigger={
        <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </button>
      }
      open={connectOpen}
      onOpenChange={setConnectOpen}
    />
  )
}
