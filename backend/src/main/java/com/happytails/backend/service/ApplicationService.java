package com.happytails.backend.service;

import com.happytails.backend.model.Application;
import com.happytails.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Business logic for applications...
    // e.g., logic to approve an application and update pet status
}
