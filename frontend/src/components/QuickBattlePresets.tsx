"use client"

import clsx from "clsx"

interface QuickBattlePresetsProps {
  onSelectPreset: (market: string, opponent: string) => void
  disabled: boolean
}

const QUICK_PRESETS = [
  {
    id: "btc-claude",
    title: "BTC vs Claude",
    emoji: "🔥",
    market: "BTC",
    opponent: "oracle",
    description: "Data-driven battle",
  },
  {
    id: "eth-gpt",
    title: "ETH vs GPT",
    emoji: "🛡️",
    market: "ETH",
    opponent: "sentinel",
    description: "Momentum-based duel",
  },
  {
    id: "sol-llama",
    title: "SOL vs Llama",
    emoji: "⚖️",
    market: "SOL",
    opponent: "prophet",
    description: "Sentiment-driven clash",
  },
]

export default function QuickBattlePresets({
  onSelectPreset,
  disabled,
}: QuickBattlePresetsProps) {
  return (
    <div className="mb-12 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">⚡ Quick Battle</h2>
        <p className="text-sm text-muted-foreground">
          Jump into an epic battle in one click
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.market, preset.opponent)}
            disabled={disabled}
            className={clsx(
              "group relative overflow-hidden rounded-lg border-2 p-6 transition-all duration-300",
              "hover:scale-105 hover:shadow-lg",
              disabled
                ? "border-border bg-card/50 cursor-not-allowed opacity-50"
                : "border-primary/50 bg-gradient-to-br from-primary/20 to-transparent hover:border-primary hover:shadow-primary/30"
            )}
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              {/* Emoji */}
              <div className="mb-3 text-4xl">{preset.emoji}</div>

              {/* Title */}
              <h3 className="text-lg font-bold text-foreground mb-1">
                {preset.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground">{preset.description}</p>

              {/* CTA */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  Battle Now
                </span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
