package com.capitalhub.reviews.entity;

import com.capitalhub.company.entity.Company;
import com.capitalhub.jobs.entity.JobOffer;
import com.capitalhub.rep.entity.RepProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "reviews",
        indexes = {
                @Index(name = "idx_review_rep", columnList = "rep_id"),
                @Index(name = "idx_review_company", columnList = "company_id"),
                @Index(name = "idx_review_job", columnList = "job_offer_id")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Empresa que deja la review
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // Comercial evaluado
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "rep_id", nullable = false)
    private RepProfile rep;

    // Oferta relacionada (opcional pero útil para trazabilidad)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_offer_id")
    private JobOffer jobOffer;

    // Rating 1–5
    @Column(nullable = false)
    private Integer rating;

    // Comentario de la empresa
    @Column(length = 1500)
    private String comment;

    // Métricas “conseguidas” durante el trabajo
    private Integer callsMade;
    private Integer dealsClosed;
    private Double generatedRevenue;

    @Column(nullable = false)
    private Boolean visible = true; // admin puede ocultar si hay abuso

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (visible == null) visible = true;
    }

    // Validación ligera de rating
    public void setRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating debe estar entre 1 y 5");
        }
        this.rating = rating;
    }
}

