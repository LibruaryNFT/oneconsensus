"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Calendar, Zap, Trophy } from "lucide-react"
import { DEMO_PLAYER_PROFILE, AI_PERSONALITIES, MARKETS } from "@/lib/constants"
import StatsCard from "@/components/StatsCard"

export default function ProfilePage() {
  const player = DEMO_PLAYER_PROFILE

  // Format join date
  const joinDate = new Date(player.joined).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Calculate chart data
  const chartData = [
    { name: "Wins", value: player.wins, color: "#22c55e" },
    { name: "Losses", value: player.losses, color: "#ef4444" },
  ]

  // Get AI personality name
  const getAIName = (id: string) => {
    return AI_PERSONALITIES.find((ai) => ai.id === id)?.name || id
  }

  // Get market name
  const getMarketName = (id: string) => {
    return MARKETS.find((m) => m.id === id)?.name || id
  }

  // Get market icon
  const getMarketIcon = (id: string) => {
    return MARKETS.find((m) => m.id === id)?.icon || "📊"
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
          <Trophy className="h-8 w-8" />
          Player Profile
        </h1>
        <p className="text-muted-foreground">
          Your battle stats and recent history
        </p>
      </div>

      {/* Profile Overview */}
      <div className="mb-12 rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Wallet & Rank Info */}
          <div className="space-y-4">
            <div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground">
                Wallet Address
              </div>
              <div className="mt-2 break-all font-mono text-lg text-primary">
                {player.address}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div>
                <div className="text-5xl font-bold text-primary">
                  #{player.rank}
                </div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Joined {joinDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-zinc-800/30 p-4">
              <div className="text-sm text-muted-foreground">Wins</div>
              <div className="mt-2 text-3xl font-bold text-green-400">
                {player.wins}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800/30 p-4">
              <div className="text-sm text-muted-foreground">Losses</div>
              <div className="mt-2 text-3xl font-bold text-red-400">
                {player.losses}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800/30 p-4">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="mt-2 text-3xl font-bold text-primary">
                {player.winRate.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800/30 p-4">
              <div className="text-sm text-muted-foreground">Streak</div>
              <div
                className={`mt-2 text-3xl font-bold ${player.streak > 0 ? "text-green-400" : player.streak < 0 ? "text-red-400" : "text-muted-foreground"}`}
              >
                {player.streak > 0 ? "+" : ""}
                {player.streak}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Stats Section */}
      <div className="mb-12 grid gap-8 lg:grid-cols-3">
        {/* Win Rate Chart */}
        <div className="lg:col-span-1 rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-6">
          <h3 className="mb-6 text-lg font-semibold text-foreground">
            Battle Record
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                }}
                formatter={(value) => [value, ""]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Key Stats */}
        <div className="lg:col-span-2 space-y-4">
          <StatsCard
            icon="💰"
            label="Total Earned"
            value={`$${player.totalEarned.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            variant="accent"
          />
          <StatsCard
            icon="📊"
            label="Battles Played"
            value={player.wins + player.losses}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <StatsCard
              icon="🎯"
              label="Avg Earnings/Win"
              value={`$${((player.totalEarned / player.wins) * (1 / 0.7)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            />
            <StatsCard
              icon="🔥"
              label="Current Streak"
              value={Math.abs(player.streak)}
              description={
                player.streak > 0
                  ? "Winning streak!"
                  : "Losing streak - bounce back!"
              }
            />
          </div>
        </div>
      </div>

      {/* Recent Battles */}
      <div>
        <h3 className="mb-6 text-2xl font-bold text-foreground">
          Recent Battles
        </h3>
        <div className="space-y-3">
          {player.recentBattles.map((battle) => (
            <div
              key={battle.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-4 transition-all hover:border-zinc-700/50 hover:bg-zinc-800/30"
            >
              <div className="flex flex-1 items-center gap-4">
                {/* Market Info */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMarketIcon(battle.market)}</span>
                  <div>
                    <div className="font-semibold text-foreground">
                      {getMarketName(battle.market)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(battle.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Prediction */}
                <div className="hidden sm:block">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Prediction
                  </div>
                  <div
                    className={`mt-1 font-semibold ${
                      battle.prediction === "UP"
                        ? "text-green-400"
                        : battle.prediction === "DOWN"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {battle.prediction}
                  </div>
                </div>

                {/* Opponent */}
                <div className="hidden sm:block">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Opponent
                  </div>
                  <div className="mt-1 font-semibold text-foreground">
                    {getAIName(battle.aiOpponent)}
                  </div>
                </div>
              </div>

              {/* Result & Earnings */}
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-1 font-semibold ${
                    battle.result === "WIN"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {battle.result === "WIN" ? (
                    <Trophy className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {battle.result}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    battle.earned > 0 ? "text-amber-400" : "text-red-400"
                  }`}
                >
                  {battle.earned > 0 ? "+" : ""}${Math.abs(battle.earned).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA for unconnected users (commented out as this is demo) */}
      <div className="mt-12 rounded-lg border border-primary/30 bg-primary/10 p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground">
          Want to see your own stats?
        </h3>
        <p className="mt-2 text-muted-foreground">
          Connect your wallet to view your personalized profile and start
          competing!
        </p>
        <button className="mt-6 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg">
          Connect Wallet
        </button>
      </div>
    </div>
  )
}
