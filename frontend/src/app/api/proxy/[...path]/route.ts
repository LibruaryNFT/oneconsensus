/**
 * API Proxy Route
 *
 * This route proxies requests to the backend API to avoid CORS issues.
 * Only use this when the frontend is deployed separately from the backend.
 * For local development, the backend CORS should handle direct requests.
 */

import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathString = params.path.join("/")
  const url = new URL(`${BACKEND_URL}/${pathString}`)

  // Preserve query parameters
  url.search = new URL(request.url).search

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`Proxy GET request failed for ${pathString}:`, error)
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathString = params.path.join("/")
  const url = new URL(`${BACKEND_URL}/${pathString}`)

  try {
    const body = await request.json()

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(`Proxy POST request failed for ${pathString}:`, error)
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    )
  }
}
