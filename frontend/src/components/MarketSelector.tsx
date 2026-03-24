"use client"

import { useEffect, useState } from "react"
import { MARKETS } from "@/lib/constants"
import { fetchPrice, PriceData } from "@/lib/api"
import { PriceSkeletonLoader } from "@/components/SkeletonLoader"
import clsx from "clsx"

interface MarketSelectorProps {
  selectedMarket: string | null
  onSelectMarket: (marketId: string) => void
}

export default function MarketSelector({
  selectedMarket,
  onSelectMarket,
}: MarketSelectorProps) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrices = async () => {
      setLoading(true)
      const newPrices: Record<string, PriceData> = {}

      for (const market of MARKETS) {
        try {
          const priceData = await fetchPrice(market.id)
          newPrices[market.id] = priceData
        } catch (error) {
          console.error(`Failed to fetch price for ${market.id}:`, error)
        }
      }

      setPrices(newPrices)
      setLoading(false)
    }

    loadPrices()
  }, [])

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Select a Market</h2>
      {loading ? (
        <PriceSkeletonLoader />
      ) : (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MARKETS.map((market) => {
          const priceData = prices[market.id]
          const isSelected = selectedMarket === market.id

          return (
            <button
              key={market.id}
              onClick={() => onSelectMarket(market.id)}
              className={clsx(
                "group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300",
                isSelected
                  ? "border-primary bg-amber-950/20 shadow-lg shadow-primary/30"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              )}
              disabled={loading}
            >
              {/* Gradient background on hover */}
              <div
                className={clsx(
                  "absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300",
                  isSelected && "opacity-100"
                )}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-3 text-4xl">{market.icon}</div>

                {/* Market name */}
                <h3 className="text-lg font-bold text-foreground">
                  {market.name}
                </h3>
                <p className="text-sm text-muted-foreground">{market.symbol}</p>

                {/* Price */}
                {loading ? (
                  <div className="mt-4 h-6 w-24 animate-pulse rounded bg-border" />
                ) : priceData ? (
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-primary">
                      ${priceData.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={clsx(
                        "text-sm font-semibold",
                        priceData.change24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {priceData.change24h > 0 ? "+" : ""}
                      {priceData.change24h.toFixed(2)}% (24h)
                    </p>
                  </div>
                ) : null}

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute right-4 top-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <svg
                        className="h-4 w-4 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      )}
    </div>
  )
}
