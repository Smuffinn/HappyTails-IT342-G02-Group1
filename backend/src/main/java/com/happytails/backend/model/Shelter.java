package com.happytails.backend.model;

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
    private Set<Pet> pets;

    @OneToMany(mappedBy = "shelter")
    private Set<ShelterStaff> staff;
}
