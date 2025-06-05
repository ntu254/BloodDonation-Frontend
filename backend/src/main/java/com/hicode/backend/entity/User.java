package com.hicode.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", length = 100, unique = true, nullable = false)
    private String username;

    @Column(name = "email", length = 150, unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", length = 255, nullable = false)
    private String passwordHash;

    @Column(name = "full_name", length = 150, nullable = false)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 10)
    private String gender;

    @Lob
    @Column(name = "address", columnDefinition = "NVARCHAR(MAX)")
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "emergency_contact", length = 255)
    private String emergencyContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @Lob
    @Column(name = "medical_conditions", columnDefinition = "NVARCHAR(MAX)")
    private String medicalConditions;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "is_ready_to_donate", columnDefinition = "BIT DEFAULT 1")
    private Boolean isReadyToDonate = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "status", length = 20)
    private String status = "Active";

    @Column(name = "email_verified", columnDefinition = "BIT DEFAULT 0")
    private Boolean emailVerified = false;

    @Column(name = "phone_verified", columnDefinition = "BIT DEFAULT 0")
    private Boolean phoneVerified = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}