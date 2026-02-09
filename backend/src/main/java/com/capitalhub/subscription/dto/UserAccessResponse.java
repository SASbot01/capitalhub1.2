package com.capitalhub.subscription.dto;

import com.capitalhub.subscription.entity.SubscriptionTier;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserAccessResponse {
    private SubscriptionTier tier;
    private String tierDisplayName;
    private boolean subscriptionActive;
    private boolean fullFormationAccess;
    private boolean marketplaceAccess;
    private boolean hasCertification;
    private LocalDateTime tierExpiresAt;
    private LocalDateTime bootcampStartDate;
}
