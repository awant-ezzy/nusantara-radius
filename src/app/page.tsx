'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import 
{
  Wifi,
  Users,
  Activity,
  CreditCard,
  Server,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Smartphone,
  BarChart3,
  Settings,
  LogOut,
  User,
  Lock,
  Mail,
  Phone,
  Gift,
  Tag,
  Download
} from 'lucide-react'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeUsers, setActiveUsers] = useState(1247)
  const [totalRevenue, setTotalRevenue] = useState(85420000)
  const [systemStatus, setSystemStatus] = useState('online')

  useEffect(() => {
    // Simulasi update data real-time
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5))
      setTotalRevenue(prev => prev + Math.floor(Math.random() * 100000 - 50000))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 -bottom-48 -right-48 animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <img
                    src="/logo.png"
                    alt="NusantaraRadius"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">NusantaraRadius</CardTitle>
                <CardDescription className="text-blue-200">
                  RADIUS Billing & Management System
                </CardDescription>
              </div>
              <Badge variant="secondary" className="w-fit mx-auto bg-green-500/20 text-green-300 border-green-500/30">
                <Server className="w-3 h-3 mr-1" />
                System Online
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-blue-200">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-300 focus:border-blue-400"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-300 focus:border-blue-400"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg"
                >
                  Sign In to Dashboard
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-blue-200 text-sm">
                  Powered by FreeRADIUS & MariaDB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="NusantaraRadius"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">NusantaraRadius</h1>
                <p className="text-xs text-blue-300">RADIUS Billing System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                System Online
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-300">+12% from last hour</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {totalRevenue.toLocaleString('id-ID')}</div>
              <p className="text-xs text-blue-300">+8% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Server Load</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24%</div>
              <p className="text-xs text-blue-300">Normal operation</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <p className="text-xs text-blue-300">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/10 border-white/20">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-blue-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-blue-500">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-white data-[state=active]:bg-blue-500">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="text-white data-[state=active]:bg-blue-500">
              <Gift className="w-4 h-4 mr-2" />
              Vouchers
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-white data-[state=active]:bg-blue-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-blue-500">
              <MessageSquare className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                  <CardDescription className="text-blue-300">Real-time system monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">FreeRADIUS Service</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">MariaDB Database</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Apache Web Server</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Running
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">daloRADIUS GUI</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accessible
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-blue-300">Latest system events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-blue-200 text-sm">User user123 connected - 2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-200 text-sm">New voucher generated - 5 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-blue-200 text-sm">Package upgrade for user456 - 12 min ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-blue-200 text-sm">Failed login attempt - 18 min ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-blue-300">Manage RADIUS users and authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-blue-500/20 border-blue-500/30">
                    <Users className="h-4 w-4 text-blue-300" />
                    <AlertDescription className="text-blue-200">
                      Total registered users: 2,847 | Active today: 1,247
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <User className="w-4 h-4 mr-2" />
                      Add New User
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Create Voucher
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Users
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Billing Management</CardTitle>
                <CardDescription className="text-blue-300">Manage packages, pricing, and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-green-500/20 border-green-500/30">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                    <AlertDescription className="text-green-200">
                      This month's revenue: Rp 85,420,000 | 124% of target
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">1,247</div>
                        <div className="text-sm text-blue-300">Active Subscriptions</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">Rp 50K</div>
                        <div className="text-sm text-blue-300">Avg. Monthly Revenue</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">8</div>
                        <div className="text-sm text-blue-300">Available Packages</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">94%</div>
                        <div className="text-sm text-blue-300">Payment Success Rate</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vouchers" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Voucher Management</CardTitle>
                <CardDescription className="text-blue-300">Create and manage discount vouchers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-purple-500/20 border-purple-500/30">
                    <Gift className="h-4 w-4 text-purple-300" />
                    <AlertDescription className="text-purple-200">
                      Total vouchers: 4 | Active: 3 | Expired: 1 | Total redemptions: 95
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Gift className="w-4 h-4 mr-2" />
                      Create Voucher
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Tag className="w-4 h-4 mr-2" />
                      Bulk Generate
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Active Vouchers</CardTitle>
                  <CardDescription className="text-blue-300">Currently available vouchers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">WELCOME2024</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-300 mb-2">Basic 10Mbps - Rp 25K off</div>
                      <div className="flex items-center justify-between text-xs text-blue-400">
                        <span>45/100 uses</span>
                        <span>Expires: Dec 31, 2024</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">SPECIAL50</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-300 mb-2">Premium 50Mbps - Rp 50K off</div>
                      <div className="flex items-center justify-between text-xs text-blue-400">
                        <span>12/50 uses</span>
                        <span>Expires: Dec 25, 2024</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">GAMING2024</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-300 mb-2">Gaming 100Mbps - Rp 100K off</div>
                      <div className="flex items-center justify-between text-xs text-blue-400">
                        <span>8/25 uses</span>
                        <span>Expires: Jan 15, 2025</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Voucher Statistics</CardTitle>
                  <CardDescription className="text-blue-300">Usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">65%</div>
                        <div className="text-sm text-blue-300">Usage Rate</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">Rp 2.4M</div>
                        <div className="text-sm text-blue-300">Total Savings</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">23</div>
                        <div className="text-sm text-blue-300">New Users</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">4.7</div>
                        <div className="text-sm text-blue-300">Avg Rating</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Most Popular</span>
                      <span className="text-white font-semibold">WELCOME2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Highest Value</span>
                      <span className="text-white font-semibold">GAMING2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200">Conversion Rate</span>
                      <span className="text-white font-semibold">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Reports & Analytics</CardTitle>
                <CardDescription className="text-blue-300">Generate comprehensive reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-orange-500/20 border-orange-500/30">
                    <TrendingUp className="h-4 w-4 text-orange-300" />
                    <AlertDescription className="text-orange-200">
                      Monthly revenue growth: +14.9% | Total active users: 1,247 | System uptime: 99.9%
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Revenue Report
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Users className="w-4 h-4 mr-2" />
                      User Analytics
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Activity className="w-4 h-4 mr-2" />
                      System Metrics
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Overview</CardTitle>
                  <CardDescription className="text-blue-300">Monthly revenue trends and analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">December 2024</div>
                        <div className="text-sm text-blue-300">Current month</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">Rp 38.5M</div>
                        <div className="text-sm text-green-300">+14.9% growth</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">November 2024</div>
                        <div className="text-sm text-blue-300">Previous month</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">Rp 33.5M</div>
                        <div className="text-sm text-blue-300">+12.4% growth</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-semibold">Average Monthly</div>
                        <div className="text-sm text-blue-300">Last 6 months</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">Rp 32.3M</div>
                        <div className="text-sm text-blue-300">Stable growth</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Total Revenue (YTD)</span>
                      <span className="text-white font-semibold">Rp 161.5M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Average Transaction</span>
                      <span className="text-white font-semibold">Rp 74,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Package Performance</CardTitle>
                  <CardDescription className="text-blue-300">Usage statistics by package type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Premium 50Mbps</span>
                        <span className="text-blue-300">389 users</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '31%'}}></div>
                      </div>
                      <div className="text-sm text-blue-300 mt-1">Rp 58.4M revenue</div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Basic 10Mbps</span>
                        <span className="text-blue-300">623 users</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '50%'}}></div>
                      </div>
                      <div className="text-sm text-blue-300 mt-1">Rp 31.2M revenue</div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Gaming 100Mbps</span>
                        <span className="text-blue-300">167 users</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '13%'}}></div>
                      </div>
                      <div className="text-sm text-blue-300 mt-1">Rp 41.8M revenue</div>
                    </div>
                    
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">Enterprise 200Mbps</span>
                        <span className="text-blue-300">68 users</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '6%'}}></div>
                      </div>
                      <div className="text-sm text-blue-300 mt-1">Rp 34.0M revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">System Health Metrics</CardTitle>
                <CardDescription className="text-blue-300">Real-time system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                    <div className="text-sm text-blue-300">System Uptime</div>
                    <div className="text-xs text-green-400 mt-1">Excellent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">145ms</div>
                    <div className="text-sm text-blue-300">Avg Response Time</div>
                    <div className="text-xs text-blue-400 mt-1">Optimal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">0.2%</div>
                    <div className="text-sm text-blue-300">Error Rate</div>
                    <div className="text-xs text-green-400 mt-1">Very Low</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">1,247</div>
                    <div className="text-sm text-blue-300">Active Connections</div>
                    <div className="text-xs text-green-400 mt-1">Normal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-green-400" />
                    WhatsApp Gateway
                  </CardTitle>
                  <CardDescription className="text-blue-300">Configure WhatsApp notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-api" className="text-blue-200">API Key</Label>
                    <Input
                      id="whatsapp-api"
                      type="password"
                      className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                      placeholder="Enter WhatsApp API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-number" className="text-blue-200">Business Number</Label>
                    <Input
                      id="whatsapp-number"
                      type="text"
                      className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                      placeholder="+628123456789"
                    />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Test WhatsApp Connection
                  </Button>
                  <Alert className="bg-green-500/20 border-green-500/30">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <AlertDescription className="text-green-200">
                      WhatsApp gateway connected successfully
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                    Telegram Gateway
                  </CardTitle>
                  <CardDescription className="text-blue-300">Configure Telegram notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="telegram-bot" className="text-blue-200">Bot Token</Label>
                    <Input
                      id="telegram-bot"
                      type="password"
                      className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                      placeholder="Enter Telegram bot token"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram-chat" className="text-blue-200">Chat ID</Label>
                    <Input
                      id="telegram-chat"
                      type="text"
                      className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                      placeholder="Enter chat ID"
                    />
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Test Telegram Connection
                  </Button>
                  <Alert className="bg-blue-500/20 border-blue-500/30">
                    <CheckCircle className="h-4 w-4 text-blue-300" />
                    <AlertDescription className="text-blue-200">
                      Telegram bot connected successfully
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">System Configuration</CardTitle>
                <CardDescription className="text-blue-300">Configure RADIUS server and database settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">FreeRADIUS Settings</h3>
                    <div className="space-y-2">
                      <Label htmlFor="radius-port" className="text-blue-200">Authentication Port</Label>
                      <Input
                        id="radius-port"
                        type="text"
                        defaultValue="1812"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radius-secret" className="text-blue-200">Shared Secret</Label>
                      <Input
                        id="radius-secret"
                        type="password"
                        defaultValue="radiussecret"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Database Settings</h3>
                    <div className="space-y-2">
                      <Label htmlFor="db-host" className="text-blue-200">Database Host</Label>
                      <Input
                        id="db-host"
                        type="text"
                        defaultValue="localhost"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-name" className="text-blue-200">Database Name</Label>
                      <Input
                        id="db-name"
                        type="text"
                        defaultValue="radius"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Shield className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}