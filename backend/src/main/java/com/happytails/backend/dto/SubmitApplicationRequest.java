package com.happytails.backend.dto;

public class SubmitApplicationRequest {
    private Long petId;
    private String supplementaryAnswers;

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public String getSupplementaryAnswers() { return supplementaryAnswers; }
    public void setSupplementaryAnswers(String supplementaryAnswers) { this.supplementaryAnswers = supplementaryAnswers; }
}
