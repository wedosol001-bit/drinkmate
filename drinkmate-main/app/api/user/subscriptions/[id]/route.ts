import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { makeAuthenticatedRequest, checkRateLimit } from '@/lib/api/protected-api'

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    isAdmin: boolean
  }
}

async function updateSubscription(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    const response = await makeAuthenticatedRequest(
      `/subscriptions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      },
      authToken
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to update subscription' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PUT = withAuth(updateSubscription)

