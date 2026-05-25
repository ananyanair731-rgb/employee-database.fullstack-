package com.hrms.service;

import com.hrms.entity.Attendance;
import com.hrms.entity.Employee;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Attendance markAttendance(Long employeeId, Attendance attendance) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        // Check if already marked for today
        if (attendance.getAttendanceDate() == null) {
            attendance.setAttendanceDate(LocalDate.now());
        }

        attendanceRepository.findByEmployeeIdAndAttendanceDate(
                employeeId, attendance.getAttendanceDate())
                .ifPresent(a -> {
                    throw new RuntimeException("Attendance already marked for this date!");
                });

        attendance.setEmployee(employee);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date);
    }

    public List<Attendance> getAttendanceByEmployeeAndDateRange(Long employeeId,
                                                                 LocalDate from, LocalDate to) {
        return attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(employeeId, from, to);
    }

    public Attendance updateAttendance(Long id, Attendance updated) {
        Attendance existing = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found: " + id));
        existing.setStatus(updated.getStatus());
        existing.setCheckIn(updated.getCheckIn());
        existing.setCheckOut(updated.getCheckOut());
        existing.setRemarks(updated.getRemarks());
        return attendanceRepository.save(existing);
    }

    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record not found: " + id);
        }
        attendanceRepository.deleteById(id);
    }
}
