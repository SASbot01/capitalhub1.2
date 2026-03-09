package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "modules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "formation_id", nullable = false)
    private Long formationId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer displayOrder;

    @Column(name = "content_type")
    private String contentType = "TECHNICAL"; // TECHNICAL or MINDSET

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
