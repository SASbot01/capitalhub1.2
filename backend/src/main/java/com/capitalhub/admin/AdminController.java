package com.capitalhub.admin;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.service.AuthenticationService;
import com.capitalhub.auth.service.EmailService;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AuthenticationService authenticationService;
    private final SubscriptionService subscriptionService;
    private final EmailService emailService;

    @Value("${app.admin-key:#{null}}")
    private String adminKey;

    /**
     * Bulk-create user accounts, assign subscription tier, and send welcome email.
     *
     * Usage:
     * POST /api/admin/bulk-create
     * Header: X-Admin-Key: <configured key>
     * Body: { "accounts": [{ "email": "...", "tier": "T1" }, ...] }
     */
    @PostMapping("/bulk-create")
    public ResponseEntity<?> bulkCreate(
            @RequestHeader("X-Admin-Key") String key,
            @RequestBody BulkCreateRequest request) {

        // Validate admin key
        if (adminKey == null || adminKey.isEmpty() || !adminKey.equals(key)) {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid admin key"));
        }

        List<Map<String, String>> results = new ArrayList<>();

        for (BulkCreateRequest.AccountEntry entry : request.getAccounts()) {
            Map<String, String> result = new HashMap<>();
            result.put("email", entry.getEmail());

            try {
                // Generate random password
                String plainPassword = authenticationService.generateRandomPassword();

                // Create user account (or get existing)
                User user = authenticationService.autoCreateUserFromPayment(entry.getEmail(), plainPassword);

                // Assign subscription tier
                SubscriptionTier tier = entry.getTier() != null ? entry.getTier() : SubscriptionTier.T1;
                subscriptionService.upgradeTier(user, tier, "ADMIN", "BULK_CREATE", tier.getPrice());

                // Send custom welcome email
                emailService.sendCustomWelcomeEmail(entry.getEmail(), plainPassword);

                result.put("status", "OK");
                result.put("tier", tier.name());
                result.put("password", plainPassword);
                log.info("Bulk-created account for {} with tier {}", entry.getEmail(), tier);

            } catch (Exception e) {
                result.put("status", "ERROR");
                result.put("error", e.getMessage());
                log.error("Error creating account for {}: {}", entry.getEmail(), e.getMessage());
            }

            results.add(result);
        }

        return ResponseEntity.ok(Map.of("results", results));
    }
}
