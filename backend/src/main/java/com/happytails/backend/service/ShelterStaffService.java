package com.happytails.backend.service;

import com.happytails.backend.repository.ShelterStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShelterStaffService {

    @Autowired
    private ShelterStaffRepository shelterStaffRepository;


}
