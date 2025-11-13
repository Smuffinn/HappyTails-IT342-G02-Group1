package com.happytails.backend.controller;

import com.happytails.backend.model.Adopter;
import com.happytails.backend.service.AdopterService;
import jakarta.persistence.EntityNotFoundException;
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

    // @PostMapping("/login") - Login an adopter (FR-2)

    // @PutMapping("/profile/{id}") - Update adopter's profile (FR-3)
}
