import { NextRequest, NextResponse } from 'next/server'

// Mock vouchers data
interface Voucher {
  id: string
  code: string
  packageId?: string
  packageName?: string
  value?: number
  duration?: number
  maxUses: number
  usedCount: number
  isActive: boolean
  expiresAt?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME2024',
    packageId: '1',
    packageName: 'Basic 10Mbps',
    value: 25000,
    duration: 7,
    maxUses: 100,
    usedCount: 45,
    isActive: true,
    expiresAt: '2024-12-31T23:59:59Z',
    createdBy: 'admin',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-19T10:30:00Z'
  },
  {
    id: '2',
    code: 'SPECIAL50',
    packageId: '2',
    packageName: 'Premium 50Mbps',
    value: 50000,
    duration: 15,
    maxUses: 50,
    usedCount: 12,
    isActive: true,
    expiresAt: '2024-12-25T23:59:59Z',
    createdBy: 'admin',
    createdAt: '2024-12-10T00:00:00Z',
    updatedAt: '2024-12-19T09:15:00Z'
  },
  {
    id: '3',
    code: 'GAMING2024',
    packageId: '3',
    packageName: 'Gaming 100Mbps',
    value: 100000,
    duration: 30,
    maxUses: 25,
    usedCount: 8,
    isActive: true,
    expiresAt: '2025-01-15T23:59:59Z',
    createdBy: 'admin',
    createdAt: '2024-12-05T00:00:00Z',
    updatedAt: '2024-12-19T08:45:00Z'
  },
  {
    id: '4',
    code: 'EXPIRED100',
    packageId: '1',
    packageName: 'Basic 10Mbps',
    value: 10000,
    duration: 5,
    maxUses: 30,
    usedCount: 30,
    isActive: false,
    expiresAt: '2024-12-15T23:59:59Z',
    createdBy: 'admin',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-16T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredVouchers = [...mockVouchers]

    // Filter by status
    if (status === 'active') {
      filteredVouchers = filteredVouchers.filter(v => v.isActive)
    } else if (status === 'inactive') {
      filteredVouchers = filteredVouchers.filter(v => !v.isActive)
    } else if (status === 'expired') {
      filteredVouchers = filteredVouchers.filter(v => 
        v.expiresAt && new Date(v.expiresAt) < new Date()
      )
    }

    // Search by code or package name
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredVouchers = filteredVouchers.filter(v =>
        v.code.toLowerCase().includes(searchTerm) ||
        (v.packageName && v.packageName.toLowerCase().includes(searchTerm))
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex)

    // Calculate statistics
    const stats = {
      total: mockVouchers.length,
      active: mockVouchers.filter(v => v.isActive).length,
      expired: mockVouchers.filter(v => 
        v.expiresAt && new Date(v.expiresAt) < new Date()
      ).length,
      totalRedemptions: mockVouchers.reduce((sum, v) => sum + v.usedCount, 0)
    }

    return NextResponse.json({
      success: true,
      vouchers: paginatedVouchers.map(voucher => ({
        ...voucher,
        remainingUses: voucher.maxUses - voucher.usedCount,
        usagePercentage: (voucher.usedCount / voucher.maxUses) * 100,
        isExpired: voucher.expiresAt ? new Date(voucher.expiresAt) < new Date() : false,
        daysUntilExpiry: voucher.expiresAt ? 
          Math.ceil((new Date(voucher.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
          null
      })),
      pagination: {
        page,
        limit,
        total: filteredVouchers.length,
        totalPages: Math.ceil(filteredVouchers.length / limit)
      },
      stats
    })

  } catch (error) {
    console.error('Get vouchers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const voucherData = await request.json()

    // Validate required fields
    const requiredFields = ['code', 'maxUses']
    for (const field of requiredFields) {
      if (!voucherData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if voucher code already exists
    if (mockVouchers.some(v => v.code === voucherData.code)) {
      return NextResponse.json(
        { error: 'Voucher code already exists' },
        { status: 409 }
      )
    }

    // Create new voucher
    const newVoucher: Voucher = {
      id: (mockVouchers.length + 1).toString(),
      code: voucherData.code.toUpperCase(),
      packageId: voucherData.packageId,
      packageName: voucherData.packageName,
      value: voucherData.value,
      duration: voucherData.duration,
      maxUses: voucherData.maxUses,
      usedCount: 0,
      isActive: voucherData.isActive !== false,
      expiresAt: voucherData.expiresAt,
      createdBy: voucherData.createdBy || 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockVouchers.push(newVoucher)

    return NextResponse.json({
      success: true,
      voucher: {
        ...newVoucher,
        remainingUses: newVoucher.maxUses - newVoucher.usedCount,
        usagePercentage: 0,
        isExpired: newVoucher.expiresAt ? 
          new Date(newVoucher.expiresAt) < new Date() : 
          false,
        daysUntilExpiry: newVoucher.expiresAt ? 
          Math.ceil((new Date(newVoucher.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      message: 'Voucher created successfully'
    })

  } catch (error) {
    console.error('Create voucher error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}