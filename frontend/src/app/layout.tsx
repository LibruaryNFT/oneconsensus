import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneHack 3.0 Never Paid Out",
  description:
    "A project claiming a $67 million raise told hackathon participants it 'cannot pay' a $16,000 prize pool. 543 builders, three hackathons, no payouts.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oneconsensus.one",
    siteName: "OneConsensus",
    title: "OneHack 3.0 Never Paid Out",
    description:
      "A project claiming a $67 million raise told hackathon participants it 'cannot pay' a $16,000 prize pool.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneHack 3.0 Never Paid Out",
    description:
      "A project claiming a $67 million raise told hackathon participants it 'cannot pay' a $16,000 prize pool.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        {children}
      </body>
    </html>
  )
}
