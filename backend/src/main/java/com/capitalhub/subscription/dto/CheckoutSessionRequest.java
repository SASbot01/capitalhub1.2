package com.capitalhub.subscription.dto;

import com.capitalhub.subscription.entity.SubscriptionTier;
import lombok.Data;

@Data
public class CheckoutSessionRequest {
    private SubscriptionTier tier;
}
