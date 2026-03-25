package com.capitalhub.auth.service;

import com.capitalhub.auth.dto.LoginRequest;
import com.capitalhub.auth.dto.LoginResponse;
import com.capitalhub.auth.dto.SignupRequest;
import com.capitalhub.auth.entity.Role;
import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.company.entity.Company;
import com.capitalhub.company.repository.CompanyRepository;
import com.capitalhub.config.JwtService;
import com.capitalhub.rep.entity.RepProfile;
import com.capitalhub.rep.entity.RepRole;
import com.capitalhub.rep.repository.RepProfileRepository;
import com.capitalhub.subscription.entity.PendingPayment;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.repository.PendingPaymentRepository;
import com.capitalhub.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

        private final UserRepository userRepository;
        private final RepProfileRepository repProfileRepository;
        private final CompanyRepository companyRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final EmailService emailService;
        private final AuthenticationManager authenticationManager;
        private final SubscriptionService subscriptionService;
        private final PendingPaymentRepository pendingPaymentRepository;

        @Transactional
        public LoginResponse signupRep(SignupRequest request) {
                // 1. Validar email
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new IllegalArgumentException("Ya existe un usuario con ese email");
                }

                // 2. Crear Usuario Base
                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.REP)
                                .build();

                userRepository.save(user);

                // 3. Crear Perfil de Comercial (Vacio por defecto)
                var repProfile = RepProfile.builder()
                                .user(user)
                                .roleType(RepRole.SETTER) // Default temporal
                                .active(true)
                                .bio("Nuevo comercial registrado")
                                .country("Sin definir")
                                .build();

                repProfileRepository.save(repProfile);

                // 3.5. Asignar tier según pago pendiente (token) o trial directo
                Optional<PendingPayment> pendingPayment = Optional.empty();
                if (request.getToken() != null && !request.getToken().isEmpty()) {
                        pendingPayment = pendingPaymentRepository.findByTokenAndUsedFalse(request.getToken());
                }

                if (pendingPayment.isPresent()) {
                        // Pago verificado via Stripe -> asignar tier del pago
                        PendingPayment payment = pendingPayment.get();
                        subscriptionService.upgradeTier(
                                user,
                                payment.getTier(),
                                payment.getProvider(),
                                payment.getPaymentReference(),
                                payment.getAmount()
                        );
                        if (payment.getStripeCustomerId() != null) {
                                subscriptionService.updateStripeCustomerId(user.getId(), payment.getStripeCustomerId());
                        }
                        payment.markUsed();
                        pendingPaymentRepository.save(payment);
                        log.info("Pending payment redeemed for {} - Tier: {}", user.getEmail(), payment.getTier());
                }
                // Trial is now started separately via POST /api/v1/trial/start
                // after the user selects a route and formation in onboarding

                // 4. Generar Token
                var token = jwtService.generateToken(user);

                // 5. Enviar Email de Bienvenida
                emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

                return buildResponse(user, token);
        }

        @Transactional
        public LoginResponse signupCompany(SignupRequest request) {
                // 1. Validar email
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new IllegalArgumentException("Ya existe un usuario con ese email");
                }

                // 2. Crear Usuario Base
                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.COMPANY)
                                .build();

                userRepository.save(user);

                // 3. Crear Perfil de Empresa (Con datos por defecto para que no falle SQL)
                var company = Company.builder()
                                .user(user)
                                .name(request.getFirstName() + " Company") // Nombre temporal
                                .industry("General")
                                .website("https://pending-setup.com")
                                .description("Cuenta de empresa recién creada.")
                                .build();

                companyRepository.save(company);

                // 4. Generar Token
                var token = jwtService.generateToken(user);

                // 5. Enviar Email de Bienvenida
                emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

                return buildResponse(user, token);
        }

        public LoginResponse login(LoginRequest request) {
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));
                } catch (BadCredentialsException e) {
                        throw new IllegalArgumentException("Usuario o contraseña incorrectos");
                }

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña incorrectos"));

                var token = jwtService.generateToken(user);
                return buildResponse(user, token);
        }

        /**
         * Auto-create a REP user from Stripe payment (no manual registration needed).
         * Accepts a plain-text password so it can be emailed to the user.
         */
        @Transactional
        public User autoCreateUserFromPayment(String email, String plainPassword) {
                // Check if user already exists
                if (userRepository.findByEmail(email).isPresent()) {
                        return userRepository.findByEmail(email).get();
                }

                // Extract name from email (before @)
                String namePart = email.split("@")[0]
                        .replaceAll("[._-]", " ")
                        .trim();
                String firstName = namePart.isEmpty() ? "Usuario" : capitalize(namePart);

                // Create user
                var user = User.builder()
                        .firstName(firstName)
                        .lastName("")
                        .email(email)
                        .password(passwordEncoder.encode(plainPassword))
                        .role(Role.REP)
                        .build();
                userRepository.save(user);

                // Create default RepProfile
                var repProfile = RepProfile.builder()
                        .user(user)
                        .roleType(RepRole.SETTER)
                        .active(true)
                        .bio("Cuenta creada automáticamente")
                        .country("Sin definir")
                        .build();
                repProfileRepository.save(repProfile);

                log.info("Auto-created user account for: {}", email);
                return user;
        }

        /**
         * Get the plain password for a freshly auto-created user.
         * Called only from the webhook flow.
         */
        public String generateRandomPassword() {
                String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
                SecureRandom random = new SecureRandom();
                StringBuilder sb = new StringBuilder(10);
                for (int i = 0; i < 10; i++) {
                        sb.append(chars.charAt(random.nextInt(chars.length())));
                }
                return sb.toString();
        }

        private String capitalize(String s) {
                if (s == null || s.isEmpty()) return s;
                return Character.toUpperCase(s.charAt(0)) + s.substring(1);
        }

        private LoginResponse buildResponse(User user, String token) {
                return LoginResponse.builder()
                                .accessToken(token)
                                .tokenType("Bearer")
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .build();
        }
}