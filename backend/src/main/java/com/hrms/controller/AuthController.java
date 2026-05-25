package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.dto.JwtResponse;
import com.hrms.dto.LoginRequest;
import com.hrms.dto.SignupRequest;
import com.hrms.entity.User;
import com.hrms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/signup
     * Register a new user
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        User user = authService.registerUser(request);
        return ResponseEntity.ok(new ApiResponse(true,
                "User registered successfully! Username: " + user.getUsername(),
                user.getUsername()));
    }

    /**
     * POST /api/auth/login
     * Login and get JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwtResponse = authService.loginUser(request);
        return ResponseEntity.ok(jwtResponse);
    }
}
