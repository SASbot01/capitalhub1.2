package com.capitalhub.subscription.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.subscription.entity.SubscriptionHistory;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.repository.SubscriptionHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final UserRepository userRepository;
    private final SubscriptionHistoryRepository subscriptionHistoryRepository;

    /**
     * Upgrade user to a new tier
     */
    @Transactional
    public User upgradeTier(Long userId, SubscriptionTier newTier, String provider,
                            String paymentReference, BigDecimal amountPaid) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return upgradeTier(user, newTier, provider, paymentReference, amountPaid);
    }

    /**
     * Upgrade user to a new tier (by email)
     */
    @Transactional
    public User upgradeTierByEmail(String email, SubscriptionTier newTier, String provider,
                                   String paymentReference, BigDecimal amountPaid) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return upgradeTier(user, newTier, provider, paymentReference, amountPaid);
    }

    /**
     * Core upgrade logic
     */
    @Transactional
    public User upgradeTier(User user, SubscriptionTier newTier, String provider,
                            String paymentReference, BigDecimal amountPaid) {
        SubscriptionTier previousTier = user.getSubscriptionTier();

        // Set new tier
        user.setSubscriptionTier(newTier);

        // Calculate expiration based on tier
        LocalDateTime expiresAt = calculateExpiration(newTier);
        user.setTierExpiresAt(expiresAt);

        // Handle T2 specific logic (bootcamp)
        if (newTier == SubscriptionTier.T2) {
            user.setBootcampStartDate(LocalDateTime.now());
            user.setMarketplaceVisible(true);
        }

        // Handle T3 specific logic (requires previous T2)
        if (newTier == SubscriptionTier.T3) {
            user.setMarketplaceVisible(true);
            user.setHasCertification(true);
        }

        // Handle T4 (enterprise)
        if (newTier == SubscriptionTier.T4) {
            user.setMarketplaceVisible(true);
        }

        // Handle T1 (basic) - formación completa + bolsa de trabajo
        if (newTier == SubscriptionTier.T1) {
            user.setMarketplaceVisible(true);
        }

        // Handle T0 (trial)
        if (newTier == SubscriptionTier.T0) {
            user.setMarketplaceVisible(false);
        }

        userRepository.save(user);

        // Record history
        SubscriptionHistory history = SubscriptionHistory.builder()
                .userId(user.getId())
                .previousTier(previousTier)
                .newTier(newTier)
                .changeReason("PAYMENT_COMPLETED")
                .paymentProvider(provider)
                .paymentReference(paymentReference)
                .amountPaid(amountPaid)
                .build();
        subscriptionHistoryRepository.save(history);

        log.info("User {} upgraded from {} to {} via {}",
                user.getEmail(), previousTier, newTier, provider);

        return user;
    }

    /**
     * Downgrade user (payment failed, subscription cancelled)
     */
    @Transactional
    public User downgradeTier(Long userId, String reason, String provider) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return downgradeTier(user, reason, provider);
    }

    /**
     * Downgrade user by email
     */
    @Transactional
    public User downgradeTierByEmail(String email, String reason, String provider) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return downgradeTier(user, reason, provider);
    }

    /**
     * Core downgrade logic
     */
    @Transactional
    public User downgradeTier(User user, String reason, String provider) {
        SubscriptionTier previousTier = user.getSubscriptionTier();

        // Downgrade to null (no active subscription)
        user.setSubscriptionTier(null);
        user.setTierExpiresAt(null);
        user.setMarketplaceVisible(false);

        userRepository.save(user);

        // Record history
        SubscriptionHistory history = SubscriptionHistory.builder()
                .userId(user.getId())
                .previousTier(previousTier)
                .newTier(null)
                .changeReason(reason)
                .paymentProvider(provider)
                .build();
        subscriptionHistoryRepository.save(history);

        log.info("User {} downgraded from {} to null. Reason: {}",
                user.getEmail(), previousTier, reason);

        return user;
    }

    /**
     * Calculate expiration date based on tier
     */
    private LocalDateTime calculateExpiration(SubscriptionTier tier) {
        if (tier == null) return null;

        LocalDateTime now = LocalDateTime.now();

        switch (tier) {
            case T0:
                return now.plusDays(14); // 14-day trial
            case T1:
                return now.plusDays(30); // Monthly recurring
            case T2:
                return now.plusDays(365); // 12 months bootcamp
            case T3:
                return now.plusDays(30); // Monthly recurring post-bootcamp
            case T4:
                return now.plusDays(365); // 12 months enterprise
            default:
                return null;
        }
    }

    /**
     * Renew subscription (for recurring payments)
     */
    @Transactional
    public User renewSubscription(Long userId, String provider, String paymentReference, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (user.getSubscriptionTier() == null) {
            throw new RuntimeException("No active subscription to renew");
        }

        // Extend expiration
        LocalDateTime newExpiration = calculateExpiration(user.getSubscriptionTier());
        user.setTierExpiresAt(newExpiration);

        userRepository.save(user);

        // Record history
        SubscriptionHistory history = SubscriptionHistory.builder()
                .userId(user.getId())
                .previousTier(user.getSubscriptionTier())
                .newTier(user.getSubscriptionTier())
                .changeReason("SUBSCRIPTION_RENEWED")
                .paymentProvider(provider)
                .paymentReference(paymentReference)
                .amountPaid(amount)
                .build();
        subscriptionHistoryRepository.save(history);

        log.info("Subscription renewed for user {}", user.getEmail());

        return user;
    }

    /**
     * Update Stripe customer ID
     */
    @Transactional
    public void updateStripeCustomerId(Long userId, String stripeCustomerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setStripeCustomerId(stripeCustomerId);
        userRepository.save(user);
    }

    /**
     * Find user by Stripe customer ID
     */
    public User findByStripeCustomerId(String stripeCustomerId) {
        return userRepository.findByStripeCustomerId(stripeCustomerId)
                .orElse(null);
    }
}
