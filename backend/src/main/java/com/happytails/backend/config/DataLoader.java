package com.happytails.backend.config;

import com.happytails.backend.model.Shelter;
import com.happytails.backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ShelterRepository shelterRepository;

    @Override
    public void run(String... args) throws Exception {
        // Load sample shelters if none exist
        if (shelterRepository.count() == 0) {
            Shelter shelter1 = new Shelter();
            shelter1.setName("Happy Paws Shelter");
            shelter1.setLocation("Cebu City, Philippines");
            shelter1.setContactInfo("contact@happypaws.com, +63-917-123-4567");

            Shelter shelter2 = new Shelter();
            shelter2.setName("Cebu Animal Rescue");
            shelter2.setLocation("Mandaue City, Cebu");
            shelter2.setContactInfo("info@ceburescue.org, +63-918-234-5678");

            Shelter shelter3 = new Shelter();
            shelter3.setName("Pet Haven Cebu");
            shelter3.setLocation("Lapu-Lapu City, Cebu");
            shelter3.setContactInfo("hello@pethavencebu.com, +63-919-345-6789");

            Shelter shelter4 = new Shelter();
            shelter4.setName("Guardian Angels Pet Sanctuary");
            shelter4.setLocation("Talisay City, Cebu");
            shelter4.setContactInfo("guardians@petangels.ph, +63-920-456-7890");

            Shelter shelter5 = new Shelter();
            shelter5.setName("Hope for Paws Cebu");
            shelter5.setLocation("Consolacion, Cebu");
            shelter5.setContactInfo("hope@pawscebu.org, +63-921-567-8901");

            shelterRepository.save(shelter1);
            shelterRepository.save(shelter2);
            shelterRepository.save(shelter3);
            shelterRepository.save(shelter4);
            shelterRepository.save(shelter5);

            System.out.println("Sample shelters loaded successfully!");
        }
    }
}