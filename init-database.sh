#!/bin/bash

# =============================================================================
# NusantaraRadius Database Initialization Script
# =============================================================================

set -e

# Database configuration
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="radius"
DB_USER="radius"
DB_PASS="Radius@2024!"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
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

# Function to check database connection
check_db_connection() {
    print_status "Checking database connection..."
    
    if mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS -e "USE $DB_NAME;" 2>/dev/null; then
        print_status "Database connection successful"
        return 0
    else
        print_error "Cannot connect to database"
        return 1
    fi
}

# Function to create FreeRADIUS tables
create_freeradius_tables() {
    print_header "Creating FreeRADIUS Tables"
    
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME <<'EOF'

-- RADIUS User Table
CREATE TABLE IF NOT EXISTS `radcheck` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `username` varchar(64) NOT NULL default '',
  `attribute` varchar(64)  NOT NULL default '',
  `op` char(2) NOT NULL default '==',
  `value` varchar(253) NOT NULL default '',
  PRIMARY KEY (`id`),
  KEY `username` (`username`(32))
) ENGINE=InnoDB;

-- RADIUS Reply Table
CREATE TABLE IF NOT EXISTS `radreply` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `username` varchar(64) NOT NULL default '',
  `attribute` varchar(64)  NOT NULL default '',
  `op` char(2) NOT NULL default '=',
  `value` varchar(253) NOT NULL default '',
  PRIMARY KEY (`id`),
  KEY `username` (`username`(32))
) ENGINE=InnoDB;

-- RADIUS Group Check Table
CREATE TABLE IF NOT EXISTS `radgroupcheck` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `groupname` varchar(64) NOT NULL default '',
  `attribute` varchar(64)  NOT NULL default '',
  `op` char(2) NOT NULL default '==',
  `value` varchar(253)  NOT NULL default '',
  PRIMARY KEY (`id`),
  KEY `groupname` (`groupname`(32))
) ENGINE=InnoDB;

-- RADIUS Group Reply Table
CREATE TABLE IF NOT EXISTS `radgroupreply` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `groupname` varchar(64) NOT NULL default '',
  `attribute` varchar(64)  NOT NULL default '',
  `op` char(2) NOT NULL default '=',
  `value` varchar(253)  NOT NULL default '',
  PRIMARY KEY (`id`),
  KEY `groupname` (`groupname`(32))
) ENGINE=InnoDB;

-- RADIUS User Group Table
CREATE TABLE IF NOT EXISTS `radusergroup` (
  `username` varchar(64) NOT NULL default '',
  `groupname` varchar(64) NOT NULL default '',
  `priority` int(11) NOT NULL default '1',
  PRIMARY KEY (`username`(32),`groupname`(32))
) ENGINE=InnoDB;

-- NAS (Network Access Server) Table
CREATE TABLE IF NOT EXISTS `nas` (
  `id` int(10) NOT NULL auto_increment,
  `nasname` varchar(128) NOT NULL,
  `shortname` varchar(32),
  `type` varchar(30) DEFAULT 'other',
  `ports` int(5),
  `secret` varchar(60) DEFAULT 'secret' NOT NULL,
  `server` varchar(64),
  `community` varchar(50),
  `description` varchar(200) DEFAULT 'RADIUS Client',
  PRIMARY KEY (`id`),
  KEY `nasname` (`nasname`)
) ENGINE=InnoDB;

-- RADIUS Accounting Table
CREATE TABLE IF NOT EXISTS `radacct` (
  `radacctid` bigint(21) NOT NULL auto_increment,
  `acctsessionid` varchar(64) NOT NULL default '',
  `acctuniqueid` varchar(32) NOT NULL default '',
  `username` varchar(64) NOT NULL default '',
  `groupname` varchar(64) NOT NULL default '',
  `realm` varchar(64) default '',
  `nasipaddress` varchar(15) NOT NULL default '',
  `nasportid` varchar(15) default NULL,
  `nasporttype` varchar(32) default NULL,
  `acctstarttime` datetime NULL default NULL,
  `acctupdatetime` datetime NULL default NULL,
  `acctstoptime` datetime NULL default NULL,
  `acctinterval` int(12) default NULL,
  `acctsessiontime` int(12) unsigned default NULL,
  `acctauthentic` varchar(32) default NULL,
  `connectinfo_start` varchar(50) default NULL,
  `connectinfo_stop` varchar(50) default NULL,
  `acctinputoctets` bigint(20) default NULL,
  `acctoutputoctets` bigint(20) default NULL,
  `calledstationid` varchar(50) NOT NULL default '',
  `callingstationid` varchar(50) NOT NULL default '',
  `acctterminatecause` varchar(32) NOT NULL default '',
  `servicetype` varchar(32) default NULL,
  `framedprotocol` varchar(32) default NULL,
  `framedipaddress` varchar(15) NOT NULL default '',
  `framedipv6address` varchar(45) NOT NULL default '',
  `framedipv6prefix` varchar(45) NOT NULL default '',
  `framedinterfaceid` varchar(44) NOT NULL default '',
  `delegatedipv6prefix` varchar(45) NOT NULL default '',
  `class` varchar(25) NOT NULL default '',
  `username` varchar(64) NOT NULL default '',
  `groupname` varchar(64) NOT NULL default '',
  `realm` varchar(64) default '',
  `nasipaddress` varchar(15) NOT NULL default '',
  `nasportid` varchar(15) default NULL,
  `nasporttype` varchar(32) default NULL,
  `acctstarttime` datetime NULL default NULL,
  `acctupdatetime` datetime NULL default NULL,
  `acctstoptime` datetime NULL default NULL,
  `acctinterval` int(12) default NULL,
  `acctsessiontime` int(12) unsigned default NULL,
  `acctauthentic` varchar(32) default NULL,
  `connectinfo_start` varchar(50) default NULL,
  `connectinfo_stop` varchar(50) default NULL,
  `acctinputoctets` bigint(20) default NULL,
  `acctoutputoctets` bigint(20) default NULL,
  `calledstationid` varchar(50) NOT NULL default '',
  `callingstationid` varchar(50) NOT NULL default '',
  `acctterminatecause` varchar(32) NOT NULL default '',
  `servicetype` varchar(32) default NULL,
  `framedprotocol` varchar(32) default NULL,
  `framedipaddress` varchar(15) NOT NULL default '',
  `framedipv6address` varchar(45) NOT NULL default '',
  `framedipv6prefix` varchar(45) NOT NULL default '',
  `framedinterfaceid` varchar(44) NOT NULL default '',
  `delegatedipv6prefix` varchar(45) NOT NULL default '',
  `class` varchar(25) NOT NULL default '',
  PRIMARY KEY (`radacctid`),
  KEY `acctuniqueid` (`acctuniqueid`),
  KEY `username` (`username`(32)),
  KEY `nasipaddress` (`nasipaddress`),
  KEY `acctstarttime` (`acctstarttime`),
  KEY `acctsessionid` (`acctsessionid`),
  KEY `acctsessiontime` (`acctsessiontime`),
  KEY `acctstoptime` (`acctstoptime`),
  KEY `nasipaddress` (`nasipaddress`),
  KEY `acctstarttime` (`acctstarttime`)
) ENGINE=InnoDB;

-- Post Authentication Table
CREATE TABLE IF NOT EXISTS `radpostauth` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(64) NOT NULL default '',
  `pass` varchar(64) NOT NULL default '',
  `reply` varchar(32) NOT NULL default '',
  `authdate` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `username` (`username`(32))
) ENGINE=InnoDB;

EOF

    print_status "FreeRADIUS tables created successfully"
}

# Function to create NusantaraRadius specific tables
create_nusantararadius_tables() {
    print_header "Creating NusantaraRadius Tables"
    
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME <<'EOF'

-- User Management Table
CREATE TABLE IF NOT EXISTS `nr_users` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(64) NOT NULL unique,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL unique,
  `phone` varchar(20),
  `full_name` varchar(100),
  `address` text,
  `status` enum('ACTIVE','SUSPENDED','EXPIRED','BLOCKED') DEFAULT 'ACTIVE',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  KEY `email` (`email`)
) ENGINE=InnoDB;

-- Package Management Table
CREATE TABLE IF NOT EXISTS `nr_packages` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) NOT NULL unique,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'Duration in days',
  `speed` varchar(50) NOT NULL,
  `data_limit` bigint(20) COMMENT 'Data limit in bytes',
  `time_limit` int(11) COMMENT 'Time limit in minutes per day',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB;

-- Subscription Table
CREATE TABLE IF NOT EXISTS `nr_subscriptions` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime NOT NULL,
  `status` enum('ACTIVE','EXPIRED','SUSPENDED','CANCELLED') DEFAULT 'ACTIVE',
  `auto_renew` tinyint(1) DEFAULT 0,
  `data_used` bigint(20) DEFAULT 0,
  `time_used` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `nr_users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`package_id`) REFERENCES `nr_packages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Transaction Table
CREATE TABLE IF NOT EXISTS `nr_transactions` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `package_id` int(11),
  `subscription_id` int(11),
  `amount` decimal(10,2) NOT NULL,
  `type` enum('SUBSCRIPTION','RENEWAL','UPGRADE','TOPUP','REFUND') NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','CANCELLED') DEFAULT 'PENDING',
  `payment_method` enum('TRANSFER','EWALLET','CREDIT_CARD','DEBIT_CARD','CASH') NOT NULL,
  `payment_ref` varchar(100),
  `description` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`),
  KEY `subscription_id` (`subscription_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `nr_users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`package_id`) REFERENCES `nr_packages`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`subscription_id`) REFERENCES `nr_subscriptions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Voucher Table
CREATE TABLE IF NOT EXISTS `nr_vouchers` (
  `id` int(11) NOT NULL auto_increment,
  `code` varchar(50) NOT NULL unique,
  `package_id` int(11),
  `value` decimal(10,2),
  `duration` int(11) COMMENT 'Additional duration in days',
  `max_uses` int(11) DEFAULT 1,
  `used_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` datetime,
  `created_by` varchar(64),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `code` (`code`),
  KEY `package_id` (`package_id`),
  FOREIGN KEY (`package_id`) REFERENCES `nr_packages`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Voucher Redemption Table
CREATE TABLE IF NOT EXISTS `nr_voucher_redemptions` (
  `id` int(11) NOT NULL auto_increment,
  `voucher_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `redeemed_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `voucher_id` (`voucher_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`voucher_id`) REFERENCES `nr_vouchers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `nr_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- System Configuration Table
CREATE TABLE IF NOT EXISTS `nr_config` (
  `id` int(11) NOT NULL auto_increment,
  `config_key` varchar(100) NOT NULL unique,
  `config_value` text,
  `description` text,
  `category` varchar(50) DEFAULT 'general',
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `config_key` (`config_key`)
) ENGINE=InnoDB;

EOF

    print_status "NusantaraRadius tables created successfully"
}

# Function to insert default data
insert_default_data() {
    print_header "Inserting Default Data"
    
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME <<'EOF'

-- Insert default NAS (Network Access Server)
INSERT IGNORE INTO `nas` (`nasname`, `shortname`, `type`, `ports`, `secret`, `description`) VALUES
('127.0.0.1', 'localhost', 'other', 1812, 'NusantaraRadius2024', 'Local RADIUS Server'),
('192.168.1.1', 'mikrotik', 'other', 1812, 'NusantaraRadius2024', 'MikroTik Router'),
('192.168.0.1', 'router', 'other', 1812, 'NusantaraRadius2024', 'Main Router');

-- Insert default RADIUS user groups
INSERT IGNORE INTO `radgroupreply` (`groupname`, `attribute`, `op`, `value`) VALUES
('users', 'Service-Type', ':=', 'Framed-User'),
('users', 'Framed-Protocol', ':=', 'PPP'),
('users', 'Framed-MTU', ':=', '1500');

-- Insert default packages
INSERT IGNORE INTO `nr_packages` (`name`, `description`, `price`, `duration`, `speed`, `data_limit`, `time_limit`) VALUES
('Basic 10Mbps', 'Paket dasar untuk penggunaan rumahan', 50000.00, 30, '10Mbps', 10737418240, NULL),
('Premium 50Mbps', 'Paket premium untuk penggunaan berat', 150000.00, 30, '50Mbps', NULL, NULL),
('Gaming 100Mbps', 'Paket khusus gaming dan streaming', 250000.00, 30, '100Mbps', NULL, NULL),
('Enterprise 200Mbps', 'Paket enterprise untuk bisnis', 500000.00, 30, '200Mbps', NULL, NULL);

-- Insert default system configuration
INSERT IGNORE INTO `nr_config` (`config_key`, `config_value`, `description`, `category`) VALUES
('company_name', 'NusantaraRadius', 'Company name displayed in the application', 'general'),
('company_email', 'admin@nusantararadius.id', 'Company contact email', 'general'),
('company_phone', '+62-21-1234-5678', 'Company contact phone', 'general'),
('currency', 'IDR', 'Default currency', 'general'),
('timezone', 'Asia/Jakarta', 'Default timezone', 'general'),
('session_timeout', '3600', 'Session timeout in seconds', 'security'),
('max_login_attempts', '5', 'Maximum login attempts before lockout', 'security'),
('password_min_length', '8', 'Minimum password length', 'security'),
('auto_backup_enabled', '1', 'Enable automatic backups', 'backup'),
('backup_retention_days', '30', 'Number of days to retain backups', 'backup'),
('telegram_enabled', '0', 'Enable Telegram notifications', 'notifications'),
('whatsapp_enabled', '0', 'Enable WhatsApp notifications', 'notifications');

-- Insert default admin user
INSERT IGNORE INTO `nr_users` (`username`, `password`, `email`, `full_name`, `status`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@nusantararadius.id', 'System Administrator', 'ACTIVE');

-- Insert default admin user to RADIUS
INSERT IGNORE INTO `radcheck` (`username`, `attribute`, `op`, `value`) VALUES
('admin', 'Cleartext-Password', ':=', 'admin123'),
('admin', 'User-Password', ':=', 'admin123');

-- Add admin to users group
INSERT IGNORE INTO `radusergroup` (`username`, `groupname`, `priority`) VALUES
('admin', 'users', 1);

EOF

    print_status "Default data inserted successfully"
}

# Function to create database views
create_views() {
    print_header "Creating Database Views"
    
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME <<'EOF'

-- View for active users with subscriptions
CREATE OR REPLACE VIEW `v_active_users` AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.phone,
    p.name as package_name,
    p.speed,
    s.start_date,
    s.end_date,
    s.data_used,
    s.time_used,
    DATEDIFF(s.end_date, NOW()) as days_remaining
FROM nr_users u
JOIN nr_subscriptions s ON u.id = s.user_id
JOIN nr_packages p ON s.package_id = p.id
WHERE s.status = 'ACTIVE' AND s.end_date > NOW();

-- View for monthly revenue
CREATE OR REPLACE VIEW `v_monthly_revenue` AS
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    SUM(amount) as total_revenue,
    COUNT(*) as transaction_count,
    COUNT(DISTINCT user_id) as unique_users
FROM nr_transactions
WHERE status = 'SUCCESS'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- View for package statistics
CREATE OR REPLACE VIEW `v_package_stats` AS
SELECT 
    p.id,
    p.name,
    p.price,
    COUNT(s.id) as active_subscriptions,
    SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END) as total_revenue
FROM nr_packages p
LEFT JOIN nr_subscriptions s ON p.id = s.package_id AND s.status = 'ACTIVE'
LEFT JOIN nr_transactions t ON p.id = t.package_id AND t.status = 'SUCCESS'
GROUP BY p.id, p.name, p.price;

EOF

    print_status "Database views created successfully"
}

# Function to create stored procedures
create_procedures() {
    print_header "Creating Stored Procedures"
    
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME <<'EOF'

DELIMITER //

-- Procedure to create new user with RADIUS authentication
CREATE PROCEDURE IF NOT EXISTS `sp_create_user`(
    IN p_username VARCHAR(64),
    IN p_password VARCHAR(255),
    IN p_email VARCHAR(100),
    IN p_full_name VARCHAR(100),
    IN p_phone VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert into NusantaraRadius users table
    INSERT INTO nr_users (username, password, email, full_name, phone)
    VALUES (p_username, p_password, p_email, p_full_name, p_phone);
    
    -- Insert into RADIUS check table
    INSERT INTO radcheck (username, attribute, op, value)
    VALUES (p_username, 'User-Password', ':=', p_password);
    
    -- Add to users group
    INSERT INTO radusergroup (username, groupname, priority)
    VALUES (p_username, 'users', 1);
    
    COMMIT;
END //

-- Procedure to update user password
CREATE PROCEDURE IF NOT EXISTS `sp_update_user_password`(
    IN p_username VARCHAR(64),
    IN p_new_password VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update in NusantaraRadius users table
    UPDATE nr_users 
    SET password = p_new_password, updated_at = NOW()
    WHERE username = p_username;
    
    -- Update in RADIUS check table
    UPDATE radcheck 
    SET value = p_new_password
    WHERE username = p_username AND attribute = 'User-Password';
    
    COMMIT;
END //

-- Procedure to create subscription
CREATE PROCEDURE IF NOT EXISTS `sp_create_subscription`(
    IN p_user_id INT,
    IN p_package_id INT,
    IN p_duration_days INT
)
BEGIN
    DECLARE v_end_date DATETIME;
    
    SET v_end_date = DATE_ADD(NOW(), INTERVAL p_duration_days DAY);
    
    INSERT INTO nr_subscriptions (user_id, package_id, start_date, end_date, status)
    VALUES (p_user_id, p_package_id, NOW(), v_end_date, 'ACTIVE');
    
    SELECT LAST_INSERT_ID() as subscription_id;
END //

-- Procedure to get user statistics
CREATE PROCEDURE IF NOT EXISTS `sp_get_user_stats`(
    IN p_user_id INT
)
BEGIN
    SELECT 
        u.username,
        u.email,
        u.full_name,
        COUNT(s.id) as total_subscriptions,
        SUM(CASE WHEN s.status = 'ACTIVE' THEN 1 ELSE 0 END) as active_subscriptions,
        SUM(CASE WHEN t.status = 'SUCCESS' THEN t.amount ELSE 0 END) as total_spent,
        MAX(s.end_date) as last_subscription_end
    FROM nr_users u
    LEFT JOIN nr_subscriptions s ON u.id = s.user_id
    LEFT JOIN nr_transactions t ON u.id = t.user_id AND t.status = 'SUCCESS'
    WHERE u.id = p_user_id
    GROUP BY u.id, u.username, u.email, u.full_name;
END //

DELIMITER ;

EOF

    print_status "Stored procedures created successfully"
}

# Main function
main() {
    print_header "NusantaraRadius Database Initialization"
    
    # Check database connection
    if ! check_db_connection; then
        print_error "Database connection failed. Please check your database configuration."
        exit 1
    fi
    
    # Create tables
    create_freeradius_tables
    create_nusantararadius_tables
    
    # Insert default data
    insert_default_data
    
    # Create views and procedures
    create_views
    create_procedures
    
    print_header "Database Initialization Complete"
    print_status "Database has been successfully initialized with:"
    print_status "  • FreeRADIUS tables"
    print_status "  • NusantaraRadius tables"
    print_status "  • Default data and users"
    print_status "  • Database views"
    print_status "  • Stored procedures"
    echo
    print_status "Default admin credentials:"
    print_status "  Username: admin"
    print_status "  Password: admin123"
    print_status "  Email: admin@nusantararadius.id"
    echo
    print_status "You can now access the applications at:"
    print_status "  • NusantaraRadius: http://localhost:3000"
    print_status "  • daloRADIUS: http://localhost/daloradius"
}

# Run main function
main "$@"