package com.capitalhub.company.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.company.dto.CompanyProfileResponse;
import com.capitalhub.company.dto.CompanyProfileUpdateRequest;
import com.capitalhub.company.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // ✅ Obtener perfil de empresa
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('COMPANY')")
    public ResponseEntity<CompanyProfileResponse> getMyProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(companyService.getMyProfile(user.getId()));
    }

    // ✅ Actualizar perfil de empresa
    @PutMapping("/me")
    @PreAuthorize("hasAuthority('COMPANY')")
    public ResponseEntity<CompanyProfileResponse> updateMyProfile(
            @Valid @RequestBody CompanyProfileUpdateRequest req,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(companyService.updateMyProfile(user.getId(), req));
    }
}
