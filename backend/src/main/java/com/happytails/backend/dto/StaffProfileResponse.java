package com.happytails.backend.dto;

import com.happytails.backend.model.Shelter;
import com.happytails.backend.model.ShelterStaff;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class StaffProfileResponse {
    private Long staffId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ShelterInfo shelter;

    @Getter
    @Setter
    public static class ShelterInfo {
        private Long shelterId;
        private String name;
        private String location;
        private String contactInfo;

        public static ShelterInfo from(Shelter shelter) {
            if (shelter == null) return null;
            ShelterInfo info = new ShelterInfo();
            info.setShelterId(shelter.getShelterId());
            info.setName(shelter.getName());
            info.setLocation(shelter.getLocation());
            info.setContactInfo(shelter.getContactInfo());
            return info;
        }
    }

    public static StaffProfileResponse from(ShelterStaff staff) {
        StaffProfileResponse response = new StaffProfileResponse();
        response.setStaffId(staff.getStaffId());
        response.setEmail(staff.getEmail());
        response.setFirstName(staff.getFirstName());
        response.setLastName(staff.getLastName());
        response.setPhoneNumber(staff.getPhoneNumber());
        response.setCreatedAt(staff.getCreatedAt());
        response.setUpdatedAt(staff.getUpdatedAt());
        response.setShelter(ShelterInfo.from(staff.getShelter()));
        return response;
    }
}
