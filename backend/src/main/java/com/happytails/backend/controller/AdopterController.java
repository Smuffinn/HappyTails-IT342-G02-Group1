package com.happytails.backend.controller;

import com.happytails.backend.dto.UpdateAdopterProfileRequest;
import com.happytails.backend.dto.UpdateAdopterRequest;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.service.AdopterService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    // Get current authenticated adopter profile
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentAdopter() {
        Optional<String> emailOpt = getCurrentUserEmail();
        if (emailOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<Adopter> adopter = adopterService.findByEmail(emailOpt.get());
        return adopter.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update the current adopter's profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateAdopterRequest req) {
        Optional<String> emailOpt = getCurrentUserEmail();
        if (emailOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            Adopter updated = adopterService.updateProfileByEmail(emailOpt.get(), req);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    // Delete current adopter account
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentAdopter() {
        Optional<String> emailOpt = getCurrentUserEmail();
        if (emailOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        adopterService.deleteByEmail(emailOpt.get());
        return ResponseEntity.noContent().build();
    }

    private Optional<String> getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) {
            return Optional.empty();
        }

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            return Optional.ofNullable(userDetails.getUsername());
        }

        if (principal instanceof String str && !"anonymousUser".equalsIgnoreCase(str)) {
            return Optional.of(str);
        }

        return Optional.empty();
    }

    // TODO:
    // @PostMapping("/register") - Register a new adopter (FR-1)

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
