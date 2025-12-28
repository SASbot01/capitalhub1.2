package com.capitalhub.auth.repository;

import com.capitalhub.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Buscar usuario por email (usado en Login)
    Optional<User> findByEmail(String email);
    
    // Verificar si existe (usado en Registro para no duplicar)
    boolean existsByEmail(String email);
    
    // Buscar usuario por token de reset (usado en Reset Password)
    Optional<User> findByResetToken(String resetToken);
}