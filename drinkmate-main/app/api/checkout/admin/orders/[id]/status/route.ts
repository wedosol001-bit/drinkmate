import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      )
    }

    // Make request to backend - admin router is mounted at /admin
    // Use /api/admin to match the frontend API pattern, or /admin directly
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const backendUrl = `${baseUrl}/admin/orders/${id}/status`
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      // If response is not JSON, return error
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid response from backend (status: ${response.status})`
        },
        { status: response.status }
      )
    }
    
    if (!response.ok) {
      // Backend returns error in data.error or data.message
      const errorMessage = data?.data?.error || data?.message || data?.error || `Backend responded with status: ${response.status}`
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage
        },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update order status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
