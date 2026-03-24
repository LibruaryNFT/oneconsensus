"use client"

import Link from "next/link"
import { Scale } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import WalletButton from "./WalletButton"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/arena", label: "Evaluate" },
    { href: "/leaderboard", label: "Agents" },
    { href: "/profile", label: "History" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-border/50 bg-background/80 backdrop-blur-xl"
          : "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo with animation */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 p-2 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            OneConsensus
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-amber-400"
                  : "text-muted-foreground hover:text-amber-400"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />
              )}
            </Link>
          ))}
        </div>

        {/* Wallet Connect Button */}
        <WalletButton />
      </nav>
    </header>
  )
}
