import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserAccess, redirectToCheckout } from '../api/subscription';
import { useAuth } from './AuthContext';
import type { UserAccess, SubscriptionTier } from '../types/subscription';

interface SubscriptionContextType {
    access: UserAccess | null;
    isLoading: boolean;
    error: string | null;
    tier: SubscriptionTier | null;
    isSubscriptionActive: boolean;
    hasFullFormationAccess: boolean;
    hasMarketplaceAccess: boolean;
    refreshAccess: () => Promise<void>;
    upgradeTo: (tier: SubscriptionTier) => Promise<void>;
    canAccessTier: (requiredTier: SubscriptionTier) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [access, setAccess] = useState<UserAccess | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshAccess = useCallback(async () => {
        if (!isAuthenticated) {
            setAccess(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getUserAccess();
            setAccess(data);
        } catch (err: any) {
            console.error('Failed to fetch user access:', err);
            setError(err.message || 'Failed to load subscription info');
            setAccess(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch access when auth state changes
    useEffect(() => {
        if (!authLoading) {
            refreshAccess();
        }
    }, [authLoading, isAuthenticated, refreshAccess]);

    const upgradeTo = useCallback(async (tier: SubscriptionTier) => {
        try {
            await redirectToCheckout(tier);
        } catch (err: any) {
            console.error('Failed to create checkout session:', err);
            throw err;
        }
    }, []);

    const canAccessTier = useCallback((requiredTier: SubscriptionTier): boolean => {
        if (!access || !access.subscriptionActive || !access.tier) {
            return false;
        }

        const tierOrder: SubscriptionTier[] = ['T0', 'T1', 'T2', 'T3', 'T4'];
        return tierOrder.indexOf(access.tier) >= tierOrder.indexOf(requiredTier);
    }, [access]);

    const value: SubscriptionContextType = {
        access,
        isLoading,
        error,
        tier: access?.tier ?? null,
        isSubscriptionActive: access?.subscriptionActive ?? false,
        hasFullFormationAccess: access?.fullFormationAccess ?? false,
        hasMarketplaceAccess: access?.marketplaceAccess ?? false,
        refreshAccess,
        upgradeTo,
        canAccessTier
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = (): SubscriptionContextType => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
