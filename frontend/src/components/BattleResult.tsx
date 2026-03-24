"use client"

import { GameResult } from "@/lib/api"
import clsx from "clsx"

interface BattleResultProps {
  result: GameResult
  aiPersonality: string
  market: string
  onPlayAgain: () => void
}

export default function BattleResult({
  result,
  aiPersonality,
  market,
  onPlayAgain,
}: BattleResultProps) {
  const getPersonalityName = (id: string): string => {
    const names: Record<string, string> = {
      oracle: "Oracle 🔮",
      sentinel: "Sentinel 🛡️",
      prophet: "Prophet 📈",
      cipher: "Cipher ⚡",
    }
    return names[id] || id
  }

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

  const priceChangePercent =
    ((result.endPrice - result.startPrice) / result.startPrice) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-primary bg-card p-8 shadow-2xl shadow-primary/30">
        {/* Result headline */}
        <div className="mb-8 text-center">
          <h1
            className={clsx(
              "text-5xl font-bold mb-2",
              result.playerWon
                ? "bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
            )}
          >
            {result.playerWon ? "YOU WON! 🎉" : "AI WINS 🤖"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {market} Price Prediction Battle
          </p>
        </div>

        {/* Price movement */}
        <div className="mb-8 rounded-xl border border-border bg-input p-6">
          <h2 className="mb-4 font-bold text-foreground">Price Movement</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Start Price:</span>
              <span className="font-mono text-lg font-bold">
                ${result.startPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">End Price:</span>
              <span className="font-mono text-lg font-bold">
                ${result.endPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Change:</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getPredictionEmoji(result.actualDirection)}
                  </span>
                  <span
                    className={clsx(
                      "font-mono text-lg font-bold",
                      result.priceChange > 0
                        ? "text-green-500"
                        : result.priceChange < 0
                          ? "text-red-500"
                          : "text-yellow-500"
                    )}
                  >
                    {result.priceChange > 0 ? "+" : ""}
                    {priceChangePercent.toFixed(3)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictions comparison */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          {/* Player prediction */}
          <div className="rounded-xl border border-border bg-input p-6 text-center">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">
              Your Prediction
            </p>
            <div className="mb-2 text-4xl">
              {getPredictionEmoji(result.playerPrediction)}
            </div>
            <p className="text-2xl font-bold text-primary">
              {result.playerPrediction}
            </p>
            <p
              className={clsx(
                "mt-2 text-sm font-semibold",
                result.playerWon ? "text-green-500" : "text-red-500"
              )}
            >
              {result.playerWon ? "✓ Correct!" : "✗ Wrong"}
            </p>
          </div>

          {/* AI prediction */}
          <div className="rounded-xl border border-border bg-input p-6 text-center">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">
              {getPersonalityName(aiPersonality)}
            </p>
            <div className="mb-2 text-4xl">
              {getPredictionEmoji(result.aiPrediction)}
            </div>
            <p className="text-2xl font-bold text-amber-400">
              {result.aiPrediction}
            </p>
            <p
              className={clsx(
                "mt-2 text-sm font-semibold",
                !result.playerWon ? "text-green-500" : "text-red-500"
              )}
            >
              {!result.playerWon ? "✓ Correct!" : "✗ Wrong"}
            </p>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="mb-8 rounded-xl border border-border bg-input p-6">
          <p className="mb-3 font-bold text-foreground">AI Reasoning:</p>
          <p className="text-sm text-muted-foreground">{result.aiReasoning}</p>
        </div>

        {/* Play again button */}
        <button
          onClick={onPlayAgain}
          className="w-full rounded-lg bg-gradient-to-r from-primary to-amber-500 py-3 font-bold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
        >
          Play Again 🎮
        </button>
      </div>
    </div>
  )
}
