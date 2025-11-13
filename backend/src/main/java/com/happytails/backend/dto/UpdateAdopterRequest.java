package com.happytails.backend.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class UpdateAdopterRequest {

	// Optional new password. If provided, will be hashed by the service.
	@Size(min = 6, message = "Password must be at least 6 characters")
	private String password;

	// Free-form profile JSON/text fields used by the frontend
	private String profilePersonalInfo;
	private String profileResidenceDetails;
	private String profilePetExperience;
}
