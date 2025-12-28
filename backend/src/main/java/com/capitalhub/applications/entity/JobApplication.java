package com.capitalhub.applications.entity;

import com.capitalhub.jobs.entity.JobOffer;
import com.capitalhub.rep.entity.RepProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rep_id", nullable = false)
    private RepProfile rep;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_offer_id", nullable = false)
    private JobOffer jobOffer;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(columnDefinition = "TEXT")
    private String repMessage;

    @Column(columnDefinition = "TEXT")
    private String companyNotes;

    private String interviewUrl;

    private LocalDateTime interviewAt;
    private LocalDateTime hiredAt;
    private LocalDateTime rejectedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Métodos helper de lógica
    public void markInterview(String url) {
        this.status = ApplicationStatus.INTERVIEW;
        this.interviewUrl = url;
        this.interviewAt = LocalDateTime.now();
    }
    public void markHired() { 
        this.status = ApplicationStatus.HIRED; 
        this.hiredAt = LocalDateTime.now();
    }
    public void markRejected(String notes) {
        this.status = ApplicationStatus.REJECTED;
        this.companyNotes = notes;
        this.rejectedAt = LocalDateTime.now();
    }
}