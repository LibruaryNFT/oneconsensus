"use client"

import { useState } from "react"
import { useCurrentAccount } from "@onelabs/dapp-kit"
import { SAMPLE_ASSETS } from "@/lib/constants"
import { ChevronRight, Shield, TrendingUp, AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import { ONECHAIN_CONFIG, formatContractAddress, getExplorerLink } from "@/lib/contracts"
import { useBlockchain } from "@/lib/useBlockchain"
import OnChainBadge from "@/components/OnChainBadge"

type EvaluationState = "SELECT_ASSET" | "EVALUATING" | "RESULTS"

interface BackendRiskAssessment {
  agent_name: string
  risk_score: number
  collateral_ratio: number
  valuation: number
  reasoning: string
  risks: string[]
  opportunities: string[]
}

interface BackendConsensusResult {
  asset: {
    id: string
    name: string
    asset_type: string
    location: string
    estimated_value: number
    yield_rate: number
    description: string
    risk_factors: string[]
  }
  assessments: BackendRiskAssessment[]
  final_risk_score: number
  final_collateral_ratio: number
  final_valuation: number
  consensus_reasoning: string
  debate_summary: string
  recommendation: string
}

interface AssessmentPanel {
  agent: "auditor" | "risk_officer" | "arbitrator"
  name: string
  emoji: string
  role: string
  accent: "emerald" | "red" | "amber"
  analysis: string
  keyPoints: string[]
  riskTone?: number // 0-100, where higher = more risk-averse
}

interface EvaluationResult {
  asset: (typeof SAMPLE_ASSETS)[0]
  riskScore: number
  collateralRatio: string
  recommendation: "Buy" | "Hold" | "Caution" | "Avoid"
  auditor: AssessmentPanel
  riskOfficer: AssessmentPanel
  arbitrator: AssessmentPanel
  consensus: string
  keyRisks: string[]
  keyOpportunities: string[]
  isDemo?: boolean
}

/**
 * Convert backend consensus result to frontend evaluation result
 */
function convertBackendResult(backendResult: BackendConsensusResult, sampleAsset: (typeof SAMPLE_ASSETS)[0]): EvaluationResult {
  const auditor = backendResult.assessments[0]
  const riskOfficer = backendResult.assessments[1]
  const arbitrator = backendResult.assessments[2]

  // Convert recommendation to our format
  const recommendationMap: Record<string, "Buy" | "Hold" | "Caution" | "Avoid"> = {
    "Strong Buy": "Buy",
    "Buy": "Buy",
    "Hold": "Hold",
    "Caution": "Caution",
    "Strong Caution": "Avoid",
  }

  const recommendation = (recommendationMap[backendResult.recommendation] || "Hold") as "Buy" | "Hold" | "Caution" | "Avoid"
  const collateralRatio = `${backendResult.final_collateral_ratio.toFixed(1)}%`

  return {
    asset: sampleAsset,
    riskScore: Math.round(backendResult.final_risk_score),
    collateralRatio,
    recommendation,
    auditor: {
      agent: "auditor",
      name: auditor.agent_name,
      emoji: "📊",
      role: "Yield Maximalist",
      accent: "emerald",
      analysis: auditor.reasoning,
      keyPoints: auditor.opportunities,
      riskTone: 20,
    },
    riskOfficer: {
      agent: "risk_officer",
      name: riskOfficer.agent_name,
      emoji: "🛡️",
      role: "Compliance First",
      accent: "red",
      analysis: riskOfficer.reasoning,
      keyPoints: riskOfficer.risks,
      riskTone: 72,
    },
    arbitrator: {
      agent: "arbitrator",
      name: arbitrator.agent_name,
      emoji: "⚖️",
      role: "Synthesizer",
      accent: "amber",
      analysis: arbitrator.reasoning,
      keyPoints: [
        `Risk Score: ${backendResult.final_risk_score.toFixed(0)}/100`,
        `Collateral Ratio: ${backendResult.final_collateral_ratio.toFixed(1)}%`,
        "Both perspectives reconciled",
        "Ready for institutional deployment",
      ],
      riskTone: 45,
    },
    consensus: `CONSENSUS: ${recommendation.toUpperCase()}. ${backendResult.consensus_reasoning}`,
    keyRisks: riskOfficer.risks,
    keyOpportunities: auditor.opportunities,
  }
}

/**
 * Fetch evaluation from backend API
 */
async function fetchEvaluationFromBackend(assetId: string, apiUrl: string): Promise<BackendConsensusResult> {
  const url = new URL("/api/evaluate", apiUrl)
  url.searchParams.append("asset_id", assetId)

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

function generateMockEvaluation(asset: (typeof SAMPLE_ASSETS)[0]): EvaluationResult {
  const riskScores: Record<string, number> = {
    commercial_real_estate_1: 28,
    farmland_1: 35,
    shipping_cargo_1: 42,
    gold_reserves_1: 15,
    infrastructure_toll_roads_1: 38,
    renewable_energy_1: 31,
  }

  const collateralRatios: Record<string, string> = {
    commercial_real_estate_1: "2.1x",
    farmland_1: "2.4x",
    shipping_cargo_1: "2.8x",
    gold_reserves_1: "1.5x",
    infrastructure_toll_roads_1: "2.5x",
    renewable_energy_1: "2.2x",
  }

  const riskScore = riskScores[asset.id] || 30
  const collateralRatio = collateralRatios[asset.id] || "2.2x"

  return {
    asset,
    riskScore,
    collateralRatio,
    recommendation: riskScore < 25 ? "Buy" : riskScore < 40 ? "Hold" : "Caution",
    auditor: {
      agent: "auditor",
      name: "The Auditor",
      emoji: "📊",
      role: "Yield Maximalist",
      accent: "emerald",
      analysis: `${asset.name} presents compelling investment fundamentals with an estimated yield of ${asset.yield}. The asset class demonstrates stable, predictable cash flows and is exceptionally well-positioned for institutional capital deployment. Market fundamentals remain robust with limited new supply constraints creating favorable pricing dynamics.`,
      keyPoints: [
        `Strong yield at ${asset.yield} with institutional buyer demand`,
        "Diversification benefits across portfolio",
        "Inflation hedge characteristics",
        "On-chain transparency enables continuous monitoring",
      ],
      riskTone: 20,
    },
    riskOfficer: {
      agent: "risk_officer",
      name: "The Risk Officer",
      emoji: "🛡️",
      role: "Compliance First",
      accent: "red",
      analysis: `While fundamentals appear solid, material risks warrant careful consideration. Primary concerns include regulatory and jurisdictional exposure variations, concentration risk from operator/tenant dependencies, and inherent market cyclicality. We recommend enhanced due diligence on compliance frameworks and comprehensive stress testing across interest rate scenarios.`,
      keyPoints: [
        "Regulatory and jurisdictional exposure",
        "Operator/tenant concentration risk",
        "Market cyclicality and economic sensitivity",
        "Interest rate sensitivity analysis required",
      ],
      riskTone: 72,
    },
    arbitrator: {
      agent: "arbitrator",
      name: "The Arbitrator",
      emoji: "⚖️",
      role: "Synthesizer",
      accent: "amber",
      analysis: `Consensus achieved: The Auditor's opportunity perspective is appropriately balanced by The Risk Officer's prudent risk concerns. A collateral ratio of ${collateralRatio} provides the necessary buffer. With a composite risk score of ${riskScore}/100, this asset represents manageable exposure suitable for institutional allocation within the recommended parameters.`,
      keyPoints: [
        `Risk Score: ${riskScore}/100 (Manageable)`,
        `Collateral Ratio: ${collateralRatio}`,
        "Both perspectives reconciled",
        "Ready for institutional deployment",
      ],
      riskTone: 45,
    },
    consensus: `CONSENSUS: ${riskScore < 25 ? "APPROVED" : riskScore < 40 ? "CONDITIONALLY APPROVED" : "REQUIRES REVIEW"}. Risk score of ${riskScore}/100 indicates ${riskScore < 25 ? "low" : riskScore < 40 ? "moderate" : "elevated"} exposure. Recommended for ${riskScore < 25 ? "institutional" : "selective"} deployment with ${collateralRatio} buffer.`,
    keyRisks: [
      "Regulatory and jurisdictional changes",
      "Operator/tenant dependency",
      "Market cyclicality and economic sensitivity",
      "Concentration risk",
    ],
    keyOpportunities: [
      `Strong yield potential at ${asset.yield} with institutional demand`,
      "Diversification across asset class",
      "Long-term inflation hedge characteristics",
      "On-chain transparency and auditability",
    ],
    isDemo: true,
  }
}

function RiskScoreGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s < 30) return "text-green-400"
    if (s < 60) return "text-amber-400"
    return "text-red-400"
  }

  const getGradient = (s: number) => {
    if (s < 30) return "from-green-500/20 to-green-400/5"
    if (s < 60) return "from-amber-500/20 to-amber-400/5"
    return "from-red-500/20 to-red-400/5"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getGradient(score)} border-2 ${getColor(score)} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-4xl font-bold ${getColor(score)}`}>{score}</div>
          <div className="text-xs text-muted-foreground">/100</div>
        </div>
      </div>
      <div className={`text-sm font-semibold ${getColor(score)}`}>
        {score < 30 ? "Low Risk" : score < 60 ? "Moderate Risk" : "Elevated Risk"}
      </div>
    </div>
  )
}

function AssessmentCard({ panel, isRevealing }: { panel: AssessmentPanel; isRevealing: boolean }) {
  const accentClasses = {
    emerald: "border-emerald-600/40 bg-gradient-to-br from-emerald-950/30 to-transparent text-emerald-400",
    red: "border-red-600/40 bg-gradient-to-br from-red-950/30 to-transparent text-red-400",
    amber: "border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-transparent text-amber-400",
  }

  const animationClass = isRevealing
    ? panel.agent === "auditor"
      ? "animate-slide-in-left"
      : panel.agent === "risk_officer"
        ? "animate-slide-in-right"
        : "animate-slide-in-center"
    : ""

  return (
    <div className={`rounded-lg border p-6 transition-all duration-500 ${accentClasses[panel.accent]} ${animationClass}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">{panel.emoji}</div>
        <div>
          <h3 className={`font-bold text-lg ${panel.accent === "emerald" ? "text-emerald-400" : panel.accent === "red" ? "text-red-400" : "text-amber-400"}`}>
            {panel.name}
          </h3>
          <p className="text-xs text-muted-foreground">{panel.role}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground">{panel.analysis}</p>

        <div className="border-t border-white/10 pt-4">
          <p className={`text-xs font-semibold mb-2 ${panel.accent === "emerald" ? "text-emerald-400/80" : panel.accent === "red" ? "text-red-400/80" : "text-amber-400/80"}`}>
            KEY POINTS
          </p>
          <ul className="space-y-2">
            {panel.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                <span
                  className={`mt-1 ${panel.accent === "emerald" ? "text-emerald-400" : panel.accent === "red" ? "text-red-400" : "text-amber-400"}`}
                >
                  →
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function ArenaPage() {
  const currentAccount = useCurrentAccount()
  const { recordAssessmentOnChain } = useBlockchain()
  const [state, setState] = useState<EvaluationState>("SELECT_ASSET")
  const [selectedAsset, setSelectedAsset] = useState<(typeof SAMPLE_ASSETS)[0] | null>(null)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [showAuditor, setShowAuditor] = useState(false)
  const [showRiskOfficer, setShowRiskOfficer] = useState(false)
  const [showArbitrator, setShowArbitrator] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<{
    show: boolean
    success: boolean
    message: string
    txHash?: string
    explorerLink?: string
  }>({
    show: false,
    success: false,
    message: "",
  })

  const handleSelectAsset = async (asset: (typeof SAMPLE_ASSETS)[0]) => {
    setSelectedAsset(asset)
    setState("EVALUATING")
    setShowAuditor(false)
    setShowRiskOfficer(false)
    setShowArbitrator(false)

    // Get API URL from environment or fallback to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    let evaluation: EvaluationResult
    let isDemo = false

    try {
      // Fetch real evaluation from backend API
      const backendResult = await fetchEvaluationFromBackend(asset.id, apiUrl)
      evaluation = convertBackendResult(backendResult, asset)
    } catch (error) {
      // Fallback to mock data on error
      console.error("Backend API call failed, using demo mode:", error)
      evaluation = generateMockEvaluation(asset)
      isDemo = true
    }

    // Mark evaluation with demo flag
    evaluation.isDemo = isDemo

    setResult(evaluation)

    // Auditor reveals first (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowAuditor(true)

    // Risk Officer reveals second (2.5s total)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowRiskOfficer(true)

    // Arbitrator reveals last (3.5s total) - the big reveal
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowArbitrator(true)

    // Move to results state
    await new Promise((resolve) => setTimeout(resolve, 800))
    setState("RESULTS")
  }

  const handleNewEvaluation = () => {
    setState("SELECT_ASSET")
    setSelectedAsset(null)
    setResult(null)
    setShowAuditor(false)
    setShowRiskOfficer(false)
    setShowArbitrator(false)
    setSubmissionStatus({ show: false, success: false, message: "" })
  }

  const handleSubmitToChain = async () => {
    if (!result) return

    setIsSubmitting(true)
    setSubmissionStatus({ show: true, success: false, message: "Submitting to OneChain..." })

    try {
      const txResult = await recordAssessmentOnChain(
        selectedAsset?.id || "",
        result.riskScore,
        result.recommendation
      )

      setSubmissionStatus({
        show: true,
        success: txResult.success,
        message: txResult.message,
        txHash: txResult.txHash,
        explorerLink: txResult.explorerLink,
      })
    } catch (error) {
      setSubmissionStatus({
        show: true,
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Failed to submit"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-600 bg-clip-text text-transparent">
          RWA Risk Consensus
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch three specialized AI agents analyze assets from different perspectives, then reach consensus on risk and opportunity
        </p>
      </div>

      {/* Wallet Status Banner */}
      {!currentAccount && (
        <div className="mb-8 rounded-lg border border-amber-500/50 bg-amber-500/10 px-6 py-4 text-center">
          <p className="text-amber-100">
            💡 Connect your OneChain wallet to record evaluations on-chain
          </p>
        </div>
      )}

      {/* SELECT ASSET STATE - Asset Grid */}
      {state === "SELECT_ASSET" && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Select an Asset</h2>
            <p className="mt-2 text-muted-foreground">
              Each asset will be evaluated by The Auditor (opportunity), The Risk Officer (caution), and The Arbitrator (consensus)
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_ASSETS.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleSelectAsset(asset)}
                className="group relative rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 transition-all duration-300 hover:border-amber-400/60 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-amber-500/20 text-left overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/0 group-hover:from-amber-500/10 group-hover:to-amber-600/10 transition-all duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{asset.icon}</span>
                    <ChevronRight className="h-5 w-5 text-amber-400/40 transition-all group-hover:text-amber-400 group-hover:translate-x-1" />
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-amber-400 transition-colors mb-1">
                    {asset.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">{asset.type}</p>

                  <div className="flex items-center justify-between text-xs mb-4 pb-4 border-b border-zinc-700/30">
                    <span className="text-muted-foreground">📍 {asset.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{asset.estimatedValue}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-semibold">
                      <span>📈</span>
                      {asset.yield}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EVALUATING STATE - 3 Panel Debate */}
      {state === "EVALUATING" && selectedAsset && result && (
        <div className="space-y-8">
          {/* Asset Header */}
          <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-600/10 via-amber-900/5 to-transparent p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{selectedAsset.icon}</span>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{selectedAsset.name}</h2>
                <p className="text-muted-foreground">{selectedAsset.type}</p>
              </div>
            </div>
          </div>

          {/* The 3 Panel Debate - THE MONEY SHOT */}
          <div className="grid gap-6 lg:grid-cols-3 auto-rows-max">
            {/* Left: Auditor */}
            {showAuditor && <AssessmentCard panel={result.auditor} isRevealing={showAuditor} />}

            {/* Right: Risk Officer */}
            {showRiskOfficer && <AssessmentCard panel={result.riskOfficer} isRevealing={showRiskOfficer} />}

            {/* Center: Arbitrator (appears last with dramatic reveal) */}
            {showArbitrator && (
              <div className="lg:col-start-2 lg:row-start-1 rounded-lg border border-amber-500/60 bg-gradient-to-br from-amber-950/50 via-amber-900/20 to-transparent p-6 shadow-lg shadow-amber-500/20 animate-slide-in-center ring-1 ring-amber-400/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-5xl">⚖️</div>
                  <div>
                    <h3 className="font-bold text-xl text-amber-400">The Arbitrator</h3>
                    <p className="text-xs text-muted-foreground">Final Consensus</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                    <p className="text-sm leading-relaxed text-foreground font-semibold">{result.arbitrator.analysis}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold text-amber-400/80 mb-3">CONSENSUS VERDICT</p>
                    <div className="flex items-center gap-2 text-base font-bold text-amber-400">
                      <CheckCircle2 className="h-5 w-5" />
                      {result.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading indicator while panels appear */}
          {!showArbitrator && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-amber-400">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-semibold">Agents reaching consensus...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULTS STATE - Full evaluation display */}
      {state === "RESULTS" && result && (
        <div className="space-y-8 animate-fade-in">
          {/* Demo Mode Badge */}
          {result.isDemo && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 flex items-center gap-2">
              <span className="text-amber-400 text-sm font-semibold">⚠️ Demo Mode</span>
              <span className="text-amber-300/80 text-sm">Backend API unavailable - showing simulated evaluation</span>
            </div>
          )}

          {/* The 3 Panel Consensus Display */}
          <div className="grid gap-6 lg:grid-cols-3">
            <AssessmentCard panel={result.auditor} isRevealing={false} />
            <AssessmentCard panel={result.riskOfficer} isRevealing={false} />
            <div className="rounded-lg border border-amber-500/60 bg-gradient-to-br from-amber-950/50 via-amber-900/20 to-transparent p-6 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">⚖️</div>
                <div>
                  <h3 className="font-bold text-lg text-amber-400">The Arbitrator</h3>
                  <p className="text-xs text-muted-foreground">Consensus Synthesis</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-foreground">{result.arbitrator.analysis}</p>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold text-amber-400/80 mb-3">VERDICT</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-amber-400">{result.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consensus Summary */}
          <div className="rounded-lg border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-transparent p-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-amber-400 mb-2">Consensus Summary</h3>
                <p className="text-foreground leading-relaxed">{result.consensus}</p>
              </div>
            </div>
          </div>

          {/* Risk Score Gauge + Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6 flex flex-col items-center justify-center">
              <RiskScoreGauge score={result.riskScore} />
            </div>

            <div className="rounded-lg border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-transparent p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-foreground">Collateral Ratio</h3>
              </div>
              <p className="text-4xl font-bold text-amber-400">{result.collateralRatio}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Conservative buffer to maintain institutional confidence and mitigate tail risk exposure
              </p>
            </div>

            <div className="rounded-lg border border-green-600/40 bg-gradient-to-br from-green-950/20 to-transparent p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-green-400">Consensus</h3>
              </div>
              <p className="text-2xl font-bold text-green-400 mb-4">✓ Reconciled</p>
              <p className="text-xs text-muted-foreground mb-4">
                All perspectives integrated into recommendation
              </p>
              <OnChainBadge size="sm" />
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-red-600/40 bg-gradient-to-br from-red-950/20 to-transparent p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <h3 className="font-semibold text-red-400">Key Risks</h3>
              </div>
              <ul className="space-y-2">
                {result.keyRisks.map((risk, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400 mt-1">⊗</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-green-600/40 bg-gradient-to-br from-green-950/20 to-transparent p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-green-400">Key Opportunities</h3>
              </div>
              <ul className="space-y-2">
                {result.keyOpportunities.map((opp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-green-400 mt-1">⊕</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* On-Chain Contract Information */}
          <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-950/20 to-transparent p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">Contract Package</h4>
                <button
                  onClick={() => window.open(getExplorerLink("object", ONECHAIN_CONFIG.packageId), "_blank")}
                  className="flex items-center gap-2 font-mono text-sm text-foreground hover:text-green-400 transition-colors break-all"
                >
                  {formatContractAddress(ONECHAIN_CONFIG.packageId, 6)}
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </button>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">Network</h4>
                <p className="text-sm text-foreground">{ONECHAIN_CONFIG.network}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase">Modules</h4>
                <p className="text-sm text-foreground">
                  {Object.values(ONECHAIN_CONFIG.modules).join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Submission Status Modal/Toast */}
          {submissionStatus.show && (
            <div
              className={`rounded-lg border p-6 ${
                submissionStatus.success
                  ? "border-green-500/50 bg-gradient-to-br from-green-950/30 to-transparent"
                  : "border-red-500/50 bg-gradient-to-br from-red-950/30 to-transparent"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {submissionStatus.success ? (
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${submissionStatus.success ? "text-green-400" : "text-red-400"}`}
                  >
                    {submissionStatus.success ? "✓ Assessment Recorded" : "⚠ Submission Error"}
                  </h3>
                  <p className="text-sm text-foreground mb-3">{submissionStatus.message}</p>
                  {submissionStatus.txHash && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Transaction Hash:</p>
                      <button
                        onClick={() =>
                          submissionStatus.explorerLink &&
                          window.open(submissionStatus.explorerLink, "_blank")
                        }
                        className="flex items-center gap-2 font-mono text-xs text-green-400 hover:text-green-300 transition-colors break-all"
                      >
                        {formatContractAddress(submissionStatus.txHash, 8)}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 bg-gradient-to-t from-background/80 to-transparent -mx-4 px-4 py-8 sm:-mx-0 sm:px-0 sm:from-transparent sm:to-transparent">
            <button
              onClick={handleNewEvaluation}
              className="rounded-lg border border-amber-400/30 px-8 py-3 font-semibold text-foreground transition-all hover:border-amber-400/60 hover:bg-white/10 active:scale-95"
            >
              Evaluate Another Asset
            </button>
            <button
              onClick={handleSubmitToChain}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-green-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Record Assessment On-Chain
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
