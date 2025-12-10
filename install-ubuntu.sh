#!/bin/bash

# =============================================================================
# NusantaraRadius Auto-Installation Script for Ubuntu 25
# RADIUS Billing & Management System
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
PROJECT_NAME="NusantaraRadius"
INSTALL_DIR="/opt/nusantararadius"
DB_NAME="radius"
DB_USER="radius"
DB_PASS="Radius@2024!"
RADIUS_SECRET="NusantaraRadius2024"
DOMAIN_NAME="localhost"
ADMIN_EMAIL="admin@nusantararadius.id"

# Function to print colored output
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

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Function to detect Ubuntu version
check_ubuntu() {
    if ! grep -q "Ubuntu 25" /etc/os-release; then
        print_warning "This script is optimized for Ubuntu 25"
        read -p "Do you want to continue? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Function to update system
update_system() {
    print_header "Updating System Packages"
    
    print_status "Updating package lists..."
    apt update -y
    
    print_status "Upgrading existing packages..."
    apt upgrade -y
    
    print_status "Installing essential utilities..."
    apt install -y curl wget git unzip software-properties-common \
        apt-transport-https ca-certificates gnupg lsb-release \
        build-essential python3 python3-pip python3-venv \
        htop net-tools vim ufw
}

# Function to install and configure MariaDB
install_mariadb() {
    print_header "Installing MariaDB Database"
    
    # Add MariaDB repository
    print_status "Adding MariaDB repository..."
    curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | \
        sudo bash -s -- --mariadb-server-version=10.11 --skip-maxscale
    
    # Update package lists
    apt update -y
    
    # Install MariaDB
    print_status "Installing MariaDB server..."
    apt install -y mariadb-server mariadb-client
    
    # Start and enable MariaDB
    systemctl start mariadb
    systemctl enable mariadb
    
    # Secure MariaDB installation
    print_status "Securing MariaDB installation..."
    mysql_secure_installation <<EOF

y
$DB_PASS
$DB_PASS
y
y
y
y
EOF
    
    # Create database and user
    print_status "Creating database and user..."
    mysql -u root -p"$DB_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    print_status "MariaDB installation completed"
}

# Function to install FreeRADIUS
install_freeradius() {
    print_header "Installing FreeRADIUS Server"
    
    print_status "Installing FreeRADIUS packages..."
    apt install -y freeradius freeradius-mysql freeradius-utils
    
    # Backup original configuration
    print_status "Backing up original configuration..."
    cp /etc/freeradius/3.0/radiusd.conf /etc/freeradius/3.0/radiusd.conf.bak
    
    # Configure FreeRADIUS
    print_status "Configuring FreeRADIUS..."
    
    # Create SQL configuration
    cat > /etc/freeradius/3.0/mods-available/sql <<EOF
sql {
    driver = "rlm_sql_mysql"
    server = "localhost"
    port = 3306
    login = "$DB_USER"
    password = "$DB_PASS"
    radius_db = "$DB_NAME"
    
    read_groups = yes
    read_profiles = yes
    read_clients = yes
    
    delete_stale_sessions = yes
    sqltrace = no
    sqltracefile = \${logdir}/sqltrace.sql
    
    num_sql_socks = 5
    connect_failure_retry_delay = 60
    lifetime = 0
    max_queries = 0
    
    acct_table = "radacct"
    acct_table2 = "radacct"
    postauth_table = "radpostauth"
    authcheck_table = "radcheck"
    authreply_table = "radreply"
    groupcheck_table = "radgroupcheck"
    groupreply_table = "radgroupreply"
    usergroup_table = "radusergroup"
    nas_table = "nas"
    
    $INCLUDE sql/\${database}/\${dialect}/queries.conf
}
EOF
    
    # Enable SQL module
    ln -sf /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/
    
    # Configure clients
    cat > /etc/freeradius/3.0/clients.conf <<EOF
client localhost {
    ipaddr = 127.0.0.1
    secret = $RADIUS_SECRET
    require_message_authenticator = no
}

client private_network {
    ipaddr = 192.168.0.0/16
    secret = $RADIUS_SECRET
    require_message_authenticator = no
}

client mikrotik {
    ipaddr = 192.168.1.1
    secret = $RADIUS_SECRET
    require_message_authenticator = no
}
EOF
    
    # Configure sites
    cat > /etc/freeradius/3.0/sites-available/nusantararadius <<EOF
server nusantararadius {
    listen {
        type = auth
        ipaddr = *
        port = 1812
    }
    
    listen {
        type = acct
        ipaddr = *
        port = 1813
    }
    
    authorize {
        preprocess
        chap
        mschap
        eap
        sql
        expiration
        logintime
    }
    
    authenticate {
        Auth-Type PAP {
            pap
        }
        Auth-Type CHAP {
            chap
        }
        Auth-Type MS-CHAP {
            mschap
        }
        eap
    }
    
    preacct {
        preprocess
        acct_unique
    }
    
    accounting {
        detail
        unix
        radutmp
        sql
    }
    
    session {
        radutmp
        sql
    }
    
    post-auth {
        sql
        exec
        Post-Auth-Type Reject {
            attr_filter.access_reject
        }
    }
}
EOF
    
    # Enable the site
    ln -sf /etc/freeradius/3.0/sites-available/nusantararadius /etc/freeradius/3.0/sites-enabled/
    
    # Disable default site
    rm -f /etc/freeradius/3.0/sites-enabled/default
    rm -f /etc/freeradius/3.0/sites-enabled/inner-tunnel
    
    # Start and enable FreeRADIUS
    systemctl restart freeradius
    systemctl enable freeradius
    
    print_status "FreeRADIUS installation completed"
}

# Function to install Apache and PHP
install_webserver() {
    print_header "Installing Apache Web Server and PHP"
    
    print_status "Installing Apache..."
    apt install -y apache2
    
    print_status "Installing PHP and extensions..."
    apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql \
        php8.2-gd php8.2-xml php8.2-mbstring php8.2-curl \
        php8.2-zip php8.2-intl php8.2-bcmath php8.2-json \
        libapache2-mod-php8.2
    
    # Enable required modules
    a2enmod php8.2
    a2enmod rewrite
    a2enmod ssl
    
    # Configure PHP
    sed -i 's/memory_limit = 128M/memory_limit = 512M/' /etc/php/8.2/apache2/php.ini
    sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 50M/' /etc/php/8.2/apache2/php.ini
    sed -i 's/post_max_size = 8M/post_max_size = 50M/' /etc/php/8.2/apache2/php.ini
    sed -i 's/max_execution_time = 30/max_execution_time = 300/' /etc/php/8.2/apache2/php.ini
    
    # Restart Apache
    systemctl restart apache2
    systemctl enable apache2
    
    print_status "Apache and PHP installation completed"
}

# Function to install Node.js and npm
install_nodejs() {
    print_header "Installing Node.js and npm"
    
    # Add NodeSource repository
    print_status "Adding NodeSource repository..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    
    # Install Node.js
    print_status "Installing Node.js..."
    apt install -y nodejs
    
    # Verify installation
    node_version=$(node --version)
    npm_version=$(npm --version)
    print_status "Node.js $node_version and npm $npm_version installed"
}

# Function to install daloRADIUS
install_daloradius() {
    print_header "Installing daloRADIUS Management GUI"
    
    # Create web directory
    mkdir -p /var/www/html/daloradius
    
    # Download daloRADIUS
    print_status "Downloading daloRADIUS..."
    cd /tmp
    wget https://github.com/lirantal/daloradius/archive/refs/heads/master.zip -O daloradius.zip
    
    # Extract daloRADIUS
    print_status "Extracting daloRADIUS..."
    unzip -q daloradius.zip
    mv daloradius-master/* /var/www/html/daloradius/
    
    # Set permissions
    chown -R www-data:www-data /var/www/html/daloradius
    chmod -R 755 /var/www/html/daloradius
    
    # Configure daloRADIUS
    print_status "Configuring daloRADIUS..."
    cp /var/www/html/daloradius/include/config.php.example /var/www/html/daloradius/include/config.php
    
    # Update database configuration
    sed -i "s/\$configValues\['CONFIG_DB_HOST'\] = 'localhost';/\$configValues\['CONFIG_DB_HOST'\] = 'localhost';/" /var/www/html/daloradius/include/config.php
    sed -i "s/\$configValues\['CONFIG_DB_PORT'\] = '3306';/\$configValues\['CONFIG_DB_PORT'\] = '3306';/" /var/www/html/daloradius/include/config.php
    sed -i "s/\$configValues\['CONFIG_DB_USER'\] = 'root';/\$configValues\['CONFIG_DB_USER'\] = '$DB_USER';/" /var/www/html/daloradius/include/config.php
    sed -i "s/\$configValues\['CONFIG_DB_PASS'\] = '';/\$configValues\['CONFIG_DB_PASS'\] = '$DB_PASS';/" /var/www/html/daloradius/include/config.php
    sed -i "s/\$configValues\['CONFIG_DB_NAME'\] = 'radius';/\$configValues\['CONFIG_DB_NAME'\] = '$DB_NAME';/" /var/www/html/daloradius/include/config.php
    
    # Import daloRADIUS database schema
    print_status "Importing daloRADIUS database schema..."
    mysql -u $DB_USER -p$DB_PASS $DB_NAME < /var/www/html/daloradius/contrib/db/fr3-mariadb-daloradius-freeradius-v2.0.1.sql
    
    # Create Apache virtual host
    cat > /etc/apache2/sites-available/daloradius.conf <<EOF
<VirtualHost *:80>
    ServerName daloradius.local
    DocumentRoot /var/www/html/daloradius
    
    <Directory /var/www/html/daloradius>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog \${APACHE_LOG_DIR}/daloradius_error.log
    CustomLog \${APACHE_LOG_DIR}/daloradius_access.log combined
</VirtualHost>
EOF
    
    # Enable the site
    a2ensite daloradius.conf
    systemctl reload apache2
    
    print_status "daloRADIUS installation completed"
}

# Function to deploy NusantaraRadius web application
deploy_nusantararadius() {
    print_header "Deploying NusantaraRadius Web Application"
    
    # Create installation directory
    mkdir -p $INSTALL_DIR
    cd $INSTALL_DIR
    
    # Clone the repository (assuming it exists)
    if [ -d "/home/z/my-project" ]; then
        print_status "Copying NusantaraRadius application..."
        cp -r /home/z/my-project/* $INSTALL_DIR/
    else
        print_status "Creating NusantaraRadius application structure..."
        mkdir -p $INSTALL_DIR/{src,public,mini-services}
    fi
    
    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    cd $INSTALL_DIR
    npm install
    
    # Build the application
    print_status "Building the application..."
    npm run build
    
    # Create systemd service for the main application
    cat > /etc/systemd/system/nusantararadius.service <<EOF
[Unit]
Description=NusantaraRadius Web Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$INSTALL_DIR
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Create systemd service for notification service
    cat > /etc/systemd/system/nusantararadius-notifications.service <<EOF
[Unit]
Description=NusantaraRadius Notification Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$INSTALL_DIR/mini-services/notification-service
Environment=NODE_ENV=production
Environment=PORT=3003
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    # Set permissions
    chown -R www-data:www-data $INSTALL_DIR
    chmod -R 755 $INSTALL_DIR
    
    # Enable and start services
    systemctl daemon-reload
    systemctl enable nusantararadius
    systemctl enable nusantararadius-notifications
    systemctl start nusantararadius
    systemctl start nusantararadius-notifications
    
    print_status "NusantaraRadius application deployed"
}

# Function to configure firewall
configure_firewall() {
    print_header "Configuring Firewall"
    
    # Enable UFW
    ufw --force enable
    
    # Allow SSH
    ufw allow ssh
    
    # Allow web traffic
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow RADIUS ports
    ufw allow 1812/udp
    ufw allow 1813/udp
    
    # Allow Node.js application ports
    ufw allow 3000/tcp
    ufw allow 3003/tcp
    
    print_status "Firewall configured"
}

# Function to create SSL certificate
create_ssl_cert() {
    print_header "Creating SSL Certificate"
    
    # Install certbot
    apt install -y certbot python3-certbot-apache
    
    # Create self-signed certificate for localhost
    if [ "$DOMAIN_NAME" = "localhost" ]; then
        print_status "Creating self-signed certificate for localhost..."
        mkdir -p /etc/ssl/private
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/ssl/private/nusantararadius.key \
            -out /etc/ssl/certs/nusantararadius.crt \
            -subj "/C=ID/ST=Jakarta/L=Jakarta/O=NusantaraRadius/OU=IT/CN=$DOMAIN_NAME"
    else
        print_status "Creating Let's Encrypt certificate for $DOMAIN_NAME..."
        certbot --apache -d $DOMAIN_NAME --non-interactive --agree-tos \
            --email $ADMIN_EMAIL --redirect
    fi
}

# Function to create startup scripts
create_startup_scripts() {
    print_header "Creating Management Scripts"
    
    # Create management script
    cat > /usr/local/bin/nusantararadius <<'EOF'
#!/bin/bash

case "$1" in
    start)
        echo "Starting NusantaraRadius services..."
        systemctl start freeradius
        systemctl start apache2
        systemctl start nusantararadius
        systemctl start nusantararadius-notifications
        echo "All services started"
        ;;
    stop)
        echo "Stopping NusantaraRadius services..."
        systemctl stop freeradius
        systemctl stop apache2
        systemctl stop nusantararadius
        systemctl stop nusantararadius-notifications
        echo "All services stopped"
        ;;
    restart)
        echo "Restarting NusantaraRadius services..."
        systemctl restart freeradius
        systemctl restart apache2
        systemctl restart nusantararadius
        systemctl restart nusantararadius-notifications
        echo "All services restarted"
        ;;
    status)
        echo "NusantaraRadius Service Status:"
        echo "=============================="
        systemctl is-active freeradius
        systemctl is-active apache2
        systemctl is-active nusantararadius
        systemctl is-active nusantararadius-notifications
        ;;
    *)
        echo "Usage: nusantararadius {start|stop|restart|status}"
        exit 1
        ;;
esac
EOF
    
    # Make the script executable
    chmod +x /usr/local/bin/nusantararadius
    
    # Create backup script
    cat > /usr/local/bin/nusantararadius-backup <<'EOF'
#!/bin/bash

BACKUP_DIR="/opt/backups/nusantararadius"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u radius -p'Radius@2024!' radius > $BACKUP_DIR/radius_db_$DATE.sql

# Backup configuration files
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/freeradius /etc/apache2/sites-available/

# Backup application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /opt/nusantararadius

echo "Backup completed: $BACKUP_DIR"
EOF
    
    chmod +x /usr/local/bin/nusantararadius-backup
    
    print_status "Management scripts created"
}

# Function to display installation summary
display_summary() {
    print_header "Installation Summary"
    
    echo -e "${GREEN}NusantaraRadius has been successfully installed!${NC}"
    echo
    echo -e "${BLUE}Service URLs:${NC}"
    echo -e "  • Main Application: ${YELLOW}http://localhost:3000${NC}"
    echo -e "  • daloRADIUS GUI:    ${YELLOW}http://localhost/daloradius${NC}"
    echo -e "  • Default Login:     ${YELLOW}admin / radius${NC}"
    echo
    echo -e "${BLUE}Service Status:${NC}"
    echo -e "  • FreeRADIUS:        ${GREEN}$(systemctl is-active freeradius)${NC}"
    echo -e "  • Apache Web Server: ${GREEN}$(systemctl is-active apache2)${NC}"
    echo -e "  • Node.js App:       ${GREEN}$(systemctl is-active nusantararadius)${NC}"
    echo -e "  • Notifications:     ${GREEN}$(systemctl is-active nusantararadius-notifications)${NC}"
    echo
    echo -e "${BLUE}Database Configuration:${NC}"
    echo -e "  • Host: localhost"
    echo -e "  • Database: $DB_NAME"
    echo -e "  • Username: $DB_USER"
    echo -e "  • Password: $DB_PASS"
    echo
    echo -e "${BLUE}RADIUS Configuration:${NC}"
    echo -e "  • Authentication Port: 1812"
    echo -e "  • Accounting Port: 1813"
    echo -e "  • Shared Secret: $RADIUS_SECRET"
    echo
    echo -e "${BLUE}Management Commands:${NC}"
    echo -e "  • Start services:    ${YELLOW}nusantararadius start${NC}"
    echo -e "  • Stop services:     ${YELLOW}nusantararadius stop${NC}"
    echo -e "  • Restart services:  ${YELLOW}nusantararadius restart${NC}"
    echo -e "  • Check status:      ${YELLOW}nusantararadius status${NC}"
    echo -e "  • Create backup:     ${YELLOW}nusantararadius-backup${NC}"
    echo
    echo -e "${GREEN}Installation completed successfully!${NC}"
}

# Main installation function
main() {
    print_header "NusantaraRadius Auto-Installation Script"
    echo -e "${BLUE}This script will install and configure the complete NusantaraRadius stack:${NC}"
    echo "  • MariaDB Database"
    echo "  • FreeRADIUS Server"
    echo "  • Apache Web Server + PHP"
    echo "  • daloRADIUS Management GUI"
    echo "  • Node.js Application"
    echo "  • SSL Certificate"
    echo "  • Firewall Configuration"
    echo
    
    read -p "Do you want to continue with the installation? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Installation cancelled"
        exit 0
    fi
    
    # Run installation steps
    check_root
    check_ubuntu
    update_system
    install_mariadb
    install_freeradius
    install_webserver
    install_nodejs
    install_daloradius
    deploy_nusantararadius
    configure_firewall
    create_ssl_cert
    create_startup_scripts
    
    display_summary
}

# Run main function
main "$@"