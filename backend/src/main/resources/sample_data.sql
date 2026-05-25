-- ============================================================
-- HRMS DATABASE - REALISTIC SAMPLE/DEMO DATA
-- Generated for testing Frontend UI and Backend APIs
-- ============================================================
-- NOTE: Run db_setup.sql FIRST to create tables, then run this file
-- Compatible with MySQL
-- ============================================================

USE hrms_db;

-- Clear existing sample data (optional - comment out if needed)
-- DELETE FROM attendance;
-- DELETE FROM payroll;
-- DELETE FROM leave_requests;
-- DELETE FROM task_assignments;
-- DELETE FROM employees;
-- DELETE FROM users;

-- ============================================================
-- 1. INSERT USERS - COMMENTED OUT
-- ============================================================
-- Users table left empty for you to create via signup
-- Create your own users through the frontend signup process
-- ============================================================
-- Uncomment below to restore pre-configured test users:
-- INSERT IGNORE INTO users (username, email, password, role, is_active, created_at) VALUES
-- ('admin', 'admin@hrms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', TRUE, NOW()),
-- ('hrmanager', 'hr@hrms.com', '$2a$10$EqKG5A3BU.Q5K1J7fELuLu6f3YNmv1WMcJjLK0Xl.0vLX2YmXbSbK', 'HR', TRUE, NOW()),
-- ('rajesh_kumar', 'rajesh.kumar@techcorp.com', '$2a$10$KhF0JZ9d7k6L3m2N5o9P1QrS8tU6vW4xY2zAaBbCc5DeEfGgHhIiJ', 'MANAGER', TRUE, NOW()),
-- ('priya_sharma', 'priya.sharma@techcorp.com', '$2a$10$AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz', 'EMPLOYEE', TRUE, NOW()),
-- ('amit_patel', 'amit.patel@techcorp.com', '$2a$10$QqRrSsTtUuVvWwXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp', 'EMPLOYEE', TRUE, NOW()),
-- ('neha_desai', 'neha.desai@techcorp.com', '$2a$10$KkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZzAaBbCcDdEeFfGgHhIiJj', 'MANAGER', TRUE, NOW()),
-- ('vikram_singh', 'vikram.singh@techcorp.com', '$2a$10$WwXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVv', 'EMPLOYEE', TRUE, NOW()),
-- ('anjali_gupta', 'anjali.gupta@techcorp.com', '$2a$10$OoPpQqRrSsTtUuVvWwXxYyZzAaBbCcDdEeFfGgHhIiJjKkLlMmNn', 'EMPLOYEE', TRUE, NOW());

-- ============================================================
-- 2. INSERT EMPLOYEES (8 employees with realistic data)
-- ============================================================

INSERT IGNORE INTO employees (first_name, last_name, email, phone, department, designation, date_of_joining, date_of_birth, salary, address, gender, employee_code, manager_name, employment_status, created_at, updated_at) VALUES

('Rajesh', 'Kumar', 'rajesh.kumar@techcorp.com', '+91-98765-43210', 'Engineering', 'Senior Manager', '2018-03-15', '1985-06-20', 120000.00, '123 Corporate Plaza, Bangalore', 'M', 'EMP001', 'Rajesh Kumar', 'ACTIVE', NOW(), NOW()),

('Priya', 'Sharma', 'priya.sharma@techcorp.com', '+91-98765-43211', 'Engineering', 'Senior Developer', '2019-05-20', '1990-08-15', 85000.00, '456 Tech Park, Bangalore', 'F', 'EMP002', 'Rajesh Kumar', 'ACTIVE', NOW(), NOW()),

('Amit', 'Patel', 'amit.patel@techcorp.com', '+91-98765-43212', 'Engineering', 'Developer', '2020-07-10', '1992-12-05', 65000.00, '789 Innovation Hub, Bangalore', 'M', 'EMP003', 'Rajesh Kumar', 'ACTIVE', NOW(), NOW()),

('Neha', 'Desai', 'neha.desai@techcorp.com', '+91-98765-43213', 'Human Resources', 'HR Manager', '2017-02-01', '1988-04-10', 75000.00, '321 City Center, Bangalore', 'F', 'EMP004', 'Admin User', 'ACTIVE', NOW(), NOW()),

('Vikram', 'Singh', 'vikram.singh@techcorp.com', '+91-98765-43214', 'Sales', 'Sales Manager', '2019-01-15', '1987-09-22', 90000.00, '654 Business District, Bangalore', 'M', 'EMP005', 'Admin User', 'ACTIVE', NOW(), NOW()),

('Anjali', 'Gupta', 'anjali.gupta@techcorp.com', '+91-98765-43215', 'Sales', 'Sales Executive', '2021-06-01', '1995-11-30', 50000.00, '987 Downtown, Bangalore', 'F', 'EMP006', 'Vikram Singh', 'ACTIVE', NOW(), NOW()),

('Arjun', 'Verma', 'arjun.verma@techcorp.com', '+91-98765-43216', 'Finance', 'Finance Manager', '2018-08-20', '1986-03-14', 80000.00, '147 Financial Hub, Bangalore', 'M', 'EMP007', 'Admin User', 'ACTIVE', NOW(), NOW()),

('Deepika', 'Rao', 'deepika.rao@techcorp.com', '+91-98765-43217', 'Engineering', 'QA Engineer', '2021-09-15', '1997-07-25', 60000.00, '258 Tech Village, Bangalore', 'F', 'EMP008', 'Rajesh Kumar', 'ON_LEAVE', NOW(), NOW());

-- ============================================================
-- 3. INSERT ATTENDANCE RECORDS (5 per employee - varying statuses)
-- Dates: May 20-24, 2026 (realistic recent dates)
-- ============================================================

-- Employee 1 (Rajesh) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(1, '2026-05-20', '09:00:00', '18:30:00', 'PRESENT', 'On time'),
(1, '2026-05-21', '09:15:00', '18:45:00', 'PRESENT', 'Regular day'),
(1, '2026-05-22', '09:00:00', '18:00:00', 'PRESENT', 'On time'),
(1, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(1, '2026-05-24', '10:00:00', '18:30:00', 'HALF_DAY', 'Doctor appointment in morning');

-- Employee 2 (Priya) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(2, '2026-05-20', '09:05:00', '18:20:00', 'PRESENT', 'On time'),
(2, '2026-05-21', NULL, NULL, 'ABSENT', 'Unplanned absence'),
(2, '2026-05-22', '09:00:00', '18:30:00', 'PRESENT', 'Regular day'),
(2, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(2, '2026-05-24', '09:10:00', '18:15:00', 'PRESENT', 'On time');

-- Employee 3 (Amit) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(3, '2026-05-20', '09:30:00', '18:45:00', 'PRESENT', 'Slight delay'),
(3, '2026-05-21', '09:00:00', '18:00:00', 'PRESENT', 'Regular day'),
(3, '2026-05-22', NULL, NULL, 'ABSENT', 'Sick leave'),
(3, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(3, '2026-05-24', '09:00:00', '18:30:00', 'PRESENT', 'On time');

-- Employee 4 (Neha) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(4, '2026-05-20', '08:55:00', '18:25:00', 'PRESENT', 'Early arrival'),
(4, '2026-05-21', '09:00:00', '18:30:00', 'PRESENT', 'Regular day'),
(4, '2026-05-22', '09:05:00', '18:35:00', 'PRESENT', 'Regular day'),
(4, '2026-05-23', NULL, NULL, 'ON_LEAVE', 'Casual leave'),
(4, '2026-05-24', '09:00:00', '18:00:00', 'PRESENT', 'On time');

-- Employee 5 (Vikram) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(5, '2026-05-20', '09:00:00', '18:30:00', 'PRESENT', 'Regular day'),
(5, '2026-05-21', '09:10:00', '18:40:00', 'PRESENT', 'Regular day'),
(5, '2026-05-22', '09:00:00', '18:00:00', 'PRESENT', 'Regular day'),
(5, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(5, '2026-05-24', '09:00:00', '17:00:00', 'HALF_DAY', 'Client meeting half day');

-- Employee 6 (Anjali) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(6, '2026-05-20', '09:00:00', '18:30:00', 'PRESENT', 'On time'),
(6, '2026-05-21', '09:05:00', '18:25:00', 'PRESENT', 'Regular day'),
(6, '2026-05-22', '09:00:00', '18:00:00', 'PRESENT', 'Regular day'),
(6, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(6, '2026-05-24', '09:15:00', '18:45:00', 'PRESENT', 'Slight delay');

-- Employee 7 (Arjun) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(7, '2026-05-20', '09:00:00', '18:30:00', 'PRESENT', 'Regular day'),
(7, '2026-05-21', '09:00:00', '18:30:00', 'PRESENT', 'Regular day'),
(7, '2026-05-22', NULL, NULL, 'ABSENT', 'Sick leave'),
(7, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(7, '2026-05-24', '09:00:00', '18:00:00', 'PRESENT', 'On time');

-- Employee 8 (Deepika) - Attendance
INSERT IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, status, remarks) VALUES
(8, '2026-05-20', '09:00:00', '18:30:00', 'PRESENT', 'Regular day'),
(8, '2026-05-21', '09:05:00', '18:25:00', 'PRESENT', 'Regular day'),
(8, '2026-05-22', '09:00:00', '18:00:00', 'PRESENT', 'Regular day'),
(8, '2026-05-23', NULL, NULL, 'HOLIDAY', 'National holiday'),
(8, '2026-05-24', NULL, NULL, 'ON_LEAVE', 'Planned leave');

-- ============================================================
-- 4. INSERT LEAVE REQUESTS (10 records - various statuses & types)
-- ============================================================

INSERT IGNORE INTO leave_requests (employee_id, leave_type, from_date, to_date, reason, status, approved_by, approved_at, applied_at) VALUES

(2, 'CASUAL', '2026-05-25', '2026-05-26', 'Personal work', 'APPROVED', 'Rajesh Kumar', '2026-05-20 10:30:00', '2026-05-19 09:00:00'),

(3, 'SICK', '2026-05-22', '2026-05-22', 'Medical appointment', 'APPROVED', 'Rajesh Kumar', '2026-05-21 14:00:00', '2026-05-21 08:30:00'),

(4, 'CASUAL', '2026-05-23', '2026-05-23', 'Family obligation', 'APPROVED', 'Admin User', '2026-05-22 11:00:00', '2026-05-21 15:00:00'),

(6, 'CASUAL', '2026-06-02', '2026-06-05', 'Vacation planned', 'PENDING', NULL, NULL, '2026-05-20 10:00:00'),

(7, 'SICK', '2026-05-22', '2026-05-23', 'Health issue', 'APPROVED', 'Admin User', '2026-05-21 09:00:00', '2026-05-21 08:00:00'),

(1, 'ANNUAL', '2026-06-10', '2026-06-15', 'Summer vacation', 'PENDING', NULL, NULL, '2026-05-15 14:00:00'),

(5, 'CASUAL', '2026-06-01', '2026-06-01', 'Doctor visit', 'APPROVED', 'Admin User', '2026-05-20 16:30:00', '2026-05-19 11:00:00'),

(8, 'CASUAL', '2026-05-24', '2026-05-26', 'Family event', 'APPROVED', 'Rajesh Kumar', '2026-05-22 13:00:00', '2026-05-20 10:30:00'),

(2, 'ANNUAL', '2026-07-01', '2026-07-10', 'Summer vacation', 'PENDING', NULL, NULL, '2026-05-18 09:00:00'),

(4, 'MATERNITY', '2026-07-15', '2026-09-15', 'Maternity leave', 'APPROVED', 'Admin User', '2026-05-10 10:00:00', '2026-05-08 09:00:00');

-- ============================================================
-- 5. INSERT TASK ASSIGNMENTS (20 records - varying priorities & statuses)
-- ============================================================

INSERT IGNORE INTO task_assignments (title, description, assigned_to, assigned_by, due_date, status, priority, created_at, completed_at) VALUES

('API Development - User Authentication', 'Implement JWT-based authentication for REST APIs', 2, 'Rajesh Kumar', '2026-05-30', 'IN_PROGRESS', 'HIGH', '2026-05-10 09:00:00', NULL),

('Database Optimization', 'Optimize slow running queries in employee report generation', 3, 'Rajesh Kumar', '2026-05-25', 'IN_PROGRESS', 'CRITICAL', '2026-05-12 10:00:00', NULL),

('Bug Fix - Attendance Module', 'Fix attendance check-in/check-out time sync issue', 7, 'Rajesh Kumar', '2026-05-27', 'ASSIGNED', 'HIGH', '2026-05-20 11:00:00', NULL),

('Feature - Leave Balance Display', 'Add leave balance calculation and display on dashboard', 2, 'Rajesh Kumar', '2026-06-05', 'ASSIGNED', 'MEDIUM', '2026-05-15 14:00:00', NULL),

('Client Presentation - Q2 Results', 'Prepare presentation for Q2 performance metrics', 5, 'Admin User', '2026-05-28', 'IN_PROGRESS', 'HIGH', '2026-05-18 09:30:00', NULL),

('Training - New Employee Onboarding', 'Conduct orientation training for new joiners', 4, 'Admin User', '2026-05-29', 'ASSIGNED', 'MEDIUM', '2026-05-17 10:00:00', NULL),

('Code Review - Payroll Module', 'Review and approve payroll calculation code', 1, 'Rajesh Kumar', '2026-05-26', 'COMPLETED', 'HIGH', '2026-05-10 08:00:00', '2026-05-24 16:00:00'),

('Testing - Attendance System', 'Complete UAT for new attendance tracking system', 8, 'Admin User', '2026-05-31', 'ON_HOLD', 'MEDIUM', '2026-05-15 13:00:00', NULL),

('Deploy - Production Release v1.2', 'Deploy HRMS application to production', 1, 'Admin User', '2026-06-02', 'ASSIGNED', 'CRITICAL', '2026-05-12 11:00:00', NULL),

('Documentation - API Specification', 'Create comprehensive API documentation', 3, 'Rajesh Kumar', '2026-06-10', 'ASSIGNED', 'MEDIUM', '2026-05-20 09:00:00', NULL),

('Report Generation - Payroll Summary', 'Generate monthly payroll summary report for April 2026', 7, 'Admin User', '2026-05-26', 'COMPLETED', 'HIGH', '2026-05-10 14:00:00', '2026-05-24 11:30:00'),

('Security Audit - User Management', 'Conduct security audit of user authentication system', 3, 'Admin User', '2026-06-15', 'ASSIGNED', 'CRITICAL', '2026-05-13 10:00:00', NULL),

('Meeting - Project Planning', 'Attend project planning meeting for Q3 initiatives', 5, 'Admin User', '2026-05-24', 'COMPLETED', 'MEDIUM', '2026-05-20 08:00:00', '2026-05-24 17:00:00'),

('Email Notification System', 'Implement email notifications for leave approvals', 2, 'Rajesh Kumar', '2026-06-08', 'IN_PROGRESS', 'MEDIUM', '2026-05-18 15:00:00', NULL),

('Dashboard Widget - Employee Analytics', 'Create interactive dashboard widget for employee analytics', 3, 'Rajesh Kumar', '2026-06-12', 'ASSIGNED', 'HIGH', '2026-05-20 10:00:00', NULL),

('HR Policy Update - Work From Home', 'Prepare HR policy document for work from home', 4, 'Admin User', '2026-06-05', 'ASSIGNED', 'MEDIUM', '2026-05-19 09:00:00', NULL),

('Client Call - Support Follow-up', 'Follow-up call with client regarding support issues', 5, 'Admin User', '2026-05-25', 'IN_PROGRESS', 'HIGH', '2026-05-22 09:00:00', NULL),

('Mobile App UI Design', 'Design mobile-responsive UI for HRMS application', 6, 'Vikram Singh', '2026-06-20', 'ASSIGNED', 'MEDIUM', '2026-05-15 13:30:00', NULL),

('Database Backup Strategy', 'Implement automated backup strategy for MySQL database', 7, 'Admin User', '2026-05-29', 'ASSIGNED', 'CRITICAL', '2026-05-16 11:00:00', NULL),

('Team Retrospective - Sprint 5', 'Conduct retrospective meeting for sprint 5 completion', 1, 'Admin User', '2026-05-26', 'COMPLETED', 'MEDIUM', '2026-05-20 14:00:00', '2026-05-24 16:30:00');

-- ============================================================
-- 6. INSERT PAYROLL RECORDS (8 records - one per employee for May 2026)
-- Using realistic salary calculations with deductions
-- ============================================================

INSERT IGNORE INTO payroll (employee_id, pay_month, basic_salary, hra, da, other_allowance, gross_salary, pf_deduction, tax_deduction, other_deduction, total_deduction, net_salary, days_worked, payment_status, payment_date, created_at) VALUES

(1, '2026-05', 120000.00, 24000.00, 12000.00, 5000.00, 161000.00, 12000.00, 16100.00, 2000.00, 30100.00, 130900.00, 22, 'PAID', '2026-05-31', NOW()),

(2, '2026-05', 85000.00, 17000.00, 8500.00, 3000.00, 113500.00, 8500.00, 11350.00, 1500.00, 21350.00, 92150.00, 21, 'PAID', '2026-05-31', NOW()),

(3, '2026-05', 65000.00, 13000.00, 6500.00, 2000.00, 86500.00, 6500.00, 8650.00, 1000.00, 16150.00, 70350.00, 21, 'PAID', '2026-05-31', NOW()),

(4, '2026-05', 75000.00, 15000.00, 7500.00, 2500.00, 100000.00, 7500.00, 10000.00, 1500.00, 19000.00, 81000.00, 22, 'PAID', '2026-05-31', NOW()),

(5, '2026-05', 90000.00, 18000.00, 9000.00, 3500.00, 120500.00, 9000.00, 12050.00, 1800.00, 22850.00, 97650.00, 22, 'PENDING', NULL, NOW()),

(6, '2026-05', 50000.00, 10000.00, 5000.00, 1500.00, 66500.00, 5000.00, 6650.00, 800.00, 12450.00, 54050.00, 20, 'PAID', '2026-05-31', NOW()),

(7, '2026-05', 80000.00, 16000.00, 8000.00, 3000.00, 107000.00, 8000.00, 10700.00, 1500.00, 20200.00, 86800.00, 21, 'PENDING', NULL, NOW()),

(8, '2026-05', 60000.00, 12000.00, 6000.00, 2000.00, 80000.00, 6000.00, 8000.00, 1000.00, 15000.00, 65000.00, 20, 'ON_HOLD', NULL, NOW());

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

SELECT '✓ Sample Data Insertion Complete!' AS Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Employees FROM employees;
SELECT COUNT(*) as Total_Attendance FROM attendance;
SELECT COUNT(*) as Total_Leave_Requests FROM leave_requests;
SELECT COUNT(*) as Total_Tasks FROM task_assignments;
SELECT COUNT(*) as Total_Payroll FROM payroll;

-- ============================================================
-- Display inserted data for verification
-- ============================================================

SELECT '--- USERS ---' AS '';
SELECT id, username, email, role, is_active FROM users LIMIT 10;

SELECT '--- EMPLOYEES ---' AS '';
SELECT id, first_name, last_name, email, department, designation, salary, employment_status FROM employees LIMIT 10;

SELECT '--- RECENT ATTENDANCE ---' AS '';
SELECT a.id, e.first_name, e.last_name, a.attendance_date, a.check_in, a.check_out, a.status 
FROM attendance a 
JOIN employees e ON a.employee_id = e.id 
LIMIT 15;

SELECT '--- LEAVE REQUESTS ---' AS '';
SELECT l.id, e.first_name, e.last_name, l.leave_type, l.from_date, l.to_date, l.status 
FROM leave_requests l 
JOIN employees e ON l.employee_id = e.id 
LIMIT 10;

SELECT '--- TASKS ---' AS '';
SELECT t.id, t.title, e.first_name, e.last_name, t.status, t.priority, t.due_date 
FROM task_assignments t 
JOIN employees e ON t.assigned_to = e.id 
LIMIT 15;

SELECT '--- PAYROLL ---' AS '';
SELECT p.id, e.first_name, e.last_name, p.pay_month, p.gross_salary, p.net_salary, p.payment_status 
FROM payroll p 
JOIN employees e ON p.employee_id = e.id;

COMMIT;