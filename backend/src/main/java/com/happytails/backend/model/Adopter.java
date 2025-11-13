package com.happytails.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "profile_personal_info", columnDefinition = "TEXT")
    private String profilePersonalInfo;

    @Column(name = "profile_residence_details", columnDefinition = "TEXT")
    private String profileResidenceDetails;

    @Column(name = "profile_pet_experience", columnDefinition = "TEXT")
    private String profilePetExperience;

    @OneToMany(mappedBy = "adopter")
    @JsonManagedReference
    private Set<Application> applications;

    @OneToMany(mappedBy = "adopter")
    @JsonManagedReference
    private Set<Pet> adoptedPets;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
