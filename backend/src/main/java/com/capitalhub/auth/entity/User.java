package com.capitalhub.auth.entity;

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