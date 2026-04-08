"use client"

import HeroSection from "@/components/HeroSection"
import FeatureCard from "@/components/FeatureCard"
import OnChainBadge from "@/components/OnChainBadge"
import { BookOpen, Shield, Zap, Sparkles, ExternalLink } from "lucide-react"
import { ONECHAIN_CONFIG, formatContractAddress, getExplorerLink } from "@/lib/contracts"

export default function Home() {
  return (
    <div className="space-y-20 py-12">
      {/* Hackathon Warning Banner */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-center space-y-3">
          <p className="text-lg font-semibold text-red-400">
            OneHack 3.0 by @onechainlabs never paid out the $16,000 prize pool.
          </p>
          <p className="text-sm text-zinc-400">
            This project was built for the hackathon. A project claiming a $67M raise told participants
            it &quot;cannot pay.&quot; The Telegram group was deleted and no winners were announced.
            This site is preserved as a portfolio demo only &mdash; on-chain features are disabled.
          </p>
          <a
            href="https://x.com/Libruary/status/2041928239287853213"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Read the full thread
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

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
            { icon: "\u{1F3E2}", name: "Real Estate" },
            { icon: "\u{1F33E}", name: "Farmland" },
            { icon: "\u26F4\uFE0F", name: "Shipping" },
            { icon: "\u{1FA99}", name: "Commodities" },
            { icon: "\u{1F6E3}\uFE0F", name: "Infrastructure" },
            { icon: "\u2600\uFE0F", name: "Energy" },
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
            <div className="text-2xl mb-3">{"\u{1F916}"}</div>
            <h3 className="font-semibold text-amber-400 mb-2">Multi-Agent Consensus</h3>
            <p className="text-sm text-muted-foreground">
              3 different AI perspectives reaching agreement = higher confidence
            </p>
          </div>
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">{"\u{1F4CA}"}</div>
            <h3 className="font-semibold text-amber-400 mb-2">Institutional Framework</h3>
            <p className="text-sm text-muted-foreground">
              Risk modeling built on professional audit and compliance standards
            </p>
          </div>
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">{"\u26D3\uFE0F"}</div>
            <h3 className="font-semibold text-amber-400 mb-2">On-Chain Immutable</h3>
            <p className="text-sm text-muted-foreground">
              Every assessment recorded on-chain for auditability and trust
            </p>
          </div>
          <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
            <div className="text-2xl mb-3">{"\u26A1"}</div>
            <h3 className="font-semibold text-amber-400 mb-2">Real-Time Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Instant risk scores, collateral ratios, and opportunity assessments
            </p>
          </div>
        </div>
      </section>

      {/* Contract Deployment Info Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-950/20 to-transparent p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Smart Contracts on OneChain Testnet
            </h3>
            <p className="text-muted-foreground">
              All assessments are recorded and verified on OneChain for transparency and institutional trust
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="rounded-lg border border-green-500/20 bg-green-950/10 p-4">
              <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">Package ID</h4>
              <button
                onClick={() => window.open(getExplorerLink("object", ONECHAIN_CONFIG.packageId), "_blank")}
                className="flex items-center gap-2 font-mono text-sm text-foreground hover:text-green-400 transition-colors break-all"
              >
                {formatContractAddress(ONECHAIN_CONFIG.packageId)}
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </button>
            </div>

            <div className="rounded-lg border border-green-500/20 bg-green-950/10 p-4">
              <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">Network</h4>
              <p className="text-sm text-foreground">{ONECHAIN_CONFIG.network}</p>
            </div>

            <div className="rounded-lg border border-green-500/20 bg-green-950/10 p-4">
              <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">Modules</h4>
              <p className="text-sm text-foreground">
                {Object.values(ONECHAIN_CONFIG.modules).join(", ")}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <OnChainBadge size="md" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-400/20 p-12 text-center">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <Sparkles className="h-12 w-12 text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-4">
              AI-Powered Risk Intelligence
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Three AI agents debate real-world asset merits and deliver
              institutional-grade risk assessment verified on-chain.
            </p>
            <p className="text-sm text-zinc-500">
              Built by{" "}
              <a href="https://libruary.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">
                Libruary
              </a>
              {" "}for OneHack 3.0
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
