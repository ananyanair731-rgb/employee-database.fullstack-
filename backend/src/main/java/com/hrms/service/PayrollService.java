package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.entity.Payroll;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Payroll generatePayroll(Long employeeId, Payroll payroll) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        // Check if payroll already exists for this month
        payrollRepository.findByEmployeeIdAndPayMonth(employeeId, payroll.getPayMonth())
                .ifPresent(p -> {
                    throw new RuntimeException("Payroll already generated for " + payroll.getPayMonth());
                });

        payroll.setEmployee(employee);
        if (payroll.getBasicSalary() == null) {
            payroll.setBasicSalary(employee.getSalary() != null ? employee.getSalary() : 0.0);
        }
        return payrollRepository.save(payroll);
    }

    public List<Payroll> getPayrollByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    public List<Payroll> getPayrollByMonth(String payMonth) {
        return payrollRepository.findByPayMonth(payMonth);
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found: " + id));
    }

    public Payroll markAsPaid(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found: " + payrollId));
        payroll.setPaymentStatus(Payroll.PaymentStatus.PAID);
        payroll.setPaymentDate(LocalDate.now());
        return payrollRepository.save(payroll);
    }

    public Payroll updatePayroll(Long id, Payroll updated) {
        Payroll existing = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found: " + id));
        existing.setBasicSalary(updated.getBasicSalary());
        existing.setHra(updated.getHra());
        existing.setDa(updated.getDa());
        existing.setOtherAllowance(updated.getOtherAllowance());
        existing.setPfDeduction(updated.getPfDeduction());
        existing.setTaxDeduction(updated.getTaxDeduction());
        existing.setOtherDeduction(updated.getOtherDeduction());
        existing.setDaysWorked(updated.getDaysWorked());
        return payrollRepository.save(existing);
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }
}
