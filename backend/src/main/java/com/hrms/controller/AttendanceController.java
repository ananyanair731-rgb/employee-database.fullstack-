package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.entity.Attendance;
import com.hrms.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    /**
     * POST /api/attendance/employee/{employeeId}
     * Mark attendance for an employee
     */
    @PostMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> markAttendance(@PathVariable Long employeeId,
                                             @RequestBody Attendance attendance) {
        Attendance marked = attendanceService.markAttendance(employeeId, attendance);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Attendance marked successfully!", marked));
    }

    /**
     * GET /api/attendance/employee/{employeeId}
     * Get all attendance records for an employee
     */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getAttendanceByEmployee(@PathVariable Long employeeId) {
        List<Attendance> records = attendanceService.getAttendanceByEmployee(employeeId);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance records found", records));
    }

    /**
     * GET /api/attendance/date/{date}
     * Get attendance for a specific date (format: yyyy-MM-dd)
     */
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> records = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance for " + date, records));
    }

    /**
     * GET /api/attendance/employee/{employeeId}/range?from=yyyy-MM-dd&to=yyyy-MM-dd
     */
    @GetMapping("/employee/{employeeId}/range")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getAttendanceByRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<Attendance> records = attendanceService.getAttendanceByEmployeeAndDateRange(employeeId, from, to);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance records found", records));
    }

    /**
     * PUT /api/attendance/{id}
     * Update attendance record
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id,
                                               @RequestBody Attendance attendance) {
        Attendance updated = attendanceService.updateAttendance(id, attendance);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance updated!", updated));
    }

    /**
     * DELETE /api/attendance/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance record deleted!"));
    }
}
