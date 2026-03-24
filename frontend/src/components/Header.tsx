"use client"

import Link from "next/link"
import { Zap } from "lucide-react"
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
    { href: "/arena", label: "Arena" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/profile", label: "Profile" },
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
          <div className="rounded-lg bg-gradient-to-r from-primary to-primary-dark p-2 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
            OnePredict Arena
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
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-transparent" />
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
