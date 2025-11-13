package com.happytails.backend.controller;

import com.happytails.backend.model.Application;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.service.ApplicationService;
import com.happytails.backend.repository.AdopterRepository;
import com.happytails.backend.repository.ShelterStaffRepository;
import com.happytails.backend.dto.ApplicationRequest;
import com.happytails.backend.dto.StatusUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private AdopterRepository adopterRepository;

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null) return ResponseEntity.status(401).build();
        Optional<Adopter> aOpt = adopterRepository.findByEmail(email);
        if (aOpt.isEmpty()) return ResponseEntity.status(404).body("Adopter not found");
        return ResponseEntity.ok(applicationService.getApplicationsForAdopter(aOpt.get().getAdopterId()));
    }

    @GetMapping("/shelter")
    public ResponseEntity<?> getApplicationsForMyShelter() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null) return ResponseEntity.status(401).build();
        Optional<ShelterStaff> sOpt = shelterStaffRepository.findByEmail(email);
        if (sOpt.isEmpty()) return ResponseEntity.status(403).body("Not shelter staff or shelter not found");
        Long shelterId = sOpt.get().getShelter().getShelterId();
        return ResponseEntity.ok(applicationService.getApplicationsForShelter(shelterId));
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(@Valid @RequestBody ApplicationRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null) return ResponseEntity.status(401).build();
        Optional<Adopter> aOpt = adopterRepository.findByEmail(email);
        if (aOpt.isEmpty()) return ResponseEntity.status(404).body("Adopter not found");
        try {
            Application created = applicationService.submitApplication(aOpt.get().getAdopterId(), req.getPetId(), req.getSupplementaryAnswers());
            return ResponseEntity.status(201).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest statusReq) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.status(401).build();
        boolean isStaff = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).anyMatch(a -> a.equals("ROLE_STAFF"));
        if (!isStaff) return ResponseEntity.status(403).body("Only shelter staff can change application status");

        try {
            Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(statusReq.getStatus());
            Application updated = applicationService.updateApplicationStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }
    }
}
