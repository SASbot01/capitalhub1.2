package com.capitalhub.subscription.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.subscription.entity.SubscriptionHistory;
import com.capitalhub.subscription.entity.SubscriptionTier;
import com.capitalhub.subscription.repository.SubscriptionHistoryRepository;
import com.capitalhub.training.entity.UserActiveRoute;
import com.capitalhub.training.entity.UserFormationUnlock;
import com.capitalhub.training.repository.UserActiveRouteRepository;
import com.capitalhub.training.repository.UserFormationUnlockRepository;
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
    private final UserActiveRouteRepository userActiveRouteRepository;
    private final UserFormationUnlockRepository userFormationUnlockRepository;

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
     * Start free trial for a user — sets T0, 14 days, assigns route and formation
     */
    @Transactional
    public User startTrial(User user, Long routeId, Long formationId) {
        if (user.getSubscriptionTier() != null) {
            throw new RuntimeException("El usuario ya tiene una suscripción activa");
        }

        // Set trial tier
        user.setSubscriptionTier(SubscriptionTier.T0);
        user.setTierExpiresAt(LocalDateTime.now().plusDays(14));
        user.setTrialStartedAt(LocalDateTime.now());
        user.setTrialRouteId(routeId);
        user.setTrialFormationId(formationId);
        user.setMarketplaceVisible(false);
        userRepository.save(user);

        // Set active route
        userActiveRouteRepository.findByUserId(user.getId())
                .ifPresent(existing -> userActiveRouteRepository.delete(existing));
        UserActiveRoute activeRoute = UserActiveRoute.builder()
                .userId(user.getId())
                .routeId(routeId)
                .build();
        userActiveRouteRepository.save(activeRoute);

        // Create trial unlock for the selected formation
        if (!userFormationUnlockRepository.existsByUserIdAndFormationId(user.getId(), formationId)) {
            UserFormationUnlock unlock = UserFormationUnlock.builder()
                    .userId(user.getId())
                    .formationId(formationId)
                    .routeId(routeId)
                    .unlockType("TRIAL")
                    .build();
            userFormationUnlockRepository.save(unlock);
        }

        // Record history
        SubscriptionHistory history = SubscriptionHistory.builder()
                .userId(user.getId())
                .previousTier(null)
                .newTier(SubscriptionTier.T0)
                .changeReason("TRIAL_STARTED")
                .paymentProvider("SYSTEM")
                .amountPaid(BigDecimal.ZERO)
                .build();
        subscriptionHistoryRepository.save(history);

        log.info("Trial started for user {} - Route: {}, Formation: {}", user.getEmail(), routeId, formationId);
        return user;
    }

    /**
     * Activate first payment — T0→T1, unlock trial formation permanently, +1 coin
     */
    @Transactional
    public User activateFirstPayment(User user, String provider, String paymentReference, BigDecimal amount) {
        SubscriptionTier previousTier = user.getSubscriptionTier();

        // Upgrade to T1
        user.setSubscriptionTier(SubscriptionTier.T1);
        user.setTierExpiresAt(LocalDateTime.now().plusDays(30));
        user.setMarketplaceVisible(true);

        // Grant 2 welcome coins
        user.setCoinBalance((user.getCoinBalance() != null ? user.getCoinBalance() : 0) + 2);

        userRepository.save(user);

        // Upgrade trial unlock to FIRST_PAYMENT if exists
        if (user.getTrialFormationId() != null) {
            var unlocks = userFormationUnlockRepository.findByUserId(user.getId());
            for (var unlock : unlocks) {
                if ("TRIAL".equals(unlock.getUnlockType()) && unlock.getFormationId().equals(user.getTrialFormationId())) {
                    unlock.setUnlockType("FIRST_PAYMENT");
                    userFormationUnlockRepository.save(unlock);
                }
            }
        }

        // Record history
        SubscriptionHistory history = SubscriptionHistory.builder()
                .userId(user.getId())
                .previousTier(previousTier)
                .newTier(SubscriptionTier.T1)
                .changeReason("FIRST_PAYMENT")
                .paymentProvider(provider)
                .paymentReference(paymentReference)
                .amountPaid(amount)
                .build();
        subscriptionHistoryRepository.save(history);

        log.info("First payment activated for user {} - Amount: {}", user.getEmail(), amount);
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
     * Note: Does NOT delete coin_balance, unlocks, active route, or progress
     */
    @Transactional
    public User downgradeTier(User user, String reason, String provider) {
        SubscriptionTier previousTier = user.getSubscriptionTier();

        // Downgrade to null (no active subscription)
        user.setSubscriptionTier(null);
        user.setTierExpiresAt(null);
        user.setMarketplaceVisible(false);
        user.setHasCancelledBefore(true);
        user.setCancelledAt(LocalDateTime.now());

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
            case STARTER:
                return now.plusDays(14); // 14-day starter
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
