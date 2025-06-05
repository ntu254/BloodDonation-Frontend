package com.hicode.backend.controller;

import com.hicode.backend.dto.BloodTypeResponse;
import com.hicode.backend.dto.CreateBloodTypeRequest;
import com.hicode.backend.dto.UpdateBloodTypeRequest;
import com.hicode.backend.service.BloodManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blood-types")
public class BloodTypeController {

    @Autowired
    private BloodManagementService bloodManagementService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<BloodTypeResponse>> getAllBloodTypes() {
        return ResponseEntity.ok(bloodManagementService.getAllBloodTypes());
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<BloodTypeResponse> getBloodTypeById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(bloodManagementService.getBloodTypeDetails(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBloodType(@Valid @RequestBody CreateBloodTypeRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(bloodManagementService.createBloodType(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating blood type: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> updateBloodType(@PathVariable Integer id, @Valid @RequestBody UpdateBloodTypeRequest request) {
        try {
            return ResponseEntity.ok(bloodManagementService.updateBloodType(id, request));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBloodType(@PathVariable Integer id) {
        try {
            bloodManagementService.deleteBloodType(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}