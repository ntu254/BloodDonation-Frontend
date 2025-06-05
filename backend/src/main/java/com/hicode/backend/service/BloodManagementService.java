package com.hicode.backend.service;

import com.hicode.backend.dto.*;
import com.hicode.backend.entity.BloodType;
import com.hicode.backend.entity.BloodTypeCompatibility;

import com.hicode.backend.repository.BloodTypeCompatibilityRepository;
import com.hicode.backend.repository.BloodTypeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodManagementService {

    @Autowired
    private BloodTypeRepository bloodTypeRepository;
    @Autowired
    private BloodTypeCompatibilityRepository bloodCompatibilityRepository;

    private BloodTypeResponse mapToBloodTypeResponse(BloodType bloodType) {
        if (bloodType == null) return null;
        BloodTypeResponse res = new BloodTypeResponse();
        BeanUtils.copyProperties(bloodType, res);
        return res;
    }

    private BloodCompatibilityDetailResponse mapToBloodCompatibilityDetailResponse(BloodTypeCompatibility rule) {
        if (rule == null) return null;
        BloodCompatibilityDetailResponse res = new BloodCompatibilityDetailResponse();
        BeanUtils.copyProperties(rule, res, "donorBloodType", "recipientBloodType");

        BloodType donorBloodTypeEntity = rule.getDonorBloodType();
        BloodType recipientBloodTypeEntity = rule.getRecipientBloodType();

        res.setDonorBloodType(mapToBloodTypeResponse(donorBloodTypeEntity));
        res.setRecipientBloodType(mapToBloodTypeResponse(recipientBloodTypeEntity));
        return res;
    }

    public List<BloodTypeResponse> getAllBloodTypes() {
        return bloodTypeRepository.findAll().stream()
                .map(this::mapToBloodTypeResponse)
                .collect(Collectors.toList());
    }

    public BloodTypeResponse getBloodTypeDetails(Integer id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BloodType not found with id: " + id));
        return mapToBloodTypeResponse(bloodType);
    }

    @Transactional
    public BloodTypeResponse createBloodType(CreateBloodTypeRequest request) {
        Optional<BloodType> existingBloodTypeOpt = bloodTypeRepository.findByBloodGroupAndComponentType(
                request.getBloodGroup(), request.getComponentType());

        if (existingBloodTypeOpt.isPresent()) {
            throw new IllegalArgumentException("Blood type with group '" + request.getBloodGroup() +
                    "' and component '" + request.getComponentType().name() + "' already exists.");
        }

        BloodType bloodType = new BloodType();
        bloodType.setBloodGroup(request.getBloodGroup());
        bloodType.setComponentType(request.getComponentType());
        bloodType.setDescription(request.getDescription());
        bloodType.setShelfLifeDays(request.getShelfLifeDays());
        bloodType.setStorageTempMin(request.getStorageTempMin());
        bloodType.setStorageTempMax(request.getStorageTempMax());
        bloodType.setVolumeMl(request.getVolumeMl());

        BloodType savedBloodType = bloodTypeRepository.save(bloodType);
        return mapToBloodTypeResponse(savedBloodType);
    }

    @Transactional
    public BloodTypeResponse updateBloodType(Integer id, UpdateBloodTypeRequest request) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BloodType not found with id: " + id));

        if (request.getDescription() != null) {
            bloodType.setDescription(request.getDescription());
        }
        // If UpdateBloodTypeRequest is expanded to include componentType or other fields, handle them here.
        // e.g., if (request.getComponentType() != null) bloodType.setComponentType(request.getComponentType()); // Assuming DTO contains BloodComponentType

        return mapToBloodTypeResponse(bloodTypeRepository.save(bloodType));
    }

    @Transactional
    public void deleteBloodType(Integer id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BloodType not found with id: " + id));

        // Handle related BloodTypeCompatibility records
        List<BloodTypeCompatibility> relatedCompatibilities = bloodCompatibilityRepository.findByDonorBloodTypeIdOrRecipientBloodTypeId(id, id);
        if (!relatedCompatibilities.isEmpty()) {
            bloodCompatibilityRepository.deleteAllInBatch(relatedCompatibilities); // Efficient batch deletion
        }

        // Placeholder for handling Users linked to this BloodType:
        // List<User> usersWithThisBloodType = userRepository.findByBloodTypeId(id);
        // if (!usersWithThisBloodType.isEmpty()) {
        //     // Option 1: Prevent deletion
        //     // throw new IllegalStateException("Cannot delete blood type. It is assigned to " + usersWithThisBloodType.size() + " users.");
        //     // Option 2: Nullify the blood_type_id in linked users
        //     // usersWithThisBloodType.forEach(user -> user.setBloodType(null));
        //     // userRepository.saveAll(usersWithThisBloodType);
        //     // System.out.println("Nullified blood type for " + usersWithThisBloodType.size() + " users.");
        // }

        bloodTypeRepository.delete(bloodType);
    }

    public Page<BloodCompatibilityDetailResponse> getAllCompatibilityRules(Pageable pageable) {
        return bloodCompatibilityRepository.findAll(pageable).map(this::mapToBloodCompatibilityDetailResponse);
    }

    public BloodCompatibilityDetailResponse getCompatibilityRuleDetails(Integer id) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compatibility rule not found with id: " + id));
        return mapToBloodCompatibilityDetailResponse(rule);
    }

    @Transactional
    public BloodCompatibilityDetailResponse createCompatibilityRule(CreateBloodCompatibilityRequest request) {
        BloodType donor = bloodTypeRepository.findById(request.getDonorBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Donor BloodType ID " + request.getDonorBloodTypeId() + " not found."));
        BloodType recipient = bloodTypeRepository.findById(request.getRecipientBloodTypeId())
                .orElseThrow(() -> new RuntimeException("Recipient BloodType ID " + request.getRecipientBloodTypeId() + " not found."));

        bloodCompatibilityRepository.findByDonorBloodTypeIdAndRecipientBloodTypeId(
                        request.getDonorBloodTypeId(), request.getRecipientBloodTypeId())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("This specific compatibility rule (donor-recipient) already exists.");
                });

        BloodTypeCompatibility rule = new BloodTypeCompatibility();
        rule.setDonorBloodType(donor);
        rule.setRecipientBloodType(recipient);
        rule.setIsCompatible(request.getIsCompatible());
        rule.setCompatibilityScore(request.getCompatibilityScore() != null ? request.getCompatibilityScore() : 100);
        rule.setIsEmergencyCompatible(request.getIsEmergencyCompatible() != null ? request.getIsEmergencyCompatible() : false);
        rule.setNotes(request.getNotes());
        return mapToBloodCompatibilityDetailResponse(bloodCompatibilityRepository.save(rule));
    }

    @Transactional
    public BloodCompatibilityDetailResponse updateCompatibilityRule(Integer id, UpdateBloodCompatibilityRequest request) {
        BloodTypeCompatibility rule = bloodCompatibilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compatibility rule not found with id: " + id));

        if (request.getDonorBloodTypeId() != null) {
            BloodType donor = bloodTypeRepository.findById(request.getDonorBloodTypeId())
                    .orElseThrow(() -> new RuntimeException("Donor BloodType ID " + request.getDonorBloodTypeId() + " not found."));
            rule.setDonorBloodType(donor);
        }
        if (request.getRecipientBloodTypeId() != null) {
            BloodType recipient = bloodTypeRepository.findById(request.getRecipientBloodTypeId())
                    .orElseThrow(() -> new RuntimeException("Recipient BloodType ID " + request.getRecipientBloodTypeId() + " not found."));
            rule.setRecipientBloodType(recipient);
        }

        if (request.getIsCompatible() != null) rule.setIsCompatible(request.getIsCompatible());
        if (request.getCompatibilityScore() != null) rule.setCompatibilityScore(request.getCompatibilityScore());
        if (request.getIsEmergencyCompatible() != null) rule.setIsEmergencyCompatible(request.getIsEmergencyCompatible());
        if (request.getNotes() != null) rule.setNotes(request.getNotes());

        return mapToBloodCompatibilityDetailResponse(bloodCompatibilityRepository.save(rule));
    }

    @Transactional
    public void deleteCompatibilityRule(Integer id) {
        if (!bloodCompatibilityRepository.existsById(id)) {
            throw new RuntimeException("Compatibility rule not found with id: " + id);
        }
        bloodCompatibilityRepository.deleteById(id);
    }
}