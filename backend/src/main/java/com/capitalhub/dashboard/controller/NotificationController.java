package com.capitalhub.dashboard.controller;

import com.capitalhub.applications.entity.ApplicationStatus;
import com.capitalhub.applications.repository.JobApplicationRepository;
import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.company.repository.CompanyRepository;
import com.capitalhub.rep.repository.RepProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyRepository companyRepository;
    private final RepProfileRepository repProfileRepository;
    private final UserRepository userRepository;

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getNotificationCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Map<String, Long> counts = new HashMap<>();
        counts.put("pending", 0L);

        if (user.getRole().name().equals("COMPANY")) {
            companyRepository.findByUserId(user.getId()).ifPresent(company -> {
                // Corrected method name to match Repository
                long pendingApps = jobApplicationRepository.countByJobOffer_CompanyIdAndStatus(company.getId(),
                        ApplicationStatus.APPLIED);
                counts.put("pending", pendingApps);
            });
        } else if (user.getRole().name().equals("REP")) {
            repProfileRepository.findByUserId(user.getId()).ifPresent(rep -> {
                // Count applications in INTERVIEW or OFFER_SENT
                long pendingInteractions = jobApplicationRepository.findByRepId(rep.getId()).stream()
                        .filter(app -> app.getStatus() == ApplicationStatus.INTERVIEW
                                || app.getStatus() == ApplicationStatus.OFFER_SENT)
                        .count();
                counts.put("pending", pendingInteractions);
            });
        }

        return ResponseEntity.ok(counts);
    }
}
