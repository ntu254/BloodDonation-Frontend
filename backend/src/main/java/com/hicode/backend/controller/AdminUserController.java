package com.hicode.backend.controller;

import com.hicode.backend.dto.AdminCreateUserRequest;
import com.hicode.backend.dto.AdminUpdateUserRequest;
import com.hicode.backend.dto.UserResponse;
import com.hicode.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = Sort.Direction.ASC;
        String sortField = "id";

        if (sort.length > 0 && !sort[0].isEmpty()) {
            sortField = sort[0];
        }
        if (sort.length > 1 && !sort[1].isEmpty()) {
            try {
                direction = Sort.Direction.fromString(sort[1].toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default direction if invalid
            }
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        Page<UserResponse> usersPage = userService.getAllUsers(pageable);
        return ResponseEntity.ok(usersPage);
    }

    @PostMapping
    public ResponseEntity<?> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest request) {
        try {
            UserResponse newUser = userService.createUserByAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            System.err.println("Admin Create User Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not create user: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserByIdForAdmin(@PathVariable Long id) {
        try {
            UserResponse user = userService.getUserByIdForAdmin(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable Long id, @Valid @RequestBody AdminUpdateUserRequest request) {
        try {
            UserResponse updatedUser = userService.updateUserByAdmin(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            System.err.println("Admin Update User Error for ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not update user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteUserByAdmin(@PathVariable Long id) {
        try {
            UserResponse deactivatedUser = userService.softDeleteUserByAdmin(id);
            return ResponseEntity.ok(deactivatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}