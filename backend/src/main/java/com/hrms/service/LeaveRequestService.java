package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.entity.LeaveRequest;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public LeaveRequest applyLeave(Long employeeId, LeaveRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
        request.setEmployee(employee);
        request.setStatus(LeaveRequest.LeaveStatus.PENDING);
        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getLeaveByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus(LeaveRequest.LeaveStatus.PENDING);
    }

    public LeaveRequest approveOrRejectLeave(Long leaveId, String status, String approvedBy) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));

        if (status.equalsIgnoreCase("APPROVED")) {
            leave.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        } else if (status.equalsIgnoreCase("REJECTED")) {
            leave.setStatus(LeaveRequest.LeaveStatus.REJECTED);
        } else {
            throw new RuntimeException("Invalid status. Use APPROVED or REJECTED");
        }
        leave.setApprovedBy(approvedBy);
        leave.setApprovedAt(LocalDateTime.now());
        return leaveRequestRepository.save(leave);
    }

    public void cancelLeave(Long leaveId) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));
        leave.setStatus(LeaveRequest.LeaveStatus.CANCELLED);
        leaveRequestRepository.save(leave);
    }
}
