package com.capitalhub.subscription.controller;

import com.capitalhub.subscription.dto.WebhookResponse;
import com.capitalhub.subscription.service.HotmartWebhookService;
import com.capitalhub.subscription.service.StripeWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final StripeWebhookService stripeWebhookService;
    private final HotmartWebhookService hotmartWebhookService;

    /**
     * Stripe webhook endpoint
     * POST /api/v1/webhooks/stripe
     */
    @PostMapping("/stripe")
    public ResponseEntity<WebhookResponse> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {

        log.info("Received Stripe webhook");

        try {
            stripeWebhookService.processWebhook(payload, sigHeader);

            return ResponseEntity.ok(WebhookResponse.builder()
                    .success(true)
                    .message("Webhook processed successfully")
                    .build());

        } catch (SecurityException e) {
            log.error("Stripe webhook signature validation failed", e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(WebhookResponse.builder()
                            .success(false)
                            .message("Invalid signature")
                            .build());

        } catch (Exception e) {
            log.error("Failed to process Stripe webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(WebhookResponse.builder()
                            .success(false)
                            .message("Webhook processing failed: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Hotmart webhook endpoint
     * POST /api/v1/webhooks/hotmart
     */
    @PostMapping("/hotmart")
    public ResponseEntity<WebhookResponse> handleHotmartWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Hotmart-Hottok", required = false) String hottokHeader) {

        log.info("Received Hotmart webhook");

        try {
            hotmartWebhookService.processWebhook(payload, hottokHeader);

            return ResponseEntity.ok(WebhookResponse.builder()
                    .success(true)
                    .message("Webhook processed successfully")
                    .build());

        } catch (SecurityException e) {
            log.error("Hotmart webhook signature validation failed", e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(WebhookResponse.builder()
                            .success(false)
                            .message("Invalid hottok")
                            .build());

        } catch (Exception e) {
            log.error("Failed to process Hotmart webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(WebhookResponse.builder()
                            .success(false)
                            .message("Webhook processing failed: " + e.getMessage())
                            .build());
        }
    }
}
