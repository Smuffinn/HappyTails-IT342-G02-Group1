package com.happytails.backend.controller;

import com.happytails.backend.model.Adopter;
import com.happytails.backend.service.AdopterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import com.happytails.backend.dto.UpdateAdopterRequest;
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

    // Get current authenticated adopter profile
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentAdopter() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = principal.toString();
        Optional<Adopter> adopter = adopterService.findByEmail(email);
        return adopter.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update the current adopter's profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateAdopterRequest req) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = principal.toString();
        try {
            Adopter updated = adopterService.updateProfileByEmail(email, req);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // Delete current adopter account
    @DeleteMapping
    public ResponseEntity<?> deleteCurrentAdopter() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String email = principal.toString();
        adopterService.deleteByEmail(email);
        return ResponseEntity.noContent().build();
    }

    // TODO:
    // @PostMapping("/register") - Register a new adopter (FR-1)

    // @PostMapping("/login") - Login an adopter (FR-2)

    // @PutMapping("/profile/{id}") - Update adopter's profile (FR-3)
}
