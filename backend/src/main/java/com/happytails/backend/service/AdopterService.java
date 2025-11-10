package com.happytails.backend.service;

import com.happytails.backend.model.Adopter;
import com.happytails.backend.repository.AdopterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdopterService {

    @Autowired
    private AdopterRepository adopterRepository;

    public List<Adopter> getAllAdopters() {
        return adopterRepository.findAll();
    }

    // Business logic for adopters...
}
