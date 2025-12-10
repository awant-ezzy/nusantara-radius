import { NextRequest, NextResponse } from 'next/server'

// Mock RADIUS users database
interface RadiusUser {
  id: number
  username: string
  password: string
  email: string
  phone: string
  package: string
  status: 'active' | 'suspended' | 'expired'
  createdAt: string
  expiresAt: string
  lastLogin?: string
  dataUsage: number
  timeUsage: number
  ipAddress?: string
  macAddress?: string
}

const mockUsers: RadiusUser[] = [
  {
    id: 1,
    username: 'user001',
    password: 'password123',
    email: 'user001@example.com',
    phone: '+628123456789',
    package: 'Basic 10Mbps',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    lastLogin: '2024-12-19T14:25:00Z',
    dataUsage: 1542000000, // bytes
    timeUsage: 124500, // seconds
    ipAddress: '192.168.1.100',
    macAddress: 'AA:BB:CC:DD:EE:FF'
  },
  {
    id: 2,
    username: 'user002',
    password: 'password456',
    email: 'user002@example.com',
    phone: '+628234567890',
    package: 'Premium 50Mbps',
    status: 'active',
    createdAt: '2024-02-01T09:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    lastLogin: '2024-12-19T16:45:00Z',
    dataUsage: 5420000000,
    timeUsage: 287600,
    ipAddress: '192.168.1.101',
    macAddress: 'BB:CC:DD:EE:FF:AA'
  },
  {
    id: 3,
    username: 'user003',
    password: 'password789',
    email: 'user003@example.com',
    phone: '+628345678901',
    package: 'Basic 10Mbps',
    status: 'suspended',
    createdAt: '2024-01-20T11:00:00Z',
    expiresAt: '2024-11-30T23:59:59Z',
    lastLogin: '2024-11-28T08:30:00Z',
    dataUsage: 890000000,
    timeUsage: 67800,
    ipAddress: '192.168.1.102',
    macAddress: 'CC:DD:EE:FF:AA:BB'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredUsers = [...mockUsers]

    // Filter by status
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }

    // Search by username, email, or phone
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone.includes(searchTerm)
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    // Format data usage dan time usage
    const formattedUsers = paginatedUsers.map(user => ({
      ...user,
      dataUsageFormatted: formatBytes(user.dataUsage),
      timeUsageFormatted: formatSeconds(user.timeUsage),
      daysRemaining: Math.ceil((new Date(user.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    }))

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validasi required fields
    const requiredFields = ['username', 'password', 'email', 'phone', 'package']
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if username already exists
    if (mockUsers.some(user => user.username === userData.username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser: RadiusUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      phone: userData.phone,
      package: userData.package,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: userData.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      dataUsage: 0,
      timeUsage: 0
    }

    mockUsers.push(newUser)

    return NextResponse.json({
      success: true,
      user: {
        ...newUser,
        dataUsageFormatted: formatBytes(newUser.dataUsage),
        timeUsageFormatted: formatSeconds(newUser.timeUsage),
        daysRemaining: Math.ceil((new Date(newUser.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      },
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}