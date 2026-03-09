package com.capitalhub.subscription.dto;

import com.capitalhub.subscription.entity.SubscriptionTier;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

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

    // Level 1 Access System fields
    private int coinBalance;
    private Long activeRouteId;
    @JsonProperty("isInTrial")
    private boolean isInTrial;
    private Long trialFormationId;
    private boolean hasCancelledBefore;
    private List<Long> unlockedFormationIds;
}
