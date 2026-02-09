package com.capitalhub.subscription.repository;

import com.capitalhub.subscription.entity.PaymentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentEventRepository extends JpaRepository<PaymentEvent, Long> {

    Optional<PaymentEvent> findByEventId(String eventId);

    List<PaymentEvent> findByProcessedFalseOrderByCreatedAtAsc();

    List<PaymentEvent> findByProviderAndEventTypeOrderByCreatedAtDesc(String provider, String eventType);

    boolean existsByEventId(String eventId);
}
