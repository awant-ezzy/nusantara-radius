import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.NOTIFICATION_PORT || 3003

// Create HTTP server
const httpServer = createServer()

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}

// Create Socket.IO server
const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
})

// Store connected clients
const connectedClients = new Map()

// System metrics
let systemMetrics = {
  activeUsers: 1247,
  totalRevenue: 85420000,
  serverLoad: 24,
  uptime: 99.9,
  lastUpdate: new Date().toISOString()
}

// Mock real-time data updates
function updateSystemMetrics() {
  systemMetrics.activeUsers += Math.floor(Math.random() * 20 - 10)
  systemMetrics.totalRevenue += Math.floor(Math.random() * 100000 - 50000)
  systemMetrics.serverLoad = Math.max(0, Math.min(100, systemMetrics.serverLoad + (Math.random() * 10 - 5)))
  systemMetrics.lastUpdate = new Date().toISOString()
  
  // Broadcast to all connected clients
  io.emit('system_metrics', systemMetrics)
}

// Generate mock notifications
function generateNotification() {
  const notifications = [
    {
      id: Date.now(),
      type: 'user_activity',
      title: 'New User Connected',
      message: `User user${Math.floor(Math.random() * 1000)} has connected to the network`,
      timestamp: new Date().toISOString(),
      severity: 'info'
    },
    {
      id: Date.now(),
      type: 'payment',
      title: 'Payment Received',
      message: `Payment of Rp ${Math.floor(Math.random() * 500000 + 50000)} received`,
      timestamp: new Date().toISOString(),
      severity: 'success'
    },
    {
      id: Date.now(),
      type: 'system',
      title: 'System Alert',
      message: 'Server CPU usage is above normal threshold',
      timestamp: new Date().toISOString(),
      severity: 'warning'
    },
    {
      id: Date.now(),
      type: 'security',
      title: 'Failed Login Attempt',
      message: 'Multiple failed login attempts detected',
      timestamp: new Date().toISOString(),
      severity: 'error'
    }
  ]
  
  return notifications[Math.floor(Math.random() * notifications.length)]
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)
  
  // Store client info
  connectedClients.set(socket.id, {
    connectedAt: new Date(),
    lastActivity: new Date()
  })
  
  // Send current metrics to new client
  socket.emit('system_metrics', systemMetrics)
  
  // Send initial notification
  socket.emit('notification', {
    id: Date.now(),
    type: 'connection',
    title: 'Connected to NusantaraRadius',
    message: 'Real-time notifications are now active',
    timestamp: new Date().toISOString(),
    severity: 'success'
  })
  
  // Handle client requests
  socket.on('request_metrics', () => {
    socket.emit('system_metrics', systemMetrics)
  })
  
  socket.on('send_notification', (data) => {
    // Broadcast notification to all clients
    const notification = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString()
    }
    
    io.emit('notification', notification)
    console.log('Notification broadcasted:', notification)
  })
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
    connectedClients.delete(socket.id)
  })
  
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error)
  })
})

// Start periodic updates
setInterval(updateSystemMetrics, 5000) // Update every 5 seconds
setInterval(() => {
  const notification = generateNotification()
  io.emit('notification', notification)
  console.log('Auto notification generated:', notification.type)
}, 30000) // Generate notification every 30 seconds

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`🔔 Notification Service running on port ${PORT}`)
  console.log(`📊 Real-time metrics enabled`)
  console.log(`📱 WebSocket ready for connections`)
})