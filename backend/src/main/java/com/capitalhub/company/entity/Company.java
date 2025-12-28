package com.capitalhub.company.entity;

import com.capitalhub.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String industry;
    private String website;

    @Column(name = "about", columnDefinition = "TEXT")
    private String description; // Mapeado a la columna 'about' del SQL

    private String videoOfferUrl;

    private String googleFormUrl;

    private String logoUrl;

    // Métricas
    private Integer projectionMrr;
    private Integer projectionGrowth;

    private LocalDateTime createdAt;
}