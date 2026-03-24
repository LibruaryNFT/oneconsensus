"use client"

import { useState } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { SAMPLE_ASSETS, AI_AGENTS } from "@/lib/constants"
import { ChevronRight, Shield, TrendingUp } from "lucide-react"

type EvaluationState = "SELECT_ASSET" | "EVALUATING" | "RESULTS"

interface EvaluationResult {
  asset: (typeof SAMPLE_ASSETS)[0]
  riskScore: number
  collateralRatio: string
  auditorAnalysis: string
  riskOfficerAnalysis: string
  arbitratorConsensus: string
  keyRisks: string[]
  keyOpportunities: string[]
}

export default function ArenaPage() {
  const currentAccount = useCurrentAccount()
  const [state, setState] = useState<EvaluationState>("SELECT_ASSET")
  const [selectedAsset, setSelectedAsset] = useState<(typeof SAMPLE_ASSETS)[0] | null>(null)
  const [result, setResult] = useState<EvaluationResult | null>(null)

  // Handle asset selection
  const handleSelectAsset = async (asset: (typeof SAMPLE_ASSETS)[0]) => {
    setSelectedAsset(asset)
    setState("EVALUATING")

    // Simulate AI evaluation with delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock evaluation results
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

    const evaluationData: EvaluationResult = {
      asset,
      riskScore: riskScores[asset.id] || 30,
      collateralRatio: collateralRatios[asset.id] || "2.2x",
      auditorAnalysis: `${asset.name} presents strong fundamentals with an estimated yield of ${asset.yield}. The asset class demonstrates stable cash flows and is well-positioned for institutional deployment. Market demand remains robust with limited supply constraints.`,
      riskOfficerAnalysis: `While the fundamentals are solid, key risks include regulatory exposure in certain jurisdictions, concentration risk from tenant/operator dependency, and market cyclicality. Recommend enhanced due diligence on compliance frameworks and stress testing against interest rate scenarios.`,
      arbitratorConsensus: `Consensus: APPROVED. The Auditor's opportunity perspective is balanced by The Risk Officer's compliance concerns. Recommended collateral ratio of ${collateralRatios[asset.id] || "2.2x"} provides appropriate buffer. Risk score of ${riskScores[asset.id] || 30}/100 indicates manageable exposure suitable for institutional allocation.`,
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
    }

    setResult(evaluationData)
    setState("RESULTS")
  }

  // Handle new evaluation
  const handleNewEvaluation = () => {
    setState("SELECT_ASSET")
    setSelectedAsset(null)
    setResult(null)
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          RWA Risk Evaluation
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground">
          Select an asset and watch three AI agents reach consensus on risk
        </p>
      </div>

      {/* Wallet Status Banner */}
      {!currentAccount && (
        <div className="mb-8 rounded-lg border border-amber-500/50 bg-amber-500/10 px-6 py-4 text-center">
          <p className="text-amber-100">
            💡 Connect your OneChain wallet to record evaluations on-chain. For now, results are demo-generated.
          </p>
        </div>
      )}

      {/* SELECT ASSET STATE */}
      {state === "SELECT_ASSET" && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Choose an Asset to Evaluate</h2>
            <p className="mt-2 text-muted-foreground">
              Each asset will be analyzed by The Auditor, The Risk Officer, and The Arbitrator
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_ASSETS.map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleSelectAsset(asset)}
                className="group rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 transition-all duration-300 hover:border-amber-400/60 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-amber-500/20 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{asset.icon}</span>
                  <ChevronRight className="h-5 w-5 text-amber-400/60 transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="font-bold text-foreground group-hover:text-amber-400 transition-colors mb-1">
                  {asset.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{asset.type}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">📍 {asset.location}</span>
                </div>
                <div className="mt-3 flex justify-between items-center pt-3 border-t border-zinc-700/30">
                  <span className="text-xs text-muted-foreground">{asset.estimatedValue}</span>
                  <span className="text-xs font-semibold text-green-400">{asset.yield} yield</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EVALUATING STATE */}
      {state === "EVALUATING" && selectedAsset && (
        <div className="space-y-8">
          <div className="rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl">{selectedAsset.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedAsset.name}</h2>
                <p className="text-muted-foreground">{selectedAsset.type}</p>
              </div>
            </div>

            {/* Evaluation in progress */}
            <div className="space-y-6">
              <p className="text-center text-amber-400 font-semibold">Evaluating asset across 3 perspectives...</p>

              <div className="grid gap-4 md:grid-cols-3">
                {AI_AGENTS.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 text-center"
                  >
                    <div className="text-3xl mb-2">{agent.avatar}</div>
                    <h3 className="font-semibold text-foreground mb-1">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{agent.role}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs text-amber-400">Analyzing...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS STATE */}
      {state === "RESULTS" && result && (
        <div className="space-y-8">
          {/* Asset Summary Card */}
          <div className="rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-600/10 to-transparent p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{result.asset.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{result.asset.name}</h2>
                  <p className="text-muted-foreground">{result.asset.type}</p>
                  <p className="text-sm text-muted-foreground mt-1">📍 {result.asset.location}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-4xl font-bold text-amber-400">{result.riskScore}</p>
                  <p className="text-xs text-muted-foreground mt-1">/100 (Lower is Better)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Panel Debate View */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Auditor - Green/Emerald */}
            <div className="rounded-lg border border-emerald-600/40 bg-gradient-to-br from-emerald-950/30 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="font-bold text-emerald-400">The Auditor</h3>
                  <p className="text-xs text-muted-foreground">Yield Maximalist</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.auditorAnalysis}
              </p>
            </div>

            {/* Risk Officer - Red */}
            <div className="rounded-lg border border-red-600/40 bg-gradient-to-br from-red-950/30 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h3 className="font-bold text-red-400">The Risk Officer</h3>
                  <p className="text-xs text-muted-foreground">Compliance First</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.riskOfficerAnalysis}
              </p>
            </div>

            {/* Arbitrator - Amber */}
            <div className="rounded-lg border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚖️</span>
                <div>
                  <h3 className="font-bold text-amber-400">The Arbitrator</h3>
                  <p className="text-xs text-muted-foreground">Synthesizer</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
                {result.arbitratorConsensus}
              </p>
            </div>
          </div>

          {/* Collateral & Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-foreground">Recommended Collateral Ratio</h3>
              </div>
              <p className="text-3xl font-bold text-amber-400">{result.collateralRatio}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Conservative buffer recommended by consensus
              </p>
            </div>

            <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-foreground">Consensus Status</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">✓ Approved</p>
              <p className="text-xs text-muted-foreground mt-2">
                All 3 agents agree on viability
              </p>
            </div>
          </div>

          {/* Key Risks & Opportunities */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-red-600/40 bg-gradient-to-br from-red-950/20 to-transparent p-6">
              <h3 className="font-semibold text-red-400 mb-4">Key Risks Identified</h3>
              <ul className="space-y-2">
                {result.keyRisks.map((risk) => (
                  <li key={risk} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-green-600/40 bg-gradient-to-br from-green-950/20 to-transparent p-6">
              <h3 className="font-semibold text-green-400 mb-4">Key Opportunities</h3>
              <ul className="space-y-2">
                {result.keyOpportunities.map((opp) => (
                  <li key={opp} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-green-400">•</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={handleNewEvaluation}
              className="rounded-lg border border-amber-400/30 px-8 py-3 font-semibold text-foreground transition-all hover:border-amber-400/60 hover:bg-white/10"
            >
              Evaluate Another Asset
            </button>
            <button className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-amber-500/50">
              Submit to Chain
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
