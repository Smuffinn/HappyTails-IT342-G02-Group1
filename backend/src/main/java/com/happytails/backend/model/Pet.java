package com.happytails.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pet")
@Getter
@Setter
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Long petId;

    @ManyToOne
    @JoinColumn(name = "shelter_id", nullable = false)
    @JsonIgnoreProperties({ "pets", "staff" })
    private Shelter shelter;

    @Column(name = "name", length = 100, nullable = false)
    @NotBlank
    private String name;

    @Column(name = "species", length = 50, nullable = false)
    @NotBlank
    private String species;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull
    private PetStatus status;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    @NotBlank
    private String description;

    @Column(name = "breed", length = 100)
    private String breed;

    @Column(name = "age", length = 50)
    private String age;

    @Enumerated(EnumType.STRING)
    @Column(name = "size")
    private PetSize size;

    @Column(name = "temperament", length = 255)
    private String temperament;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private PetGender gender;

    @Column(name = "photos_json", columnDefinition = "json")
    private String photosJson;

    @ManyToOne
    @JoinColumn(name = "adopter_id")
    @JsonIgnoreProperties(value = { "applications", "adoptedPets" }, allowSetters = true)
    private Adopter adopter;

    public Pet() {
    }

    public enum PetStatus {
        Available, Pending, Adopted;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static PetStatus fromString(String key) {
            return key == null ? null
                    : PetStatus.valueOf(key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase());
        }
    }

    public enum PetSize {
        Small, Medium, Large;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static PetSize fromString(String key) {
            return key == null ? null
                    : PetSize.valueOf(key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase());
        }
    }

    public enum PetGender {
        Male, Female;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static PetGender fromString(String key) {
            return key == null ? null
                    : PetGender.valueOf(key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase());
        }
    }
}
