import { NextRequest, NextResponse } from 'next/server'

// GET /api/incidents - Get incident reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '1'
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const nearby = searchParams.get('nearby') === 'true'

    // Mock incidents data
    let incidents = [
      {
        id: '1',
        userId: '1',
        type: 'unsafe_area',
        description: 'Poorly lit street corner with no foot traffic after dark',
        location: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          timestamp: new Date().toISOString(),
          address: '123 Main St, New York',
        },
        severity: 'medium',
        reportedAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'reviewed',
        isAnonymous: false,
      },
      {
        id: '2',
        userId: '1',
        type: 'harassment',
        description: 'Verbal harassment near the subway entrance',
        location: {
          latitude: 40.7580,
          longitude: -73.9855,
          accuracy: 15,
          timestamp: new Date().toISOString(),
          address: '456 Broadway, New York',
        },
        severity: 'high',
        reportedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
        isAnonymous: true,
      },
      {
        id: '3',
        userId: '1',
        type: 'theft',
        description: 'Witnessed phone snatching incident',
        location: {
          latitude: 40.7300,
          longitude: -73.9950,
          accuracy: 10,
          timestamp: new Date().toISOString(),
          address: '789 Park Ave, New York',
        },
        severity: 'high',
        reportedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'resolved',
        isAnonymous: false,
      },
    ]

    // Filter by type
    if (type) {
      incidents = incidents.filter(i => i.type === type)
    }

    // Filter by status
    if (status) {
      incidents = incidents.filter(i => i.status === status)
    }

    return NextResponse.json({
      success: true,
      incidents,
      count: incidents.length,
    })
  } catch (error) {
    console.error('Get incidents error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/incidents - Create incident report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, description, location, severity, isAnonymous, attachments } = body

    // Validate required fields
    if (!type || !description || !location || !severity) {
      return NextResponse.json(
        { error: 'Type, description, location, and severity are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['unsafe_area', 'harassment', 'theft', 'accident', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid incident type' },
        { status: 400 }
      )
    }

    // Validate severity
    const validSeverities = ['low', 'medium', 'high']
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid severity level' },
        { status: 400 }
      )
    }

    const userId = '1' // From session in production

    // In production, this would:
    // 1. Save incident to database
    // 2. Process any attachments (images/audio)
    // 3. Notify nearby users if high severity
    // 4. Update area safety score
    // 5. Potentially alert authorities for serious incidents

    const newIncident = {
      id: crypto.randomUUID(),
      userId: isAnonymous ? null : userId,
      type,
      description,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 10,
        timestamp: new Date().toISOString(),
        address: location.address || null,
      },
      severity,
      reportedAt: new Date().toISOString(),
      status: 'pending',
      isAnonymous: isAnonymous ?? false,
      attachments: attachments || [],
    }

    console.log('Incident reported:', newIncident)

    return NextResponse.json({
      success: true,
      incident: newIncident,
      message: 'Incident reported successfully. Thank you for helping keep the community safe.',
    }, { status: 201 })
  } catch (error) {
    console.error('Report incident error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/incidents - Update incident status (admin/user)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Incident ID is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'reviewed', 'resolved']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      incident: { id, status, notes, updatedAt: new Date().toISOString() },
      message: 'Incident updated successfully',
    })
  } catch (error) {
    console.error('Update incident error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
