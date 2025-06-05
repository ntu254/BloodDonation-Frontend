package com.hicode.backend.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateUserRequest {

    @Size(min = 3, max = 150, message = "Full name must be between 3 and 150 characters")
    private String fullName;

    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private Double latitude;
    private Double longitude;
    private String emergencyContact;
    private Integer bloodTypeId;
    private String medicalConditions;
    private LocalDate lastDonationDate;
    private Boolean isReadyToDonate;
}