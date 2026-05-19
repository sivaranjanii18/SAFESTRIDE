import { NextRequest, NextResponse } from 'next/server'

// GET /api/location - Get current location and safety info
export async function GET(request: NextRequest) {
  try {
    const userId = '1' // From session in production

    // Mock location data - in production would be from device GPS
    const locationData = {
      current: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        timestamp: new Date().toISOString(),
        address: '123 Main Street, New York, NY',
      },
      safetyScore: {
        overall: 78,
        areaScore: 82,
        timeScore: 75,
        recentIncidents: 2,
        lastUpdated: new Date().toISOString(),
      },
      nearbyAlerts: [],
      safeZones: [
        {
          id: 'sz1',
          name: 'Home',
          latitude: 40.7130,
          longitude: -74.005,
          radius: 100, // meters
        },
        {
          id: 'sz2',
          name: 'Office',
          latitude: 40.7580,
          longitude: -73.9855,
          radius: 50,
        },
      ],
    }

    return NextResponse.json({
      success: true,
      location: locationData,
    })
  } catch (error) {
    console.error('Get location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/location - Update user location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude, accuracy, address } = body

    // Validate required fields
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Valid latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90' },
        { status: 400 }
      )
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Longitude must be between -180 and 180' },
        { status: 400 }
      )
    }

    // In production, this would:
    // 1. Save location to database
    // 2. Check for nearby incidents/alerts
    // 3. Update safety score based on area
    // 4. Check if in/near safe zone

    const updatedLocation = {
      latitude,
      longitude,
      accuracy: accuracy || 10,
      timestamp: new Date().toISOString(),
      address: address || null,
    }

    return NextResponse.json({
      success: true,
      location: updatedLocation,
      message: 'Location updated successfully',
    })
  } catch (error) {
    console.error('Update location error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
