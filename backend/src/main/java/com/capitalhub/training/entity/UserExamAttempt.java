package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_exam_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserExamAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "formation_id", nullable = false)
    private Long formationId;

    private Integer score;
    private Boolean passed = false;

    @Column(name = "attempted_at")
    private LocalDateTime attemptedAt = LocalDateTime.now();
}
