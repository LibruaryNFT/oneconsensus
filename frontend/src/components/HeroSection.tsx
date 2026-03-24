"use client"

import Link from "next/link"
import { ArrowRight, Scale } from "lucide-react"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [statCounts, setStatCounts] = useState({ assets: 0, agents: 3, onchain: 100 })

  useEffect(() => {
    // Animate stat counters
    const interval = setInterval(() => {
      setStatCounts((prev) => ({
        assets: Math.min(prev.assets + 8, 142),
        agents: 3,
        onchain: 100,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const aiAgents = [
    { name: "The Auditor", emoji: "📊", role: "Yield Maximalist", color: "emerald" },
    { name: "The Risk Officer", emoji: "🛡️", role: "Compliance First", color: "red" },
    { name: "The Arbitrator", emoji: "⚖️", role: "Synthesizer", color: "amber" },
  ]

  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-amber-400/10"></div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Main Headline with animated text reveal */}
          <div className="space-y-4">
            <h1 className="animate-fade-in text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                AI-Powered Risk Intelligence
              </span>
              <span className="block text-foreground mt-2">for Tokenized Assets</span>
            </h1>
            <p className="animate-fade-in mx-auto max-w-2xl text-xl text-muted-foreground opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Three sovereign AI agents debate, analyze, and reach consensus on
              real-world asset risk — all verified on-chain with institutional-grade intelligence.
            </p>
          </div>

          {/* CTA Buttons with pulse animation */}
          <div className="animate-fade-in flex flex-col justify-center gap-4 sm:flex-row opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <Link
              href="/arena"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 animate-pulse-glow"
            >
              Evaluate an Asset
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-400/30 glass-card-sm font-semibold text-foreground transition-all duration-300 hover:border-amber-400/60 hover:bg-white/10">
              View Agents
            </button>
          </div>

          {/* Animated Stats Row */}
          <div className="grid gap-8 pt-12 sm:grid-cols-3">
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.3s" }}>
              <div className="text-4xl font-bold text-amber-400">{statCounts.assets}</div>
              <p className="mt-2 text-muted-foreground">Asset Classes</p>
            </div>
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.4s" }}>
              <div className="text-4xl font-bold text-amber-400">{statCounts.agents}</div>
              <p className="mt-2 text-muted-foreground">AI Agents</p>
            </div>
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.5s" }}>
              <div className="text-4xl font-bold text-amber-400">{statCounts.onchain}%</div>
              <p className="mt-2 text-muted-foreground">On-Chain Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Meet Your Risk Assessment Team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three autonomous AI agents with different perspectives, reaching consensus
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {aiAgents.map((agent, idx) => (
            <div
              key={agent.name}
              className="animate-slide-up glass-card text-center transition-all duration-300 hover:border-amber-400/60 hover:bg-white/10 cursor-pointer group"
              style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                {agent.emoji}
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-1">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="animate-slide-up glass-card p-6" style={{ animationDelay: "0.1s" }}>
            <div className="text-3xl mb-3">🗣️</div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Multi-Agent Debate</h3>
            <p className="text-sm text-muted-foreground">
              Watch as AI agents present competing perspectives, challenge each other, and synthesize consensus
            </p>
          </div>
          <div className="animate-slide-up glass-card p-6" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">On-Chain Verification</h3>
            <p className="text-sm text-muted-foreground">
              Every assessment is recorded on-chain for transparency, auditability, and trust
            </p>
          </div>
          <div className="animate-slide-up glass-card p-6" style={{ animationDelay: "0.3s" }}>
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Institutional Grade</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-level risk frameworks, compliance checks, and audit trails
            </p>
          </div>
        </div>
      </section>

      {/* Powered By OneChain Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-500/20 glass-card text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Scale className="h-8 w-8 text-amber-400 animate-pulse" />
            <h3 className="text-xl font-semibold text-foreground">
              Powered by OneChain
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Built on OneChain&apos;s secure, transparent settlement layer for trustless
              RWA risk assessment with on-chain verification and institutional credibility
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
