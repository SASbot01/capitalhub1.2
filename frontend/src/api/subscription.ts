import { apiClient } from './client';
import type { UserAccess, CheckoutSessionResponse, SubscriptionTier } from '../types/subscription';

/**
 * Get current user's subscription access info
 */
export async function getUserAccess(): Promise<UserAccess> {
    return apiClient.get<UserAccess>('/api/v1/user/access', true);
}

/**
 * Create a checkout session for upgrading to a new tier
 */
export async function createCheckoutSession(tier: SubscriptionTier): Promise<CheckoutSessionResponse> {
    return apiClient.post<CheckoutSessionResponse>('/api/v1/billing/create-session', { tier }, true);
}

/**
 * Redirect to Stripe checkout
 */
export async function redirectToCheckout(tier: SubscriptionTier): Promise<void> {
    const response = await createCheckoutSession(tier);
    if (response.url) {
        window.location.href = response.url;
    }
}
