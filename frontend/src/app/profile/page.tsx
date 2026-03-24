"use client"

import { useState } from "react"
import { TrendingUp, CheckCircle, Shield } from "lucide-react"
import { DEMO_EVALUATIONS, SAMPLE_ASSETS } from "@/lib/constants"
import StatsCard from "@/components/StatsCard"

export default function ProfilePage() {
  const [evaluations] = useState(DEMO_EVALUATIONS)

  // Get asset details
  const getAssetDetails = (assetId: string) => {
    return SAMPLE_ASSETS.find((a) => a.id === assetId)
  }

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  // Calculate stats
  const totalEvaluations = evaluations.length
  const avgRiskScore =
    evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + e.riskScore, 0) / evaluations.length).toFixed(1)
      : 0
  const highRiskCount = evaluations.filter((e) => e.riskScore > 60).length
  const lowRiskCount = evaluations.filter((e) => e.riskScore < 30).length

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-amber-400" />
          Evaluation History
        </h1>
        <p className="text-muted-foreground">
          Your asset risk assessment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon="📊"
          label="Total Evaluations"
          value={totalEvaluations.toLocaleString()}
          variant="accent"
        />
        <StatsCard
          icon="📈"
          label="Avg Risk Score"
          value={`${avgRiskScore}/100`}
        />
        <StatsCard
          icon="🟢"
          label="Low Risk Assets"
          value={lowRiskCount}
        />
        <StatsCard
          icon="🔴"
          label="High Risk Assets"
          value={highRiskCount}
          variant="accent"
        />
      </div>

      {/* Recent Evaluations */}
      <div>
        <h3 className="mb-6 text-2xl font-bold text-foreground">
          Recent Evaluations
        </h3>

        {evaluations.length > 0 ? (
          <div className="space-y-3">
            {evaluations.map((evaluation) => {
              const asset = getAssetDetails(evaluation.assetId)
              const riskLevel =
                evaluation.riskScore < 30
                  ? "LOW"
                  : evaluation.riskScore < 60
                    ? "MEDIUM"
                    : "HIGH"
              const riskColor =
                riskLevel === "LOW"
                  ? "text-green-400"
                  : riskLevel === "MEDIUM"
                    ? "text-yellow-400"
                    : "text-red-400"
              const riskBgColor =
                riskLevel === "LOW"
                  ? "bg-green-500/20"
                  : riskLevel === "MEDIUM"
                    ? "bg-yellow-500/20"
                    : "bg-red-500/20"

              return (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-4 transition-all hover:border-zinc-700/50 hover:bg-zinc-800/30"
                >
                  <div className="flex flex-1 items-center gap-4">
                    {/* Asset Info */}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{asset?.icon}</span>
                      <div>
                        <div className="font-semibold text-foreground">
                          {asset?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(evaluation.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Asset Type */}
                    <div className="hidden sm:block">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Type
                      </div>
                      <div className="mt-1 font-semibold text-foreground">
                        {asset?.type}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="hidden md:block">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        Location
                      </div>
                      <div className="mt-1 font-semibold text-foreground">
                        {asset?.location}
                      </div>
                    </div>
                  </div>

                  {/* Risk Score & Status */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-1 font-semibold ${riskBgColor} ${riskColor}`}>
                      {evaluation.consensusReached ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                      {riskLevel}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                      <div className="text-2xl font-bold text-amber-400">
                        {evaluation.riskScore}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-900/30">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No evaluations yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start by evaluating an asset in the Arena
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Evaluation Insights */}
      <div className="mt-12 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-600/10 to-transparent p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Evaluation Insights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-amber-400 mb-2">Portfolio Health</h3>
            <p className="text-sm text-muted-foreground">
              {lowRiskCount > highRiskCount
                ? "Your portfolio is weighted toward lower-risk assets. This suggests a conservative investment approach."
                : "Your portfolio includes significant exposure to higher-risk assets. Consider diversifying for stability."}
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-amber-400 mb-2">Average Risk</h3>
            <p className="text-sm text-muted-foreground">
              Your evaluated assets average a risk score of {avgRiskScore}/100. This reflects{" "}
              {parseFloat(avgRiskScore as string) < 40
                ? "conservative selection criteria"
                : parseFloat(avgRiskScore as string) < 70
                  ? "balanced risk tolerance"
                  : "aggressive opportunity seeking"}
              .
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-semibold text-amber-400 mb-2">Next Steps</h3>
            <p className="text-sm text-muted-foreground">
              Continue evaluating assets to build a comprehensive view of your market opportunities and refine your investment thesis.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-400/20 p-12 text-center">
        <h3 className="text-3xl font-bold text-foreground mb-4">
          Ready to evaluate more assets?
        </h3>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
          Return to the Arena to analyze new RWA opportunities and expand your evaluation portfolio.
        </p>
        <a
          href="/arena"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-4 font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50"
        >
          <TrendingUp className="h-5 w-5" />
          Evaluate Assets
        </a>
      </div>
    </div>
  )
}
