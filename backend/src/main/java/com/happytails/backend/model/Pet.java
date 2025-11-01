package com.happytails.backend.model;

import jakarta.persistence.*;
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
    private Shelter shelter;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "species", length = 50)
    private String species;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PetStatus status;

    @Column(name = "description", columnDefinition = "TEXT")
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

    @Column(name = "photos_json", columnDefinition = "json")
    private String photosJson;

    public enum PetStatus {
        Available, Pending, Adopted
    }

    public enum PetSize {
        Small, Medium, Large
    }
}
