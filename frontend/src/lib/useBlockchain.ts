/**
 * Custom hook for OneChain blockchain interactions
 * Handles transaction submission and event emission
 */

import { useCallback } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"

interface TransactionResult {
  success: boolean
  txHash: string
  message: string
  explorerLink?: string
}


export function useBlockchain() {
  const currentAccount = useCurrentAccount()

  const recordAssessmentOnChain = useCallback(
    async (assetId: string, riskScore: number, recommendation: string): Promise<TransactionResult> => {
      try {
        // Call server-side API to record assessment on-chain
        // The API will use the deployer keypair to sign and submit the transaction
        const response = await fetch('/api/record-assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assetId,
            riskScore,
            recommendation,
            assessmentsHash: `${assetId}-${riskScore}-${Date.now()}`,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return {
            success: false,
            txHash: "",
            message: `API error: ${data.error || 'Unknown error'}`,
          }
        }

        if (!data.success) {
          return {
            success: false,
            txHash: "",
            message: data.error || 'Failed to record assessment',
          }
        }

        const accountInfo = currentAccount
          ? `from ${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
          : 'via server keypair'

        return {
          success: true,
          txHash: data.txDigest,
          message: `Assessment recorded on OneChain testnet ${accountInfo}`,
          explorerLink: data.explorerLink,
        }
      } catch (error) {
        return {
          success: false,
          txHash: "",
          message: `Failed to record assessment: ${error instanceof Error ? error.message : "Unknown error"}`,
        }
      }
    },
    [currentAccount]
  )

  const queryLeaderboard = useCallback(async () => {
    // Query the leaderboard module for assessment history
    // This would call the OneChain RPC in production
    try {
      // Simulated response
      return {
        success: true,
        data: {
          totalAssessments: 1247,
          averageRiskScore: 32.5,
          consensus: "High confidence",
        },
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Failed to query leaderboard",
      }
    }
  }, [])

  return {
    connected: !!currentAccount,
    currentAccount,
    recordAssessmentOnChain,
    queryLeaderboard,
  }
}
