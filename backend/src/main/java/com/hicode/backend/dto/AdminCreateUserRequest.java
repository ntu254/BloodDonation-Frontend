package com.hicode.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCreateUserRequest {

    @NotBlank
    @Size(min = 3, max = 100)
    private String username;

    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank
    @Size(min = 3, max = 150)
    private String fullName;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    private String roleName;

    private Integer bloodTypeId;
    private String phone;
    private String status;
    private Boolean emailVerified;
    private Boolean phoneVerified;
}