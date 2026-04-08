"use client"

import { Scale } from "lucide-react"

export default function HeroSection() {
  const aiAgents = [
    { name: "The Auditor", emoji: "\u{1F4CA}", role: "Yield Maximalist" },
    { name: "The Risk Officer", emoji: "\u{1F6E1}\uFE0F", role: "Compliance First" },
    { name: "The Arbitrator", emoji: "\u2696\uFE0F", role: "Synthesizer" },
  ]

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-amber-400/10"></div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="animate-fade-in text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                AI-Powered Risk Intelligence
              </span>
              <span className="block text-foreground mt-2">for Tokenized Assets</span>
            </h1>
            <p className="animate-fade-in mx-auto max-w-2xl text-xl text-muted-foreground opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Three sovereign AI agents debate, analyze, and reach consensus on
              real-world asset risk — with institutional-grade intelligence.
            </p>
          </div>

          {/* Static stats — no animated counters, no "on-chain" claim */}
          <div className="grid gap-8 pt-12 sm:grid-cols-3">
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.3s" }}>
              <div className="text-4xl font-bold text-amber-400">6</div>
              <p className="mt-2 text-muted-foreground">Asset Classes</p>
            </div>
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.4s" }}>
              <div className="text-4xl font-bold text-amber-400">3</div>
              <p className="mt-2 text-muted-foreground">AI Agents</p>
            </div>
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.5s" }}>
              <div className="text-4xl font-bold text-red-400">Disabled</div>
              <p className="mt-2 text-muted-foreground">On-Chain Features</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            The Risk Assessment Team
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
            <div className="text-3xl mb-3">{"\u{1F5E3}\uFE0F"}</div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Multi-Agent Debate</h3>
            <p className="text-sm text-muted-foreground">
              AI agents present competing perspectives, challenge each other, and synthesize consensus
            </p>
          </div>
          <div className="animate-slide-up glass-card p-6" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl mb-3">{"\u{1F4CB}"}</div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Risk Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Institutional-grade risk frameworks with collateral ratios and opportunity assessments
            </p>
          </div>
          <div className="animate-slide-up glass-card p-6" style={{ animationDelay: "0.3s" }}>
            <div className="text-3xl mb-3">{"\u{1F3DB}\uFE0F"}</div>
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Institutional Grade</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-level compliance checks and audit-ready assessment reports
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio notice instead of "Live on OneChain" */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-700/50 glass-card text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Scale className="h-8 w-8 text-zinc-500" />
            <h3 className="text-xl font-semibold text-foreground">
              Portfolio Demo
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              This project was built for OneHack 3.0 by OneChain Labs. On-chain features
              have been disabled after the hackathon organizer failed to pay the $16,000 prize pool.
              The site is preserved as a technical demo only.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                </span>
                On-Chain Disabled
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
