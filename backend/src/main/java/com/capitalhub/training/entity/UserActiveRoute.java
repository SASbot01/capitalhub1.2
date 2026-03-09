package com.capitalhub.training.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_active_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActiveRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "route_id", nullable = false)
    private Long routeId;

    @Column(name = "activated_at")
    @Builder.Default
    private LocalDateTime activatedAt = LocalDateTime.now();
}
