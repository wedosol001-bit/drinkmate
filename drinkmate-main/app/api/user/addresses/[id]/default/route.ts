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

async function setDefaultAddress(
  req: AuthenticatedRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Call backend API to set default address
    const response = await makeAuthenticatedRequest(
      `/addresses/${id}/default`,
      {
        method: 'PATCH'
      },
      authToken
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to set default address' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    // Transform backend address to frontend format
    const address = {
      id: result.data?._id || result.data?.id,
      fullName: result.data?.fullName || '',
      phone: result.data?.phone || '',
      district: result.data?.district || '',
      city: result.data?.city || '',
      country: result.data?.country || 'Saudi Arabia',
      nationalAddress: result.data?.nationalAddress || '',
      isDefault: result.data?.isDefault || true,
      createdAt: result.data?.createdAt || new Date().toISOString(),
      updatedAt: result.data?.updatedAt || new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    })

  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PATCH = withAuth(setDefaultAddress)


