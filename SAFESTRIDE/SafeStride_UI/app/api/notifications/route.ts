import { NextRequest, NextResponse } from 'next/server'

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const userId = '1' // From session in production

    // Mock notifications
    const notifications = [
      {
        id: 'n1',
        userId,
        type: 'info',
        title: 'Safety Check Complete',
        message: 'Your area has been assessed as safe. Stay vigilant!',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'n2',
        userId,
        type: 'reminder',
        title: 'Check-in Reminder',
        message: "You haven't checked in for 2 hours. Let your contacts know you're safe.",
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'n3',
        userId,
        type: 'info',
        title: 'Device Connected',
        message: 'Apple Watch is now connected and syncing.',
        isRead: true,
        createdAt: new Date(Date.now() - 18000000).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => !n.isRead).length,
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Send notification (internal/admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, actionUrl } = body

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'userId, type, title, and message are required' },
        { status: 400 }
      )
    }

    const validTypes = ['alert', 'info', 'reminder', 'sos']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      )
    }

    // In production, this would:
    // 1. Save notification to database
    // 2. Send push notification via FCM/APNS
    // 3. Send SMS if critical alert
    // 4. Send email notification

    const newNotification = {
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl: actionUrl || null,
    }

    return NextResponse.json({
      success: true,
      notification: newNotification,
      message: 'Notification sent successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, markAllRead } = body

    if (!notificationIds && !markAllRead) {
      return NextResponse.json(
        { error: 'notificationIds or markAllRead is required' },
        { status: 400 }
      )
    }

    // In production, this would update in database
    return NextResponse.json({
      success: true,
      message: markAllRead
        ? 'All notifications marked as read'
        : `${notificationIds?.length || 0} notifications marked as read`,
    })
  } catch (error) {
    console.error('Update notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const deleteAll = searchParams.get('all') === 'true'

    if (!notificationId && !deleteAll) {
      return NextResponse.json(
        { error: 'Notification ID or deleteAll flag is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: deleteAll
        ? 'All notifications deleted'
        : 'Notification deleted successfully',
    })
  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
