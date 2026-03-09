package com.capitalhub.subscription.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "coin_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer amount; // +1 or -1

    @Column(name = "transaction_type", nullable = false)
    private String transactionType; // MONTHLY_GRANT, FIRST_PAYMENT_BONUS, COIN_SPENT

    @Column(name = "reference_id")
    private Long referenceId; // formation_id when spending

    private String description;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
