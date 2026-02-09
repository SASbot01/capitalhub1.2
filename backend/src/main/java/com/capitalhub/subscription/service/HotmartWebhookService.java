package com.capitalhub.subscription.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.subscription.entity.PaymentEvent;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.repository.PaymentEventRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotmartWebhookService {

    private final SubscriptionService subscriptionService;
    private final PaymentEventRepository paymentEventRepository;
    private final ObjectMapper objectMapper;

    @Value("${hotmart.hottok:}")
    private String hottok;

    /**
     * Validate Hotmart webhook signature
     */
    public boolean validateSignature(String providedHottok) {
        if (hottok == null || hottok.isEmpty()) {
            log.warn("Hotmart hottok validation is disabled");
            return true;
        }
        return hottok.equals(providedHottok);
    }

    /**
     * Process incoming Hotmart webhook
     */
    @Transactional
    public void processWebhook(String payload, String hottokHeader) throws Exception {
        // Validate signature
        if (!validateSignature(hottokHeader)) {
            throw new SecurityException("Invalid Hotmart hottok");
        }

        JsonNode json = objectMapper.readTree(payload);

        String eventType = json.path("event").asText();
        String transactionId = json.path("data").path("purchase").path("transaction").asText();

        if (transactionId == null || transactionId.isEmpty()) {
            transactionId = "hotmart-" + System.currentTimeMillis();
        }

        // Check for duplicate events
        if (paymentEventRepository.existsByEventId(transactionId)) {
            log.info("Duplicate Hotmart event ignored: {}", transactionId);
            return;
        }

        // Log the event
        PaymentEvent paymentEvent = PaymentEvent.builder()
                .provider("HOTMART")
                .eventType(eventType)
                .eventId(transactionId)
                .payload(payload)
                .build();
        paymentEventRepository.save(paymentEvent);

        try {
            handleEvent(eventType, json, paymentEvent);
            paymentEvent.markProcessed();
        } catch (Exception e) {
            paymentEvent.markFailed(e.getMessage());
            log.error("Failed to process Hotmart event: {}", transactionId, e);
            throw e;
        } finally {
            paymentEventRepository.save(paymentEvent);
        }
    }

    /**
     * Handle specific Hotmart event types
     */
    private void handleEvent(String eventType, JsonNode json, PaymentEvent paymentEvent) {
        switch (eventType.toUpperCase()) {
            case "PURCHASE_APPROVED":
            case "PURCHASE_COMPLETE":
                handlePurchaseApproved(json);
                break;

            case "PURCHASE_REFUNDED":
            case "PURCHASE_CHARGEBACK":
                handlePurchaseRefunded(json);
                break;

            case "SUBSCRIPTION_CANCELLATION":
            case "CANCEL_SUBSCRIPTION":
                handleSubscriptionCancellation(json);
                break;

            case "PURCHASE_DELAYED":
            case "PURCHASE_BILLET_PRINTED":
                log.info("Purchase pending payment: {}", eventType);
                break;

            default:
                log.info("Unhandled Hotmart event type: {}", eventType);
        }
    }

    /**
     * Handle PURCHASE_APPROVED event
     */
    private void handlePurchaseApproved(JsonNode json) {
        JsonNode buyer = json.path("data").path("buyer");
        JsonNode purchase = json.path("data").path("purchase");
        JsonNode product = json.path("data").path("product");

        String email = buyer.path("email").asText();
        String transactionId = purchase.path("transaction").asText();
        BigDecimal price = new BigDecimal(purchase.path("price").path("value").asText("0"));
        String productId = product.path("id").asText();

        if (email == null || email.isEmpty()) {
            log.error("No buyer email in Hotmart purchase");
            return;
        }

        // Determine tier from price or product ID
        SubscriptionTier tier = determineTierFromHotmart(price, productId);
        if (tier == null) {
            log.error("Could not determine tier from Hotmart purchase. Price: {}, Product: {}", price, productId);
            return;
        }

        log.info("Processing Hotmart purchase for {} - Price: {} - Tier: {}", email, price, tier);

        // Upgrade user
        subscriptionService.upgradeTierByEmail(
                email,
                tier,
                "HOTMART",
                transactionId,
                price
        );
    }

    /**
     * Handle PURCHASE_REFUNDED event
     */
    private void handlePurchaseRefunded(JsonNode json) {
        JsonNode buyer = json.path("data").path("buyer");
        String email = buyer.path("email").asText();

        if (email == null || email.isEmpty()) {
            log.error("No buyer email in Hotmart refund");
            return;
        }

        // Downgrade user
        subscriptionService.downgradeTierByEmail(
                email,
                "PURCHASE_REFUNDED",
                "HOTMART"
        );

        log.info("User {} downgraded due to Hotmart refund", email);
    }

    /**
     * Handle SUBSCRIPTION_CANCELLATION event
     */
    private void handleSubscriptionCancellation(JsonNode json) {
        JsonNode subscriber = json.path("data").path("subscriber");
        String email = subscriber.path("email").asText();

        if (email == null || email.isEmpty()) {
            // Try buyer path as fallback
            email = json.path("data").path("buyer").path("email").asText();
        }

        if (email == null || email.isEmpty()) {
            log.error("No email in Hotmart subscription cancellation");
            return;
        }

        // Downgrade user
        subscriptionService.downgradeTierByEmail(
                email,
                "SUBSCRIPTION_CANCELLED",
                "HOTMART"
        );

        log.info("User {} subscription cancelled via Hotmart", email);
    }

    /**
     * Determine tier from Hotmart price or product ID
     */
    private SubscriptionTier determineTierFromHotmart(BigDecimal price, String productId) {
        // First try to match by price
        SubscriptionTier tier = SubscriptionTier.fromAmount(price);
        if (tier != null) {
            return tier;
        }

        // Fallback: Match by product ID patterns
        // These would be configured based on actual Hotmart product IDs
        if (productId != null) {
            if (productId.contains("trial") || productId.contains("prueba")) {
                return SubscriptionTier.T0;
            }
            if (productId.contains("basic") || productId.contains("basico")) {
                return SubscriptionTier.T1;
            }
            if (productId.contains("bootcamp") || productId.contains("intensivo")) {
                return SubscriptionTier.T2;
            }
            if (productId.contains("pro") || productId.contains("profesional")) {
                return SubscriptionTier.T3;
            }
            if (productId.contains("enterprise") || productId.contains("empresa")) {
                return SubscriptionTier.T4;
            }
        }

        return null;
    }
}
