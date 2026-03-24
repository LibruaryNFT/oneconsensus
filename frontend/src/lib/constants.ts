export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// AI Agent personalities for RWA risk assessment
export const AI_AGENTS = [
  {
    id: "auditor",
    name: "The Auditor",
    role: "Yield Maximalist",
    avatar: "📊",
    color: "emerald",
    description: "Focuses on opportunity and yield potential",
    tone: "bullish",
  },
  {
    id: "risk_officer",
    name: "The Risk Officer",
    role: "Compliance First",
    avatar: "🛡️",
    color: "red",
    description: "Identifies risks and regulatory concerns",
    tone: "cautious",
  },
  {
    id: "arbitrator",
    name: "The Arbitrator",
    role: "Synthesizer",
    avatar: "⚖️",
    color: "amber",
    description: "Weighs both sides and makes final consensus call",
    tone: "balanced",
  },
]

// Real-world assets for evaluation
export const SAMPLE_ASSETS = [
  {
    id: "commercial_real_estate_1",
    name: "Manhattan Office Tower",
    type: "Commercial Real Estate",
    icon: "🏢",
    location: "New York, USA",
    estimatedValue: "$850M",
    yield: "4.2%",
    description: "Grade-A office building in Midtown Manhattan",
  },
  {
    id: "farmland_1",
    name: "Iowa Agricultural Land",
    type: "Farmland",
    icon: "🌾",
    location: "Iowa, USA",
    estimatedValue: "$125M",
    yield: "3.8%",
    description: "Productive corn and soybean farming operations",
  },
  {
    id: "shipping_cargo_1",
    name: "Container Vessel Fleet",
    type: "Shipping Assets",
    icon: "⛴️",
    location: "Global",
    estimatedValue: "$450M",
    yield: "5.1%",
    description: "Modern container ships with 15-year charters",
  },
  {
    id: "gold_reserves_1",
    name: "Physical Gold Reserves",
    type: "Precious Metals",
    icon: "🪙",
    location: "Switzerland",
    estimatedValue: "$280M",
    yield: "2.5%",
    description: "Allocated gold bullion in segregated storage",
  },
  {
    id: "infrastructure_toll_roads_1",
    name: "Toll Road Network",
    type: "Infrastructure",
    icon: "🛣️",
    location: "Europe",
    estimatedValue: "$650M",
    yield: "4.7%",
    description: "Long-term concession agreements on major highways",
  },
  {
    id: "renewable_energy_1",
    name: "Solar Farm Portfolio",
    type: "Renewable Energy",
    icon: "☀️",
    location: "Spain & Portugal",
    estimatedValue: "$320M",
    yield: "5.3%",
    description: "Grid-connected solar installations with 20-year PPAs",
  },
]

export const MARKETS = [
  {
    id: "commercial_re",
    name: "Commercial Real Estate",
    symbol: "CRE",
    icon: "🏢",
    description: "Office, retail, and mixed-use properties",
  },
  {
    id: "farmland",
    name: "Farmland",
    symbol: "FARM",
    icon: "🌾",
    description: "Agricultural production and land assets",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    symbol: "INFRA",
    icon: "🛣️",
    description: "Roads, bridges, and utility assets",
  },
  {
    id: "renewable_energy",
    name: "Renewable Energy",
    symbol: "RENEW",
    icon: "☀️",
    description: "Solar, wind, and clean energy projects",
  },
]

export const RISK_LEVELS = [
  { value: "LOW", label: "Low Risk", color: "text-green-500" },
  { value: "MEDIUM", label: "Medium Risk", color: "text-amber-500" },
  { value: "HIGH", label: "High Risk", color: "text-red-500" },
] as const

export const TIME_WINDOWS = [
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
] as const

// Demo agent performance data for leaderboard
export const DEMO_AGENT_PERFORMANCE = [
  {
    id: "arbitrator",
    agent: "The Arbitrator",
    role: "Synthesizer",
    avatar: "⚖️",
    assessmentsMade: 1247,
    accuracyScore: 91.2,
    avgResponseTime: "2.3s",
    color: "amber",
    confidence: "95%",
  },
  {
    id: "auditor",
    agent: "The Auditor",
    role: "Yield Maximalist",
    avatar: "📊",
    assessmentsMade: 1247,
    accuracyScore: 78.5,
    avgResponseTime: "1.8s",
    color: "emerald",
    confidence: "88%",
  },
  {
    id: "risk_officer",
    agent: "The Risk Officer",
    role: "Compliance First",
    avatar: "🛡️",
    assessmentsMade: 1247,
    accuracyScore: 82.3,
    avgResponseTime: "2.1s",
    color: "red",
    confidence: "89%",
  },
]

// Demo leaderboard data (for backward compatibility if needed)
export const DEMO_LEADERBOARD_PLAYERS = DEMO_AGENT_PERFORMANCE

// Demo evaluation history
export const DEMO_EVALUATIONS = [
  {
    id: "eval1",
    assetId: "commercial_real_estate_1",
    riskScore: 28,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    collateralRatio: "2.1x",
    consensusReached: true,
  },
  {
    id: "eval2",
    assetId: "shipping_cargo_1",
    riskScore: 42,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    collateralRatio: "2.8x",
    consensusReached: true,
  },
  {
    id: "eval3",
    assetId: "farmland_1",
    riskScore: 35,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    collateralRatio: "2.4x",
    consensusReached: true,
  },
  {
    id: "eval4",
    assetId: "renewable_energy_1",
    riskScore: 31,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    collateralRatio: "2.2x",
    consensusReached: true,
  },
  {
    id: "eval5",
    assetId: "infrastructure_toll_roads_1",
    riskScore: 38,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    collateralRatio: "2.5x",
    consensusReached: true,
  },
  {
    id: "eval6",
    assetId: "gold_reserves_1",
    riskScore: 15,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    collateralRatio: "1.5x",
    consensusReached: true,
  },
]

// Demo player profile data (repurposed for evaluations)
export const DEMO_PLAYER_PROFILE = {
  address: "0x1234...5678",
  fullAddress: "0x12345678abcdefghijklmnopqrstuvwxyz5678",
  evaluationsMade: 156,
  averageRiskScore: 32.5,
  successRate: 91.7,
  totalAssetValue: 2.75e9,
  joined: new Date(2024, 8, 15), // Sept 15, 2024
  rank: 1,
  recentEvaluations: DEMO_EVALUATIONS,
}
