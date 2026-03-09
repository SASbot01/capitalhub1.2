package com.capitalhub.subscription.repository;

import com.capitalhub.subscription.entity.PendingPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PendingPaymentRepository extends JpaRepository<PendingPayment, Long> {

    Optional<PendingPayment> findByTokenAndUsedFalse(String token);

    Optional<PendingPayment> findByEmailAndUsedFalse(String email);
}
