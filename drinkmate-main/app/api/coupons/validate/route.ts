import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { makeAuthenticatedRequest } from '@/lib/api/protected-api'

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    isAdmin: boolean
  }
}

export async function POST(req: AuthenticatedRequest) {
  try {
    const { code, cartTotal } = await req.json()

    if (!code || !cartTotal) {
      return NextResponse.json(
        { success: false, message: 'Coupon code and cart total are required' },
        { status: 400 }
      )
    }

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    const userId = req.user?.id

    if (!userId || !authToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const response = await makeAuthenticatedRequest(
      `/checkout/validate-coupon`,
      {
        method: 'POST',
        body: JSON.stringify({ code, cartTotal })
      },
      authToken
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to validate coupon' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in coupon validation API route:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

