package com.happytails.backend.controller;

import com.happytails.backend.model.Adopter;
import com.happytails.backend.service.AdopterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    // TODO:
    // @PostMapping("/register") - Register a new adopter (FR-1)

    // @PostMapping("/login") - Login an adopter (FR-2)

    // @PutMapping("/profile/{id}") - Update adopter's profile (FR-3)
}
