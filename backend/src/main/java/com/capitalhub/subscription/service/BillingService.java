package com.capitalhub.subscription.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.subscription.dto.CheckoutSessionRequest;
import com.capitalhub.subscription.dto.CheckoutSessionResponse;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final UserRepository userRepository;

    @Value("${stripe.api-key:}")
    private String stripeApiKey;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    // Map tier to Stripe Price IDs (to be configured)
    private final Map<SubscriptionTier, String> tierPriceIds = new HashMap<>();

    @PostConstruct
    public void init() {
        if (stripeApiKey != null && !stripeApiKey.isEmpty()) {
            Stripe.apiKey = stripeApiKey;
            log.info("Stripe API initialized");
        } else {
            log.warn("Stripe API key not configured");
        }
    }

    /**
     * Create a Stripe checkout session for tier upgrade
     */
    public CheckoutSessionResponse createCheckoutSession(Long userId, CheckoutSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SubscriptionTier tier = request.getTier();
        if (tier == null) {
            throw new IllegalArgumentException("Tier is required");
        }

        try {
            // Get or create Stripe customer
            String customerId = getOrCreateStripeCustomer(user);

            // Build checkout session
            SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                    .setMode(tier.isRecurring() ?
                            SessionCreateParams.Mode.SUBSCRIPTION :
                            SessionCreateParams.Mode.PAYMENT)
                    .setCustomer(customerId)
                    .setCustomerEmail(user.getEmail())
                    .setSuccessUrl(frontendUrl + "/subscription/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendUrl + "/upgrade")
                    .putMetadata("user_id", userId.toString())
                    .putMetadata("tier", tier.name());

            // Add line item
            String priceId = tierPriceIds.get(tier);
            if (priceId != null && !priceId.isEmpty()) {
                // Use configured Stripe Price ID
                paramsBuilder.addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build()
                );
            } else {
                // Create ad-hoc price (for testing or dynamic pricing)
                paramsBuilder.addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(tier.getPrice().multiply(BigDecimal.valueOf(100)).longValue())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(tier.getDisplayName() + " - CapitalHub FPD")
                                                                .setDescription(getProductDescription(tier))
                                                                .build()
                                                )
                                                .setRecurring(tier.isRecurring() ?
                                                        SessionCreateParams.LineItem.PriceData.Recurring.builder()
                                                                .setInterval(SessionCreateParams.LineItem.PriceData.Recurring.Interval.MONTH)
                                                                .build() : null)
                                                .build()
                                )
                                .setQuantity(1L)
                                .build()
                );
            }

            Session session = Session.create(paramsBuilder.build());

            log.info("Created checkout session {} for user {} tier {}", session.getId(), user.getEmail(), tier);

            return CheckoutSessionResponse.builder()
                    .sessionId(session.getId())
                    .url(session.getUrl())
                    .build();

        } catch (Exception e) {
            log.error("Failed to create checkout session for user {}", user.getEmail(), e);
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

    /**
     * Get or create Stripe customer for user
     */
    private String getOrCreateStripeCustomer(User user) throws Exception {
        if (user.getStripeCustomerId() != null && !user.getStripeCustomerId().isEmpty()) {
            return user.getStripeCustomerId();
        }

        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(user.getEmail())
                .setName(user.getFirstName() + " " + user.getLastName())
                .putMetadata("user_id", user.getId().toString())
                .build();

        Customer customer = Customer.create(params);

        // Save customer ID
        user.setStripeCustomerId(customer.getId());
        userRepository.save(user);

        return customer.getId();
    }

    /**
     * Get product description for tier
     */
    private String getProductDescription(SubscriptionTier tier) {
        switch (tier) {
            case T0:
                return "14 días de prueba - Formación completa durante 2 semanas";
            case T1:
                return "Membresía Completa - Formación completa + Bolsa de trabajo + Marketplace";
            case T2:
                return "High Ticket Intensivo - 4 meses de bootcamp + tutor + certificación";
            case T3:
                return "Membresía Pro - Certificación activa + acceso marketplace";
            case T4:
                return "Enterprise - Dashboard B2B para filtrado de candidatos";
            default:
                return "Suscripción CapitalHub FPD";
        }
    }

    /**
     * Configure Stripe Price IDs for tiers
     */
    public void configurePriceId(SubscriptionTier tier, String priceId) {
        tierPriceIds.put(tier, priceId);
    }
}
