"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [statCounts, setStatCounts] = useState({ battles: 0, wins: 0, markets: 0 })

  useEffect(() => {
    // Animate stat counters
    const interval = setInterval(() => {
      setStatCounts((prev) => ({
        battles: Math.min(prev.battles + 150, 1247),
        wins: Math.min(prev.wins + 9, 89),
        markets: Math.min(prev.markets + 10, 1000),
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const aiOpponents = [
    { name: "Oracle", emoji: "🔮", description: "Pattern Recognition" },
    { name: "Sentinel", emoji: "🛡️", description: "Risk Analyzer" },
    { name: "Prophet", emoji: "📈", description: "Trend Predictor" },
  ]

  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Main Headline with animated text reveal */}
          <div className="space-y-4">
            <h1 className="animate-fade-in text-5xl font-bold leading-tight gradient-text sm:text-6xl lg:text-7xl">
              Battle AI. Predict the Future.
              <br />
              <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
                Win Rewards.
              </span>
            </h1>
            <p className="animate-fade-in mx-auto max-w-2xl text-xl text-muted-foreground opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Compete against advanced AI models in the OnePredict Arena. Make
              accurate predictions, outsmart the algorithms, and climb the
              leaderboard.
            </p>
          </div>

          {/* CTA Buttons with pulse animation */}
          <div className="animate-fade-in flex flex-col justify-center gap-4 sm:flex-row opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <Link
              href="/arena"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 animate-pulse-glow"
            >
              Enter Arena
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 glass-card-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-white/10">
              Learn More
            </button>
          </div>

          {/* Animated Stats Row */}
          <div className="grid gap-8 pt-12 sm:grid-cols-3">
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.3s" }}>
              <div className="text-4xl font-bold text-primary">{statCounts.battles}</div>
              <p className="mt-2 text-muted-foreground">Battles Fought</p>
            </div>
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.4s" }}>
              <div className="text-4xl font-bold text-green-500">{statCounts.wins}%</div>
              <p className="mt-2 text-muted-foreground">AI Win Rate</p>
            </div>
            <div className="animate-slide-up glass-card text-center" style={{ animationDelay: "0.5s" }}>
              <div className="text-4xl font-bold text-amber-400">{statCounts.markets}</div>
              <p className="mt-2 text-muted-foreground">Markets Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Opponents Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold gradient-text">Meet Your AI Opponents</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three unique personalities, each with their own prediction strategy
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {aiOpponents.map((opponent, idx) => (
            <div
              key={opponent.name}
              className="animate-slide-up glass-card text-center transition-all duration-300 hover:border-primary/60 hover:bg-white/10 cursor-pointer group"
              style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                {opponent.emoji}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{opponent.name}</h3>
              <p className="text-sm text-muted-foreground">{opponent.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Powered By OneChain Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/20 glass-card text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Zap className="h-8 w-8 text-primary animate-pulse" />
            <h3 className="text-xl font-semibold text-foreground">
              Powered by OneChain
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Built on OneChain&apos;s secure, transparent settlement layer for trustless
              prediction markets with real rewards
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
