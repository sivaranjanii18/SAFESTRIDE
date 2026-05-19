import { NextRequest, NextResponse } from 'next/server'

// GET /api/sos - Get SOS alert history
export async function GET(request: NextRequest) {
  try {
    const userId = '1' // From session in production

    // Mock SOS history
    const alerts = [
      {
        id: 'sos1',
        userId,
        location: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          address: '123 Main St, New York, NY',
        },
        status: 'resolved',
        type: 'sos',
        triggeredAt: new Date(Date.now() - 86400000).toISOString(),
        resolvedAt: new Date(Date.now() - 86000000).toISOString(),
        notifiedContacts: ['ec1', 'ec2'],
        notes: 'False alarm - pocket dial',
      },
    ]

    return NextResponse.json({
      success: true,
      alerts,
    })
  } catch (error) {
    console.error('Get SOS history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/sos - Trigger SOS alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location, type = 'sos' } = body

    // Validate location data
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Valid location data is required' },
        { status: 400 }
      )
    }

    const userId = '1' // From session in production

    // Create new SOS alert
    const newAlert = {
      id: crypto.randomUUID(),
      userId,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 10,
        timestamp: new Date().toISOString(),
        address: location.address || null,
      },
      status: 'active',
      type,
      triggeredAt: new Date().toISOString(),
      notifiedContacts: ['ec1', 'ec2'], // Would be fetched from user's contacts
    }

    // In production, this would:
    // 1. Save alert to database
    // 2. Fetch user's emergency contacts
    // 3. Send SMS notifications via Twilio/similar
    // 4. Send push notifications
    // 5. Optionally call emergency services

    // Simulate notification sending
    console.log('SOS Alert triggered:', newAlert)
    console.log('Sending notifications to contacts:', newAlert.notifiedContacts)

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: 'SOS alert triggered - contacts notified',
    }, { status: 201 })
  } catch (error) {
    console.error('Trigger SOS error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/sos - Update SOS alert (resolve/cancel)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['active', 'resolved', 'cancelled']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // In production, this would update in database
    const updatedAlert = {
      id,
      status: status || 'resolved',
      resolvedAt: new Date().toISOString(),
      notes: notes || null,
    }

    // Notify contacts that alert is resolved
    console.log('SOS Alert resolved:', updatedAlert)

    return NextResponse.json({
      success: true,
      alert: updatedAlert,
      message: `SOS alert ${status || 'resolved'} - contacts notified`,
    })
  } catch (error) {
    console.error('Update SOS error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
