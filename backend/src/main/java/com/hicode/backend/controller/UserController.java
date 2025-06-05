package com.hicode.backend.controller;

import com.hicode.backend.dto.UpdateUserRequest;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUserProfile() {
        try {
            UserResponse userProfile = userService.getUserProfile();
            return ResponseEntity.ok(userProfile);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error fetching current user profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not retrieve user profile.");
        }
    }

    @PutMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateUserRequest updateUserRequest) {
        try {
            UserResponse updatedUser = userService.updateUserProfile(updateUserRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (RuntimeException e) {
            System.err.println("Error updating user profile: " + e.getMessage());
            e.printStackTrace();
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile: " + e.getMessage());
        }
    }
}