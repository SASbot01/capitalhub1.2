package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_active_formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActiveFormation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "formation_id", nullable = false)
    private Long formationId;

    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();
}
