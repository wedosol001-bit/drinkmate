import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { makeAuthenticatedRequest, handleBackendResponse, checkRateLimit, sanitizeInput, validateNationalAddress } from '@/lib/api/protected-api'

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    isAdmin: boolean
  }
}

async function getUserAddresses(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check rate limiting
    if (!checkRateLimit(`addresses_${userId}`, 20, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Call backend API to get addresses
    const response = await makeAuthenticatedRequest(
      `/addresses`,
      { method: 'GET' },
      authToken
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch addresses' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    // Transform backend addresses to frontend format
    const addresses = (result.data || []).map((addr: any) => ({
      id: addr._id || addr.id,
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      district: addr.district || '',
      city: addr.city || '',
      country: addr.country || 'Saudi Arabia',
      nationalAddress: addr.nationalAddress || '',
      isDefault: addr.isDefault || false,
      createdAt: addr.createdAt || new Date().toISOString(),
      updatedAt: addr.updatedAt || new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: addresses
    })

  } catch (error) {
    console.error('Error fetching user addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createUserAddress(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check rate limiting
    if (!checkRateLimit(`create_address_${userId}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { 
      fullName, 
      phone, 
      district, 
      city, 
      country = 'Saudi Arabia',
      nationalAddress,
      isDefault = false 
    } = body

    // Validation
    if (!fullName || !phone || !district || !city) {
      return NextResponse.json(
        { error: 'Full name, phone, district, and city are required' },
        { status: 400 }
      )
    }

    // Validate national address format if provided
    if (nationalAddress && !validateNationalAddress(nationalAddress)) {
      return NextResponse.json(
        { error: 'Invalid national address format. Must be 4 letters followed by 4 numbers (e.g., JESA3591)' },
        { status: 400 }
      )
    }

    const authToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    
    // Call backend API to create address
    const response = await makeAuthenticatedRequest(
      `/addresses`,
      {
        method: 'POST',
        body: JSON.stringify({
          fullName: sanitizeInput(fullName),
          phone: sanitizeInput(phone),
          district: sanitizeInput(district),
          city: sanitizeInput(city),
          country: sanitizeInput(country),
          nationalAddress: nationalAddress ? sanitizeInput(nationalAddress).toUpperCase() : '',
          isDefault: isDefault
        })
      },
      authToken
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to create address' },
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
      message: 'Address created successfully',
      data: address
    })

  } catch (error) {
    console.error('Error creating user address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateUserAddress(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { id } = req.params || {}
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
    
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: result.data
    })

  } catch (error) {
    console.error('Error updating user address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function deleteUserAddress(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { id } = req.params || {}

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

async function setDefaultAddress(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { id } = req.params || {}

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
    
    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
      data: result.data
    })

  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getUserAddresses)
export const POST = withAuth(createUserAddress)
