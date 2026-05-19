import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/login - User login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // In production, this would:
    // 1. Look up user in database
    // 2. Verify password with bcrypt.compare()
    // 3. Generate JWT token or session
    // 4. Set HTTP-only cookie

    // Mock successful login for demo
    const mockUser = {
      id: '1',
      email,
      name: 'Demo User',
      phone: '+1 (555) 123-4567',
      createdAt: new Date().toISOString(),
    }

    // Create mock session token
    const sessionToken = Buffer.from(JSON.stringify({
      userId: mockUser.id,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Login successful',
    })

    // Set secure HTTP-only cookie
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
