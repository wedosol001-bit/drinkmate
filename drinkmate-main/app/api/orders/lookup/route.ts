import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { email, orderNumber } = await req.json()

    if (!email || !orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Email and order number are required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/orders/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, orderNumber })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to lookup order' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in order lookup API route:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

