package com.happytails.backend.controller;

import com.happytails.backend.model.Pet;
import com.happytails.backend.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    // This is a basic "GET ALL" endpoint
    // It will be available at http://localhost:8080/api/pets
    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petRepository.findAll();
        return ResponseEntity.ok(pets);
    }

    // You can add more endpoints here for:
    // @GetMapping("/{id}") - Get one pet by ID
    // @PostMapping - Create a new pet
    // @PutMapping("/{id}") - Update a pet
    // @DeleteMapping("/{id}") - Delete a pet
}
