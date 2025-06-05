package com.hicode.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum BloodComponentType {
    WHOLE_BLOOD("Whole Blood"),
    PLASMA("Plasma"),
    RED_BLOOD_CELLS("Red Blood Cells"),
    PLATELETS("Platelets"),
    WHITE_BLOOD_CELLS("White Blood Cells");

    private final String displayName;

    BloodComponentType(String displayName) {
        this.displayName = displayName;
    }

    public static BloodComponentType fromDisplayName(String displayName) {
        if (displayName == null) {
            return null;
        }
        return Arrays.stream(BloodComponentType.values())
                .filter(type -> type.getDisplayName().equalsIgnoreCase(displayName.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown display name: '" + displayName + "' for BloodComponentType"));
    }

    // Giúp Jackson serialize/deserialize enum này thành/từ displayName trong JSON
    @JsonValue
    public String toJsonValue() {
        return displayName;
    }

    @JsonCreator
    public static BloodComponentType forValue(String value) {
        return fromDisplayName(value);
    }
}