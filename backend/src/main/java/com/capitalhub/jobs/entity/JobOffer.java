package com.capitalhub.jobs.entity;

import com.capitalhub.company.entity.Company;
import com.capitalhub.rep.entity.RepRole;
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
@Table(name = "job_offers")
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private RepRole role; // SETTER, CLOSER

    private Integer seats;
    private Integer maxApplicants;

    @Builder.Default
    private Integer applicantsCount = 0;

    // Datos económicos y detalles
    private Double salary;
    private Double commissionPercent;
    private Double avgTicket;
    private Double estimatedMonthlyEarnings;

    private String language;
    private String crm;
    private String modality;
    private String market;

    // Links de entrevista
    private String calendlyUrl;
    private String zoomUrl;
    private String whatsappUrl;
    private String googleFormUrl;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private Boolean active;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}