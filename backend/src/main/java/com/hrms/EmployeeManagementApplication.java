package com.hrms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EmployeeManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementApplication.class, args);
        System.out.println("==============================================");
        System.out.println("  HRMS Application Started Successfully!");
        System.out.println("  API Base URL: http://localhost:8080/api");
        System.out.println("==============================================");
    }
}
