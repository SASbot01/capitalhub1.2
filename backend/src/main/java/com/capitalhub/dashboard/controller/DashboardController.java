package com.capitalhub.dashboard.controller;

import com.capitalhub.applications.entity.ApplicationStatus;
import com.capitalhub.applications.repository.JobApplicationRepository;
import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.jobs.repository.JobOfferRepository;
import com.capitalhub.rep.repository.RepProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rep/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final JobOfferRepository jobOfferRepository;
    private final RepProfileRepository repProfileRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('REP')")
    public ResponseEntity<Map<String, Object>> getStats(Principal principal) {
        Map<String, Object> stats = new HashMap<>();

        // Get current user and rep profile
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        var repProfile = repProfileRepository.findByUserId(user.getId()).orElseThrow();

        long totalOffers = jobOfferRepository.count();

        // Monthly stats (placeholder for now)
        Map<String, Object> monthlyStats = new HashMap<>();
        monthlyStats.put("callsMade", 0);
        monthlyStats.put("closures", 0);
        monthlyStats.put("avgTicket", 0);
        monthlyStats.put("estimatedCommission", 0);

        // Weekly activity stats
        Map<String, Object> weeklyActivity = new HashMap<>();
        weeklyActivity.put("callsThisWeek", repProfile.getCallsMadeThisWeek());
        weeklyActivity.put("callGoal", repProfile.getWeeklyCallGoal());
        weeklyActivity.put("meetingsThisWeek", repProfile.getMeetingsScheduledThisWeek());
        weeklyActivity.put("meetingsDelta",
                repProfile.getMeetingsScheduledThisWeek() - repProfile.getMeetingsScheduledLastWeek());

        // Count offers sent (applications in APPLIED status)
        long offersSent = jobApplicationRepository.findByRepId(repProfile.getId()).stream()
                .filter(app -> app.getStatus() == ApplicationStatus.APPLIED)
                .count();

        // Count pending offers (applications in INTERVIEW or OFFER_SENT status)
        long offersPending = jobApplicationRepository.findByRepId(repProfile.getId()).stream()
                .filter(app -> app.getStatus() == ApplicationStatus.INTERVIEW
                        || app.getStatus() == ApplicationStatus.OFFER_SENT)
                .count();

        weeklyActivity.put("offersSent", offersSent);
        weeklyActivity.put("offersPending", offersPending);

        stats.put("monthlyStats", monthlyStats);
        stats.put("weeklyActivity", weeklyActivity);
        stats.put("latestProcesses", Collections.emptyList());
        stats.put("totalOffers", totalOffers);

        return ResponseEntity.ok(stats);
    }
}