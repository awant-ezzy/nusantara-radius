#!/bin/bash

# =============================================================================
# NusantaraRadius Monitoring and Maintenance Script
# =============================================================================

set -e

# Configuration
LOG_DIR="/var/log/nusantararadius"
BACKUP_DIR="/opt/backups/nusantararadius"
TEMP_DIR="/tmp/nusantararadius"
DB_NAME="radius"
DB_USER="radius"
DB_PASS="Radius@2024!"

# Create directories
mkdir -p "$LOG_DIR" "$BACKUP_DIR" "$TEMP_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "=================================================================="
    echo "  $1"
    echo "=================================================================="
    echo -e "${NC}"
}

# Function to check service status
check_services() {
    print_header "Service Status Check"
    
    services=("freeradius" "apache2" "mariadb" "nusantararadius" "nusantararadius-notifications")
    
    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service"; then
            echo -e "  $service: ${GREEN}RUNNING${NC}"
        else
            echo -e "  $service: ${RED}STOPPED${NC}"
        fi
    done
}

# Function to check system resources
check_system_resources() {
    print_header "System Resources Check"
    
    # CPU usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    echo -e "  CPU Usage: ${cpu_usage}%"
    
    # Memory usage
    memory_info=$(free -m | grep Mem)
    total_mem=$(echo $memory_info | awk '{print $2}')
    used_mem=$(echo $memory_info | awk '{print $3}')
    memory_usage=$((used_mem * 100 / total_mem))
    
    if [ $memory_usage -lt 80 ]; then
        echo -e "  Memory Usage: ${GREEN}${memory_usage}%${NC} (${used_mem}MB/${total_mem}MB)"
    else
        echo -e "  Memory Usage: ${RED}${memory_usage}%${NC} (${used_mem}MB/${total_mem}MB)"
    fi
    
    # Disk usage
    disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $disk_usage -lt 80 ]; then
        echo -e "  Disk Usage: ${GREEN}${disk_usage}%${NC}"
    else
        echo -e "  Disk Usage: ${RED}${disk_usage}%${NC}"
    fi
    
    # Load average
    load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    echo -e "  Load Average: $load_avg"
}

# Function to check database status
check_database() {
    print_header "Database Status Check"
    
    # Check if database is accessible
    if mysql -u $DB_USER -p$DB_PASS -e "USE $DB_NAME;" 2>/dev/null; then
        print_status "Database connection: OK"
    else
        print_error "Database connection: FAILED"
        return 1
    fi
    
    # Check database size
    db_size=$(mysql -u $DB_USER -p$DB_PASS -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS 'DB Size in MB' FROM information_schema.tables WHERE table_schema='$DB_NAME';" | tail -1)
    echo -e "  Database Size: ${db_size}MB"
    
    # Check active connections
    active_connections=$(mysql -u $DB_USER -p$DB_PASS -e "SHOW STATUS LIKE 'Threads_connected';" | tail -1 | awk '{print $2}')
    echo -e "  Active Connections: $active_connections"
    
    # Check slow queries
    slow_queries=$(mysql -u $DB_USER -p$DB_PASS -e "SHOW GLOBAL STATUS LIKE 'Slow_queries';" | tail -1 | awk '{print $2}')
    echo -e "  Slow Queries: $slow_queries"
}

# Function to check RADIUS activity
check_radius_activity() {
    print_header "RADIUS Activity Check"
    
    # Check recent authentications
    recent_auth=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT COUNT(*) FROM radpostauth WHERE authdate > DATE_SUB(NOW(), INTERVAL 1 HOUR);" 2>/dev/null | tail -1)
    echo -e "  Authentications (last hour): $recent_auth"
    
    # Check active sessions
    active_sessions=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT COUNT(*) FROM radacct WHERE acctstarttime IS NOT NULL AND acctstoptime IS NULL;" 2>/dev/null | tail -1)
    echo -e "  Active Sessions: $active_sessions"
    
    # Check total users
    total_users=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT COUNT(*) FROM nr_users;" 2>/dev/null | tail -1)
    echo -e "  Total Users: $total_users"
    
    # Check active subscriptions
    active_subs=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "SELECT COUNT(*) FROM nr_subscriptions WHERE status = 'ACTIVE' AND end_date > NOW();" 2>/dev/null | tail -1)
    echo -e "  Active Subscriptions: $active_subs"
}

# Function to check web applications
check_web_apps() {
    print_header "Web Applications Check"
    
    # Check NusantaraRadius app
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo -e "  NusantaraRadius App: ${GREEN}OK${NC}"
    else
        echo -e "  NusantaraRadius App: ${RED}ERROR${NC}"
    fi
    
    # Check daloRADIUS
    if curl -s -o /dev/null -w "%{http_code}" http://localhost/daloradius | grep -q "200"; then
        echo -e "  daloRADIUS: ${GREEN}OK${NC}"
    else
        echo -e "  daloRADIUS: ${RED}ERROR${NC}"
    fi
}

# Function to perform backup
perform_backup() {
    print_header "Performing Backup"
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="$BACKUP_DIR/nusantararadius_backup_$timestamp"
    
    print_status "Creating database backup..."
    mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > "$backup_file.sql"
    
    print_status "Creating configuration backup..."
    tar -czf "$backup_file.config.tar.gz" /etc/freeradius /etc/apache2/sites-available/ /opt/nusantararadius 2>/dev/null
    
    print_status "Creating full backup archive..."
    tar -czf "$backup_file.full.tar.gz" "$backup_file.sql" "$backup_file.config.tar.gz" 2>/dev/null
    
    # Cleanup individual files
    rm -f "$backup_file.sql" "$backup_file.config.tar.gz"
    
    # Keep only last 7 days of backups
    find "$BACKUP_DIR" -name "nusantararadius_backup_*.full.tar.gz" -mtime +7 -delete
    
    print_status "Backup completed: $backup_file.full.tar.gz"
}

# Function to cleanup old data
cleanup_old_data() {
    print_header "Cleaning Up Old Data"
    
    # Clean old RADIUS accounting records (older than 90 days)
    mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "DELETE FROM radacct WHERE acctstoptime < DATE_SUB(NOW(), INTERVAL 90 DAY);" 2>/dev/null
    print_status "Cleaned old accounting records"
    
    # Clean old post-auth records (older than 30 days)
    mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "DELETE FROM radpostauth WHERE authdate < DATE_SUB(NOW(), INTERVAL 30 DAY);" 2>/dev/null
    print_status "Cleaned old authentication records"
    
    # Clean old application logs (older than 7 days)
    find "$LOG_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null
    print_status "Cleaned old application logs"
    
    # Clean temporary files
    find "$TEMP_DIR" -type f -mtime +1 -delete 2>/dev/null
    print_status "Cleaned temporary files"
}

# Function to generate health report
generate_health_report() {
    print_header "Generating Health Report"
    
    report_file="$LOG_DIR/health_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "NusantaraRadius Health Report"
        echo "Generated: $(date)"
        echo "================================"
        echo
        
        echo "Service Status:"
        check_services
        echo
        
        echo "System Resources:"
        check_system_resources
        echo
        
        echo "Database Status:"
        check_database
        echo
        
        echo "RADIUS Activity:"
        check_radius_activity
        echo
        
        echo "Web Applications:"
        check_web_apps
        echo
        
    } > "$report_file"
    
    print_status "Health report generated: $report_file"
}

# Function to check for security issues
security_check() {
    print_header "Security Check"
    
    # Check for failed login attempts
    failed_logins=$(grep "authentication failed" /var/log/freeradius/radius.log 2>/dev/null | wc -l)
    if [ $failed_logins -gt 100 ]; then
        print_warning "High number of failed login attempts: $failed_logins"
    else
        print_status "Failed login attempts: $failed_logins"
    fi
    
    # Check for suspicious IP addresses
    echo "Top 10 IP addresses with failed attempts:"
    grep "authentication failed" /var/log/freeradius/radius.log 2>/dev/null | \
        awk '{print $8}' | sort | uniq -c | sort -nr | head -10 2>/dev/null || echo "No data available"
    
    # Check database user privileges
    mysql -u $DB_USER -p$DB_PASS -e "SELECT User, Host FROM mysql.user;" 2>/dev/null
}

# Function to restart services if needed
restart_services() {
    print_header "Restarting Services"
    
    services=("freeradius" "apache2" "mariadb" "nusantararadius" "nusantararadius-notifications")
    
    for service in "${services[@]}"; do
        if ! systemctl is-active --quiet "$service"; then
            print_status "Starting $service..."
            systemctl start "$service"
            sleep 2
        fi
    done
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo
    echo "Options:"
    echo "  check           Run all health checks"
    echo "  services        Check service status"
    echo "  resources       Check system resources"
    echo "  database        Check database status"
    echo "  radius          Check RADIUS activity"
    echo "  webapps         Check web applications"
    echo "  backup          Perform backup"
    echo "  cleanup         Clean up old data"
    echo "  report          Generate health report"
    echo "  security        Run security check"
    echo "  restart         Restart services if needed"
    echo "  all             Run all checks and maintenance tasks"
    echo "  help            Show this help message"
}

# Main function
main() {
    case "${1:-all}" in
        "check")
            check_services
            check_system_resources
            check_database
            check_radius_activity
            check_web_apps
            ;;
        "services")
            check_services
            ;;
        "resources")
            check_system_resources
            ;;
        "database")
            check_database
            ;;
        "radius")
            check_radius_activity
            ;;
        "webapps")
            check_web_apps
            ;;
        "backup")
            perform_backup
            ;;
        "cleanup")
            cleanup_old_data
            ;;
        "report")
            generate_health_report
            ;;
        "security")
            security_check
            ;;
        "restart")
            restart_services
            ;;
        "all")
            check_services
            check_system_resources
            check_database
            check_radius_activity
            check_web_apps
            security_check
            cleanup_old_data
            perform_backup
            generate_health_report
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"