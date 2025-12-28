package com.capitalhub.rep.entity;

import com.capitalhub.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rep_profiles")
public class RepProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    private RepRole roleType; // SETTER, CLOSER, etc.

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String phone;
    private String city;
    private String country;

    private String linkedinUrl;
    private String portfolioUrl;
    private String avatarUrl;
    private String introVideoUrl;
    private String bestCallUrl;

    @Builder.Default
    private Boolean active = true;

    private LocalDateTime createdAt;

    // Weekly activity tracking for dashboard
    @Builder.Default
    private Integer callsMadeThisWeek = 0;

    @Builder.Default
    private Integer callsMadeLastWeek = 0;

    @Builder.Default
    private Integer weeklyCallGoal = 45;

    @Builder.Default
    private Integer meetingsScheduledThisWeek = 0;

    @Builder.Default
    private Integer meetingsScheduledLastWeek = 0;

    // ✅ MÉTODO CLAVE QUE FALTABA
    public String getFullName() {
        if (user != null) {
            return user.getFirstName() + " " + user.getLastName();
        }
        return "Usuario Desconocido";
    }
}