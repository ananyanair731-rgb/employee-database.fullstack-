package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.entity.LeaveRequest;
import com.hrms.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    /**
     * POST /api/leave/employee/{employeeId}/apply
     * Apply for leave
     */
    @PostMapping("/employee/{employeeId}/apply")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> applyLeave(@PathVariable Long employeeId,
                                         @RequestBody LeaveRequest request) {
        LeaveRequest leave = leaveRequestService.applyLeave(employeeId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Leave request submitted successfully!", leave));
    }

    /**
     * GET /api/leave/all
     * Get all leave requests — HR and ADMIN only
     */
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> getAllLeaveRequests() {
        List<LeaveRequest> requests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(new ApiResponse(true, "Leave requests found", requests));
    }

    /**
     * GET /api/leave/employee/{employeeId}
     * Get leave requests for a specific employee
     */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getLeaveByEmployee(@PathVariable Long employeeId) {
        List<LeaveRequest> requests = leaveRequestService.getLeaveByEmployee(employeeId);
        return ResponseEntity.ok(new ApiResponse(true, "Leave requests found", requests));
    }

    /**
     * GET /api/leave/pending
     * Get all pending leave requests
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> getPendingRequests() {
        List<LeaveRequest> requests = leaveRequestService.getPendingRequests();
        return ResponseEntity.ok(new ApiResponse(true, "Pending requests", requests));
    }

    /**
     * PUT /api/leave/{leaveId}/action
     * Approve or reject a leave — HR and ADMIN only
     * Body: { "status": "APPROVED", "approvedBy": "admin" }
     */
    @PutMapping("/{leaveId}/action")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> approveOrReject(@PathVariable Long leaveId,
                                              @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String approvedBy = body.getOrDefault("approvedBy", "HR");
        LeaveRequest updated = leaveRequestService.approveOrRejectLeave(leaveId, status, approvedBy);
        return ResponseEntity.ok(new ApiResponse(true, "Leave request " + status, updated));
    }

    /**
     * PUT /api/leave/{leaveId}/cancel
     * Cancel a leave request
     */
    @PutMapping("/{leaveId}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<?> cancelLeave(@PathVariable Long leaveId) {
        leaveRequestService.cancelLeave(leaveId);
        return ResponseEntity.ok(new ApiResponse(true, "Leave request cancelled"));
    }
}
