import { NextRequest, NextResponse } from 'next/server'

// GET /api/contacts - Get all emergency contacts
export async function GET(request: NextRequest) {
  try {
    const userId = '1' // From session in production

    // Mock emergency contacts
    const contacts = [
      {
        id: 'ec1',
        userId,
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        email: 'sarah@email.com',
        relationship: 'Sister',
        isPrimary: true,
        notifyOnSOS: true,
        notifyOnCheckIn: true,
      },
      {
        id: 'ec2',
        userId,
        name: 'Mike Chen',
        phone: '+1 (555) 456-7890',
        relationship: 'Friend',
        isPrimary: false,
        notifyOnSOS: true,
        notifyOnCheckIn: false,
      },
    ]

    return NextResponse.json({
      success: true,
      contacts,
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Add emergency contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, relationship, isPrimary, notifyOnSOS, notifyOnCheckIn } = body

    // Validate required fields
    if (!name || !phone || !relationship) {
      return NextResponse.json(
        { error: 'Name, phone, and relationship are required' },
        { status: 400 }
      )
    }

    // Validate phone format
    const phoneRegex = /^[+]?[\d\s()-]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
    }

    // In production, this would save to database
    const newContact = {
      id: crypto.randomUUID(),
      userId: '1',
      name,
      phone,
      email: email || null,
      relationship,
      isPrimary: isPrimary ?? false,
      notifyOnSOS: notifyOnSOS ?? true,
      notifyOnCheckIn: notifyOnCheckIn ?? false,
    }

    return NextResponse.json({
      success: true,
      contact: newContact,
      message: 'Emergency contact added successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Add contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/contacts - Update emergency contact
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    // In production, this would update in database
    return NextResponse.json({
      success: true,
      contact: { id, ...updates },
      message: 'Emergency contact updated successfully',
    })
  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts - Remove emergency contact
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('id')

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    // In production, this would delete from database
    return NextResponse.json({
      success: true,
      message: 'Emergency contact removed successfully',
    })
  } catch (error) {
    console.error('Remove contact error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
