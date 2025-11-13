package com.happytails.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStaffProfileRequest {
    private String email;
    private String password;  // Optional - only if user wants to change password
}
