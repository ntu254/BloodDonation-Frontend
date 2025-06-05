package com.hicode.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBloodTypeRequest {
    @Size(max = 50)
    private String description;

}