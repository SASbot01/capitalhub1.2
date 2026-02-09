package com.capitalhub.subscription.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_tier")
    private SubscriptionTier previousTier;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_tier")
    private SubscriptionTier newTier;

    @Column(name = "change_reason", nullable = false)
    private String changeReason;

    @Column(name = "payment_provider")
    private String paymentProvider;

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
