package com.capitalhub.subscription.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.subscription.dto.UserAccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Slf4j
public class UserAccessController {

    /**
     * Get current user's subscription access info
     * GET /api/v1/user/access
     */
    @GetMapping("/access")
    public ResponseEntity<UserAccessResponse> getUserAccess(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserAccessResponse response = UserAccessResponse.builder()
                .tier(user.getSubscriptionTier())
                .tierDisplayName(user.getSubscriptionTier() != null ?
                        user.getSubscriptionTier().getDisplayName() : null)
                .subscriptionActive(user.isSubscriptionActive())
                .fullFormationAccess(user.hasFullFormationAccess())
                .marketplaceAccess(user.hasMarketplaceAccess())
                .hasCertification(Boolean.TRUE.equals(user.getHasCertification()))
                .tierExpiresAt(user.getTierExpiresAt())
                .bootcampStartDate(user.getBootcampStartDate())
                .build();

        return ResponseEntity.ok(response);
    }
}
