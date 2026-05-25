package com.hrms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "pay_month", nullable = false)
    private String payMonth;   // e.g., "2024-01"

    @Column(name = "basic_salary")
    private Double basicSalary;

    @Column(name = "hra")
    private Double hra = 0.0;  // House Rent Allowance

    @Column(name = "da")
    private Double da = 0.0;   // Dearness Allowance

    @Column(name = "other_allowance")
    private Double otherAllowance = 0.0;

    @Column(name = "gross_salary")
    private Double grossSalary;

    @Column(name = "pf_deduction")
    private Double pfDeduction = 0.0;  // Provident Fund

    @Column(name = "tax_deduction")
    private Double taxDeduction = 0.0;

    @Column(name = "other_deduction")
    private Double otherDeduction = 0.0;

    @Column(name = "total_deduction")
    private Double totalDeduction;

    @Column(name = "net_salary")
    private Double netSalary;

    @Column(name = "days_worked")
    private Integer daysWorked;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum PaymentStatus {
        PENDING, PAID, ON_HOLD
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateSalary();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateSalary();
    }

    private void calculateSalary() {
        double basic = basicSalary != null ? basicSalary : 0;
        double hraVal = hra != null ? hra : 0;
        double daVal = da != null ? da : 0;
        double otherAllow = otherAllowance != null ? otherAllowance : 0;

        grossSalary = basic + hraVal + daVal + otherAllow;

        double pf = pfDeduction != null ? pfDeduction : 0;
        double tax = taxDeduction != null ? taxDeduction : 0;
        double other = otherDeduction != null ? otherDeduction : 0;

        totalDeduction = pf + tax + other;
        netSalary = grossSalary - totalDeduction;
    }

    // Constructors
    public Payroll() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getPayMonth() { return payMonth; }
    public void setPayMonth(String payMonth) { this.payMonth = payMonth; }

    public Double getBasicSalary() { return basicSalary; }
    public void setBasicSalary(Double basicSalary) { this.basicSalary = basicSalary; }

    public Double getHra() { return hra; }
    public void setHra(Double hra) { this.hra = hra; }

    public Double getDa() { return da; }
    public void setDa(Double da) { this.da = da; }

    public Double getOtherAllowance() { return otherAllowance; }
    public void setOtherAllowance(Double otherAllowance) { this.otherAllowance = otherAllowance; }

    public Double getGrossSalary() { return grossSalary; }
    public void setGrossSalary(Double grossSalary) { this.grossSalary = grossSalary; }

    public Double getPfDeduction() { return pfDeduction; }
    public void setPfDeduction(Double pfDeduction) { this.pfDeduction = pfDeduction; }

    public Double getTaxDeduction() { return taxDeduction; }
    public void setTaxDeduction(Double taxDeduction) { this.taxDeduction = taxDeduction; }

    public Double getOtherDeduction() { return otherDeduction; }
    public void setOtherDeduction(Double otherDeduction) { this.otherDeduction = otherDeduction; }

    public Double getTotalDeduction() { return totalDeduction; }
    public void setTotalDeduction(Double totalDeduction) { this.totalDeduction = totalDeduction; }

    public Double getNetSalary() { return netSalary; }
    public void setNetSalary(Double netSalary) { this.netSalary = netSalary; }

    public Integer getDaysWorked() { return daysWorked; }
    public void setDaysWorked(Integer daysWorked) { this.daysWorked = daysWorked; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
