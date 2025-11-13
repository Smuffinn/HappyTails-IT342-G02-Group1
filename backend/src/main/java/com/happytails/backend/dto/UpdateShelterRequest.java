package com.happytails.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateShelterRequest {
    
    @NotBlank(message = "Shelter name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @Size(max = 255, message = "Contact info must not exceed 255 characters")
    private String contactInfo;
}
