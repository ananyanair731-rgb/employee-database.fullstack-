package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.entity.Payroll;
import com.hrms.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    /**
     * POST /api/payroll/employee/{employeeId}/generate
     * Generate payroll for an employee
     */
    @PostMapping("/employee/{employeeId}/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> generatePayroll(@PathVariable Long employeeId,
                                              @RequestBody Payroll payroll) {
        Payroll created = payrollService.generatePayroll(employeeId, payroll);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Payroll generated successfully!", created));
    }

    /**
     * GET /api/payroll/all
     * Get all payroll records
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> getAllPayrolls() {
        List<Payroll> payrolls = payrollService.getAllPayrolls();
        return ResponseEntity.ok(new ApiResponse(true, "Payroll records found", payrolls));
    }

    /**
     * GET /api/payroll/employee/{employeeId}
     * Get payroll for a specific employee
     */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<?> getPayrollByEmployee(@PathVariable Long employeeId) {
        List<Payroll> payrolls = payrollService.getPayrollByEmployee(employeeId);
        return ResponseEntity.ok(new ApiResponse(true, "Payroll records found", payrolls));
    }

    /**
     * GET /api/payroll/month/{payMonth}
     * Get payroll by month (format: 2024-01)
     */
    @GetMapping("/month/{payMonth}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> getPayrollByMonth(@PathVariable String payMonth) {
        List<Payroll> payrolls = payrollService.getPayrollByMonth(payMonth);
        return ResponseEntity.ok(new ApiResponse(true, "Payroll for " + payMonth, payrolls));
    }

    /**
     * GET /api/payroll/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> getPayrollById(@PathVariable Long id) {
        Payroll payroll = payrollService.getPayrollById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Payroll record", payroll));
    }

    /**
     * PUT /api/payroll/{id}/mark-paid
     * Mark payroll as paid
     */
    @PutMapping("/{id}/mark-paid")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> markAsPaid(@PathVariable Long id) {
        Payroll payroll = payrollService.markAsPaid(id);
        return ResponseEntity.ok(new ApiResponse(true, "Payroll marked as PAID!", payroll));
    }

    /**
     * PUT /api/payroll/{id}
     * Update payroll record
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll) {
        Payroll updated = payrollService.updatePayroll(id, payroll);
        return ResponseEntity.ok(new ApiResponse(true, "Payroll updated!", updated));
    }
}
