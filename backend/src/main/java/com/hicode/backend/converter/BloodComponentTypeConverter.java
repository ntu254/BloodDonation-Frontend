package com.hicode.backend.converter;

import com.hicode.backend.entity.BloodComponentType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true) // Tự động áp dụng converter này cho tất cả các trường kiểu BloodComponentType
public class BloodComponentTypeConverter implements AttributeConverter<BloodComponentType, String> {

    @Override
    public String convertToDatabaseColumn(BloodComponentType attribute) {
        // Khi lưu vào DB, lấy displayName từ enum
        if (attribute == null) {
            return null;
        }
        return attribute.getDisplayName();
    }

    @Override
    public BloodComponentType convertToEntityAttribute(String dbData) {
        // Khi đọc từ DB, chuyển chuỗi dbData thành enum tương ứng
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        return BloodComponentType.fromDisplayName(dbData);
    }
}