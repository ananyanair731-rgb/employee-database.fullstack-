-- ============================================================
-- HRMS DATABASE SETUP SCRIPT
-- Run this in MySQL Workbench or MySQL CLI before starting app
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;

-- ============================================================
-- NOTE: Spring Boot with JPA (ddl-auto=update) will
-- auto-create tables. But you can also run this manually.
-- ============================================================

-- Step 2: Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    date_of_joining DATE,
    date_of_birth DATE,
    salary DOUBLE,
    address VARCHAR(255),
    gender VARCHAR(10),
    employee_code VARCHAR(20) UNIQUE,
    manager_name VARCHAR(100),
    employment_status ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED') DEFAULT 'ACTIVE',
    user_id BIGINT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Step 4: Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'HOLIDAY') DEFAULT 'PRESENT',
    remarks VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employee_id, attendance_date)
);

-- Step 5: Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type ENUM('CASUAL', 'SICK', 'ANNUAL', 'MATERNITY', 'PATERNITY', 'UNPAID'),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason VARCHAR(500),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    approved_by VARCHAR(100),
    approved_at DATETIME,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Step 6: Create task_assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    assigned_to BIGINT NOT NULL,
    assigned_by VARCHAR(100),
    due_date DATE,
    status ENUM('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') DEFAULT 'ASSIGNED',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE CASCADE
);

-- Step 7: Create payroll table
CREATE TABLE IF NOT EXISTS payroll (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    pay_month VARCHAR(7) NOT NULL,
    basic_salary DOUBLE,
    hra DOUBLE DEFAULT 0,
    da DOUBLE DEFAULT 0,
    other_allowance DOUBLE DEFAULT 0,
    gross_salary DOUBLE,
    pf_deduction DOUBLE DEFAULT 0,
    tax_deduction DOUBLE DEFAULT 0,
    other_deduction DOUBLE DEFAULT 0,
    total_deduction DOUBLE,
    net_salary DOUBLE,
    days_worked INT,
    payment_status ENUM('PENDING', 'PAID', 'ON_HOLD') DEFAULT 'PENDING',
    payment_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_payroll (employee_id, pay_month)
);

-- ============================================================
-- SAMPLE DATA (Optional - for quick testing)
-- NOTE: Users table left empty - create accounts via signup
-- ============================================================

COMMIT;

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'Database and tables created successfully!' AS Status;
SHOW TABLES;
