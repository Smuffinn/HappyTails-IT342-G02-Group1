package com.happytails.backend.controller;

import com.happytails.backend.dto.UpdateShelterRequest;
import com.happytails.backend.model.Shelter;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.repository.ShelterStaffRepository;
import com.happytails.backend.service.ShelterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    @Autowired
    private ShelterService shelterService;

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    @GetMapping
    public ResponseEntity<List<Shelter>> getAllShelters() {
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    // Create new shelter
    @PostMapping
    public ResponseEntity<Shelter> createShelter(@Valid @RequestBody UpdateShelterRequest request) {
        Shelter newShelter = shelterService.createShelter(
                request.getName(),
                request.getLocation(),
                request.getContactInfo()
        );
        return ResponseEntity.ok(newShelter);
    }

    // FR-5: Update shelter profile (only for staff of that shelter)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShelter(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShelterRequest request
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<ShelterStaff> staffOpt = shelterStaffRepository.findByEmail(email);

        if (staffOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Only shelter staff can update shelter profiles");
        }

        ShelterStaff staff = staffOpt.get();
        if (!staff.getShelter().getShelterId().equals(id)) {
            return ResponseEntity.status(403).body("You can only update your own shelter's profile");
        }

        Shelter updatedShelter = shelterService.updateShelterProfile(
                id,
                request.getName(),
                request.getLocation(),
                request.getContactInfo()
        );

        return ResponseEntity.ok(updatedShelter);
    }
}
