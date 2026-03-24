import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import { WalletProviderWrapper } from "@/lib/wallet-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneConsensus - AI-Powered RWA Risk Assessment",
  description:
    "Three sovereign AI agents debate, analyze, and reach consensus on real-world asset risk. Institutional-grade risk intelligence verified on-chain.",
  keywords: [
    "RWA",
    "risk assessment",
    "AI consensus",
    "real-world assets",
    "blockchain",
    "tokenization",
    "risk management",
  ],
  authors: [{ name: "OneConsensus" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oneconsensus.io",
    siteName: "OneConsensus",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletProviderWrapper>
          <Header />
          <main className="min-h-screen">{children}</main>
        </WalletProviderWrapper>
      </body>
    </html>
  )
}
