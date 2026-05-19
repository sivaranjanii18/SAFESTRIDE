import { NextRequest, NextResponse } from 'next/server'

// GET /api/devices - Get all devices for user
export async function GET(request: NextRequest) {
  try {
    // In production, extract user from session/token
    const userId = '1' // Mock user ID

    // Mock devices data
    const devices = [
      {
        id: 'd1',
        userId,
        name: 'iPhone 15 Pro',
        type: 'smartphone',
        isConnected: true,
        batteryLevel: 85,
        lastSyncAt: new Date().toISOString(),
      },
      {
        id: 'd2',
        userId,
        name: 'Apple Watch',
        type: 'smartwatch',
        bluetoothId: 'BT-WATCH-001',
        isConnected: true,
        batteryLevel: 72,
        lastSyncAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      devices,
    })
  } catch (error) {
    console.error('Get devices error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/devices - Register new device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, bluetoothId } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Device name and type are required' },
        { status: 400 }
      )
    }

    // Validate device type
    const validTypes = ['smartphone', 'smartwatch', 'tracker']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid device type' },
        { status: 400 }
      )
    }

    // In production, this would save to database
    const newDevice = {
      id: crypto.randomUUID(),
      userId: '1', // From session
      name,
      type,
      bluetoothId: bluetoothId || null,
      isConnected: true,
      batteryLevel: 100,
      lastSyncAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      device: newDevice,
      message: 'Device registered successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Register device error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/devices - Remove device
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('id')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }

    // In production, this would delete from database
    return NextResponse.json({
      success: true,
      message: 'Device removed successfully',
    })
  } catch (error) {
    console.error('Remove device error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
