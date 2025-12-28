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
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository userRepository;
        private final RepProfileRepository repProfileRepository;
        private final CompanyRepository companyRepository; // ✅ Necesario para guardar la empresa
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final EmailService emailService;
        private final AuthenticationManager authenticationManager;

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
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña incorrectos"));

                var token = jwtService.generateToken(user);
                return buildResponse(user, token);
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