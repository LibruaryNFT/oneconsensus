"use client"

import Link from "next/link"
import { Scale } from "lucide-react"
import { useEffect, useState } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-border/50 bg-background/80 backdrop-blur-xl"
          : "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 p-2 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            OneConsensus
          </span>
        </Link>

        <a
          href="https://libruary.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground hover:text-amber-400 transition-colors"
        >
          Built by Libruary
        </a>
      </nav>
    </header>
  )
}
