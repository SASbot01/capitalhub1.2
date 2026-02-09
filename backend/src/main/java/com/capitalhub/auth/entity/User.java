package com.capitalhub.auth.entity;

import com.capitalhub.subscription.entity.SubscriptionTier;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, COMPANY, REP

    // Coincide con la columna is_active de tu SQL
    @Column(name = "is_active")
    @Builder.Default
    private Boolean active = true;

    // Campos para reset de contraseña
    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    // --- Campos de Suscripción ---
    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_tier")
    private SubscriptionTier subscriptionTier;

    @Column(name = "has_certification")
    @Builder.Default
    private Boolean hasCertification = false;

    @Column(name = "bootcamp_start_date")
    private LocalDateTime bootcampStartDate;

    @Column(name = "marketplace_visible")
    @Builder.Default
    private Boolean marketplaceVisible = false;

    @Column(name = "tier_expires_at")
    private LocalDateTime tierExpiresAt;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    // --- Métodos de Suscripción ---

    /**
     * Check if the subscription is currently active (not expired)
     */
    public boolean isSubscriptionActive() {
        if (subscriptionTier == null) return false;
        if (tierExpiresAt == null) return true; // Recurring subscriptions without expiry
        return LocalDateTime.now().isBefore(tierExpiresAt);
    }

    /**
     * Check if user can access a specific tier level
     */
    public boolean canAccessTier(SubscriptionTier required) {
        if (!isSubscriptionActive()) return false;
        if (required == null) return true;
        return subscriptionTier.canAccess(required);
    }

    /**
     * Check if user has marketplace access
     */
    public boolean hasMarketplaceAccess() {
        return isSubscriptionActive() &&
               subscriptionTier != null &&
               subscriptionTier.hasMarketplaceAccess() &&
               Boolean.TRUE.equals(marketplaceVisible);
    }

    /**
     * Check if user has full formation access (not just intro modules)
     */
    public boolean hasFullFormationAccess() {
        return isSubscriptionActive() &&
               subscriptionTier != null &&
               subscriptionTier.hasFullFormationAccess();
    }

    // --- Métodos de Spring Security ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 🚀 CORRECCIÓN CRÍTICA: Devolvemos solo el nombre (ej: "REP")
        // para que coincida con @PreAuthorize("hasAuthority('REP')") en tus controladores.
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Si el campo es nulo, asumimos true para no bloquear
        return active != null ? active : true;
    }
}