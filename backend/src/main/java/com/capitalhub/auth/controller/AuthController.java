package com.capitalhub.auth.controller;

import com.capitalhub.auth.dto.LoginRequest;
import com.capitalhub.auth.dto.LoginResponse;
import com.capitalhub.auth.dto.SignupRequest;
import com.capitalhub.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // 👈 Asegura que la base es esta
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;

    @PostMapping("/signup/rep")
    public ResponseEntity<LoginResponse> signupRep(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(service.signupRep(request));
    }

    @PostMapping("/signup/company")
    public ResponseEntity<LoginResponse> signupCompany(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(service.signupCompany(request));
    }

    @PostMapping("/login") // 👈 Esto completa la ruta: /api/auth/login
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(service.login(request));
    }
}