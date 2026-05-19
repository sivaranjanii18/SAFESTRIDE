import { NextRequest, NextResponse } from 'next/server'

// GET /api/checkin - Get check-in history
export async function GET(request: NextRequest) {
  try {
    const userId = '1' // From session in production

    // Mock check-in history
    const checkIns = [
      {
        id: 'ci1',
        userId,
        type: 'manual',
        message: 'Just arrived at the office',
        location: {
          latitude: 40.7580,
          longitude: -73.9855,
          address: '456 Office Park, NY',
        },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        notifiedContacts: ['ec1'],
      },
      {
        id: 'ci2',
        userId,
        type: 'scheduled',
        message: 'Regular evening check-in',
        location: {
          latitude: 40.7130,
          longitude: -74.005,
          address: '123 Home St, NY',
        },
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        notifiedContacts: ['ec1', 'ec2'],
      },
    ]

    return NextResponse.json({
      success: true,
      checkIns,
    })
  } catch (error) {
    console.error('Get check-ins error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/checkin - Create new check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, location, contactIds } = body

    const userId = '1' // From session in production

    // In production, this would:
    // 1. Save check-in to database
    // 2. Notify specified contacts via SMS/push
    // 3. Reset check-in timer if scheduled

    const newCheckIn = {
      id: crypto.randomUUID(),
      userId,
      type: 'manual',
      message: message || "I'm safe and checking in",
      location: location || null,
      timestamp: new Date().toISOString(),
      notifiedContacts: contactIds || [],
    }

    console.log('Check-in created:', newCheckIn)

    // Simulate SMS notification
    if (contactIds && contactIds.length > 0) {
      console.log('Sending check-in notifications to:', contactIds)
    }

    return NextResponse.json({
      success: true,
      checkIn: newCheckIn,
      message: 'Check-in sent successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
