package com.happytails.backend.service;

import com.happytails.backend.dto.UpdateAdopterProfileRequest;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.repository.AdopterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdopterService {

    @Autowired
    private AdopterRepository adopterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Adopter> getAllAdopters() {
        return adopterRepository.findAll();
    }

    // Get single adopter by ID
    public Adopter getAdopterById(Long id) {
        return adopterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Adopter not found with ID: " + id));
    }

    // Update adopter profile
    public Adopter updateAdopterProfile(Long id, UpdateAdopterProfileRequest request) {
        Adopter adopter = adopterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Adopter not found with ID: " + id));

        // Update email if provided
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            adopter.setEmail(request.getEmail());
        }

        // Update password if provided (hash it)
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            adopter.setPassword(hashedPassword);
        }

        // Update profile fields if provided
        if (request.getProfilePersonalInfo() != null) {
            adopter.setProfilePersonalInfo(request.getProfilePersonalInfo());
        }

        if (request.getProfileResidenceDetails() != null) {
            adopter.setProfileResidenceDetails(request.getProfileResidenceDetails());
        }

        if (request.getProfilePetExperience() != null) {
            adopter.setProfilePetExperience(request.getProfilePetExperience());
        }

        return adopterRepository.save(adopter);
    }

    // Delete adopter profile
    public void deleteAdopterProfile(Long id) {
        Adopter adopter = adopterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Adopter not found with ID: " + id));
        
        adopterRepository.delete(adopter);
    }
}
