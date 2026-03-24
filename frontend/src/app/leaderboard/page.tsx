"use client"

import { useState } from "react"
import { Trophy, Zap, Clock } from "lucide-react"
import { DEMO_AGENT_PERFORMANCE, AI_AGENTS } from "@/lib/constants"
import StatsCard from "@/components/StatsCard"

export default function LeaderboardPage() {
  const [agents] = useState(DEMO_AGENT_PERFORMANCE)

  // Calculate global stats
  const totalAssessments = agents.reduce((sum, a) => sum + a.assessmentsMade, 0)
  const avgAccuracy =
    agents.length > 0 ? agents.reduce((sum, a) => sum + a.accuracyScore, 0) / agents.length : 0
  const bestAgent = agents.length > 0 ? [...agents].sort((a, b) => b.accuracyScore - a.accuracyScore)[0] : null

  // Get agent details
  const getAgentDetails = (agentId: string) => {
    return AI_AGENTS.find((ai) => ai.id === agentId)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-400" />
          Agent Performance
        </h1>
        <p className="text-muted-foreground">
          See how each AI agent performs across evaluations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon="📊"
          label="Total Assessments"
          value={totalAssessments.toLocaleString()}
          variant="accent"
        />
        <StatsCard
          icon={<Zap className="h-6 w-6" />}
          label="AI Agents"
          value={agents.length}
        />
        <StatsCard
          icon="🎯"
          label="Avg Accuracy"
          value={`${avgAccuracy.toFixed(1)}%`}
        />
        <StatsCard
          icon="⭐"
          label="Top Performer"
          value={bestAgent ? `${bestAgent.accuracyScore}%` : "—"}
          variant="accent"
        />
      </div>

      {/* Agent Performance Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {agents.map((agent) => {
          const agentInfo = getAgentDetails(agent.id)
          const isTopPerformer = agent === bestAgent

          // Color scheme based on agent
          let borderColorClass = "border-zinc-700/50"
          let textColorClass = "text-amber-400"
          let accentColorClass = "bg-amber-500/20"

          if (agentInfo?.id === "auditor") {
            borderColorClass = "border-emerald-600/40"
            textColorClass = "text-emerald-400"
            accentColorClass = "bg-emerald-500/20"
          } else if (agentInfo?.id === "risk_officer") {
            borderColorClass = "border-red-600/40"
            textColorClass = "text-red-400"
            accentColorClass = "bg-red-500/20"
          }

          return (
            <div
              key={agent.id}
              className={`rounded-lg border ${borderColorClass} bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 transition-all hover:shadow-lg ${
                isTopPerformer ? "ring-2 ring-amber-400/50" : ""
              }`}
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{agentInfo?.avatar}</span>
                  <div>
                    <h3 className={`font-bold ${textColorClass} text-lg`}>
                      {agentInfo?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{agentInfo?.role}</p>
                  </div>
                </div>
                {isTopPerformer && (
                  <div className="text-2xl">⭐</div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4">
                {/* Accuracy Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <span className={`font-bold ${textColorClass}`}>
                      {agent.accuracyScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-700/30 overflow-hidden">
                    <div
                      className={`h-full ${
                        agentInfo?.id === "auditor"
                          ? "bg-emerald-400"
                          : agentInfo?.id === "risk_officer"
                            ? "bg-red-400"
                            : "bg-amber-400"
                      }`}
                      style={{ width: `${agent.accuracyScore}%` }}
                    />
                  </div>
                </div>

                {/* Assessments Made */}
                <div className="rounded-lg bg-zinc-800/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-sm">Assessments Made</span>
                    </div>
                    <div className={`font-semibold ${textColorClass}`}>
                      {agent.assessmentsMade}
                    </div>
                  </div>
                </div>

                {/* Avg Response Time */}
                <div className="rounded-lg bg-zinc-800/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Avg Response Time</span>
                    </div>
                    <div className="font-semibold text-muted-foreground">
                      {agent.avgResponseTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className={`mt-4 rounded-lg ${accentColorClass} p-3 border border-current/20`}>
                <p className="text-xs text-muted-foreground">Specialty</p>
                <p className={`text-sm font-semibold ${textColorClass}`}>
                  {agentInfo?.role}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Agent Insights Section */}
      <div className="mt-12 rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-600/10 to-transparent p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How Agents Are Evaluated</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-amber-400 mb-2">Accuracy</h3>
            <p className="text-sm text-muted-foreground">
              How often each agent&apos;s risk assessment aligns with real-world outcomes
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-amber-400 mb-2">Speed</h3>
            <p className="text-sm text-muted-foreground">
              Average time each agent takes to complete an evaluation analysis
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-semibold text-amber-400 mb-2">Consensus Building</h3>
            <p className="text-sm text-muted-foreground">
              How well each agent synthesizes its perspective into actionable insights
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
