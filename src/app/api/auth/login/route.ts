import { NextRequest, NextResponse } from 'next/server'

// Mock user database - ini akan diganti dengan database MariaDB
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@nusantararadius.id',
    role: 'admin',
    name: 'Administrator'
  },
  {
    id: 2,
    username: 'operator',
    password: 'operator123',
    email: 'operator@nusantararadius.id',
    role: 'operator',
    name: 'Network Operator'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Cari user di database
    const user = users.find(u => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Buat session token (sederhana, dalam production gunakan JWT)
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64')

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}