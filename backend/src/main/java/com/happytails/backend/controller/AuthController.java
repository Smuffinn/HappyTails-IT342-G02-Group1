package com.happytails.backend.controller;

import com.happytails.backend.dto.LoginRequest;
import com.happytails.backend.dto.LoginResponse;
import com.happytails.backend.dto.RegisterAdopterRequest;
import com.happytails.backend.dto.RegisterStaffRequest; // Make sure this is imported
import com.happytails.backend.model.Adopter;
import com.happytails.backend.model.ShelterStaff; // Make sure this is imported
import com.happytails.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Fulfills FR-1
    @PostMapping("/register-adopter")
    public ResponseEntity<Adopter> registerAdopter(@RequestBody RegisterAdopterRequest request) {
        Adopter newAdopter = authService.registerAdopter(request);
        return ResponseEntity.ok(newAdopter);
    }

    // Fulfills FR-2 and part of FR-4
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Fulfills part of FR-4
    @PostMapping("/register-staff")
    public ResponseEntity<ShelterStaff> registerStaff(@RequestBody RegisterStaffRequest request) {
        ShelterStaff newStaff = authService.registerStaff(request);
        return ResponseEntity.ok(newStaff);
    }
}