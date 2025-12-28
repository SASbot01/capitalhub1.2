package com.capitalhub.applications.controller;

import com.capitalhub.applications.dto.ApplicationResponse;
import com.capitalhub.applications.dto.ApplyRequest;
import com.capitalhub.applications.entity.ApplicationStatus;
import com.capitalhub.applications.service.JobApplicationService;
import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;
    private final UserRepository userRepository;

    // 1. REP: Aplicar a una oferta
    @PreAuthorize("hasAuthority('REP')")
    @PostMapping("/rep/jobs/{offerId}/apply")
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse apply(@PathVariable Long offerId,
                                     @Valid @RequestBody(required = false) ApplyRequest req,
                                     Authentication authentication) {
        Long repUserId = getUserIdFromAuth(authentication);
        if (req == null) req = new ApplyRequest();
        return applicationService.applyToOffer(repUserId, offerId, req);
    }

    // 2. REP: Ver mis aplicaciones
    @PreAuthorize("hasAuthority('REP')")
    @GetMapping("/rep/applications")
    public List<ApplicationResponse> myApplications(Authentication authentication) {
        Long repUserId = getUserIdFromAuth(authentication);
        return applicationService.listMyApplications(repUserId);
    }

    // 3. COMPANY: Ver aplicaciones de una oferta específica
    @PreAuthorize("hasAuthority('COMPANY')")
    @GetMapping("/company/jobs/{offerId}/applications")
    public List<ApplicationResponse> listApplicationsForOffer(@PathVariable Long offerId,
                                                              Authentication authentication) {
        Long companyUserId = getUserIdFromAuth(authentication);
        return applicationService.listApplicationsForOffer(companyUserId, offerId);
    }

    // 4. COMPANY: Ver TODAS las aplicaciones recibidas (Global) ✅ NUEVO ENDPOINT
    @PreAuthorize("hasAuthority('COMPANY')")
    @GetMapping("/company/applications")
    public List<ApplicationResponse> listAllCompanyApplications(Authentication authentication) {
        Long companyUserId = getUserIdFromAuth(authentication);
        return applicationService.listAllCompanyApplications(companyUserId);
    }

    // 5. COMPANY: Actualizar estado de una aplicación
    @PreAuthorize("hasAuthority('COMPANY')")
    @PatchMapping("/company/applications/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String companyNotes,
            @RequestParam(required = false) String interviewUrl,
            Authentication authentication
    ) {
        Long companyUserId = getUserIdFromAuth(authentication);
        return applicationService.updateApplicationStatus(
                companyUserId, id, status, companyNotes, interviewUrl
        );
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
        return user.getId();
    }
}