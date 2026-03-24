"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">
            OnePredict Arena
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/arena"
            className="text-foreground transition-colors hover:text-primary"
          >
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className="text-foreground transition-colors hover:text-primary"
          >
            Leaderboard
          </Link>
        </div>

        {/* Wallet Connect Button */}
        <button className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg">
          Connect Wallet
        </button>
      </nav>
    </header>
  )
}
