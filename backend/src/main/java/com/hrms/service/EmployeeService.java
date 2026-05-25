package com.hrms.service;

import com.hrms.dto.EmployeeDTO;
import com.hrms.dto.SignupRequest;
import com.hrms.entity.Employee;
import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---- ADD EMPLOYEE (with login account) ----
    @Transactional
    public EmployeeDTO addEmployee(EmployeeDTO dto) {
        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new RuntimeException("Username is required to create employee login.");
        }
        if (dto.getPassword() == null || dto.getPassword().length() < 6) {
            throw new RuntimeException("Password is required (minimum 6 characters).");
        }
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Employee with email " + dto.getEmail() + " already exists!");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username " + dto.getUsername() + " is already taken!");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email " + dto.getEmail() + " is already registered!");
        }

        Role userRole = resolveAccountRole(dto.getAccountRole());
        User user = new User(
                dto.getUsername().trim(),
                dto.getEmail().trim(),
                passwordEncoder.encode(dto.getPassword()),
                userRole
        );
        user = userRepository.save(user);

        Employee employee = dto.toEntity();
        if (employee.getEmployeeCode() == null || employee.getEmployeeCode().isEmpty()) {
            employee.setEmployeeCode(generateEmployeeCode());
        }
        employee.setUser(user);
        Employee saved = employeeRepository.save(employee);
        return EmployeeDTO.fromEntity(saved);
    }

    // ---- CREATE EMPLOYEE PROFILE ON SELF-SIGNUP ----
    @Transactional
    public Employee createEmployeeForSignup(User user, SignupRequest request) {
        validateEmployeeSignupFields(request);

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An employee profile with this email already exists!");
        }
        if (employeeRepository.existsByUserId(user.getId())) {
            throw new RuntimeException("Employee profile already linked to this account!");
        }

        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(request.getLastName().trim());
        employee.setEmail(request.getEmail().trim());
        employee.setPhone(request.getPhone().trim());
        employee.setDepartment(request.getDepartment().trim());
        employee.setDesignation(request.getDesignation().trim());
        employee.setEmployeeCode(generateEmployeeCode());
        employee.setUser(user);
        return employeeRepository.save(employee);
    }

    // ---- LIST EMPLOYEES (role-filtered) ----
    public List<EmployeeDTO> getEmployeesForCurrentUser() {
        User current = getCurrentUser();
        Role role = current.getRole();

        if (role == Role.ADMIN || role == Role.HR) {
            return getAllEmployees();
        }
        if (role == Role.MANAGER) {
            return employeeRepository.findByManagerNameIgnoreCase(current.getUsername())
                    .stream()
                    .map(EmployeeDTO::fromEntity)
                    .collect(Collectors.toList());
        }
        if (role == Role.EMPLOYEE) {
            Employee own = getEmployeeEntityByUserId(current.getId());
            return Collections.singletonList(EmployeeDTO.fromEntity(own));
        }
        throw new AccessDeniedException("Access denied");
    }

    public EmployeeDTO getMyProfile() {
        User current = getCurrentUser();
        Employee employee = getEmployeeEntityByUserId(current.getId());
        return EmployeeDTO.fromEntity(employee);
    }

    @Transactional
    public EmployeeDTO updateMyProfile(EmployeeDTO dto) {
        User current = getCurrentUser();
        if (current.getRole() != Role.EMPLOYEE) {
            throw new AccessDeniedException("Use employee update endpoint for staff records.");
        }
        Employee existing = getEmployeeEntityByUserId(current.getId());
        if (dto.getPhone() != null) existing.setPhone(dto.getPhone());
        if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
        if (dto.getGender() != null) existing.setGender(dto.getGender());
        Employee updated = employeeRepository.save(existing);
        return EmployeeDTO.fromEntity(updated);
    }

    private Role resolveAccountRole(String accountRole) {
        Role userRole = Role.EMPLOYEE;
        if (accountRole != null && !accountRole.isBlank()) {
            try {
                userRole = Role.valueOf(accountRole.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid account role. Use: ADMIN, HR, MANAGER, EMPLOYEE");
            }
            User current = getCurrentUser();
            if (userRole != Role.EMPLOYEE && current.getRole() != Role.ADMIN) {
                throw new RuntimeException("Only Admin can assign Admin, HR, or Manager roles.");
            }
        }
        return userRole;
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(EmployeeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        assertCanAccessEmployee(employee);
        return EmployeeDTO.fromEntity(employee);
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (!existing.getEmail().equals(dto.getEmail())
                && employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email " + dto.getEmail() + " is already in use!");
        }

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setDepartment(dto.getDepartment());
        existing.setDesignation(dto.getDesignation());
        existing.setDateOfJoining(dto.getDateOfJoining());
        existing.setDateOfBirth(dto.getDateOfBirth());
        existing.setSalary(dto.getSalary());
        existing.setAddress(dto.getAddress());
        existing.setGender(dto.getGender());
        existing.setManagerName(dto.getManagerName());
        if (dto.getEmployeeCode() != null) existing.setEmployeeCode(dto.getEmployeeCode());
        if (dto.getEmploymentStatus() != null) existing.setEmploymentStatus(dto.getEmploymentStatus());

        if (existing.getUser() != null) {
            User linkedUser = existing.getUser();
            linkedUser.setEmail(dto.getEmail());
            userRepository.save(linkedUser);
        }

        Employee updated = employeeRepository.save(existing);
        return EmployeeDTO.fromEntity(updated);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        User linkedUser = employee.getUser();
        employeeRepository.delete(employee);
        if (linkedUser != null) {
            userRepository.delete(linkedUser);
        }
    }

    public List<EmployeeDTO> searchEmployees(String keyword) {
        List<Employee> results = employeeRepository.searchEmployees(keyword);
        User current = getCurrentUser();
        if (current.getRole() == Role.MANAGER) {
            results = results.stream()
                    .filter(e -> current.getUsername().equalsIgnoreCase(e.getManagerName()))
                    .collect(Collectors.toList());
        } else if (current.getRole() == Role.EMPLOYEE) {
            results = results.stream()
                    .filter(e -> e.getUser() != null && e.getUser().getId().equals(current.getId()))
                    .collect(Collectors.toList());
        }
        return results.stream().map(EmployeeDTO::fromEntity).collect(Collectors.toList());
    }

    public List<EmployeeDTO> getEmployeesByDepartment(String department) {
        List<Employee> results = employeeRepository.findByDepartment(department);
        User current = getCurrentUser();
        if (current.getRole() == Role.MANAGER) {
            results = results.stream()
                    .filter(e -> current.getUsername().equalsIgnoreCase(e.getManagerName()))
                    .collect(Collectors.toList());
        }
        return results.stream().map(EmployeeDTO::fromEntity).collect(Collectors.toList());
    }

    public Long findEmployeeIdByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .map(Employee::getId)
                .orElse(null);
    }

    private Employee getEmployeeEntityByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee profile linked to your account. Contact HR/Admin."));
    }

    private void assertCanAccessEmployee(Employee employee) {
        User current = getCurrentUser();
        Role role = current.getRole();

        if (role == Role.ADMIN || role == Role.HR) {
            return;
        }
        if (role == Role.EMPLOYEE) {
            if (employee.getUser() == null || !employee.getUser().getId().equals(current.getId())) {
                throw new AccessDeniedException("You can only view your own employee profile.");
            }
            return;
        }
        if (role == Role.MANAGER) {
            if (employee.getManagerName() == null
                    || !current.getUsername().equalsIgnoreCase(employee.getManagerName())) {
                throw new AccessDeniedException("You can only view employees assigned to you.");
            }
            return;
        }
        throw new AccessDeniedException("Access denied");
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Not authenticated");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateEmployeeSignupFields(SignupRequest request) {
        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new RuntimeException("First name is required for employee registration.");
        }
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new RuntimeException("Last name is required for employee registration.");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new RuntimeException("Phone is required for employee registration.");
        }
        if (request.getDepartment() == null || request.getDepartment().isBlank()) {
            throw new RuntimeException("Department is required for employee registration.");
        }
        if (request.getDesignation() == null || request.getDesignation().isBlank()) {
            throw new RuntimeException("Designation is required for employee registration.");
        }
    }

    private String generateEmployeeCode() {
        long count = employeeRepository.count() + 1;
        return String.format("EMP%04d", count);
    }
}
