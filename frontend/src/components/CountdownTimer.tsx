"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  duration: number // in seconds
  onComplete: () => void
}

export default function CountdownTimer({
  duration,
  onComplete,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    if (remaining <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setRemaining(remaining - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [remaining, onComplete])

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (remaining / duration) * circumference

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in px-4">
      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          {/* Progress circle with glow */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300 filter drop-shadow-lg"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50px 50px",
            }}
          />
        </svg>

        {/* Center text with glow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl sm:text-6xl font-bold text-primary animate-pulse">
            {remaining}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">seconds</div>
        </div>
      </div>

      {/* Status message */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-base sm:text-lg text-muted-foreground mb-2">
          ⚔️ Battle in progress...
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Resolving prediction in {remaining} seconds
        </p>
      </div>
    </div>
  )
}
