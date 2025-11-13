package com.happytails.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApplicationRequest {
    @NotNull
    private Long petId;

    @Size(max = 2000)
    private String supplementaryAnswers;

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }

    public String getSupplementaryAnswers() { return supplementaryAnswers; }
    public void setSupplementaryAnswers(String supplementaryAnswers) { this.supplementaryAnswers = supplementaryAnswers; }
}
