import { NextRequest, NextResponse } from 'next/server'

// Mock data for reports
interface ReportData {
  dailyRevenue: Array<{
    date: string
    revenue: number
    users: number
    transactions: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    users: number
    growth: number
  }>
  packageUsage: Array<{
    packageName: string
    users: number
    revenue: number
    percentage: number
  }>
  topUsers: Array<{
    username: string
    package: string
    usage: number
    revenue: number
    lastActive: string
  }>
  systemMetrics: {
    uptime: number
    avgResponseTime: number
    errorRate: number
    activeConnections: number
  }
}

const mockReportData: ReportData = {
  dailyRevenue: [
    { date: '2024-12-15', revenue: 1250000, users: 45, transactions: 48 },
    { date: '2024-12-16', revenue: 980000, users: 38, transactions: 41 },
    { date: '2024-12-17', revenue: 1520000, users: 52, transactions: 56 },
    { date: '2024-12-18', revenue: 1180000, users: 41, transactions: 44 },
    { date: '2024-12-19', revenue: 1850000, users: 63, transactions: 67 }
  ],
  monthlyRevenue: [
    { month: '2024-08', revenue: 28500000, users: 847, growth: 12.5 },
    { month: '2024-09', revenue: 31200000, users: 923, growth: 9.5 },
    { month: '2024-10', revenue: 29800000, users: 891, growth: -4.5 },
    { month: '2024-11', revenue: 33500000, users: 1024, growth: 12.4 },
    { month: '2024-12', revenue: 38500000, users: 1247, growth: 14.9 }
  ],
  packageUsage: [
    { packageName: 'Basic 10Mbps', users: 623, revenue: 31150000, percentage: 50 },
    { packageName: 'Premium 50Mbps', users: 389, revenue: 58350000, percentage: 31 },
    { packageName: 'Gaming 100Mbps', users: 167, revenue: 41750000, percentage: 13 },
    { packageName: 'Enterprise 200Mbps', users: 68, revenue: 34000000, percentage: 6 }
  ],
  topUsers: [
    { username: 'gamer_pro', package: 'Gaming 100Mbps', usage: 847, revenue: 3000000, lastActive: '2024-12-19T14:30:00Z' },
    { username: 'company_xyz', package: 'Enterprise 200Mbps', usage: 672, revenue: 6000000, lastActive: '2024-12-19T16:45:00Z' },
    { username: 'stream_user', package: 'Premium 50Mbps', usage: 523, revenue: 900000, lastActive: '2024-12-19T18:20:00Z' },
    { username: 'family_home', package: 'Basic 10Mbps', usage: 412, revenue: 300000, lastActive: '2024-12-19T12:15:00Z' },
    { username: 'tech_enthusiast', package: 'Gaming 100Mbps', usage: 389, revenue: 750000, lastActive: '2024-12-19T20:10:00Z' }
  ],
  systemMetrics: {
    uptime: 99.9,
    avgResponseTime: 145,
    errorRate: 0.2,
    activeConnections: 1247
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const period = searchParams.get('period') || 'daily'
    const format = searchParams.get('format') || 'json'

    if (type === 'revenue') {
      const data = period === 'monthly' ? mockReportData.monthlyRevenue : mockReportData.dailyRevenue
      
      return NextResponse.json({
        success: true,
        type: 'revenue',
        period,
        data,
        summary: {
          total: data.reduce((sum, item) => sum + item.revenue, 0),
          average: data.reduce((sum, item) => sum + item.revenue, 0) / data.length,
          peak: Math.max(...data.map(item => item.revenue)),
          growth: calculateGrowth(data)
        }
      })
    }

    if (type === 'usage') {
      return NextResponse.json({
        success: true,
        type: 'usage',
        data: mockReportData.packageUsage,
        summary: {
          totalUsers: mockReportData.packageUsage.reduce((sum, item) => sum + item.users, 0),
          totalRevenue: mockReportData.packageUsage.reduce((sum, item) => sum + item.revenue, 0),
          mostPopular: mockReportData.packageUsage.reduce((max, item) => item.users > max.users ? item : max),
          highestRevenue: mockReportData.packageUsage.reduce((max, item) => item.revenue > max.revenue ? item : max)
        }
      })
    }

    if (type === 'users') {
      return NextResponse.json({
        success: true,
        type: 'users',
        data: mockReportData.topUsers,
        summary: {
          totalUsers: mockReportData.topUsers.length,
          avgUsage: mockReportData.topUsers.reduce((sum, item) => sum + item.usage, 0) / mockReportData.topUsers.length,
          totalRevenue: mockReportData.topUsers.reduce((sum, item) => sum + item.revenue, 0)
        }
      })
    }

    if (type === 'system') {
      return NextResponse.json({
        success: true,
        type: 'system',
        data: mockReportData.systemMetrics,
        status: mockReportData.systemMetrics.uptime > 99 ? 'excellent' : 
               mockReportData.systemMetrics.uptime > 95 ? 'good' : 'needs_attention'
      })
    }

    // Return all data if no specific type
    return NextResponse.json({
      success: true,
      data: mockReportData,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, reportType, filters } = await request.json()

    if (action === 'generate') {
      // Generate custom report based on filters
      const customReport = generateCustomReport(reportType, filters)
      
      return NextResponse.json({
        success: true,
        report: customReport,
        message: 'Custom report generated successfully'
      })
    }

    if (action === 'export') {
      // Export report in different formats
      const { data, format } = await request.json()
      
      if (format === 'csv') {
        const csvData = convertToCSV(data)
        return new NextResponse(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="report-${Date.now()}.csv"`
          }
        })
      }
      
      if (format === 'pdf') {
        // In production, use a PDF library like jsPDF or puppeteer
        return NextResponse.json({
          success: false,
          error: 'PDF export not implemented yet'
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Reports POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateGrowth(data: Array<{ revenue: number }>): number {
  if (data.length < 2) return 0
  
  const first = data[0].revenue
  const last = data[data.length - 1].revenue
  
  return ((last - first) / first) * 100
}

function generateCustomReport(reportType: string, filters: any) {
  // Generate custom report based on type and filters
  const startDate = filters?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const endDate = filters?.endDate || new Date()
  
  return {
    type: reportType,
    period: { startDate, endDate },
    filters,
    data: mockReportData[reportType as keyof ReportData] || [],
    generatedAt: new Date().toISOString()
  }
}

function convertToCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return 'No data available'
  }
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}