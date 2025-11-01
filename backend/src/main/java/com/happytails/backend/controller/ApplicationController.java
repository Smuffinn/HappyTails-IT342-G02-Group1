package com.happytails.backend.controller;

import com.happytails.backend.model.Application;
import com.happytails.backend.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    // TODO:
    // @PostMapping - Submit an application (FR-13)

    // @GetMapping("/adopter/{id}") - Get applications for a specific adopter

    // @PutMapping("/{id}") - Update application status (FR-15)
}
