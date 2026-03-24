import { API_URL } from "./constants"

export interface PriceData {
  market: string
  price: number
  change24h: number
}

export interface PredictionResponse {
  market: string
  aiPersonality: string
  prediction: "UP" | "DOWN" | "FLAT"
  confidence: number
  reasoning: string
}

export interface GameResult {
  playerPrediction: "UP" | "DOWN" | "FLAT"
  aiPrediction: "UP" | "DOWN" | "FLAT"
  startPrice: number
  endPrice: number
  actualDirection: "UP" | "DOWN" | "FLAT"
  playerWon: boolean
  aiReasoning: string
  priceChange: number
}

export interface BattleCreateResponse {
  battle_id: string
  start_price: number
  ai_prediction: "UP" | "DOWN" | "FLAT"
  ai_confidence: number
  ai_reasoning: string
}

export interface BattleResolveResponse {
  player_won: boolean
  price_start: number
  price_end: number
  actual_direction: "UP" | "DOWN" | "FLAT"
  player_direction: "UP" | "DOWN" | "FLAT"
  ai_direction: "UP" | "DOWN" | "FLAT"
}

// Mock data for demo mode
const MOCK_PRICES: Record<string, number> = {
  BTC: 67240,
  ETH: 3412,
  SOL: 182.45,
  FLOW: 1.23,
}

const MOCK_REASONINGS: Record<string, string[]> = {
  oracle: [
    "Historical patterns suggest a 72% probability of upward movement based on weekly RSI divergence.",
    "Support level at $X shows strong buying pressure. Expecting consolidation then breakout.",
    "Funding rates are elevated. Short squeeze potential detected.",
  ],
  sentinel: [
    "Momentum indicators (MACD, Stochastic) flashing bullish crossover signals.",
    "Price touching 200-day MA with reversal patterns forming. Watch for breakout.",
    "Volume profile shows heavy accumulation zone. Technical setup favors downside.",
  ],
  prophet: [
    "On-chain whale transfers suggest institutional accumulation. Bullish signal.",
    "Social sentiment spiking. Community expecting a major move within 4h.",
    "Exchange outflows indicate hodling behavior. Potential reversal imminent.",
  ],
  cipher: [
    "Implied volatility at multi-month highs. Expecting mean reversion soon.",
    "Options market pricing in 8% move. Tail risk on downside.",
    "ATR expanding. Volatility breakout in progress. Trend following setup.",
  ],
}

/**
 * Fetch current market price
 */
export async function fetchPrice(market: string): Promise<PriceData> {
  try {
    const response = await fetch(`${API_URL}/api/price/${market}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Demo mode: return mock price
    const mockPrice = MOCK_PRICES[market] || 50000
    return {
      market,
      price: mockPrice,
      change24h: Math.random() > 0.5 ? 2.3 : -1.5,
    }
  }
}

/**
 * Get AI prediction for a market and personality
 */
export async function getPrediction(
  market: string,
  personality: string
): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        market,
        personality,
        current_price: null,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      market,
      aiPersonality: personality,
      prediction: data.direction,
      confidence: data.confidence,
      reasoning: data.reasoning,
    }
  } catch (error) {
    // Demo mode: return mock prediction
    const directions: ("UP" | "DOWN" | "FLAT")[] = ["UP", "DOWN", "FLAT"]
    const prediction = directions[Math.floor(Math.random() * 3)]
    const reasonings = MOCK_REASONINGS[personality as keyof typeof MOCK_REASONINGS] || MOCK_REASONINGS.oracle
    const reasoning =
      reasonings[Math.floor(Math.random() * reasonings.length)]

    return {
      market,
      aiPersonality: personality,
      prediction,
      confidence: 0.65 + Math.random() * 0.25,
      reasoning,
    }
  }
}

/**
 * Fetch leaderboard data
 */
export async function fetchLeaderboard(): Promise<Array<{
  id: string
  address: string
  fullAddress: string
  wins: number
  losses: number
  winRate: number
  streak: number
  totalEarned: number
  rank: number
}>> {
  try {
    const response = await fetch(`${API_URL}/api/leaderboard`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error)
    // Demo fallback: return mock leaderboard
    return []
  }
}

/**
 * Create a battle with the backend
 */
export async function createBattle(
  market: string,
  playerDirection: "UP" | "DOWN" | "FLAT",
  aiPersonality: string
): Promise<BattleCreateResponse> {
  try {
    const response = await fetch(`${API_URL}/api/battle/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        market,
        player_direction: playerDirection,
        ai_personality: aiPersonality,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to create battle:", error)
    // Demo fallback: return mock battle
    return {
      battle_id: `demo_${Date.now()}`,
      start_price: 0,
      ai_prediction: (["UP", "DOWN", "FLAT"][Math.floor(Math.random() * 3)] as "UP" | "DOWN" | "FLAT"),
      ai_confidence: 0.65 + Math.random() * 0.25,
      ai_reasoning: "Demo mode: AI reasoning not available",
    }
  }
}

/**
 * Resolve a battle and get the result
 */
export async function resolveBattle(battleId: string): Promise<BattleResolveResponse> {
  try {
    const response = await fetch(`${API_URL}/api/battle/${battleId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to resolve battle:", error)
    // Demo fallback: simulate result
    return {
      player_won: Math.random() > 0.5,
      price_start: 0,
      price_end: 0,
      actual_direction: (["UP", "DOWN", "FLAT"][Math.floor(Math.random() * 3)] as "UP" | "DOWN" | "FLAT"),
      player_direction: (["UP", "DOWN", "FLAT"][Math.floor(Math.random() * 3)] as "UP" | "DOWN" | "FLAT"),
      ai_direction: (["UP", "DOWN", "FLAT"][Math.floor(Math.random() * 3)] as "UP" | "DOWN" | "FLAT"),
    }
  }
}

/**
 * Simulate price movement and determine game result
 */
export async function simulateGameResult(
  playerPrediction: "UP" | "DOWN" | "FLAT",
  startPrice: number,
  aiPrediction: "UP" | "DOWN" | "FLAT",
  aiReasoning: string
): Promise<GameResult> {
  // Simulate price change: random ±0.5% for demo
  const changePercent = (Math.random() - 0.5) * 0.01 // ±0.5%
  const endPrice = startPrice * (1 + changePercent)
  const priceChange = endPrice - startPrice

  let actualDirection: "UP" | "DOWN" | "FLAT"
  if (Math.abs(priceChange) < startPrice * 0.001) {
    actualDirection = "FLAT"
  } else {
    actualDirection = priceChange > 0 ? "UP" : "DOWN"
  }

  const playerWon = playerPrediction === actualDirection

  return {
    playerPrediction,
    aiPrediction,
    startPrice,
    endPrice,
    actualDirection,
    playerWon,
    aiReasoning,
    priceChange,
  }
}
