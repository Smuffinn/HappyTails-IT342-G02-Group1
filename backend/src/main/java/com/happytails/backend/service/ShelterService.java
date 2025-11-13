package com.happytails.backend.service;

import com.happytails.backend.exception.ResourceNotFoundException;
import com.happytails.backend.model.Shelter;
import com.happytails.backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterService {

    @Autowired
    private ShelterRepository shelterRepository;

    // Get all shelters
    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    // Get shelter by ID
    public Shelter getShelterById(Long shelterId) {
        return shelterRepository.findById(shelterId)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with ID: " + shelterId));
    }

    // Find shelter by ID (Optional return)
    public Optional<Shelter> findById(Long shelterId) {
        return shelterRepository.findById(shelterId);
    }

    // FR-5: Update shelter profile (name, location, contact info)
    public Shelter updateShelterProfile(Long shelterId, String name, String location, String contactInfo) {
        Shelter shelter = getShelterById(shelterId);

        // Update fields if provided
        if (name != null && !name.isBlank()) {
            shelter.setName(name);
        }
        if (location != null && !location.isBlank()) {
            shelter.setLocation(location);
        }
        if (contactInfo != null && !contactInfo.isBlank()) {
            shelter.setContactInfo(contactInfo);
        }

        return shelterRepository.save(shelter);
    }

    // Create a new shelter (for admin purposes)
    public Shelter createShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    // Delete shelter (for admin purposes)
    public void deleteShelter(Long shelterId) {
        Shelter shelter = getShelterById(shelterId);
        shelterRepository.delete(shelter);
    }
}
