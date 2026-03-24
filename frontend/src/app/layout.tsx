import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OnePredict Arena - Battle AI, Predict the Future",
  description:
    "An AI prediction battle game on OneChain. Compete with other predictors, win rewards, and prove your foresight.",
  keywords: [
    "prediction",
    "AI",
    "game",
    "OneChain",
    "crypto",
    "trading",
    "competition",
  ],
  authors: [{ name: "OnePredict" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onepredict.io",
    siteName: "OnePredict Arena",
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
