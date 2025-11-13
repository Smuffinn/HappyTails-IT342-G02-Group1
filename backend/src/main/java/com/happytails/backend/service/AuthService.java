package com.happytails.backend.service;

import com.happytails.backend.dto.LoginRequest;
import com.happytails.backend.dto.RegisterAdopterRequest;
import com.happytails.backend.dto.RegisterStaffRequest;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.model.Shelter;
import com.happytails.backend.model.ShelterStaff;
import com.happytails.backend.repository.AdopterRepository;
import com.happytails.backend.repository.ShelterRepository;
import com.happytails.backend.repository.ShelterStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.happytails.backend.security.JwtUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdopterRepository adopterRepository;

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    @Autowired
    private ShelterRepository shelterRepository; // Inject ShelterRepository

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // This method is complete and working
    public Adopter registerAdopter(RegisterAdopterRequest request) {
        // Step 1: Check if email already exists
        Optional<Adopter> existingAdopter = adopterRepository.findByEmail(request.getEmail());
        if (existingAdopter.isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Adopter adopter = new Adopter();
        adopter.setEmail(request.getEmail());

        // Step 2: Hash the password before saving
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        adopter.setPassword(hashedPassword);

        // Step 3: Save the new adopter to the database
        return adopterRepository.save(adopter);
    }

    // NEW METHOD: Implements FR-4 (Register Staff)
    public ShelterStaff registerStaff(RegisterStaffRequest request) {
        // Step 1: Check if email already exists
        Optional<ShelterStaff> existingStaff = shelterStaffRepository.findByEmail(request.getEmail());
        if (existingStaff.isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Step 2: Find the shelter they belong to
        Shelter shelter = shelterRepository.findById(request.getShelterId())
                .orElseThrow(() -> new RuntimeException("Error: Shelter not found!"));

        ShelterStaff staff = new ShelterStaff();
        staff.setEmail(request.getEmail());
        staff.setShelter(shelter); // Link the staff to the shelter

        // Step 3: Hash the password
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        staff.setPassword(hashedPassword);

        // Step 4: Save new staff member
        return shelterStaffRepository.save(staff);
    }

    // UPDATED METHOD: Implements FR-2 (Login)
    public String login(LoginRequest request) {
        // Step 1: Try to find user as an Adopter
        Optional<Adopter> adopterOpt = adopterRepository.findByEmail(request.getEmail());
        if (adopterOpt.isPresent()) {
            Adopter adopter = adopterOpt.get();
            // Step 2: Check password
            if (passwordEncoder.matches(request.getPassword(), adopter.getPassword())) {
                // Generate JWT token for the adopter with role
                java.util.List<String> roles = java.util.List.of("ROLE_ADOPTER");
                return jwtUtils.generateJwtToken(adopter.getEmail(), roles);
            }
        }

        // Step 3: Try to find user as Shelter Staff
        Optional<ShelterStaff> staffOpt = shelterStaffRepository.findByEmail(request.getEmail());
        if (staffOpt.isPresent()) {
            ShelterStaff staff = staffOpt.get();
            // Step 4: Check password
            if (passwordEncoder.matches(request.getPassword(), staff.getPassword())) {
                // Generate JWT token for the staff with role
                java.util.List<String> roles = java.util.List.of("ROLE_STAFF");
                return jwtUtils.generateJwtToken(staff.getEmail(), roles);
            }
        }

        // Step 5: If no user found or password mismatch
        throw new RuntimeException("Error: Invalid email or password");
    }
}