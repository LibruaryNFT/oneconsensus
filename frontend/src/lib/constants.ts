export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const AI_PERSONALITIES = [
  {
    id: "oracle",
    name: "Oracle",
    style: "data-driven",
    avatar: "🔮",
    description: "Analyzes market trends with historical data patterns",
  },
  {
    id: "sentinel",
    name: "Sentinel",
    style: "momentum-based",
    avatar: "🛡️",
    description: "Tracks momentum and technical indicators",
  },
  {
    id: "prophet",
    name: "Prophet",
    style: "sentiment-based",
    avatar: "📈",
    description: "Reads social sentiment and on-chain signals",
  },
  {
    id: "cipher",
    name: "Cipher",
    style: "volatility-focused",
    avatar: "⚡",
    description: "Predicts volatility spikes and tail risks",
  },
]

export const MARKETS = [
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    description: "Bitcoin price prediction",
  },
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    description: "Ethereum price prediction",
  },
  {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    description: "Solana price prediction",
  },
  {
    id: "FLOW",
    name: "Flow",
    symbol: "FLOW",
    icon: "⚙️",
    description: "Flow price prediction",
  },
]

export const PREDICTION_DIRECTIONS = [
  { value: "UP", label: "Price Up", color: "text-green-500" },
  { value: "DOWN", label: "Price Down", color: "text-red-500" },
  { value: "FLAT", label: "Price Flat", color: "text-yellow-500" },
] as const

export const TIME_WINDOWS = [
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
] as const
