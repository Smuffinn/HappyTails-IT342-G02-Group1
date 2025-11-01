package com.happytails.backend.service;

import com.happytails.backend.dto.LoginRequest;
import com.happytails.backend.dto.RegisterAdopterRequest;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.repository.AdopterRepository;
import com.happytails.backend.repository.ShelterStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// We need to add Spring Security later to properly hash passwords
// import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private AdopterRepository adopterRepository;

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;

    // @Autowired
    // private PasswordEncoder passwordEncoder; // Add this when you add Spring Security

    public Adopter registerAdopter(RegisterAdopterRequest request) {
        // TODO: Check if email already exists

        Adopter adopter = new Adopter();
        adopter.setEmail(request.getEmail());

        // TODO: Hash the password before saving
        // String hashedPassword = passwordEncoder.encode(request.getPassword());
        // adopter.setPassword(hashedPassword);

        adopter.setPassword(request.getPassword()); // Temporary: Unsafe!

        return adopterRepository.save(adopter);
    }

    public String login(LoginRequest request) {
        // TODO: Add logic to check Adopter and ShelterStaff tables
        // and return a JWT token or session ID
        return "Login logic not yet implemented for: " + request.getEmail();
    }

    // TODO:
    // public ShelterStaff registerStaff(RegisterStaffRequest request) { ... }
}
