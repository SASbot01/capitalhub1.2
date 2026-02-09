package com.capitalhub.subscription.controller;

import com.capitalhub.auth.entity.User;
import com.capitalhub.subscription.dto.CheckoutSessionRequest;
import com.capitalhub.subscription.dto.CheckoutSessionResponse;
import com.capitalhub.subscription.service.BillingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
@Slf4j
public class BillingController {

    private final BillingService billingService;

    /**
     * Create a checkout session for subscription upgrade
     * POST /api/v1/billing/create-session
     */
    @PostMapping("/create-session")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            @AuthenticationPrincipal User user,
            @RequestBody CheckoutSessionRequest request) {

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Creating checkout session for user {} tier {}", user.getEmail(), request.getTier());

        try {
            CheckoutSessionResponse response = billingService.createCheckoutSession(user.getId(), request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Failed to create checkout session", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
