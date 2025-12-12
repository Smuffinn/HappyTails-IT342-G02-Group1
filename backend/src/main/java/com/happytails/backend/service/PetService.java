package com.happytails.backend.service;

import com.happytails.backend.dto.PetRequest;
import com.happytails.backend.model.Pet;
import com.happytails.backend.model.Shelter;
import com.happytails.backend.repository.PetRepository;
import com.happytails.backend.specification.PetSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public List<Pet> getAllPets() {
        // Only return pets that are not yet adopted for public discovery
        return petRepository.findAll().stream()
                .filter(pet -> pet.getStatus() != Pet.PetStatus.Adopted)
                .toList();
    }

    public Optional<Pet> getPetById(Long id) {
        return petRepository.findById(id);
    }

    // --- NEW: Create Pet Logic ---
    public Pet createPet(PetRequest req, Shelter shelter) {
        Pet pet = new Pet();
        pet.setName(req.getName());
        pet.setSpecies(req.getSpecies());
        pet.setBreed(req.getBreed());
        pet.setAge(req.getAge());
        pet.setDescription(req.getDescription());
        pet.setShelter(shelter); // Automatically link to the staff's shelter

        // Set Defaults
        pet.setStatus(Pet.PetStatus.Available);

        // Handle Enums safely (defaulting to Medium if invalid or missing)
        try {
            if (req.getSize() != null) {
                pet.setSize(Pet.PetSize.valueOf(req.getSize()));
            } else {
                pet.setSize(Pet.PetSize.Medium);
            }
        } catch (IllegalArgumentException e) {
            pet.setSize(Pet.PetSize.Medium);
        }

        // Handle temperament
        if (req.getTemperament() != null && !req.getTemperament().isEmpty()) {
            pet.setTemperament(req.getTemperament());
        }

        // Handle gender
        try {
            if (req.getGender() != null) {
                pet.setGender(Pet.PetGender.valueOf(req.getGender()));
            }
        } catch (IllegalArgumentException e) {
            // Invalid gender, skip
        }

        // Handle photos JSON
        if (req.getPhotosJson() != null) {
            pet.setPhotosJson(req.getPhotosJson());
        }

        return petRepository.save(pet);
    }

    // FR-7: Update existing pet profile
    public Pet updatePet(Long petId, PetRequest req, Shelter shelter) {
        Optional<Pet> existingPetOpt = petRepository.findById(petId);
        if (existingPetOpt.isEmpty()) {
            throw new IllegalArgumentException("Pet not found with ID: " + petId);
        }

        Pet pet = existingPetOpt.get();

        // Verify the pet belongs to the shelter
        if (!pet.getShelter().getShelterId().equals(shelter.getShelterId())) {
            throw new IllegalArgumentException("You can only update pets from your shelter");
        }

        // Update fields
        if (req.getName() != null && !req.getName().isEmpty()) {
            pet.setName(req.getName());
        }
        if (req.getSpecies() != null && !req.getSpecies().isEmpty()) {
            pet.setSpecies(req.getSpecies());
        }
        if (req.getBreed() != null) {
            pet.setBreed(req.getBreed());
        }
        if (req.getAge() != null) {
            pet.setAge(req.getAge());
        }
        if (req.getDescription() != null && !req.getDescription().isEmpty()) {
            pet.setDescription(req.getDescription());
        }
        if (req.getTemperament() != null) {
            pet.setTemperament(req.getTemperament());
        }
        if (req.getPhotosJson() != null) {
            pet.setPhotosJson(req.getPhotosJson());
        }

        // Handle size enum
        try {
            if (req.getSize() != null && !req.getSize().isEmpty()) {
                pet.setSize(Pet.PetSize.valueOf(req.getSize()));
            }
        } catch (IllegalArgumentException e) {
            // Invalid size, keep existing
        }

        // Handle gender enum
        try {
            if (req.getGender() != null && !req.getGender().isEmpty()) {
                pet.setGender(Pet.PetGender.valueOf(req.getGender()));
            }
        } catch (IllegalArgumentException e) {
            // Invalid gender, keep existing
        }

        return petRepository.save(pet);
    }

    // FR-8: Change pet status
    public Pet updatePetStatus(Long petId, Pet.PetStatus newStatus, Shelter shelter) {
        Optional<Pet> existingPetOpt = petRepository.findById(petId);
        if (existingPetOpt.isEmpty()) {
            throw new IllegalArgumentException("Pet not found with ID: " + petId);
        }

        Pet pet = existingPetOpt.get();

        // Verify the pet belongs to the shelter
        if (!pet.getShelter().getShelterId().equals(shelter.getShelterId())) {
            throw new IllegalArgumentException("You can only update pets from your shelter");
        }

        pet.setStatus(newStatus);
        return petRepository.save(pet);
    }

    // FR-10, FR-11: Search and filter pets
    public List<Pet> searchPets(
            String species,
            String gender,
            String breed,
            String size,
            String temperament,
            String shelterLocation,
            Integer minAge,
            Integer maxAge
    ) {
        Specification<Pet> spec = PetSpecification.filterPets(
                species, gender, breed, size, temperament, shelterLocation, minAge, maxAge
        );
        return petRepository.findAll(spec);
    }
}