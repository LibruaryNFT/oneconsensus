import HeroSection from "@/components/HeroSection"
import FeatureCard from "@/components/FeatureCard"
import { Zap, TrendingUp, Trophy } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold gradient-text">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to battle AI and earn rewards
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={Zap}
            title="Make a Prediction"
            description="Choose a market and predict the direction of price movements"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Battle AI Models"
            description="Compete against advanced AI predictors to prove your accuracy"
          />
          <FeatureCard
            icon={Trophy}
            title="Earn Rewards"
            description="Win tokens and climb the leaderboard with successful predictions"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary-dark/20 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold">Ready to Enter the Arena?</h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Start making predictions and compete with the best predictors
          </p>
          <button className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg">
            Go to Arena
          </button>
        </div>
      </section>
    </div>
  )
}
