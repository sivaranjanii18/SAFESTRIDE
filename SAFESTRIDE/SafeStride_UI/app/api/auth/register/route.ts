import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/register - User registration endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone format (basic)
    const phoneRegex = /^[+]?[\d\s()-]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // In production, this would:
    // 1. Check if email already exists
    // 2. Hash password with bcrypt
    // 3. Create user in database
    // 4. Send verification email
    // 5. Return user data (without password)

    // Mock user creation for demo
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
      devices: [],
      emergencyContacts: [],
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Registration successful',
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
