"use client"

import { AI_AGENTS } from "@/lib/constants"
import clsx from "clsx"

interface AIOpponentCardProps {
  selectedOpponent: string | null
  onSelectOpponent: (agentId: string) => void
}

export default function AIOpponentCard({
  selectedOpponent,
  onSelectOpponent,
}: AIOpponentCardProps) {
  // Mock accuracy scores for demo
  const getAccuracyScore = (id: string): number => {
    const scores: Record<string, number> = {
      auditor: 78,
      risk_officer: 82,
      arbitrator: 91,
    }
    return scores[id] || 80
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Choose an Agent</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_AGENTS.map((agent) => {
          const isSelected = selectedOpponent === agent.id
          const accuracy = getAccuracyScore(agent.id)

          return (
            <button
              key={agent.id}
              onClick={() => onSelectOpponent(agent.id)}
              className={clsx(
                "group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300",
                isSelected
                  ? "border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/30"
                  : "border-border bg-card hover:border-amber-400/50 hover:shadow-md"
              )}
            >
              {/* Gradient background */}
              <div
                className={clsx(
                  "absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity duration-300",
                  isSelected && "opacity-100"
                )}
              />

              <div className="relative z-10">
                {/* Avatar emoji */}
                <div className="mb-3 text-5xl">{agent.avatar}</div>

                {/* Name */}
                <h3 className="text-lg font-bold text-foreground">
                  {agent.name}
                </h3>

                {/* Role */}
                <p className="text-xs font-semibold uppercase text-amber-400">
                  {agent.role}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm text-muted-foreground">
                  {agent.description}
                </p>

                {/* Accuracy Score */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-2 bg-gradient-to-r from-amber-500 to-amber-400"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {accuracy}%
                  </span>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute right-4 top-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400">
                      <svg
                        className="h-4 w-4 text-foreground"
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
