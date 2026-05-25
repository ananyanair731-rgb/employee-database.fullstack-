# HRMS Employee Management System
## Complete Setup Guide + Postman API Reference

---

## PROJECT STRUCTURE

```
employee-management/
├── pom.xml
└── src/
    └── main/
        ├── java/com/hrms/
        │   ├── EmployeeManagementApplication.java   ← Main class
        │   ├── config/
        │   │   ├── SecurityConfig.java              ← Spring Security
        │   │   ├── JwtUtils.java                    ← JWT helper
        │   │   ├── JwtAuthenticationFilter.java     ← JWT filter
        │   │   └── AuthEntryPoint.java              ← 401 handler
        │   ├── controller/
        │   │   ├── AuthController.java              ← /api/auth
        │   │   ├── EmployeeController.java          ← /api/employees
        │   │   ├── AttendanceController.java        ← /api/attendance
        │   │   ├── LeaveRequestController.java      ← /api/leave
        │   │   ├── TaskAssignmentController.java    ← /api/tasks
        │   │   └── PayrollController.java           ← /api/payroll
        │   ├── dto/
        │   │   ├── SignupRequest.java
        │   │   ├── LoginRequest.java
        │   │   ├── JwtResponse.java
        │   │   ├── ApiResponse.java
        │   │   └── EmployeeDTO.java
        │   ├── entity/
        │   │   ├── User.java
        │   │   ├── Employee.java
        │   │   ├── Attendance.java
        │   │   ├── LeaveRequest.java
        │   │   ├── TaskAssignment.java
        │   │   ├── Payroll.java
        │   │   └── Role.java
        │   ├── exception/
        │   │   ├── ResourceNotFoundException.java
        │   │   └── GlobalExceptionHandler.java
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   ├── EmployeeRepository.java
        │   │   ├── AttendanceRepository.java
        │   │   ├── LeaveRequestRepository.java
        │   │   ├── TaskAssignmentRepository.java
        │   │   └── PayrollRepository.java
        │   └── service/
        │       ├── AuthService.java
        │       ├── UserDetailsServiceImpl.java
        │       ├── EmployeeService.java
        │       ├── AttendanceService.java
        │       ├── LeaveRequestService.java
        │       ├── TaskAssignmentService.java
        │       └── PayrollService.java
        └── resources/
            ├── application.properties
            └── db_setup.sql
```

---

## STEP 1: START MYSQL

### Option A — MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local server
3. Open a new query tab
4. Paste and run: `CREATE DATABASE IF NOT EXISTS hrms_db;`

### Option B — Command Line
```bash
mysql -u root -p
# Enter password when prompted
CREATE DATABASE IF NOT EXISTS hrms_db;
exit;
```

### Then run the SQL setup script:
```sql
-- Open db_setup.sql in MySQL Workbench and execute it
-- OR run from CLI:
mysql -u root -p hrms_db < src/main/resources/db_setup.sql
```

---

## STEP 2: CONFIGURE DATABASE PASSWORD

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```
Replace `root` with your actual MySQL root password.

---

## STEP 3: IMPORT INTO ECLIPSE

1. Open Eclipse IDE
2. Go to: **File → Import → Maven → Existing Maven Projects**
3. Click **Browse**, navigate to the `employee-management` folder
4. Check the `pom.xml` checkbox → Click **Finish**
5. Wait for Maven to download dependencies (first time takes a few minutes)
6. Right-click on project → **Maven → Update Project** → OK

---

## STEP 4: RUN THE APPLICATION

1. In Eclipse, open `EmployeeManagementApplication.java`
2. Right-click → **Run As → Java Application**
3. Watch console — you should see:
```
==============================================
  HRMS Application Started Successfully!
  API Base URL: http://localhost:8080/api
==============================================
```

---

## STEP 5: TEST WITH POSTMAN

### IMPORTANT: Set this in every secured request
```
Header: Authorization
Value:  Bearer <your_token_here>
```
Content-Type header: `application/json`

---

## API REFERENCE & POSTMAN JSON

### BASE URL: http://localhost:8080/api

---

### 1. AUTH ENDPOINTS (No token needed)

#### 1.1 SIGNUP
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json
```
**Body:**
```json
{
  "username": "admin",
  "email": "admin@company.com",
  "password": "admin123",
  "role": "ADMIN"
}
```
**Roles available:** ADMIN, HR, MANAGER, EMPLOYEE

---

#### 1.2 LOGIN
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json
```
**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@company.com",
  "role": "ROLE_ADMIN"
}
```
**→ Copy the "token" value. Use it in all following requests.**

---

### 2. EMPLOYEE ENDPOINTS (Token required)

#### 2.1 ADD EMPLOYEE
```
POST http://localhost:8080/api/employees
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "dateOfJoining": "2024-01-15",
  "dateOfBirth": "1995-06-20",
  "salary": 75000.00,
  "gender": "Male",
  "address": "123 Main Street, New York",
  "managerName": "Jane Smith",
  "employeeCode": "EMP001"
}
```

---

#### 2.2 GET ALL EMPLOYEES
```
GET http://localhost:8080/api/employees
Authorization: Bearer <token>
```

---

#### 2.3 GET EMPLOYEE BY ID
```
GET http://localhost:8080/api/employees/1
Authorization: Bearer <token>
```

---

#### 2.4 UPDATE EMPLOYEE
```
PUT http://localhost:8080/api/employees/1
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "salary": 90000.00,
  "managerName": "Jane Smith",
  "employmentStatus": "ACTIVE"
}
```

---

#### 2.5 DELETE EMPLOYEE
```
DELETE http://localhost:8080/api/employees/1
Authorization: Bearer <token>
```
*(Requires ADMIN role)*

---

#### 2.6 SEARCH EMPLOYEES
```
GET http://localhost:8080/api/employees/search?keyword=john
Authorization: Bearer <token>
```

---

#### 2.7 GET BY DEPARTMENT
```
GET http://localhost:8080/api/employees/department/Engineering
Authorization: Bearer <token>
```

---

### 3. ATTENDANCE ENDPOINTS

#### 3.1 MARK ATTENDANCE
```
POST http://localhost:8080/api/attendance/employee/1
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "attendanceDate": "2024-01-20",
  "checkIn": "09:00:00",
  "checkOut": "18:00:00",
  "status": "PRESENT",
  "remarks": "On time"
}
```
**Status values:** PRESENT, ABSENT, HALF_DAY, ON_LEAVE, HOLIDAY

---

#### 3.2 GET ATTENDANCE BY EMPLOYEE
```
GET http://localhost:8080/api/attendance/employee/1
Authorization: Bearer <token>
```

---

#### 3.3 GET ATTENDANCE BY DATE
```
GET http://localhost:8080/api/attendance/date/2024-01-20
Authorization: Bearer <token>
```

---

#### 3.4 GET ATTENDANCE BY DATE RANGE
```
GET http://localhost:8080/api/attendance/employee/1/range?from=2024-01-01&to=2024-01-31
Authorization: Bearer <token>
```

---

#### 3.5 UPDATE ATTENDANCE
```
PUT http://localhost:8080/api/attendance/1
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "checkIn": "09:30:00",
  "checkOut": "18:30:00",
  "status": "PRESENT",
  "remarks": "Slightly late"
}
```

---

### 4. LEAVE REQUEST ENDPOINTS

#### 4.1 APPLY FOR LEAVE
```
POST http://localhost:8080/api/leave/employee/1/apply
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "leaveType": "SICK",
  "fromDate": "2024-01-25",
  "toDate": "2024-01-26",
  "reason": "Fever and flu"
}
```
**Leave types:** CASUAL, SICK, ANNUAL, MATERNITY, PATERNITY, UNPAID

---

#### 4.2 GET ALL LEAVE REQUESTS
```
GET http://localhost:8080/api/leave/all
Authorization: Bearer <token>
```

---

#### 4.3 GET LEAVE BY EMPLOYEE
```
GET http://localhost:8080/api/leave/employee/1
Authorization: Bearer <token>
```

---

#### 4.4 GET PENDING REQUESTS
```
GET http://localhost:8080/api/leave/pending
Authorization: Bearer <token>
```

---

#### 4.5 APPROVE / REJECT LEAVE
```
PUT http://localhost:8080/api/leave/1/action
Authorization: Bearer <token>
Content-Type: application/json
```
**Body (Approve):**
```json
{
  "status": "APPROVED",
  "approvedBy": "admin"
}
```
**Body (Reject):**
```json
{
  "status": "REJECTED",
  "approvedBy": "hrmanager"
}
```

---

#### 4.6 CANCEL LEAVE
```
PUT http://localhost:8080/api/leave/1/cancel
Authorization: Bearer <token>
```

---

### 5. TASK ASSIGNMENT ENDPOINTS

#### 5.1 ASSIGN A TASK
```
POST http://localhost:8080/api/tasks/employee/1/assign
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "title": "Fix login bug",
  "description": "The JWT token is not refreshing properly. Investigate and fix.",
  "assignedBy": "manager@company.com",
  "dueDate": "2024-01-30",
  "priority": "HIGH"
}
```
**Priority values:** LOW, MEDIUM, HIGH, CRITICAL

---

#### 5.2 GET ALL TASKS
```
GET http://localhost:8080/api/tasks
Authorization: Bearer <token>
```

---

#### 5.3 GET TASKS BY EMPLOYEE
```
GET http://localhost:8080/api/tasks/employee/1
Authorization: Bearer <token>
```

---

#### 5.4 UPDATE TASK STATUS
```
PUT http://localhost:8080/api/tasks/1/status
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "status": "IN_PROGRESS"
}
```
**Status values:** ASSIGNED, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED

---

### 6. PAYROLL ENDPOINTS (ADMIN/HR only)

#### 6.1 GENERATE PAYROLL
```
POST http://localhost:8080/api/payroll/employee/1/generate
Authorization: Bearer <token>
Content-Type: application/json
```
**Body:**
```json
{
  "payMonth": "2024-01",
  "basicSalary": 50000.00,
  "hra": 10000.00,
  "da": 5000.00,
  "otherAllowance": 3000.00,
  "pfDeduction": 6000.00,
  "taxDeduction": 8000.00,
  "otherDeduction": 0.00,
  "daysWorked": 26
}
```
*(Net salary is auto-calculated: grossSalary - totalDeductions)*

---

#### 6.2 GET PAYROLL BY EMPLOYEE
```
GET http://localhost:8080/api/payroll/employee/1
Authorization: Bearer <token>
```

---

#### 6.3 GET PAYROLL BY MONTH
```
GET http://localhost:8080/api/payroll/month/2024-01
Authorization: Bearer <token>
```

---

#### 6.4 MARK PAYROLL AS PAID
```
PUT http://localhost:8080/api/payroll/1/mark-paid
Authorization: Bearer <token>
```

---

## ROLE PERMISSIONS SUMMARY

| Endpoint             | ADMIN | HR  | MANAGER | EMPLOYEE |
|----------------------|-------|-----|---------|----------|
| Signup/Login         | ✅    | ✅  | ✅      | ✅       |
| Add Employee         | ✅    | ✅  | ❌      | ❌       |
| View Employees       | ✅    | ✅  | ✅      | ❌       |
| Update Employee      | ✅    | ✅  | ❌      | ❌       |
| Delete Employee      | ✅    | ❌  | ❌      | ❌       |
| Mark Attendance      | ✅    | ✅  | ✅      | ❌       |
| View Own Attendance  | ✅    | ✅  | ✅      | ✅       |
| Apply Leave          | ✅    | ✅  | ✅      | ✅       |
| Approve Leave        | ✅    | ✅  | ✅      | ❌       |
| Assign Task          | ✅    | ✅  | ✅      | ❌       |
| Update Task Status   | ✅    | ✅  | ✅      | ✅       |
| Payroll Generate     | ✅    | ✅  | ❌      | ❌       |
| View Own Payroll     | ✅    | ✅  | ❌      | ✅       |

---

## COMMON ERRORS & FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Missing/expired token | Login again, copy new token |
| 403 Forbidden | Wrong role for action | Use correct role account |
| 400 Username taken | Username already exists | Use different username |
| Connection refused | MySQL not running | Start MySQL service |
| Table not found | DB not created | Run db_setup.sql |
| Dependencies fail | Java version mismatch | Use Java 17+ |

---

## QUICK TEST WORKFLOW IN POSTMAN

1. **POST** `/api/auth/signup` → Create admin user
2. **POST** `/api/auth/login` → Get JWT token
3. Copy token → Set as `Authorization: Bearer <token>` header
4. **POST** `/api/employees` → Add employee (note ID in response)
5. **GET** `/api/employees` → View all employees
6. **GET** `/api/employees/1` → View employee by ID
7. **PUT** `/api/employees/1` → Update employee
8. **POST** `/api/attendance/employee/1` → Mark attendance
9. **POST** `/api/leave/employee/1/apply` → Apply leave
10. **POST** `/api/tasks/employee/1/assign` → Assign task
11. **POST** `/api/payroll/employee/1/generate` → Generate payroll
12. **DELETE** `/api/employees/1` → Delete employee (admin only)
