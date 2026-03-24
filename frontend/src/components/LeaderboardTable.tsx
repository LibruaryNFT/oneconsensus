"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface Player {
  id: string
  address: string
  fullAddress: string
  wins: number
  losses: number
  winRate: number
  streak: number
  totalEarned: number
  rank: number
}

type SortKey = "rank" | "wins" | "winRate" | "streak" | "totalEarned"

interface LeaderboardTableProps {
  players: Player[]
  currentPlayerAddress?: string
  itemsPerPage?: number
}

export default function LeaderboardTable({
  players,
  currentPlayerAddress,
  itemsPerPage = 10,
}: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("wins")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }

  const sortedPlayers = useMemo(() => {
    const sorted = [...players].sort((a, b) => {
      let aVal: number
      let bVal: number

      switch (sortKey) {
        case "rank":
          aVal = a.rank
          bVal = b.rank
          break
        case "wins":
          aVal = a.wins
          bVal = b.wins
          break
        case "winRate":
          aVal = a.winRate
          bVal = b.winRate
          break
        case "streak":
          aVal = a.streak
          bVal = b.streak
          break
        case "totalEarned":
          aVal = a.totalEarned
          bVal = b.totalEarned
          break
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    })

    return sorted
  }, [players, sortKey, sortDirection])

  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedPlayers.slice(start, start + itemsPerPage)
  }, [sortedPlayers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedPlayers.length / itemsPerPage)

  const SortHeader = ({
    label,
    sortKeyValue,
  }: {
    label: string
    sortKeyValue: SortKey
  }) => (
    <button
      onClick={() => handleSort(sortKeyValue)}
      className="flex items-center gap-1 font-semibold text-foreground transition-colors hover:text-primary"
    >
      {label}
      {sortKey === sortKeyValue && (
        <>
          {sortDirection === "desc" ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </>
      )}
    </button>
  )

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return <span className="text-lg">🥇</span>
    if (rank === 2)
      return <span className="text-lg">🥈</span>
    if (rank === 3)
      return <span className="text-lg">🥉</span>
    return <span className="text-muted-foreground">{rank}</span>
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-700/50 bg-zinc-900/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700/50 bg-zinc-800/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                Player
              </th>
              <th className="px-4 py-3 text-right text-sm">
                <SortHeader label="Wins" sortKeyValue="wins" />
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">
                Losses
              </th>
              <th className="px-4 py-3 text-right text-sm">
                <SortHeader label="Win Rate" sortKeyValue="winRate" />
              </th>
              <th className="px-4 py-3 text-right text-sm">
                <SortHeader label="Streak" sortKeyValue="streak" />
              </th>
              <th className="px-4 py-3 text-right text-sm">
                <SortHeader label="Earned" sortKeyValue="totalEarned" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlayers.map((player, index) => {
              const isCurrentPlayer = player.fullAddress === currentPlayerAddress
              const rowBgClass =
                index % 2 === 0 ? "bg-transparent" : "bg-zinc-800/20"
              const highlightClass = isCurrentPlayer
                ? "ring-1 ring-primary/50 bg-primary/5"
                : ""

              return (
                <tr
                  key={player.id}
                  className={`border-b border-zinc-700/30 transition-colors hover:bg-zinc-800/40 ${rowBgClass} ${highlightClass}`}
                >
                  <td className="px-4 py-4 text-sm">
                    {getRankBadge(player.rank)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {player.address}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-green-400">
                    {player.wins}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-red-400">
                    {player.losses}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-primary">
                    {player.winRate.toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold">
                    <span
                      className={
                        player.streak > 0
                          ? "text-green-400"
                          : player.streak < 0
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }
                    >
                      {player.streak > 0 ? "+" : ""}
                      {player.streak}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-amber-400">
                    ${player.totalEarned.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-700/30 pt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({sortedPlayers.length} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-zinc-700/50 px-4 py-2 text-sm font-medium text-foreground transition-colors disabled:opacity-50 hover:enabled:bg-zinc-800"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-zinc-700/50 px-4 py-2 text-sm font-medium text-foreground transition-colors disabled:opacity-50 hover:enabled:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
