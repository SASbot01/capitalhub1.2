package com.capitalhub.subscription.repository;

import com.capitalhub.subscription.entity.SubscriptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionHistoryRepository extends JpaRepository<SubscriptionHistory, Long> {

    List<SubscriptionHistory> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<SubscriptionHistory> findByPaymentReference(String paymentReference);
}
