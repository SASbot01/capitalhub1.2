package com.capitalhub.subscription.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.auth.service.EmailService;
import com.capitalhub.subscription.entity.PaymentEvent;
import com.capitalhub.subscription.entity.PendingPayment;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.repository.PaymentEventRepository;
import com.capitalhub.subscription.repository.PendingPaymentRepository;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookService {

    private final SubscriptionService subscriptionService;
    private final CoinService coinService;
    private final PaymentEventRepository paymentEventRepository;
    private final PendingPaymentRepository pendingPaymentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    /**
     * Process incoming Stripe webhook
     */
    @Transactional
    public void processWebhook(String payload, String sigHeader) throws Exception {
        Event event;

        // Verify webhook signature if secret is configured
        if (webhookSecret != null && !webhookSecret.isEmpty()) {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } else {
            event = Event.GSON.fromJson(payload, Event.class);
            log.warn("Stripe webhook signature verification is disabled");
        }

        // Check for duplicate events
        if (paymentEventRepository.existsByEventId(event.getId())) {
            log.info("Duplicate Stripe event ignored: {}", event.getId());
            return;
        }

        // Log the event
        PaymentEvent paymentEvent = PaymentEvent.builder()
                .provider("STRIPE")
                .eventType(event.getType())
                .eventId(event.getId())
                .payload(payload)
                .build();
        paymentEventRepository.save(paymentEvent);

        try {
            handleEvent(event, paymentEvent);
            paymentEvent.markProcessed();
        } catch (Exception e) {
            paymentEvent.markFailed(e.getMessage());
            log.error("Failed to process Stripe event: {}", event.getId(), e);
            throw e;
        } finally {
            paymentEventRepository.save(paymentEvent);
        }
    }

    /**
     * Handle specific event types
     */
    private void handleEvent(Event event, PaymentEvent paymentEvent) {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;

        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else {
            log.error("Deserialization failed for event: {}", event.getId());
            return;
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutCompleted((Session) stripeObject);
                break;

            case "invoice.paid":
                handleInvoicePaid((Invoice) stripeObject);
                break;

            case "invoice.payment_failed":
                handlePaymentFailed((Invoice) stripeObject);
                break;

            case "customer.subscription.deleted":
                handleSubscriptionCancelled(stripeObject);
                break;

            default:
                log.info("Unhandled Stripe event type: {}", event.getType());
        }
    }

    /**
     * Handle checkout.session.completed event
     */
    private void handleCheckoutCompleted(Session session) {
        String customerEmail = session.getCustomerEmail();
        String customerId = session.getCustomer();
        Long amountTotal = session.getAmountTotal();

        if (customerEmail == null) {
            log.error("No customer email in checkout session");
            return;
        }

        // Convert amount from cents to euros
        BigDecimal amount = BigDecimal.valueOf(amountTotal).divide(BigDecimal.valueOf(100));

        // Determine tier from amount
        SubscriptionTier tier = SubscriptionTier.fromAmount(amount);
        if (tier == null) {
            log.error("Unknown amount for tier determination: {}", amount);
            return;
        }

        log.info("Processing checkout for {} - Amount: {} - Tier: {}", customerEmail, amount, tier);

        // Check if user already exists
        var existingUser = userRepository.findByEmail(customerEmail);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Detect if this is a first payment (user was T0/null -> T1)
            boolean isFirstPayment = (user.getSubscriptionTier() == null ||
                    user.getSubscriptionTier() == SubscriptionTier.T0);

            if (isFirstPayment && tier == SubscriptionTier.T1) {
                // First payment or re-matriculación -> activateFirstPayment
                user = subscriptionService.activateFirstPayment(user, "STRIPE", session.getId(), amount);
            } else {
                // Standard upgrade
                user = subscriptionService.upgradeTier(user, tier, "STRIPE", session.getId(), amount);
            }

            if (customerId != null) {
                subscriptionService.updateStripeCustomerId(user.getId(), customerId);
            }
            log.info("Existing user {} upgraded to {}", customerEmail, tier);
        } else {
            // User does NOT exist -> save pending payment + send registration email
            String token = UUID.randomUUID().toString();

            PendingPayment pending = PendingPayment.builder()
                    .email(customerEmail)
                    .token(token)
                    .tier(tier)
                    .amount(amount)
                    .provider("STRIPE")
                    .paymentReference(session.getId())
                    .stripeCustomerId(customerId)
                    .build();
            pendingPaymentRepository.save(pending);

            emailService.sendRegistrationEmail(customerEmail, token);

            log.info("Pending payment saved for {} - Registration email sent with token {}", customerEmail, token);
        }
    }

    /**
     * Handle invoice.paid event (recurring subscription payments)
     */
    private void handleInvoicePaid(Invoice invoice) {
        String customerId = invoice.getCustomer();
        Long amountPaid = invoice.getAmountPaid();

        if (customerId == null) {
            log.error("No customer ID in invoice");
            return;
        }

        User user = subscriptionService.findByStripeCustomerId(customerId);
        if (user == null) {
            log.error("User not found for Stripe customer: {}", customerId);
            return;
        }

        BigDecimal amount = BigDecimal.valueOf(amountPaid).divide(BigDecimal.valueOf(100));

        // Detect if this is a first payment or renewal
        boolean isFirstPayment = (user.getSubscriptionTier() == null ||
                user.getSubscriptionTier() == SubscriptionTier.T0);

        if (isFirstPayment) {
            // First payment -> activateFirstPayment (includes +1 coin)
            subscriptionService.activateFirstPayment(user, "STRIPE", invoice.getId(), amount);
            log.info("First payment activated for user {} via invoice {}", user.getEmail(), invoice.getId());
        } else {
            // Renewal -> extend + grant monthly coin
            subscriptionService.renewSubscription(user.getId(), "STRIPE", invoice.getId(), amount);
            if (user.getSubscriptionTier() == SubscriptionTier.T1) {
                coinService.grantMonthlyCoin(user.getId());
            }
            log.info("Subscription renewed + coin granted for user {} via invoice {}", user.getEmail(), invoice.getId());
        }
    }

    /**
     * Handle invoice.payment_failed event
     */
    private void handlePaymentFailed(Invoice invoice) {
        String customerId = invoice.getCustomer();

        if (customerId == null) {
            log.error("No customer ID in failed invoice");
            return;
        }

        User user = subscriptionService.findByStripeCustomerId(customerId);
        if (user == null) {
            log.error("User not found for Stripe customer: {}", customerId);
            return;
        }

        // Downgrade user
        subscriptionService.downgradeTier(
                user.getId(),
                "PAYMENT_FAILED",
                "STRIPE"
        );

        log.info("User {} downgraded due to payment failure", user.getEmail());
    }

    /**
     * Handle customer.subscription.deleted event
     */
    private void handleSubscriptionCancelled(StripeObject stripeObject) {
        // Extract customer ID from subscription object
        String customerId = null;
        try {
            java.lang.reflect.Method getCustomer = stripeObject.getClass().getMethod("getCustomer");
            customerId = (String) getCustomer.invoke(stripeObject);
        } catch (Exception e) {
            log.error("Failed to extract customer from subscription: {}", e.getMessage());
            return;
        }

        if (customerId == null) {
            log.error("No customer ID in cancelled subscription");
            return;
        }

        User user = subscriptionService.findByStripeCustomerId(customerId);
        if (user == null) {
            log.error("User not found for Stripe customer: {}", customerId);
            return;
        }

        // Downgrade user
        subscriptionService.downgradeTier(
                user.getId(),
                "SUBSCRIPTION_CANCELLED",
                "STRIPE"
        );

        log.info("User {} subscription cancelled", user.getEmail());
    }
}
