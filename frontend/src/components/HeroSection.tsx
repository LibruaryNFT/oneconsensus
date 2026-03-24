import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-8 text-center">
        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold leading-tight gradient-text sm:text-6xl lg:text-7xl">
            Battle AI. Predict the Future. Win Rewards.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Compete against advanced AI models in the OnePredict Arena. Make
            accurate predictions, outsmart the algorithms, and climb the
            leaderboard.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/arena"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg"
          >
            Enter Arena
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-input px-8 py-3 font-semibold text-foreground transition-all duration-200 hover:bg-card">
            Learn More
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-8 pt-12 sm:grid-cols-3">
          <div>
            <div className="text-3xl font-bold text-primary">10K+</div>
            <p className="mt-2 text-muted-foreground">Active Predictors</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">$2M+</div>
            <p className="mt-2 text-muted-foreground">Rewards Distributed</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">1000+</div>
            <p className="mt-2 text-muted-foreground">Markets Available</p>
          </div>
        </div>
      </div>
    </section>
  )
}
