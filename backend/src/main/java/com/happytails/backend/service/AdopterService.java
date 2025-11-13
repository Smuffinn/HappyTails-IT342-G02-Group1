package com.happytails.backend.service;

import com.happytails.backend.dto.UpdateAdopterProfileRequest;
import com.happytails.backend.dto.UpdateAdopterRequest;
import com.happytails.backend.exception.UserNotFoundException;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.repository.AdopterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityNotFoundException;

@Service
public class AdopterService {

    @Autowired
    private AdopterRepository adopterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Adopter> getAllAdopters() {
        return adopterRepository.findAll();
    }

    public Optional<Adopter> findByEmail(String email) {
        return adopterRepository.findByEmail(email);
    }

    public Optional<Adopter> getById(Long id) {
        return adopterRepository.findById(id);
    }

    public Adopter getAdopterById(Long id) {
        return adopterRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Adopter not found with id: " + id));
    }

    public Adopter updateProfileByEmail(String email, UpdateAdopterRequest req) {
        Adopter adopter = adopterRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Adopter not found"));

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            adopter.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getProfilePersonalInfo() != null) adopter.setProfilePersonalInfo(req.getProfilePersonalInfo());
        if (req.getProfileResidenceDetails() != null) adopter.setProfileResidenceDetails(req.getProfileResidenceDetails());
        if (req.getProfilePetExperience() != null) adopter.setProfilePetExperience(req.getProfilePetExperience());

        return adopterRepository.save(adopter);
    }

    public void deleteByEmail(String email) {
        adopterRepository.findByEmail(email).ifPresent(adopterRepository::delete);
    }

    public Adopter updateAdopterProfile(Long id, UpdateAdopterProfileRequest request) {
        Adopter adopter = adopterRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Adopter not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            adopter.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            adopter.setPassword(passwordEncoder.encode(request.getPassword()));
        }
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

    public void deleteAdopterProfile(Long id) {
        Adopter adopter = adopterRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Adopter not found with id: " + id));
        adopterRepository.delete(adopter);
    }
}
