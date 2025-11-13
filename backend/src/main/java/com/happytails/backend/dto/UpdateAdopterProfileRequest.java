package com.happytails.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAdopterProfileRequest {
    private String email;
    private String password;  // Optional - only if user wants to change password
    private String profilePersonalInfo;  // JSON string
    private String profileResidenceDetails;  // JSON string
    private String profilePetExperience;  // TEXT
}
