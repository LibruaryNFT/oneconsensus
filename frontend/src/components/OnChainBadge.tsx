"use client"

import { ExternalLink } from "lucide-react"
import { ONECHAIN_CONFIG, getExplorerLink } from "@/lib/contracts"

interface OnChainBadgeProps {
  size?: "sm" | "md" | "lg"
  abbreviated?: boolean
  onClick?: () => void
  link?: boolean
}

export default function OnChainBadge({
  size = "md",
  onClick,
  link = true,
}: OnChainBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2",
  }

  const explorerLink = getExplorerLink("object", ONECHAIN_CONFIG.packageId)

  const handleClick = () => {
    if (link && explorerLink) {
      window.open(explorerLink, "_blank")
    }
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 text-green-400 font-semibold transition-all duration-300 hover:border-green-400/60 hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-500/20 ${sizeClasses[size]} ${
        link ? "cursor-pointer" : ""
      }`}
      title={ONECHAIN_CONFIG.packageId}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>
      <span>Verified on OneChain</span>
      {link && <ExternalLink className={size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} />}
    </button>
  )
}
