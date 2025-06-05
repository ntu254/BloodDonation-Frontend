package com.hicode.backend.config;

import com.hicode.backend.entity.Role;
import com.hicode.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
        createRoleIfNotFound("Guest", "[\"view_public_content\", \"search_blood_compatibility\"]", "Public users with limited access");
        createRoleIfNotFound("Member", "[\"view_content\", \"donate_blood\", \"request_blood\", \"view_profile\", \"schedule_appointment\"]", "Registered users - donors and requesters");
        createRoleIfNotFound("Staff", "[\"manage_donations\", \"conduct_health_checks\", \"manage_inventory\", \"view_reports\", \"manage_appointments\"]", "Medical staff and technicians");
        createRoleIfNotFound("Admin", "[\"full_access\", \"manage_users\", \"manage_system\", \"view_all_reports\", \"manage_all_appointments\"]", "System administrators");
    }

    private void createRoleIfNotFound(String name, String permissions, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name);
            role.setPermissions(permissions);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("Initialized role: " + name);
        }
    }
}