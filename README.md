# 🌐 NusantaraRadius - RADIUS Billing & Management System

## 📋 Overview

NusantaraRadius adalah sistem billing dan manajemen RADIUS yang komprehensif, dibangun dengan teknologi modern untuk mengelola layanan internet hotspot dan ISP. Sistem ini menggabungkan kekuatan FreeRADIUS, MariaDB, dan aplikasi web modern untuk memberikan solusi lengkap untuk manajemen pengguna, billing, dan monitoring.

## 🏗️ Architecture

### Core Components
- **FreeRADIUS 3.x**: RADIUS server engine untuk autentikasi dan accounting
- **MariaDB 10.11**: Database untuk menyimpan data pengguna, billing, dan logging
- **Apache 2.4 + PHP 8.2**: Web server untuk daloRADIUS management GUI
- **Node.js 20.x**: Runtime untuk aplikasi web modern
- **Next.js 15**: Framework untuk aplikasi frontend dan backend API

### Applications
- **NusantaraRadius Web App**: Dashboard modern dengan real-time monitoring
- **daloRADIUS**: Web-based RADIUS management interface
- **Notification Service**: Real-time notifications via WebSocket
- **API Endpoints**: RESTful API untuk integrasi dengan sistem lain

## 🚀 Features

### 🔐 User Management
- User registration dan authentication
- Multi-tier subscription packages
- Real-time usage monitoring
- User status management (Active, Suspended, Expired, Blocked)
- Bulk user operations

### 💳 Billing System
- Multiple payment methods (Transfer, E-wallet, Credit Card)
- Automated billing and invoicing
- Subscription management
- Payment gateway integration
- Financial reporting

### 🎫 Voucher System
- Discount voucher creation and management
- Bulk voucher generation
- Usage tracking and analytics
- Expiration management
- Redemption history

### 📊 Analytics & Reporting
- Real-time dashboard
- Revenue analytics
- User behavior insights
- System performance metrics
- Custom report generation
- Data export (CSV, PDF)

### 🔔 Notification System
- Telegram bot integration
- WhatsApp gateway support
- Email notifications
- Real-time alerts
- Custom notification templates

### 🛡️ Security Features
- Secure authentication
- Session management
- Access control
- Audit logging
- Rate limiting
- SSL/TLS encryption

## 📦 Installation

### Prerequisites
- Ubuntu 25.04 or later
- Root or sudo access
- Minimum 4GB RAM
- 20GB disk space
- Internet connection

### Quick Install
```bash
# Download installation script
wget https://raw.githubusercontent.com/your-repo/nusantararadius/main/install-ubuntu.sh

# Make executable
chmod +x install-ubuntu.sh

# Run installation
sudo ./install-ubuntu.sh
```

### Manual Install
Lihat [INSTALLATION.md](./INSTALLATION.md) untuk panduan instalasi manual.

## 🎯 Quick Start

### Default Credentials
- **Admin Username**: admin
- **Admin Password**: admin123
- **Database User**: radius
- **Database Password**: Radius@2024!

### Access URLs
- **Main Application**: http://localhost:3000
- **daloRADIUS GUI**: http://localhost/daloradius
- **API Documentation**: http://localhost:3000/api

### Basic Configuration
1. Login ke aplikasi dengan kredensial default
2. Ubah password admin
3. Konfigurasikan package dan pricing
4. Setup payment gateway
5. Konfigurasikan notification channels

## 📖 Usage Guide

### User Management
```bash
# Add new user via API
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "user@example.com",
    "package": "Basic 10Mbps"
  }'

# Get user list
curl http://localhost:3000/api/users

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```

### RADIUS Authentication
```bash
# Test RADIUS authentication
radtest username password localhost 1812 NusantaraRadius2024

# Check user attributes
radclient -x localhost:1812 auth NusantaraRadius2024 < request.txt
```

### Database Operations
```bash
# Connect to database
mysql -u radius -p'Radius@2024!' radius

# View active users
SELECT * FROM v_active_users;

# View monthly revenue
SELECT * FROM v_monthly_revenue;

# Create new user via stored procedure
CALL sp_create_user('newuser', 'password', 'user@example.com', 'Full Name', '+628123456789');
```

## 🔧 Configuration

### FreeRADIUS Configuration
File konfigurasi utama:
- `/etc/freeradius/3.0/radiusd.conf` - Konfigurasi server
- `/etc/freeradius/3.0/clients.conf` - Konfigurasi NAS clients
- `/etc/freeradius/3.0/mods-available/sql` - Konfigurasi database

### Database Configuration
Connection string:
```
mysql://radius:Radius@2024!@localhost:3306/radius
```

### Application Configuration
Environment variables:
```bash
DATABASE_URL="mysql://radius:Radius@2024!@localhost:3306/radius"
RADIUS_SECRET="NusantaraRadius2024"
JWT_SECRET="your-jwt-secret"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
WHATSAPP_API_KEY="your-whatsapp-api-key"
```

## 📊 Monitoring

### System Monitoring
```bash
# Check all services
./monitor.sh check

# Check specific components
./monitor.sh services
./monitor.sh database
./monitor.sh radius

# Generate health report
./monitor.sh report

# Perform backup
./monitor.sh backup
```

### Log Files
- **FreeRADIUS**: `/var/log/freeradius/radius.log`
- **Apache**: `/var/log/apache2/access.log`, `/var/log/apache2/error.log`
- **Application**: `/var/log/nusantararadius/`
- **Database**: `/var/log/mysql/`

### Performance Metrics
Monitor metrics berikut:
- Authentication response time
- Database query performance
- Memory and CPU usage
- Network throughput
- Active user sessions

## 🔒 Security

### Best Practices
1. **Password Security**: Gunakan password yang kuat untuk semua akun
2. **Network Security**: Konfigurasikan firewall dengan benar
3. **SSL/TLS**: Gunakan HTTPS untuk semua akses web
4. **Database Security**: Limit database access dan gunakan encrypted connections
5. **Regular Updates**: Update sistem dan packages secara berkala

### Security Checklist
- [ ] Ubah password default
- [ ] Konfigurasikan firewall
- [ ] Setup SSL certificates
- [ ] Enable audit logging
- [ ] Configure backup
- [ ] Monitor security logs
- [ ] Regular security scans

## 🔄 Maintenance

### Daily Tasks
- Monitor system performance
- Check error logs
- Verify backup completion
- Review security alerts

### Weekly Tasks
- Update security patches
- Review user activity
- Clean old logs
- Optimize database

### Monthly Tasks
- Full system backup
- Security audit
- Performance tuning
- Capacity planning

### Backup Strategy
```bash
# Automated daily backup
0 2 * * * /usr/local/bin/nusantararadius-backup

# Weekly full backup
0 3 * * 0 /opt/nusantararadius/scripts/full-backup.sh

# Monthly archive backup
0 4 1 * * /opt/nusantararadius/scripts/archive-backup.sh
```

## 🐛 Troubleshooting

### Common Issues

#### FreeRADIUS Not Starting
```bash
# Check configuration
freeradius -X

# Check logs
journalctl -u freeradius -f

# Test authentication
radtest test test123 localhost 1812 NusantaraRadius2024
```

#### Database Connection Issues
```bash
# Test connection
mysql -u radius -p'Radius@2024!' radius

# Check service status
systemctl status mariadb

# Restart database
systemctl restart mariadb
```

#### Web Application Issues
```bash
# Check Node.js service
systemctl status nusantararadius

# Check application logs
journalctl -u nusantararadius -f

# Restart application
systemctl restart nusantararadius
```

### Performance Issues
1. **High Memory Usage**: Check untuk memory leaks di aplikasi
2. **Slow Database**: Optimize queries dan add indexes
3. **Network Latency**: Check network configuration
4. **Disk I/O**: Monitor disk usage dan performance

## 📚 API Documentation

### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### User Management
```http
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

### Billing
```http
GET /api/billing
POST /api/billing
GET /api/billing/transactions
```

### Reports
```http
GET /api/reports?type=revenue&period=monthly
GET /api/reports?type=usage&period=daily
POST /api/reports/export
```

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-repo/nusantararadius.git

# Install dependencies
cd nusantararadius
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Standards
- Use TypeScript untuk type safety
- Follow ESLint configuration
- Write unit tests untuk new features
- Document API endpoints
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Documentation**: https://docs.nusantararadius.id
- **GitHub Issues**: https://github.com/your-repo/nusantararadius/issues
- **Community Forum**: https://community.nusantararadius.id

### Professional Support
Untuk enterprise support dan custom development:
- **Email**: support@nusantararadius.id
- **Phone**: +62-21-1234-5678
- **Website**: https://nusantararadius.id

### Training & Consulting
Kami menyediakan training dan consulting untuk:
- System setup dan configuration
- Custom development
- Performance optimization
- Security audit
- Staff training

## 🗺️ Roadmap

### Version 2.0 (Q1 2025)
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Mobile app for users
- [ ] Integration with popular payment gateways
- [ ] Advanced reporting features

### Version 2.1 (Q2 2025)
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Advanced security features
- [ ] Performance monitoring tools
- [ ] API rate limiting

### Version 3.0 (Q3 2025)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced automation
- [ ] Machine learning integration
- [ ] Global CDN support

## 🏆 Acknowledgments

- **FreeRADIUS Team**: Untuk RADIUS server yang powerful
- **daloRADIUS Team**: Untuk management interface yang user-friendly
- **Next.js Team**: Untuk framework React yang modern
- **MariaDB Team**: Untuk database yang reliable
- **Open Source Community**: Untuk semua tools dan libraries yang digunakan

---

**NusantaraRadius** - Empowering Internet Service Providers with Modern RADIUS Billing Solutions

Made with ❤️ in Indonesia