package com.happytails.backend.repository;

import com.happytails.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // Example custom queries
    List<Application> findByAdopterAdopterId(Long adopterId);
    List<Application> findByPetPetId(Long petId);
}
