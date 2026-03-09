package com.capitalhub.subscription.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pending_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, unique = true)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionTier tier;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String provider;

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Builder.Default
    private Boolean used = false;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    public void markUsed() {
        this.used = true;
        this.usedAt = LocalDateTime.now();
    }
}
