package com.capitalhub.dashboard.controller;

import com.capitalhub.applications.repository.JobApplicationRepository;
import com.capitalhub.auth.entity.User;
import com.capitalhub.company.entity.Company;
import com.capitalhub.company.repository.CompanyRepository;
import com.capitalhub.jobs.repository.JobOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/company/dashboard")
@RequiredArgsConstructor
public class CompanyDashboardController {

    private final CompanyRepository companyRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository applicationRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('COMPANY')")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        Company company = companyRepository.findByUserId(user.getId())
                .orElse(null);

        Map<String, Object> stats = new HashMap<>();
        
        if (company == null) {
            stats.put("activeJobs", 0);
            stats.put("totalApplications", 0);
            stats.put("pendingApplications", 0);
            stats.put("hiredCount", 0);
            return ResponseEntity.ok(stats);
        }

        // Contar ofertas activas de esta empresa
        long activeJobs = jobOfferRepository.countByCompanyIdAndActive(company.getId(), true);
        
        // Contar aplicaciones totales a las ofertas de esta empresa
        long totalApplications = applicationRepository.countByJobOffer_CompanyId(company.getId());
        
        // Contar aplicaciones pendientes (status = APPLIED)
        long pendingApplications = applicationRepository.countByJobOffer_CompanyIdAndStatus(
            company.getId(), 
            com.capitalhub.applications.entity.ApplicationStatus.APPLIED
        );
        
        // Contar contratados
        long hiredCount = applicationRepository.countByJobOffer_CompanyIdAndStatus(
            company.getId(), 
            com.capitalhub.applications.entity.ApplicationStatus.HIRED
        );

        stats.put("activeJobs", activeJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("pendingApplications", pendingApplications);
        stats.put("hiredCount", hiredCount);
        stats.put("companyName", company.getName());
        
        return ResponseEntity.ok(stats);
    }
}

