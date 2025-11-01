package com.happytails.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "application")
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "adopter_id", nullable = false)
    private Adopter adopter;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ApplicationStatus status;

    @Column(name = "supplementary_answers", columnDefinition = "TEXT")
    private String supplementaryAnswers;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    public enum ApplicationStatus {
        Received, In_Review, Interview_Scheduled, Approved, Rejected
    }

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        status = ApplicationStatus.Received; // Default status on creation
    }
}
