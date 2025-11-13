package com.happytails.backend.service;

import com.happytails.backend.dto.UpdateStaffProfileRequest;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.repository.ShelterStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShelterStaffService {

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all staff members
    public List<ShelterStaff> getAllStaff() {
        return shelterStaffRepository.findAll();
    }

    // Get single staff by ID
    public ShelterStaff getStaffById(Long id) {
        return shelterStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Staff not found with ID: " + id));
    }

    // Update staff profile
    public ShelterStaff updateStaffProfile(Long id, UpdateStaffProfileRequest request) {
        ShelterStaff staff = shelterStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Staff not found with ID: " + id));

        // Update email if provided
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            staff.setEmail(request.getEmail());
        }

        // Update password if provided (hash it)
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            staff.setPassword(hashedPassword);
        }

        return shelterStaffRepository.save(staff);
    }

    // Delete staff profile
    public void deleteStaffProfile(Long id) {
        ShelterStaff staff = shelterStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Staff not found with ID: " + id));
        
        shelterStaffRepository.delete(staff);
    }
}
