package com.happytails.backend.service;

import com.happytails.backend.model.Application;
import com.happytails.backend.model.Pet;
import com.happytails.backend.model.Adopter;
import com.happytails.backend.repository.ApplicationRepository;
import com.happytails.backend.repository.AdopterRepository;
import com.happytails.backend.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private AdopterRepository adopterRepository;

    @Autowired
    private PetRepository petRepository;


    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application submitApplication(Long adopterId, Long petId, String supplementaryAnswers) {
        Optional<Adopter> aOpt = adopterRepository.findById(adopterId);
        Optional<Pet> pOpt = petRepository.findById(petId);
        if (aOpt.isEmpty() || pOpt.isEmpty()) throw new IllegalArgumentException("Invalid adopter or pet id");

        Adopter adopter = aOpt.get();
        Pet pet = pOpt.get();

        // create application
        Application app = new Application();
        app.setAdopter(adopter);
        app.setPet(pet);
        app.setSupplementaryAnswers(supplementaryAnswers);

        // mark pet as Pending so others know there's an application in progress
        pet.setStatus(Pet.PetStatus.Pending);
        petRepository.save(pet);

        return applicationRepository.save(app);
    }

    public List<Application> getApplicationsForAdopter(Long adopterId) {
        return applicationRepository.findByAdopterAdopterId(adopterId);
    }

    public List<Application> getApplicationsForPet(Long petId) {
        return applicationRepository.findByPetPetId(petId);
    }

    public List<Application> getApplicationsForShelter(Long shelterId) {
        // naive approach: return all apps for pets that belong to shelter
        return applicationRepository.findAll().stream().filter(a -> a.getPet() != null && a.getPet().getShelter() != null && a.getPet().getShelter().getShelterId().equals(shelterId)).toList();
    }

    public Application updateApplicationStatus(Long applicationId, Application.ApplicationStatus newStatus) {
        Optional<Application> o = applicationRepository.findById(applicationId);
        if (o.isEmpty()) throw new IllegalArgumentException("Application not found");
        Application app = o.get();
        app.setStatus(newStatus);

        // when approved, set pet adopted and link adopter to pet
        if (newStatus == Application.ApplicationStatus.Approved) {
            Pet pet = app.getPet();
            pet.setStatus(Pet.PetStatus.Adopted);
            pet.setAdopter(app.getAdopter());
            petRepository.save(pet);
        }

        if (newStatus == Application.ApplicationStatus.Rejected) {
            Pet pet = app.getPet();
            if (pet.getStatus() == Pet.PetStatus.Pending) {
                pet.setStatus(Pet.PetStatus.Available);
                petRepository.save(pet);
            }
        }

        return applicationRepository.save(app);
    }
}
