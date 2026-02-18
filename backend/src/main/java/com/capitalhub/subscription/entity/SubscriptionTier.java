package com.capitalhub.subscription.entity;

import java.math.BigDecimal;

/**
 * Subscription tiers for the FPD Value Ladder
 * T0 - Trial (8€, 14 days)
 * T1 - Basic membership (44€/month) - Formación completa + Bolsa de trabajo
 * T2 - High Ticket Intensive (1,900€, 12 months) - Venta interna
 * T3 - Pro membership (97€/month) - Venta interna
 * T4 - B2B Dashboard (3,000€, 12 months)
 */
public enum SubscriptionTier {
    T0("Trial", new BigDecimal("8.00"), 14, true, false),
    T1("Basic", new BigDecimal("44.00"), 30, true, true),
    T2("Bootcamp", new BigDecimal("1900.00"), 365, true, true),
    T3("Pro", new BigDecimal("97.00"), 30, true, true),
    T4("Enterprise", new BigDecimal("3000.00"), 365, true, true);

    private final String displayName;
    private final BigDecimal price;
    private final int durationDays;
    private final boolean fullFormationAccess;
    private final boolean marketplaceAccess;

    SubscriptionTier(String displayName, BigDecimal price, int durationDays,
                     boolean fullFormationAccess, boolean marketplaceAccess) {
        this.displayName = displayName;
        this.price = price;
        this.durationDays = durationDays;
        this.fullFormationAccess = fullFormationAccess;
        this.marketplaceAccess = marketplaceAccess;
    }

    public String getDisplayName() {
        return displayName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public boolean hasFullFormationAccess() {
        return fullFormationAccess;
    }

    public boolean hasMarketplaceAccess() {
        return marketplaceAccess;
    }

    /**
     * Check if this tier can access a required tier level
     */
    public boolean canAccess(SubscriptionTier required) {
        if (required == null) return true;
        return this.ordinal() >= required.ordinal();
    }

    /**
     * Determine tier from payment amount
     */
    public static SubscriptionTier fromAmount(BigDecimal amount) {
        if (amount == null) return null;

        // Use compareTo for BigDecimal comparison
        if (amount.compareTo(new BigDecimal("8.00")) == 0) return T0;
        if (amount.compareTo(new BigDecimal("44.00")) == 0) return T1;
        if (amount.compareTo(new BigDecimal("1500.00")) == 0 ||
            amount.compareTo(new BigDecimal("1900.00")) == 0) return T2;
        if (amount.compareTo(new BigDecimal("97.00")) == 0) return T3;
        if (amount.compareTo(new BigDecimal("3000.00")) == 0) return T4;

        return null;
    }

    /**
     * Check if tier is recurring subscription
     */
    public boolean isRecurring() {
        return this == T1 || this == T3;
    }
}
