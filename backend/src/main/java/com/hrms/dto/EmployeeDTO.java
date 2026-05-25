package com.hrms.dto;

import com.hrms.entity.Employee;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class EmployeeDTO {

    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private LocalDate dateOfJoining;
    private LocalDate dateOfBirth;

    @DecimalMin(value = "0.0")
    private Double salary;

    private String address;
    private String gender;
    private String employeeCode;
    private String managerName;
    private Employee.EmploymentStatus employmentStatus;

    /** Login account (required when Admin/HR creates employee) */
    private String username;
    private String password;
    private Long userId;
    /** System role for login: ADMIN, HR, MANAGER, EMPLOYEE (Admin only for non-EMPLOYEE) */
    private String accountRole;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public LocalDate getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(LocalDate dateOfJoining) { this.dateOfJoining = dateOfJoining; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public Employee.EmploymentStatus getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(Employee.EmploymentStatus employmentStatus) {
        this.employmentStatus = employmentStatus;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAccountRole() { return accountRole; }
    public void setAccountRole(String accountRole) { this.accountRole = accountRole; }

    // Convert Entity -> DTO
    public static EmployeeDTO fromEntity(Employee emp) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(emp.getId());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getEmail());
        dto.setPhone(emp.getPhone());
        dto.setDepartment(emp.getDepartment());
        dto.setDesignation(emp.getDesignation());
        dto.setDateOfJoining(emp.getDateOfJoining());
        dto.setDateOfBirth(emp.getDateOfBirth());
        dto.setSalary(emp.getSalary());
        dto.setAddress(emp.getAddress());
        dto.setGender(emp.getGender());
        dto.setEmployeeCode(emp.getEmployeeCode());
        dto.setManagerName(emp.getManagerName());
        dto.setEmploymentStatus(emp.getEmploymentStatus());
        if (emp.getUser() != null) {
            dto.setUserId(emp.getUser().getId());
            dto.setUsername(emp.getUser().getUsername());
            dto.setAccountRole(emp.getUser().getRole().name());
        }
        return dto;
    }

    // Convert DTO -> Entity
    public Employee toEntity() {
        Employee emp = new Employee();
        emp.setFirstName(this.firstName);
        emp.setLastName(this.lastName);
        emp.setEmail(this.email);
        emp.setPhone(this.phone);
        emp.setDepartment(this.department);
        emp.setDesignation(this.designation);
        emp.setDateOfJoining(this.dateOfJoining);
        emp.setDateOfBirth(this.dateOfBirth);
        emp.setSalary(this.salary);
        emp.setAddress(this.address);
        emp.setGender(this.gender);
        emp.setEmployeeCode(this.employeeCode);
        emp.setManagerName(this.managerName);
        if (this.employmentStatus != null) emp.setEmploymentStatus(this.employmentStatus);
        return emp;
    }
}
