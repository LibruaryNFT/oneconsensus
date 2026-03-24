import HeroSection from "@/components/HeroSection"
import FeatureCard from "@/components/FeatureCard"
import RecentBattlesFeed from "@/components/RecentBattlesFeed"
import Link from "next/link"
import { Zap, TrendingUp, Trophy, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Recent Battles Feed */}
      <RecentBattlesFeed />

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to battle AI and earn rewards
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <FeatureCard
              icon={Zap}
              title="Pick a Market"
              description="Choose from 1000+ crypto, stock, and commodity markets"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <FeatureCard
              icon={TrendingUp}
              title="Battle AI"
              description="Make your prediction and compete against advanced AI personalities"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <FeatureCard
              icon={Trophy}
              title="Win Rewards"
              description="Earn ARENA tokens for correct predictions and climb the leaderboard"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 p-12 text-center">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <h3 className="text-4xl font-bold gradient-text mb-4">
              Ready to Enter the Arena?
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Connect your OneChain wallet, pick a market, and start battling AI.
              The faster you are, the better your predictions, and the more tokens you earn.
            </p>
            <Link
              href="/arena"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-8 py-4 font-bold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 animate-pulse-glow text-lg"
            >
              <Zap className="h-5 w-5" />
              Enter the Arena Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
