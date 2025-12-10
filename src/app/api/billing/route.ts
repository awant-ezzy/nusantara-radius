import { NextRequest, NextResponse } from 'next/server'

// Mock billing packages
interface BillingPackage {
  id: number
  name: string
  price: number
  duration: number // in days
  speed: string
  dataLimit?: number // in bytes, null for unlimited
  description: string
  isActive: boolean
  userCount: number
}

// Mock transactions
interface Transaction {
  id: number
  userId: number
  username: string
  packageId: number
  packageName: string
  amount: number
  type: 'subscription' | 'topup' | 'upgrade'
  status: 'success' | 'pending' | 'failed'
  paymentMethod: 'transfer' | 'ewallet' | 'credit_card'
  createdAt: string
  expiresAt?: string
}

const mockPackages: BillingPackage[] = [
  {
    id: 1,
    name: 'Basic 10Mbps',
    price: 50000,
    duration: 30,
    speed: '10 Mbps',
    dataLimit: 10737418240, // 10GB
    description: 'Paket dasar untuk penggunaan rumahan',
    isActive: true,
    userCount: 245
  },
  {
    id: 2,
    name: 'Premium 50Mbps',
    price: 150000,
    duration: 30,
    speed: '50 Mbps',
    dataLimit: null, // unlimited
    description: 'Paket premium untuk penggunaan berat',
    isActive: true,
    userCount: 128
  },
  {
    id: 3,
    name: 'Gaming 100Mbps',
    price: 250000,
    duration: 30,
    speed: '100 Mbps',
    dataLimit: null,
    description: 'Paket khusus gaming dan streaming',
    isActive: true,
    userCount: 67
  },
  {
    id: 4,
    name: 'Enterprise 200Mbps',
    price: 500000,
    duration: 30,
    speed: '200 Mbps',
    dataLimit: null,
    description: 'Paket enterprise untuk bisnis',
    isActive: true,
    userCount: 23
  }
]

const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    username: 'user001',
    packageId: 1,
    packageName: 'Basic 10Mbps',
    amount: 50000,
    type: 'subscription',
    status: 'success',
    paymentMethod: 'transfer',
    createdAt: '2024-12-01T10:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 2,
    userId: 2,
    username: 'user002',
    packageId: 2,
    packageName: 'Premium 50Mbps',
    amount: 150000,
    type: 'subscription',
    status: 'success',
    paymentMethod: 'ewallet',
    createdAt: '2024-12-05T14:20:00Z',
    expiresAt: '2024-12-31T23:59:59Z'
  },
  {
    id: 3,
    userId: 3,
    username: 'user003',
    packageId: 3,
    packageName: 'Gaming 100Mbps',
    amount: 250000,
    type: 'upgrade',
    status: 'pending',
    paymentMethod: 'credit_card',
    createdAt: '2024-12-18T09:15:00Z',
    expiresAt: '2025-01-18T23:59:59Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'packages', 'transactions', 'stats'

    if (type === 'packages') {
      return NextResponse.json({
        success: true,
        packages: mockPackages
      })
    }

    if (type === 'transactions') {
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const status = searchParams.get('status')

      let filteredTransactions = [...mockTransactions]

      if (status && status !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.status === status)
      }

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

      return NextResponse.json({
        success: true,
        transactions: paginatedTransactions,
        pagination: {
          page,
          limit,
          total: filteredTransactions.length,
          totalPages: Math.ceil(filteredTransactions.length / limit)
        }
      })
    }

    if (type === 'stats') {
      const totalRevenue = mockTransactions
        .filter(t => t.status === 'success')
        .reduce((sum, t) => sum + t.amount, 0)

      const monthlyRevenue = mockTransactions
        .filter(t => {
          const transactionDate = new Date(t.createdAt)
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          return t.status === 'success' && 
                 transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)

      const activeSubscriptions = mockTransactions.filter(t => 
        t.status === 'success' && 
        t.type === 'subscription' &&
        new Date(t.expiresAt || '') > new Date()
      ).length

      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue,
          monthlyRevenue,
          activeSubscriptions,
          totalUsers: mockPackages.reduce((sum, pkg) => sum + pkg.userCount, 0),
          averageRevenue: totalRevenue / mockTransactions.filter(t => t.status === 'success').length
        }
      })
    }

    // Default: return all data
    return NextResponse.json({
      success: true,
      packages: mockPackages,
      transactions: mockTransactions.slice(0, 10), // limit to 10 for default view
      stats: {
        totalRevenue: mockTransactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0),
        activeSubscriptions: mockTransactions.filter(t => 
          t.status === 'success' && 
          t.type === 'subscription' &&
          new Date(t.expiresAt || '') > new Date()
        ).length
      }
    })

  } catch (error) {
    console.error('Billing API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    if (action === 'create_package') {
      const newPackage: BillingPackage = {
        id: Math.max(...mockPackages.map(p => p.id)) + 1,
        name: data.name,
        price: data.price,
        duration: data.duration,
        speed: data.speed,
        dataLimit: data.dataLimit || null,
        description: data.description,
        isActive: true,
        userCount: 0
      }

      mockPackages.push(newPackage)

      return NextResponse.json({
        success: true,
        package: newPackage,
        message: 'Package created successfully'
      })
    }

    if (action === 'create_transaction') {
      const newTransaction: Transaction = {
        id: Math.max(...mockTransactions.map(t => t.id)) + 1,
        userId: data.userId,
        username: data.username,
        packageId: data.packageId,
        packageName: data.packageName,
        amount: data.amount,
        type: data.type,
        status: 'pending',
        paymentMethod: data.paymentMethod,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt
      }

      mockTransactions.push(newTransaction)

      return NextResponse.json({
        success: true,
        transaction: newTransaction,
        message: 'Transaction created successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Billing POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}