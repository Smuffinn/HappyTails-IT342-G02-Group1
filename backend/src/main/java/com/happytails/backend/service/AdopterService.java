package com.happytails.backend.service;

import com.happytails.backend.dto.UpdateAdopterProfileRequest;
import com.happytails.backend.dto.UpdateAdopterRequest;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.repository.AdopterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public Optional<Adopter> findByEmail(String email) {
        return adopterRepository.findByEmail(email);
    }

    public Optional<Adopter> getById(Long id) {
        return adopterRepository.findById(id);
    }

    public Adopter updateProfileByEmail(String email, UpdateAdopterRequest req) {
        Adopter adopter = adopterRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Adopter not found"));

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            adopter.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getProfilePersonalInfo() != null) adopter.setProfilePersonalInfo(req.getProfilePersonalInfo());
        if (req.getProfileResidenceDetails() != null) adopter.setProfileResidenceDetails(req.getProfileResidenceDetails());
        if (req.getProfilePetExperience() != null) adopter.setProfilePetExperience(req.getProfilePetExperience());

        return adopterRepository.save(adopter);
    }

    // Delete adopter profile
    public void deleteAdopterProfile(Long id) {
        Adopter adopter = adopterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Adopter not found with ID: " + id));
        
        adopterRepository.delete(adopter);
    public void deleteByEmail(String email) {
        adopterRepository.findByEmail(email).ifPresent(adopterRepository::delete);
    }
}
