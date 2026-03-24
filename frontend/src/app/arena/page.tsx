"use client"

import { useState } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import MarketSelector from "@/components/MarketSelector"
import AIOpponentCard from "@/components/AIOpponentCard"
import PredictionPanel from "@/components/PredictionPanel"
import CountdownTimer from "@/components/CountdownTimer"
import BattleResult from "@/components/BattleResult"
import { fetchPrice, PredictionResponse, GameResult, createBattle, resolveBattle } from "@/lib/api"

type GameState = "SELECT" | "PREDICT" | "WAITING" | "RESULT"

export default function ArenaPage() {
  const currentAccount = useCurrentAccount()
  const [gameState, setGameState] = useState<GameState>("SELECT")
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null)
  const [startPrice, setStartPrice] = useState<number>(0)
  const [playerPrediction, setPlayerPrediction] = useState<"UP" | "DOWN" | "FLAT" | null>(null)
  const [aiResponse, setAiResponse] = useState<PredictionResponse | null>(null)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [battleId, setBattleId] = useState<string | null>(null)

  // Handle market selection
  const handleSelectMarket = (marketId: string) => {
    setSelectedMarket(marketId)
  }

  // Handle opponent selection
  const handleSelectOpponent = (personalityId: string) => {
    setSelectedOpponent(personalityId)
  }

  // Check if both selections are made
  const canStartGame = selectedMarket && selectedOpponent

  // Handle prediction made
  const handlePredictionMade = async (
    prediction: "UP" | "DOWN" | "FLAT",
    aiResp: PredictionResponse
  ) => {
    setPlayerPrediction(prediction)
    setAiResponse(aiResp)

    // Create battle on backend
    if (selectedMarket && selectedOpponent) {
      const battleResponse = await createBattle(selectedMarket, prediction, selectedOpponent)
      setBattleId(battleResponse.battle_id)
    }

    setGameState("WAITING")
  }

  // Handle countdown timer completion
  const handleCountdownComplete = async () => {
    if (!gameResult && playerPrediction && aiResponse && selectedMarket && battleId) {
      // Resolve battle on backend
      const battleResult = await resolveBattle(battleId)

      // Convert backend response to GameResult
      const result: GameResult = {
        playerPrediction: battleResult.player_direction,
        aiPrediction: battleResult.ai_direction,
        startPrice,
        endPrice: battleResult.price_end,
        actualDirection: battleResult.actual_direction,
        playerWon: battleResult.player_won,
        aiReasoning: aiResponse.reasoning,
        priceChange: battleResult.price_end - battleResult.price_start,
      }

      setGameResult(result)
      setGameState("RESULT")
    }
  }

  // Handle play again
  const handlePlayAgain = () => {
    setGameState("SELECT")
    setSelectedMarket(null)
    setSelectedOpponent(null)
    setStartPrice(0)
    setPlayerPrediction(null)
    setAiResponse(null)
    setGameResult(null)
    setBattleId(null)
  }

  // Handle moving to prediction step
  const handleStartPrediction = async () => {
    if (selectedMarket && selectedOpponent) {
      // Fetch current price
      const priceData = await fetchPrice(selectedMarket)
      setStartPrice(priceData.price)
      setGameState("PREDICT")
    }
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold gradient-text">🎮 OnePredict Arena</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Battle AI opponents and prove your prediction prowess
        </p>
      </div>

      {/* Wallet Status Banner */}
      {!currentAccount && (
        <div className="mb-8 rounded-lg border border-amber-500/50 bg-amber-500/10 px-6 py-4 text-center">
          <p className="text-amber-100">
            ✨ Connect your OneChain wallet to earn rewards! Playing in demo mode now, but your predictions won&apos;t count toward prizes.
          </p>
        </div>
      )}

      {currentAccount && (
        <div className="mb-8 rounded-lg border border-green-500/50 bg-green-500/10 px-6 py-4 text-center">
          <p className="text-green-100">
            🎯 Wallet connected! Your predictions will earn you rewards on OneChain.
          </p>
        </div>
      )}

      {/* SELECT STATE */}
      {gameState === "SELECT" && (
        <div className="space-y-12">
          <MarketSelector
            selectedMarket={selectedMarket}
            onSelectMarket={handleSelectMarket}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <AIOpponentCard
            selectedOpponent={selectedOpponent}
            onSelectOpponent={handleSelectOpponent}
          />

          {/* Start button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartPrediction}
              disabled={!canStartGame}
              className={`rounded-lg px-8 py-3 font-bold text-lg transition-all duration-300 ${
                canStartGame
                  ? "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
                  : "bg-border text-muted-foreground cursor-not-allowed"
              }`}
            >
              {canStartGame ? "Start Battle ⚔️" : "Select Market & Opponent"}
            </button>
          </div>
        </div>
      )}

      {/* PREDICT STATE */}
      {gameState === "PREDICT" && selectedMarket && selectedOpponent && (
        <div className="flex justify-center">
          <PredictionPanel
            marketId={selectedMarket}
            aiPersonality={selectedOpponent}
            startPrice={startPrice}
            onPredictionMade={handlePredictionMade}
          />
        </div>
      )}

      {/* WAITING STATE */}
      {gameState === "WAITING" && (
        <div className="flex justify-center">
          <CountdownTimer duration={60} onComplete={handleCountdownComplete} />
        </div>
      )}

      {/* RESULT STATE */}
      {gameState === "RESULT" && gameResult && selectedMarket && (
        <BattleResult
          result={gameResult}
          aiPersonality={selectedOpponent || "oracle"}
          market={selectedMarket}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}
