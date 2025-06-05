package com.hicode.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_type_compatibility")
@Getter
@Setter
@NoArgsConstructor
public class BloodTypeCompatibility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_blood_type_id", nullable = false)
    private BloodType donorBloodType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_blood_type_id", nullable = false)
    private BloodType recipientBloodType;

    @Column(name = "is_compatible", nullable = false)
    private Boolean isCompatible;

    @Column(name = "compatibility_score")
    private Integer compatibilityScore;

    @Column(name = "is_emergency_compatible", columnDefinition = "BIT DEFAULT 0")
    private Boolean isEmergencyCompatible = false;

    @Lob
    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

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