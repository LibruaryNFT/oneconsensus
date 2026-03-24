import React from "react"

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  description?: string
  variant?: "default" | "accent"
}

export default function StatsCard({
  icon,
  label,
  value,
  description,
  variant = "default",
}: StatsCardProps) {
  const bgClass =
    variant === "accent"
      ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30"
      : "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border-zinc-700/50"

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border p-6 ${bgClass} transition-all duration-200 hover:border-primary/50`}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl">{icon}</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
    </div>
  )
}
