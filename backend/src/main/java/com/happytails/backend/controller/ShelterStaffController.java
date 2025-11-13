package com.happytails.backend.controller;

import com.happytails.backend.dto.UpdateShelterRequest;
import com.happytails.backend.dto.UpdateStaffProfileRequest;
import com.happytails.backend.model.Shelter;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.service.ShelterStaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class ShelterStaffController {

    @Autowired
    private ShelterStaffService shelterStaffService;

    // Get current staff profile
    @GetMapping("/me")
    public ResponseEntity<ShelterStaff> getCurrentStaff() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ShelterStaff staff = shelterStaffService.getStaffByEmail(email);
        return ResponseEntity.ok(staff);
    }

    // Update current staff profile (FR-4)
    @PutMapping("/me")
    public ResponseEntity<ShelterStaff> updateCurrentStaff(@Valid @RequestBody UpdateStaffProfileRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ShelterStaff updatedStaff = shelterStaffService.updateStaffProfile(email, request);
        return ResponseEntity.ok(updatedStaff);
    }

    // Delete current staff account
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteCurrentStaff() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        shelterStaffService.deleteStaffProfile(email);
        return ResponseEntity.ok("Staff account deleted successfully");
    }

    // FR-5: Get shelter details for current staff
    @GetMapping("/my-shelter")
    public ResponseEntity<Shelter> getStaffShelter() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Shelter shelter = shelterStaffService.getStaffShelter(email);
        return ResponseEntity.ok(shelter);
    }

    // FR-5: Update shelter profile (name, location, contact info)
    @PutMapping("/my-shelter")
    public ResponseEntity<Shelter> updateStaffShelter(@Valid @RequestBody UpdateShelterRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Shelter updatedShelter = shelterStaffService.updateStaffShelter(
                email,
                request.getName(),
                request.getLocation(),
                request.getContactInfo()
        );
        return ResponseEntity.ok(updatedShelter);
    }
}