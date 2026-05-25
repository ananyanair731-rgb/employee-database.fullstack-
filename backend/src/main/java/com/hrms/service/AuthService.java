package com.hrms.service;

import com.hrms.config.JwtUtils;
import com.hrms.dto.JwtResponse;
import com.hrms.dto.LoginRequest;
import com.hrms.dto.SignupRequest;
import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public User registerUser(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Role role = (request.getRole() != null) ? request.getRole() : Role.EMPLOYEE;

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        user = userRepository.save(user);

        if (role == Role.EMPLOYEE) {
            employeeService.createEmployeeForSignup(user, request);
        }

        return user;
    }

    public JwtResponse loginUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long employeeId = employeeService.findEmployeeIdByUserId(user.getId());
        String redirectPath = resolveRedirectPath(role);

        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(),
                role, employeeId, redirectPath);
    }

    private String resolveRedirectPath(String role) {
        if (role == null) return "dashboard.html";
        return switch (role) {
            case "ROLE_EMPLOYEE" -> "dashboard.html";
            case "ROLE_ADMIN", "ROLE_HR", "ROLE_MANAGER" -> "dashboard.html";
            default -> "dashboard.html";
        };
    }
}
