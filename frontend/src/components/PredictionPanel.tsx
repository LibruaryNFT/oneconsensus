"use client"

import { useState } from "react"
import { getPrediction, PredictionResponse } from "@/lib/api"
import clsx from "clsx"

interface PredictionPanelProps {
  marketId: string
  aiPersonality: string
  startPrice: number
  onPredictionMade: (
    playerPrediction: "UP" | "DOWN" | "FLAT",
    aiResponse: PredictionResponse
  ) => void
}

export default function PredictionPanel({
  marketId,
  aiPersonality,
  startPrice,
  onPredictionMade,
}: PredictionPanelProps) {
  const [playerPrediction, setPlayerPrediction] = useState<
    "UP" | "DOWN" | "FLAT" | null
  >(null)
  const [aiResponse, setAiResponse] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAiThinking, setShowAiThinking] = useState(false)

  const handlePredictionClick = async (
    prediction: "UP" | "DOWN" | "FLAT"
  ) => {
    if (playerPrediction) return

    setPlayerPrediction(prediction)
    setShowAiThinking(true)
    setLoading(true)

    // Simulate AI thinking delay (500-1000ms)
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500)
    )

    const response = await getPrediction(marketId, aiPersonality)
    setAiResponse(response)
    setLoading(false)

    // Small delay before auto-advancing
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (response) {
      onPredictionMade(prediction, response)
    }
  }

  const getPersonalityName = (id: string): string => {
    const names: Record<string, string> = {
      oracle: "Oracle 🔮",
      sentinel: "Sentinel 🛡️",
      prophet: "Prophet 📈",
      cipher: "Cipher ⚡",
    }
    return names[id] || id
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="mb-8 text-2xl font-bold">Make Your Prediction</h2>

      {/* Current price */}
      <div className="mb-8 rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Current Price</p>
        <p className="text-3xl font-bold text-primary">
          ${startPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Prediction buttons */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <button
          onClick={() => handlePredictionClick("UP")}
          disabled={playerPrediction !== null || loading}
          className={clsx(
            "group relative overflow-hidden rounded-xl border-2 py-8 font-bold transition-all duration-300",
            playerPrediction === "UP"
              ? "border-green-500 bg-green-950/30 shadow-lg shadow-green-500/30"
              : playerPrediction
                ? "border-border bg-card/50 opacity-50"
                : "border-green-500/30 bg-card hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20"
          )}
        >
          <div className="relative z-10 text-center">
            <div className="text-4xl">📈</div>
            <div className="mt-2 text-lg text-green-500">UP</div>
          </div>
        </button>

        <button
          onClick={() => handlePredictionClick("FLAT")}
          disabled={playerPrediction !== null || loading}
          className={clsx(
            "group relative overflow-hidden rounded-xl border-2 py-8 font-bold transition-all duration-300",
            playerPrediction === "FLAT"
              ? "border-yellow-500 bg-yellow-950/30 shadow-lg shadow-yellow-500/30"
              : playerPrediction
                ? "border-border bg-card/50 opacity-50"
                : "border-yellow-500/30 bg-card hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20"
          )}
        >
          <div className="relative z-10 text-center">
            <div className="text-4xl">↔️</div>
            <div className="mt-2 text-lg text-yellow-500">FLAT</div>
          </div>
        </button>

        <button
          onClick={() => handlePredictionClick("DOWN")}
          disabled={playerPrediction !== null || loading}
          className={clsx(
            "group relative overflow-hidden rounded-xl border-2 py-8 font-bold transition-all duration-300",
            playerPrediction === "DOWN"
              ? "border-red-500 bg-red-950/30 shadow-lg shadow-red-500/30"
              : playerPrediction
                ? "border-border bg-card/50 opacity-50"
                : "border-red-500/30 bg-card hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
          )}
        >
          <div className="relative z-10 text-center">
            <div className="text-4xl">📉</div>
            <div className="mt-2 text-lg text-red-500">DOWN</div>
          </div>
        </button>
      </div>

      {/* AI Thinking animation and response */}
      {showAiThinking && (
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-bold text-primary">
            {getPersonalityName(aiPersonality)} is analyzing...
          </h3>

          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  Processing market data...
                </span>
              </div>
            </div>
          ) : aiResponse ? (
            <div className="space-y-4">
              {/* AI Prediction */}
              <div className="rounded-lg bg-input p-4">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  AI Prediction:
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {aiResponse.prediction === "UP"
                      ? "📈"
                      : aiResponse.prediction === "DOWN"
                        ? "📉"
                        : "↔️"}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {aiResponse.prediction}
                  </span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    Confidence: {(aiResponse.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <div className="rounded-lg bg-input p-4">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  Reasoning:
                </p>
                <p className="text-sm text-foreground">{aiResponse.reasoning}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Info text */}
      {!playerPrediction && (
        <p className="text-center text-sm text-muted-foreground">
          Click a button to make your prediction. The AI will analyze and respond.
        </p>
      )}
    </div>
  )
}
