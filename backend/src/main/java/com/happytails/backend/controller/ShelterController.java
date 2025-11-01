package com.happytails.backend.controller;

import com.happytails.backend.model.Shelter;
import com.happytails.backend.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    @Autowired
    private ShelterService shelterService;

    @GetMapping
    public ResponseEntity<List<Shelter>> getAllShelters() {
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    // TODO:
    // @PutMapping("/{id}") - Update a shelter profile (FR-5)
}
