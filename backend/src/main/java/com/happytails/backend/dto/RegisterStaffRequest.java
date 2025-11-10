package com.happytails.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterStaffRequest {
    private String email;
    private String password;
    private Long shelterId;
}