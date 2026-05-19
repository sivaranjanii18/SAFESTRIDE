import { NextRequest, NextResponse } from 'next/server'

// POST /api/devices/sync - Sync device data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, batteryLevel, bluetoothStatus, location, healthData } = body

    // Validate required fields
    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }

    const userId = '1' // From session in production

    // In production, this would:
    // 1. Verify device belongs to user
    // 2. Update device status in database
    // 3. Store location history
    // 4. Process health data if from smartwatch
    // 5. Check for anomalies (sudden stops, falls, etc.)

    const syncResult = {
      deviceId,
      syncedAt: new Date().toISOString(),
      status: 'success',
      data: {
        batteryLevel: batteryLevel ?? null,
        bluetoothStatus: bluetoothStatus ?? 'unknown',
        locationUpdated: !!location,
        healthDataProcessed: !!healthData,
      },
    }

    // Check for low battery alert
    if (batteryLevel && batteryLevel < 20) {
      console.log(`Low battery alert for device ${deviceId}: ${batteryLevel}%`)
      // Would trigger notification in production
    }

    return NextResponse.json({
      success: true,
      sync: syncResult,
      message: 'Device synced successfully',
    })
  } catch (error) {
    console.error('Device sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/devices/sync - Get sync status for all devices
export async function GET(request: NextRequest) {
  try {
    const userId = '1' // From session in production

    // Mock sync status
    const syncStatus = {
      lastFullSync: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
      devices: [
        {
          id: 'd1',
          name: 'iPhone 15 Pro',
          status: 'connected',
          lastSync: new Date(Date.now() - 60000).toISOString(),
          batteryLevel: 85,
        },
        {
          id: 'd2',
          name: 'Apple Watch',
          status: 'connected',
          lastSync: new Date(Date.now() - 120000).toISOString(),
          batteryLevel: 72,
        },
      ],
      pendingUpdates: 0,
    }

    return NextResponse.json({
      success: true,
      syncStatus,
    })
  } catch (error) {
    console.error('Get sync status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
