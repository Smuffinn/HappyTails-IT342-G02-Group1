package com.happytails.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterAdopterRequest {
    private String email;
    private String password;
    // Add any other fields required for FR-1,
    // but for now email/pass is fine.
}
