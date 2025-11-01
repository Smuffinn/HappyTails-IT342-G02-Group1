package com.happytails.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "adopter")
@Getter
@Setter
public class Adopter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adopter_id")
    private Long adopterId;

    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "profile_personal_info", columnDefinition = "json")
    private String profilePersonalInfo;

    @Column(name = "profile_residence_details", columnDefinition = "json")
    private String profileResidenceDetails;

    @Column(name = "profile_pet_experience", columnDefinition = "TEXT")
    private String profilePetExperience;

    @OneToMany(mappedBy = "adopter")
    private Set<Application> applications;
}
