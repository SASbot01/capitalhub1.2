package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_certifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCertification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "formation_id", nullable = false)
    private Long formationId;

    @Column(name = "route_id", nullable = false)
    private Long routeId;

    private Integer examScore;
    private Boolean passed = false;

    @Column(name = "certified_at")
    private LocalDateTime certifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
