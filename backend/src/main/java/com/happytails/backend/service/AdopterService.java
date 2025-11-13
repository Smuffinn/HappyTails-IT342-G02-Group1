package com.happytails.backend.service;

import com.happytails.backend.dto.UpdateAdopterRequest;
import com.happytails.backend.exception.UserNotFoundException;
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

    public Optional<Adopter> findByEmail(String email) {
        return adopterRepository.findByEmail(email);
    }

    public Optional<Adopter> getById(Long id) {
        return adopterRepository.findById(id);
    }

    public Adopter updateProfileByEmail(String email, UpdateAdopterRequest req) {
        Adopter adopter = adopterRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Adopter not found with email: " + email));

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
}
