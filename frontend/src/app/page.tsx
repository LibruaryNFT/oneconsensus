import HeroSection from "@/components/HeroSection"
import FeatureCard from "@/components/FeatureCard"
import Link from "next/link"
import { BookOpen, Shield, Zap, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            How OneConsensus Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to AI-powered RWA risk assessment
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <FeatureCard
              icon={BookOpen}
              title="Select an Asset"
              description="Choose a real-world asset from our curated list of tokenized properties, farmland, infrastructure, and commodities"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <FeatureCard
              icon={Zap}
              title="Agents Evaluate"
              description="Three AI perspectives analyze opportunity, risks, and compliance. Watch them debate and synthesize consensus in real-time"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <FeatureCard
              icon={Shield}
              title="Get Intelligence"
              description="Receive institutional-grade risk scores, collateral ratios, and on-chain verified consensus for your asset evaluation"
            />
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Assessment Ready for 6 Asset Classes
          </h2>
          <p className="mt-4 text-muted-foreground">
            From commercial real estate to renewable energy, OneConsensus evaluates diverse RWA categories
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: "🏢", name: "Real Estate" },
            { icon: "🌾", name: "Farmland" },
            { icon: "⛴️", name: "Shipping" },
            { icon: "🪙", name: "Commodities" },
            { icon: "🛣️", name: "Infrastructure" },
            { icon: "☀️", name: "Energy" },
          ].map((assetClass) => (
            <div
              key={assetClass.name}
              className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-4 text-center transition-all hover:border-amber-400/50 hover:bg-zinc-900/50"
            >
              <div className="text-3xl mb-2">{assetClass.icon}</div>
              <p className="text-sm font-medium text-foreground">{assetClass.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why OneConsensus Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Why Trust OneConsensus?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="font-semibold text-amber-400 mb-2">Multi-Agent Consensus</h3>
            <p className="text-sm text-muted-foreground">
              3 different AI perspectives reaching agreement = higher confidence
            </p>
          </div>
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-amber-400 mb-2">Institutional Framework</h3>
            <p className="text-sm text-muted-foreground">
              Risk modeling built on professional audit and compliance standards
            </p>
          </div>
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">⛓️</div>
            <h3 className="font-semibold text-amber-400 mb-2">On-Chain Immutable</h3>
            <p className="text-sm text-muted-foreground">
              Every assessment recorded on-chain for auditability and trust
            </p>
          </div>
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-amber-400 mb-2">Real-Time Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Instant risk scores, collateral ratios, and opportunity assessments
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-400/20 p-12 text-center">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <Sparkles className="h-12 w-12 text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Ready for AI-Powered Risk Intelligence?
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Upload an RWA asset, watch three AI agents debate its merits, and
              receive institutional-grade risk assessment verified on-chain.
            </p>
            <Link
              href="/arena"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-4 font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 animate-pulse-glow text-lg"
            >
              <Zap className="h-5 w-5" />
              Start Evaluation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
