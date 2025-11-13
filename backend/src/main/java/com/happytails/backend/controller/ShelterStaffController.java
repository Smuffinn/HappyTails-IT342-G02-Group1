package com.happytails.backend.controller;

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