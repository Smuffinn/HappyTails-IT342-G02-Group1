package com.happytails.backend.controller;

import com.happytails.backend.dto.UpdateAdopterProfileRequest;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.service.AdopterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adopters")
public class AdopterController {

    @Autowired
    private AdopterService adopterService;

    @GetMapping
    public ResponseEntity<List<Adopter>> getAllAdopters() {
        return ResponseEntity.ok(adopterService.getAllAdopters());
    }

    // Get single adopter profile by ID (FR-3)
    @GetMapping("/{id}")
    public ResponseEntity<Adopter> getAdopterById(@PathVariable Long id) {
        Adopter adopter = adopterService.getAdopterById(id);
        return ResponseEntity.ok(adopter);
    }

    // Update adopter profile (FR-3)
    @PutMapping("/profile/{id}")
    public ResponseEntity<Adopter> updateAdopterProfile(
            @PathVariable Long id,
            @RequestBody UpdateAdopterProfileRequest request) {
        Adopter updatedAdopter = adopterService.updateAdopterProfile(id, request);
        return ResponseEntity.ok(updatedAdopter);
    }

    // Delete adopter profile (FR-3)
    @DeleteMapping("/profile/{id}")
    public ResponseEntity<String> deleteAdopterProfile(@PathVariable Long id) {
        adopterService.deleteAdopterProfile(id);
        return ResponseEntity.ok("Adopter profile deleted successfully");
    }
}
