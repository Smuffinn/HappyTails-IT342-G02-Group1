package com.happytails.backend.repository;

import com.happytails.backend.model.ShelterStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelterStaffRepository extends JpaRepository<ShelterStaff,Long> {
}
