package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.EmployeeDTO;
import com.hrms.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    /**
     * POST /api/employees
     * Add new employee + login account — ADMIN, HR only
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> addEmployee(@Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO created = employeeService.addEmployee(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true,
                        "Employee and login account created successfully!", created));
    }

    /**
     * GET /api/employees/me
     * Current user's linked employee profile
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getMyProfile() {
        EmployeeDTO employee = employeeService.getMyProfile();
        return ResponseEntity.ok(new ApiResponse(true, "Your employee profile", employee));
    }

    /**
     * PUT /api/employees/me
     * Employee self-service: update limited personal fields only
     */
    @PutMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> updateMyProfile(@RequestBody EmployeeDTO dto) {
        EmployeeDTO updated = employeeService.updateMyProfile(dto);
        return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully!", updated));
    }

    /**
     * GET /api/employees
     * Role-filtered employee list
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getEmployeesForCurrentUser();
        return ResponseEntity.ok(new ApiResponse(true,
                "Found " + employees.size() + " employees", employees));
    }

    /**
     * GET /api/employees/{id}
     * Get employee by ID (access-checked)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Employee found", employee));
    }

    /**
     * PUT /api/employees/{id}
     * Update employee — ADMIN, HR only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id,
                                             @Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(new ApiResponse(true, "Employee updated successfully!", updated));
    }

    /**
     * DELETE /api/employees/{id}
     * Delete employee + linked user — ADMIN only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(new ApiResponse(true, "Employee and login account deleted successfully!"));
    }

    /**
     * GET /api/employees/search?keyword=xyz
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> searchEmployees(@RequestParam String keyword) {
        List<EmployeeDTO> results = employeeService.searchEmployees(keyword);
        return ResponseEntity.ok(new ApiResponse(true,
                "Found " + results.size() + " results", results));
    }

    /**
     * GET /api/employees/department/{dept}
     */
    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> getByDepartment(@PathVariable String department) {
        List<EmployeeDTO> results = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(new ApiResponse(true,
                "Found " + results.size() + " employees in " + department, results));
    }
}
