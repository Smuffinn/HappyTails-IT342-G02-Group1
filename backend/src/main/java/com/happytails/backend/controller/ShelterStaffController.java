package com.happytails.backend.controller;

import com.happytails.backend.dto.UpdateStaffProfileRequest;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.service.ShelterStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.repository.ShelterStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
public class ShelterStaffController {

    @Autowired
    private ShelterStaffService shelterStaffService;

    // Get all staff members
    @GetMapping
    public ResponseEntity<List<ShelterStaff>> getAllStaff() {
        return ResponseEntity.ok(shelterStaffService.getAllStaff());
    }

    // Get single staff profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<ShelterStaff> getStaffById(@PathVariable Long id) {
        ShelterStaff staff = shelterStaffService.getStaffById(id);
        return ResponseEntity.ok(staff);
    }

    // Update staff profile
    @PutMapping("/profile/{id}")
    public ResponseEntity<ShelterStaff> updateStaffProfile(
            @PathVariable Long id,
            @RequestBody UpdateStaffProfileRequest request) {
        ShelterStaff updatedStaff = shelterStaffService.updateStaffProfile(id, request);
        return ResponseEntity.ok(updatedStaff);
    }

    // Delete staff profile
    @DeleteMapping("/profile/{id}")
    public ResponseEntity<String> deleteStaffProfile(@PathVariable Long id) {
        shelterStaffService.deleteStaffProfile(id);
        return ResponseEntity.ok("Staff profile deleted successfully");
    }
}
    private ShelterStaffRepository shelterStaffRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentStaff() {
        // Extract email from JWT token via SecurityContext
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Optional<ShelterStaff> staff = shelterStaffRepository.findByEmail(email);
        if (staff.isPresent()) {
            return ResponseEntity.ok(staff.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentStaff() {
        // Extract email from JWT token via SecurityContext
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Optional<ShelterStaff> staff = shelterStaffRepository.findByEmail(email);
        if (staff.isPresent()) {
            shelterStaffRepository.delete(staff.get());
            return ResponseEntity.ok("Account deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
