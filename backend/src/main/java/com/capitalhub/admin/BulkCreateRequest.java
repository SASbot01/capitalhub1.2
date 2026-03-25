package com.capitalhub.admin;

import com.capitalhub.subscription.entity.SubscriptionTier;
import lombok.Data;

import java.util.List;

@Data
public class BulkCreateRequest {

    private List<AccountEntry> accounts;

    @Data
    public static class AccountEntry {
        private String email;
        private SubscriptionTier tier; // T1, STARTER, etc.
    }
}
