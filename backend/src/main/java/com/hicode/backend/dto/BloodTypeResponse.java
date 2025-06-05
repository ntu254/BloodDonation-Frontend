package com.hicode.backend.dto;

import com.hicode.backend.entity.BloodComponentType;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class BloodTypeResponse {
    private Integer id;
    private String bloodGroup;
    private BloodComponentType componentType;
    private String description;
    private Integer shelfLifeDays;
    private Double storageTempMin;
    private Double storageTempMax;
    private Integer volumeMl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}