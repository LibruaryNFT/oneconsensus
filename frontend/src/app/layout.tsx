import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneConsensus - AI-Powered RWA Risk Assessment",
  description:
    "Three sovereign AI agents debate, analyze, and reach consensus on real-world asset risk. Built for OneHack 3.0.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oneconsensus.one",
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
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
