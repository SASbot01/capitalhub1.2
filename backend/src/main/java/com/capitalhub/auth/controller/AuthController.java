package com.capitalhub.auth.controller;

import com.capitalhub.auth.dto.LoginRequest;
import com.capitalhub.auth.dto.LoginResponse;
import com.capitalhub.auth.dto.SignupRequest;
import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.auth.service.AuthenticationService;
import com.capitalhub.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionService subscriptionService;

    @PostMapping("/signup/rep")
    public ResponseEntity<LoginResponse> signupRep(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(service.signupRep(request));
    }

    @PostMapping("/signup/company")
    public ResponseEntity<LoginResponse> signupCompany(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(service.signupCompany(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No autenticado"));
        }

        User principal = (User) auth.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Contraseña actual y nueva son obligatorias"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "La nueva contraseña debe tener al menos 6 caracteres"));
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "La contraseña actual no es correcta"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
    }

    @PostMapping("/cancel-subscription")
    public ResponseEntity<?> cancelSubscription(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No autenticado"));
        }

        User principal = (User) auth.getPrincipal();

        try {
            subscriptionService.downgradeTier(principal.getId(), "USER_CANCELLED", "SELF_SERVICE");
            return ResponseEntity.ok(Map.of("message", "Suscripción cancelada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }
}
