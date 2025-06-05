package com.hicode.backend.controller;

import com.hicode.backend.dto.AuthResponse;
import com.hicode.backend.dto.LoginRequest;
import com.hicode.backend.dto.RegisterRequest;
import com.hicode.backend.entity.User;
import com.hicode.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User registeredUser = authService.registerUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User registered successfully! Email: " + registeredUser.getEmail());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during registration.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.loginUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("The email or password is invalid");
        } catch (AuthenticationException e) {
            System.err.println("Authentication failed: " + e.getClass().getName() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed. Please check server logs for details.");
        } catch (Exception e) {
            System.err.println("Unexpected error during login: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during login.");
        }
    }
}