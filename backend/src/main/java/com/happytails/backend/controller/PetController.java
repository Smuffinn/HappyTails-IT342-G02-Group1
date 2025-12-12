package com.happytails.backend.controller;

import com.happytails.backend.dto.PetRequest; // Import this!
import com.happytails.backend.model.Pet;
import com.happytails.backend.model.ShelterStaff; // Import this!
import com.happytails.backend.repository.ShelterStaffRepository; // Import this!
import com.happytails.backend.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder; // Import this!
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        Optional<Pet> pet = petService.getPetById(id);
        return pet.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // FR-6: Create Pet
    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> createPet(@RequestBody PetRequest petRequest) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<ShelterStaff> staffOpt = shelterStaffRepository.findByEmail(email);

        if (staffOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Shelter Staff can add pets.");
        }

        try {
            Pet newPet = petService.createPet(petRequest, staffOpt.get().getShelter());
            return ResponseEntity.ok(newPet);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating pet: " + e.getMessage());
        }
    }

    // FR-7: Update Pet Profile
    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<?> updatePet(@PathVariable Long id, @RequestBody PetRequest petRequest) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<ShelterStaff> staffOpt = shelterStaffRepository.findByEmail(email);

        if (staffOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Shelter Staff can update pets.");
        }

        try {
            Pet updatedPet = petService.updatePet(id, petRequest, staffOpt.get().getShelter());
            return ResponseEntity.ok(updatedPet);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating pet: " + e.getMessage());
        }
    }

    // FR-8: Change Pet Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updatePetStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<ShelterStaff> staffOpt = shelterStaffRepository.findByEmail(email);

        if (staffOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Shelter Staff can update pet status.");
        }

        try {
            String statusStr = statusRequest.get("status");
            if (statusStr == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }
            Pet.PetStatus newStatus = Pet.PetStatus.valueOf(statusStr);
            Pet updatedPet = petService.updatePetStatus(id, newStatus, staffOpt.get().getShelter());
            return ResponseEntity.ok(updatedPet);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + e.getMessage());
        }
    }

    // FR-9, FR-10, FR-11: Search and Filter Pets
    @GetMapping("/search")
    public ResponseEntity<List<Pet>> searchPets(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String temperament,
            @RequestParam(required = false) String shelterLocation,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge
    ) {
        List<Pet> filteredPets = petService.searchPets(
                species, gender, breed, size, temperament, shelterLocation, minAge, maxAge
        );
        return ResponseEntity.ok(filteredPets);
    }
}