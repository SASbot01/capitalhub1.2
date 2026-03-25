package com.capitalhub.subscription.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import com.capitalhub.subscription.entity.CoinTransaction;
import com.capitalhub.subscription.repository.CoinTransactionRepository;
import com.capitalhub.training.entity.UserFormationUnlock;
import com.capitalhub.training.repository.UserActiveRouteRepository;
import com.capitalhub.training.repository.UserFormationUnlockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoinService {

    private final UserRepository userRepository;
    private final CoinTransactionRepository coinTransactionRepository;
    private final UserFormationUnlockRepository userFormationUnlockRepository;
    private final UserActiveRouteRepository userActiveRouteRepository;

    /**
     * Grant +1 monthly coin to user
     */
    @Transactional
    public void grantMonthlyCoin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        int current = user.getCoinBalance() != null ? user.getCoinBalance() : 0;
        user.setCoinBalance(current + 1);
        userRepository.save(user);

        CoinTransaction tx = CoinTransaction.builder()
                .userId(userId)
                .amount(1)
                .transactionType("MONTHLY_GRANT")
                .description("Moneda mensual por suscripción activa")
                .build();
        coinTransactionRepository.save(tx);

        log.info("Monthly coin granted to user {}. New balance: {}", userId, user.getCoinBalance());
    }

    /**
     * Grant +1 coin as first payment bonus
     */
    @Transactional
    public void grantFirstPaymentCoin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        int current = user.getCoinBalance() != null ? user.getCoinBalance() : 0;
        user.setCoinBalance(current + 1);
        userRepository.save(user);

        CoinTransaction tx = CoinTransaction.builder()
                .userId(userId)
                .amount(1)
                .transactionType("FIRST_PAYMENT_BONUS")
                .description("Moneda de bienvenida por primer pago")
                .build();
        coinTransactionRepository.save(tx);

        log.info("First payment coin granted to user {}. New balance: {}", userId, user.getCoinBalance());
    }

    /**
     * Spend 1 coin to unlock a formation
     */
    @Transactional
    public void spendCoinOnFormation(Long userId, Long formationId, Long routeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Validate coin balance
        if (user.getCoinBalance() == null || user.getCoinBalance() <= 0) {
            throw new IllegalStateException("No tienes monedas disponibles");
        }

        // If already unlocked, return silently (idempotent)
        if (userFormationUnlockRepository.existsByUserIdAndFormationId(userId, formationId)) {
            log.info("Formation {} already unlocked for user {}, skipping", formationId, userId);
            return;
        }

        // Spend coin
        user.setCoinBalance(user.getCoinBalance() - 1);
        userRepository.save(user);

        // Create unlock record
        UserFormationUnlock unlock = UserFormationUnlock.builder()
                .userId(userId)
                .formationId(formationId)
                .routeId(routeId)
                .unlockType("COIN_SPENT")
                .build();
        userFormationUnlockRepository.save(unlock);

        // Log transaction
        CoinTransaction tx = CoinTransaction.builder()
                .userId(userId)
                .amount(-1)
                .transactionType("COIN_SPENT")
                .referenceId(formationId)
                .description("Moneda gastada en desbloquear formación")
                .build();
        coinTransactionRepository.save(tx);

        log.info("User {} spent 1 coin on formation {}. New balance: {}", userId, formationId, user.getCoinBalance());
    }

    /**
     * Get coin balance
     */
    public int getCoinBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return user.getCoinBalance() != null ? user.getCoinBalance() : 0;
    }

    /**
     * Get coin transaction history
     */
    public List<CoinTransaction> getCoinHistory(Long userId) {
        return coinTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
