"use client"

import { useState, useEffect } from "react"
import { Search, Trophy, Users, TrendingUp } from "lucide-react"
import { DEMO_LEADERBOARD_PLAYERS } from "@/lib/constants"
import { fetchLeaderboard } from "@/lib/api"
import LeaderboardTable from "@/components/LeaderboardTable"
import StatsCard from "@/components/StatsCard"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [players, setPlayers] = useState(DEMO_LEADERBOARD_PLAYERS)
  const [filteredPlayers, setFilteredPlayers] = useState(
    DEMO_LEADERBOARD_PLAYERS
  )
  const [loading, setLoading] = useState(true)

  // Fetch leaderboard on mount
  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true)
      const leaderboardData = await fetchLeaderboard()

      // Use backend data if available, otherwise use demo data
      if (leaderboardData && leaderboardData.length > 0) {
        setPlayers(leaderboardData)
        setFilteredPlayers(leaderboardData)
      } else {
        setPlayers(DEMO_LEADERBOARD_PLAYERS)
        setFilteredPlayers(DEMO_LEADERBOARD_PLAYERS)
      }

      setLoading(false)
    }

    loadLeaderboard()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredPlayers(players)
    } else {
      const filtered = players.filter((player) =>
        player.address.toLowerCase().includes(query.toLowerCase()) ||
        player.fullAddress.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredPlayers(filtered)
    }
  }

  // Calculate global stats
  const totalBattles = players.reduce(
    (sum, p) => sum + p.wins + p.losses,
    0
  )
  const totalEarned = players.reduce(
    (sum, p) => sum + p.totalEarned,
    0
  )
  const avgWinRate =
    players.length > 0 ? players.reduce((sum, p) => sum + p.winRate, 0) / players.length : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
          <Trophy className="h-8 w-8" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">
          See who&apos;s winning in the OnePredict Arena
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon="⚔️"
          label="Total Battles"
          value={loading ? "..." : totalBattles.toLocaleString()}
          variant="accent"
        />
        <StatsCard
          icon={<Users className="h-6 w-6" />}
          label="Active Players"
          value={loading ? "..." : players.length}
        />
        <StatsCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Avg Win Rate"
          value={loading ? "..." : `${avgWinRate.toFixed(1)}%`}
        />
        <StatsCard
          icon="💰"
          label="Total Earned"
          value={loading ? "..." : `$${totalEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          variant="accent"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by wallet address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700/50 bg-zinc-900/30 py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Results info */}
      {searchQuery && (
        <div className="mb-4 text-sm text-muted-foreground">
          Found {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Leaderboard Table */}
      {filteredPlayers.length > 0 ? (
        <LeaderboardTable players={filteredPlayers} itemsPerPage={10} />
      ) : (
        <div className="flex h-96 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-900/30">
          <div className="text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No players found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try searching with a different wallet address
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
