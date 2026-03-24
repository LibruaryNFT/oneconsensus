"use client"

export function PriceSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 h-10 w-10 rounded-full skeleton-loading" />
          <div className="mb-2 h-6 w-24 skeleton-loading rounded" />
          <div className="h-4 w-16 skeleton-loading rounded" />
          <div className="mt-4 h-8 w-32 skeleton-loading rounded" />
        </div>
      ))}
    </div>
  )
}

export function OpponentSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 h-12 w-12 rounded-full skeleton-loading" />
          <div className="mb-2 h-6 w-24 skeleton-loading rounded" />
          <div className="h-4 w-32 skeleton-loading rounded" />
        </div>
      ))}
    </div>
  )
}

export function LeaderboardSkeletonLoader() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
          <div className="h-6 w-6 skeleton-loading rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 skeleton-loading rounded" />
            <div className="h-3 w-32 skeleton-loading rounded" />
          </div>
          <div className="h-6 w-16 skeleton-loading rounded" />
        </div>
      ))}
    </div>
  )
}

export function AIThinkingLoader() {
  return (
    <div className="mt-8 rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="h-5 w-48 skeleton-loading rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full skeleton-loading rounded" />
        <div className="h-4 w-4/5 skeleton-loading rounded" />
      </div>
    </div>
  )
}
