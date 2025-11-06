import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { makeAuthenticatedRequest, handleBackendResponse, checkRateLimit } from '@/lib/api/protected-api'

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    isAdmin: boolean
  }
}

async function getUserOrders(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check rate limiting
    if (!checkRateLimit(`orders_${userId}`, 30, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const status = searchParams.get('status') || ''

    // Call backend API
    const backendUrl = `/checkout/orders?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`
    console.log('🔍 API Route: Calling backend:', backendUrl)
    const response = await makeAuthenticatedRequest(
      backendUrl,
      { method: 'GET' },
      authToken
    )

    console.log('🔍 API Route: Backend response status:', response.status)
    
    // Clone the response to read it for logging without consuming the body
    const clonedResponse = response.clone()
    const backendData = await clonedResponse.json().catch(() => ({}))
    console.log('🔍 API Route: Backend response data:', JSON.stringify(backendData, null, 2))

    return await handleBackendResponse(response)

  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getUserOrders)
