package com.happytails.backend.controller;

import com.happytails.backend.dto.LoginRequest;
import com.happytails.backend.dto.RegisterAdopterRequest;
import com.happytails.backend.model.Adopter;
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

    // POST /api/auth/register-adopter
    // Fulfills FR-1
    @PostMapping("/register-adopter")
    public ResponseEntity<Adopter> registerAdopter(@RequestBody RegisterAdopterRequest request) {
        Adopter newAdopter = authService.registerAdopter(request);
        return ResponseEntity.ok(newAdopter);
    }

    // POST /api/auth/login
    // Fulfills FR-2 and part of FR-4
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // TODO:
    // @PostMapping("/register-staff")
    // Fulfills part of FR-4
}
