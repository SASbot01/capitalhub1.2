package com.capitalhub.jobs.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.jobs.dto.JobOfferRequest;
import com.capitalhub.jobs.dto.JobOfferResponse;
import com.capitalhub.jobs.entity.JobStatus;
import com.capitalhub.jobs.service.JobOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    // 1. COMPANY: Crear una nueva oferta
    @PreAuthorize("hasAuthority('COMPANY')")
    @PostMapping("/company/jobs")
    @ResponseStatus(HttpStatus.CREATED)
    public JobOfferResponse createOffer(@Valid @RequestBody JobOfferRequest req,
                                        Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return jobOfferService.createOffer(user.getId(), req);
    }

    // 2. EMPRESA: Ver las ofertas que ha creado esa empresa
    @PreAuthorize("hasAuthority('COMPANY')")
    @GetMapping("/company/jobs")
    public List<JobOfferResponse> listCompanyOffers(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return jobOfferService.listCompanyOffers(user.getId());
    }

    // 3. EMPRESA: Cambiar estado de oferta (Abrir/Cerrar)
    @PreAuthorize("hasAuthority('COMPANY')")
    @PatchMapping("/company/jobs/{id}/status")
    public JobOfferResponse updateStatus(@PathVariable Long id,
                                         @RequestParam JobStatus status,
                                         Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return jobOfferService.updateStatus(user.getId(), id, status);
    }

    // 4. COMERCIAL: Ver ofertas disponibles (Mercado)
    // Usamos el método listAllActiveOffers() para asegurar que ves datos en el MVP
    @PreAuthorize("hasAuthority('REP')")
    @GetMapping("/rep/jobs")
    public List<JobOfferResponse> listOffersForRep() {
        return jobOfferService.listAllActiveOffers();
    }

    // 5. DETALLE: Ver una oferta específica (Público para usuarios logueados)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/jobs/{id}")
    public JobOfferResponse getOffer(@PathVariable Long id) {
        return jobOfferService.getOffer(id);
    }
}