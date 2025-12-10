# NusantaraRadius Installation Guide for Ubuntu 25

## 🚀 Quick Start Installation

### Prerequisites
- Ubuntu 25.04 or later
- Root or sudo access
- Minimum 4GB RAM
- 20GB disk space
- Internet connection

### Installation Steps

1. **Download the installation script:**
```bash
wget https://raw.githubusercontent.com/your-repo/nusantararadius/main/install-ubuntu.sh
```

2. **Make the script executable:**
```bash
chmod +x install-ubuntu.sh
```

3. **Run the installation:**
```bash
sudo ./install-ubuntu.sh
```

## 📋 What Gets Installed

### Core Components
- **MariaDB 10.11**: Database server
- **FreeRADIUS 3.x**: RADIUS authentication server
- **Apache 2.4**: Web server
- **PHP 8.2**: Server-side scripting
- **Node.js 20.x**: JavaScript runtime
- **daloRADIUS**: Web-based RADIUS management

### Applications
- **NusantaraRadius Web App**: Modern billing dashboard
- **Notification Service**: Real-time notifications via WebSocket
- **API Endpoints**: RESTful API for integration

### Security Features
- **UFW Firewall**: Network security
- **SSL Certificate**: HTTPS encryption
- **Database Security**: Secure MariaDB configuration

## 🔧 Manual Configuration

### Database Configuration
After installation, you can access the database with:
- **Host**: localhost
- **Database**: radius
- **Username**: radius
- **Password**: Radius@2024!

### RADIUS Configuration
- **Authentication Port**: 1812 (UDP)
- **Accounting Port**: 1813 (UDP)
- **Shared Secret**: NusantaraRadius2024

### Web Applications
- **Main Application**: http://localhost:3000
- **daloRADIUS GUI**: http://localhost/daloradius
- **Default Login**: admin / radius

## 🛠️ Management Commands

### Service Management
```bash
# Start all services
nusantararadius start

# Stop all services
nusantararadius stop

# Restart all services
nusantararadius restart

# Check service status
nusantararadius status
```

### Backup Management
```bash
# Create full backup
nusantararadius-backup

# Manual database backup
mysqldump -u radius -p'Radius@2024!' radius > backup.sql

# Restore database
mysql -u radius -p'Radius@2024!' radius < backup.sql
```

### Log Files
```bash
# FreeRADIUS logs
tail -f /var/log/freeradius/radius.log

# Apache logs
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log

# NusantaraRadius logs
journalctl -u nusantararadius -f
```

## 🔒 Security Configuration

### Firewall Rules
```bash
# View firewall status
ufw status

# Allow additional ports
ufw allow 8080/tcp
ufw allow 8443/tcp

# Block IP addresses
ufw deny from 192.168.1.100
```

### SSL Certificate Management
```bash
# For production domains
certbot --apache -d yourdomain.com

# Renew certificates
certbot renew

# Test renewal
certbot renew --dry-run
```

## 📊 Monitoring and Maintenance

### System Monitoring
```bash
# Check system resources
htop

# Monitor RADIUS activity
radtest username password localhost 1812 NusantaraRadius2024

# Check database connections
mysql -u radius -p'Radius@2024!' -e "SHOW PROCESSLIST;"
```

### Performance Tuning

#### MariaDB Optimization
Edit `/etc/mysql/mariadb.conf.d/50-server.cnf`:
```ini
[mysqld]
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
max_connections = 500
query_cache_size = 64M
```

#### FreeRADIUS Optimization
Edit `/etc/freeradius/3.0/radiusd.conf`:
```conf
max_requests = 1024
max_servers = 32
thread_pool {
    start_servers = 5
    max_servers = 32
    min_spare_servers = 3
    max_spare_servers = 10
}
```

#### Apache Optimization
Edit `/etc/apache2/apache2.conf`:
```apache
<IfModule mpm_prefork_module>
    StartServers 5
    MinSpareServers 5
    MaxSpareServers 10
    MaxRequestWorkers 150
    MaxConnectionsPerChild 0
</IfModule>
```

## 🚨 Troubleshooting

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
# Test database connection
mysql -u radius -p'Radius@2024!' radius

# Check MariaDB status
systemctl status mariadb

# Restart database
systemctl restart mariadb
```

#### Web Application Not Accessible
```bash
# Check Node.js service
systemctl status nusantararadius

# Check application logs
journalctl -u nusantararadius -f

# Restart application
systemctl restart nusantararadius
```

### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :1812
netstat -tulpn | grep :3000

# Kill processes using ports
sudo fuser -k 1812/udp
sudo fuser -k 3000/tcp
```

## 🔄 Updates and Upgrades

### System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js packages
cd /opt/nusantararadius
npm update

# Update FreeRADIUS
sudo apt install freeradius freeradius-mysql
```

### Application Updates
```bash
# Backup current installation
nusantararadius-backup

# Download new version
cd /tmp
wget new-version.tar.gz

# Extract and replace
tar -xzf new-version.tar.gz
sudo cp -r new-version/* /opt/nusantararadius/

# Restart services
nusantararadius restart
```

## 📞 Support

### Getting Help
- Check logs for error messages
- Verify all services are running
- Test network connectivity
- Review configuration files

### Community Support
- GitHub Issues: https://github.com/your-repo/nusantararadius/issues
- Documentation: https://docs.nusantararadius.id
- Community Forum: https://community.nusantararadius.id

### Professional Support
For enterprise support and custom development:
- Email: support@nusantararadius.id
- Phone: +62-21-1234-5678
- Website: https://nusantararadius.id