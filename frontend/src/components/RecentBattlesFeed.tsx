"use client"

import { useEffect, useState } from "react"

interface Battle {
  id: string
  player: string
  market: string
  prediction: "UP" | "DOWN" | "FLAT"
  opponent: string
  result: "WIN" | "LOSS"
  reward: number
}

const DEMO_BATTLES: Battle[] = [
  {
    id: "1",
    player: "0x1a3f...",
    market: "BTC",
    prediction: "UP",
    opponent: "Claude",
    result: "WIN",
    reward: 50,
  },
  {
    id: "2",
    player: "0x5e2c...",
    market: "ETH",
    prediction: "DOWN",
    opponent: "GPT",
    result: "WIN",
    reward: 50,
  },
  {
    id: "3",
    player: "0x9d1b...",
    market: "SOL",
    prediction: "UP",
    opponent: "Llama",
    result: "LOSS",
    reward: -25,
  },
  {
    id: "4",
    player: "0x4f7a...",
    market: "FLOW",
    prediction: "FLAT",
    opponent: "Oracle",
    result: "WIN",
    reward: 50,
  },
  {
    id: "5",
    player: "0x8c3e...",
    market: "BTC",
    prediction: "DOWN",
    opponent: "Sentinel",
    result: "WIN",
    reward: 50,
  },
  {
    id: "6",
    player: "0x2b9f...",
    market: "ETH",
    prediction: "UP",
    opponent: "Prophet",
    result: "LOSS",
    reward: -25,
  },
]

const getPredictionEmoji = (pred: "UP" | "DOWN" | "FLAT"): string => {
  switch (pred) {
    case "UP":
      return "📈"
    case "DOWN":
      return "📉"
    case "FLAT":
      return "↔️"
  }
}

export default function RecentBattlesFeed() {
  const [displayBattles, setDisplayBattles] = useState<Battle[]>(DEMO_BATTLES)
  const [isScrolling, setIsScrolling] = useState(true)

  // Rotate battle feed every 5 seconds
  useEffect(() => {
    if (!isScrolling) return

    const interval = setInterval(() => {
      setDisplayBattles((prev) => {
        const rotated = [...prev.slice(1), prev[0]]
        return rotated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isScrolling])

  return (
    <div
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12"
      onMouseEnter={() => setIsScrolling(false)}
      onMouseLeave={() => setIsScrolling(true)}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          🔥 Recent Battles
        </h2>
        <p className="text-sm text-muted-foreground">
          Watch the arena come alive as players battle AI opponents
        </p>
      </div>

      {/* Battle feed ticker */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="space-y-1">
          {displayBattles.map((battle, idx) => (
            <div
              key={battle.id}
              className={`flex items-center justify-between px-6 py-4 border-b border-border last:border-b-0 transition-all duration-300 ${
                idx === 0 ? "bg-primary/10 border-primary/30" : ""
              } hover:bg-primary/5`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Player address */}
                <div className="font-mono text-sm font-semibold text-primary whitespace-nowrap">
                  {battle.player}
                </div>

                {/* Battle details */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{battle.market}</span>
                  <span className="text-2xl">{getPredictionEmoji(battle.prediction)}</span>
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {battle.prediction}
                  </span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {battle.opponent}
                  </span>
                </div>
              </div>

              {/* Result badge */}
              <div
                className={`flex items-center gap-2 whitespace-nowrap ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  battle.result === "WIN"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {battle.result === "WIN" ? "✓ WON" : "✗ LOST"}
                <span className="font-mono">
                  {battle.reward > 0 ? "+" : ""}
                  {battle.reward} ARENA
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info text */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        ℹ️ Showing latest battles. Hover to pause scrolling.
      </p>
    </div>
  )
}
