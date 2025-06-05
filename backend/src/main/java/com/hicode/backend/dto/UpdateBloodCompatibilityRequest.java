package com.hicode.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBloodCompatibilityRequest {
    private Integer donorBloodTypeId;
    private Integer recipientBloodTypeId;
    private Boolean isCompatible;
    private Integer compatibilityScore;
    private Boolean isEmergencyCompatible;
    private String notes;
}