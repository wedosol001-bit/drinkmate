import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { makeAuthenticatedRequest, checkRateLimit, sanitizeInput, validateNationalAddress } from '@/lib/api/protected-api'

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    isAdmin: boolean
  }
}

async function updateUserAddress(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { 
      fullName, 
      phone, 
      district, 
      city, 
      country,
      nationalAddress,
      isDefault
    } = body

    // Validate national address format if provided
    if (nationalAddress && !validateNationalAddress(nationalAddress)) {
      return NextResponse.json(
        { error: 'Invalid national address format. Must be 4 letters followed by 4 numbers (e.g., JESA3591)' },
        { status: 400 }
      )
    }

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Call backend API to update address
    const response = await makeAuthenticatedRequest(
      `/addresses/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          ...(fullName && { fullName: sanitizeInput(fullName) }),
          ...(phone && { phone: sanitizeInput(phone) }),
          ...(district && { district: sanitizeInput(district) }),
          ...(city && { city: sanitizeInput(city) }),
          ...(country && { country: sanitizeInput(country) }),
          ...(nationalAddress !== undefined && { 
            nationalAddress: nationalAddress ? sanitizeInput(nationalAddress).toUpperCase() : '' 
          }),
          ...(isDefault !== undefined && { isDefault })
        })
      },
      authToken
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to update address' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    // Transform backend address to frontend format
    const address = {
      id: result.data?._id || result.data?.id,
      fullName: result.data?.fullName || fullName,
      phone: result.data?.phone || phone,
      district: result.data?.district || district,
      city: result.data?.city || city,
      country: result.data?.country || country,
      nationalAddress: result.data?.nationalAddress || nationalAddress || '',
      isDefault: result.data?.isDefault || isDefault,
      createdAt: result.data?.createdAt || new Date().toISOString(),
      updatedAt: result.data?.updatedAt || new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    })

  } catch (error) {
    console.error('Error updating user address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deleteUserAddress(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { id } = await params

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Call backend API to delete address
    const response = await makeAuthenticatedRequest(
      `/addresses/${id}`,
      {
        method: 'DELETE'
      },
      authToken
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete address' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PUT = withAuth(updateUserAddress)
export const DELETE = withAuth(deleteUserAddress)


