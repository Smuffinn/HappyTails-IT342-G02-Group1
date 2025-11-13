package com.happytails.backend.service;

import com.happytails.backend.dto.UpdateStaffProfileRequest;
import com.happytails.backend.exception.UserNotFoundException;
import com.happytails.backend.model.Shelter;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.repository.ShelterStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterStaffService {

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ShelterService shelterService;

    // Get all staff members
    public List<ShelterStaff> getAllStaff() {
        return shelterStaffRepository.findAll();
    }

    // Get staff by ID
    public ShelterStaff getStaffById(Long staffId) {
        return shelterStaffRepository.findById(staffId)
                .orElseThrow(() -> new UserNotFoundException("Staff member not found with ID: " + staffId));
    }

    // Find staff by email
    public Optional<ShelterStaff> findByEmail(String email) {
        return shelterStaffRepository.findByEmail(email);
    }

    // Get staff by email (throws exception if not found)
    public ShelterStaff getStaffByEmail(String email) {
        return shelterStaffRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Staff member not found with email: " + email));
    }

    // Update staff profile
    public ShelterStaff updateStaffProfile(String email, UpdateStaffProfileRequest request) {
        ShelterStaff staff = getStaffByEmail(email);

        // Update email if provided
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            staff.setEmail(request.getEmail());
        }

        // Update password if provided (hash it)
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            staff.setPassword(hashedPassword);
        }

        // Update additional fields
        if (request.getFirstName() != null) {
            staff.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            staff.setLastName(request.getLastName());
        }

        if (request.getPhoneNumber() != null) {
            staff.setPhoneNumber(request.getPhoneNumber());
        }

        return shelterStaffRepository.save(staff);
    }

    // FR-5: Get shelter details for the current staff member
    public Shelter getStaffShelter(String email) {
        ShelterStaff staff = getStaffByEmail(email);
        return staff.getShelter();
    }

    // FR-5: Update shelter profile (for staff to update their shelter's info)
    public Shelter updateStaffShelter(String email, String name, String location, String contactInfo) {
        ShelterStaff staff = getStaffByEmail(email);
        Long shelterId = staff.getShelter().getShelterId();
        
        return shelterService.updateShelterProfile(shelterId, name, location, contactInfo);
    }

    // Delete staff profile
    public void deleteStaffProfile(String email) {
        ShelterStaff staff = getStaffByEmail(email);
        shelterStaffRepository.delete(staff);
    }

    // Get all staff members of a specific shelter
    public List<ShelterStaff> getStaffByShelter(Long shelterId) {
        Shelter shelter = shelterService.getShelterById(shelterId);
        return shelterStaffRepository.findByShelter(shelter);
    }
}
