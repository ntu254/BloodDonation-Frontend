package com.hicode.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_types",
        uniqueConstraints = {
                // Ràng buộc unique sẽ dựa trên giá trị chuỗi được lưu bởi converter
                @UniqueConstraint(name = "UQ_blood_group_component", columnNames = {"blood_group", "component_type"})
        })
@Getter
@Setter
@NoArgsConstructor
public class BloodType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "blood_group", length = 3, nullable = false)
    private String bloodGroup;

    // KHÔNG sử dụng @Enumerated(EnumType.STRING) ở đây
    // AttributeConverter sẽ tự động được áp dụng
    @Column(name = "component_type", length = 30, nullable = false)
    private BloodComponentType componentType;

    @Column(name = "description", length = 50)
    private String description;

    @Column(name = "shelf_life_days", nullable = false)
    private Integer shelfLifeDays;

    @Column(name = "storage_temp_min", columnDefinition = "DECIMAL(4,2)")
    private Double storageTempMin;

    @Column(name = "storage_temp_max", columnDefinition = "DECIMAL(4,2)")
    private Double storageTempMax;

    @Column(name = "volume_ml")
    private Integer volumeMl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.componentType == null && this.id == null) {
            this.componentType = BloodComponentType.WHOLE_BLOOD;
        }
        if (this.shelfLifeDays == null && this.id == null) {
            this.shelfLifeDays = 35;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}