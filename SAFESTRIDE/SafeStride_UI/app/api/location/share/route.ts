import { NextRequest, NextResponse } from 'next/server'

// POST /api/location/share - Share location with contacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactIds, message, location, duration } = body

    // Validate required fields
    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one contact ID is required' },
        { status: 400 }
      )
    }

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Valid location data is required' },
        { status: 400 }
      )
    }

    const userId = '1' // From session in production

    // Create location share record
    const shareRecord = {
      id: crypto.randomUUID(),
      userId,
      contactIds,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 10,
        timestamp: new Date().toISOString(),
        address: location.address || null,
      },
      message: message || 'I am sharing my location with you.',
      sharedAt: new Date().toISOString(),
      expiresAt: duration
        ? new Date(Date.now() + duration * 60 * 1000).toISOString()
        : new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Default 1 hour
      status: 'active',
    }

    // In production, this would:
    // 1. Save share record to database
    // 2. Send SMS with location link to contacts
    // 3. Send push notifications
    // 4. Generate shareable link

    // Generate mock shareable link
    const shareLink = `https://safestride.app/track/${shareRecord.id}`

    console.log('Location shared:', shareRecord)
    console.log('Share link:', shareLink)
    console.log('Notifying contacts:', contactIds)

    return NextResponse.json({
      success: true,
      share: shareRecord,
      shareLink,
      message: `Location shared with ${contactIds.length} contact(s)`,
    }, { status: 201 })
  } catch (error) {
    console.error('Share location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/location/share - Stop sharing location
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // In production, this would update share record status to 'stopped'
    return NextResponse.json({
      success: true,
      message: 'Location sharing stopped',
    })
  } catch (error) {
    console.error('Stop sharing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
