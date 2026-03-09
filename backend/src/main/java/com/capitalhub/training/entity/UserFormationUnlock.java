package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_formation_unlocks",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "formation_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFormationUnlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "formation_id", nullable = false)
    private Long formationId;

    @Column(name = "route_id", nullable = false)
    private Long routeId;

    @Column(name = "unlock_type", nullable = false)
    private String unlockType; // FIRST_PAYMENT, COIN_SPENT, TRIAL

    @Column(name = "unlocked_at")
    @Builder.Default
    private LocalDateTime unlockedAt = LocalDateTime.now();
}
