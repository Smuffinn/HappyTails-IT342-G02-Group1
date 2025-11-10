package com.happytails.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "shelter")
@Getter
@Setter
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shelter_id")
    private Long shelterId;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "location", columnDefinition = "TEXT")
    private String location;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @OneToMany(mappedBy = "shelter")
    @JsonManagedReference
    private Set<Pet> pets;

    @OneToMany(mappedBy = "shelter")
    @JsonManagedReference
    private Set<ShelterStaff> staff;
}
