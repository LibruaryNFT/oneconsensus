"use client"

import { AI_PERSONALITIES } from "@/lib/constants"
import clsx from "clsx"

interface AIOpponentCardProps {
  selectedOpponent: string | null
  onSelectOpponent: (personalityId: string) => void
}

export default function AIOpponentCard({
  selectedOpponent,
  onSelectOpponent,
}: AIOpponentCardProps) {
  // Mock win rates for demo
  const getWinRate = (id: string): number => {
    const rates: Record<string, number> = {
      oracle: 58,
      sentinel: 55,
      prophet: 61,
      cipher: 52,
    }
    return rates[id] || 50
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Choose Your Opponent</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AI_PERSONALITIES.map((personality) => {
          const isSelected = selectedOpponent === personality.id
          const winRate = getWinRate(personality.id)

          return (
            <button
              key={personality.id}
              onClick={() => onSelectOpponent(personality.id)}
              className={clsx(
                "group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300",
                isSelected
                  ? "border-primary bg-amber-950/20 shadow-lg shadow-primary/30"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              )}
            >
              {/* Gradient background */}
              <div
                className={clsx(
                  "absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300",
                  isSelected && "opacity-100"
                )}
              />

              <div className="relative z-10">
                {/* Avatar emoji */}
                <div className="mb-3 text-5xl">{personality.avatar}</div>

                {/* Name */}
                <h3 className="text-lg font-bold text-foreground">
                  {personality.name}
                </h3>

                {/* Style */}
                <p className="text-xs font-semibold uppercase text-primary">
                  {personality.style}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm text-muted-foreground">
                  {personality.description}
                </p>

                {/* Win rate */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-2 bg-gradient-to-r from-primary to-amber-400"
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {winRate}%
                  </span>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute right-4 top-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <svg
                        className="h-4 w-4 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
