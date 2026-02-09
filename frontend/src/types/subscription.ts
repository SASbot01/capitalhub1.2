// Subscription tier types for FPD Value Ladder

export type SubscriptionTier = 'T0' | 'T1' | 'T2' | 'T3' | 'T4';

export interface TierInfo {
    tier: SubscriptionTier;
    displayName: string;
    price: number;
    priceLabel: string;
    durationDays: number;
    features: string[];
    isRecurring: boolean;
    hasFullFormationAccess: boolean;
    hasMarketplaceAccess: boolean;
}

export const TIER_INFO: Record<SubscriptionTier, TierInfo> = {
    T0: {
        tier: 'T0',
        displayName: 'Prueba 2 Semanas',
        price: 8,
        priceLabel: '8€',
        durationDays: 14,
        features: [
            'Acceso a módulos introductorios',
            'Evaluación inicial gratuita',
            'Entrada de bajo riesgo'
        ],
        isRecurring: false,
        hasFullFormationAccess: false,
        hasMarketplaceAccess: false
    },
    T1: {
        tier: 'T1',
        displayName: 'Membresía Básica',
        price: 44,
        priceLabel: '44€/mes',
        durationDays: 30,
        features: [
            'Acceso completo a formaciones',
            'Bolsa de trabajo básica',
            'Comunidad de alumnos'
        ],
        isRecurring: true,
        hasFullFormationAccess: true,
        hasMarketplaceAccess: false
    },
    T2: {
        tier: 'T2',
        displayName: 'High Ticket Intensivo',
        price: 1900,
        priceLabel: '1.900€',
        durationDays: 365,
        features: [
            '4 meses intensivos de bootcamp',
            'Tutor dedicado (2 calls/semana)',
            'Grupos reducidos (max 8)',
            'Certificación oficial',
            'Acceso al marketplace',
            '1 año de acceso total'
        ],
        isRecurring: false,
        hasFullFormationAccess: true,
        hasMarketplaceAccess: true
    },
    T3: {
        tier: 'T3',
        displayName: 'Membresía Pro',
        price: 97,
        priceLabel: '97€/mes',
        durationDays: 30,
        features: [
            'Certificación activa mantenida',
            'Acceso completo al marketplace',
            'Networking profesional',
            'Ofertas exclusivas'
        ],
        isRecurring: true,
        hasFullFormationAccess: true,
        hasMarketplaceAccess: true
    },
    T4: {
        tier: 'T4',
        displayName: 'Enterprise B2B',
        price: 3000,
        priceLabel: '3.000€/año',
        durationDays: 365,
        features: [
            'Dashboard B2B completo',
            'Filtrado avanzado de candidatos',
            'Candidatos certificados',
            'Soporte prioritario'
        ],
        isRecurring: false,
        hasFullFormationAccess: true,
        hasMarketplaceAccess: true
    }
};

export interface UserAccess {
    tier: SubscriptionTier | null;
    tierDisplayName: string | null;
    subscriptionActive: boolean;
    fullFormationAccess: boolean;
    marketplaceAccess: boolean;
    hasCertification: boolean;
    tierExpiresAt: string | null;
    bootcampStartDate: string | null;
}

export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
}

// Helper functions
export function canAccessTier(currentTier: SubscriptionTier | null, requiredTier: SubscriptionTier): boolean {
    if (!currentTier) return false;
    const tierOrder: SubscriptionTier[] = ['T0', 'T1', 'T2', 'T3', 'T4'];
    return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier);
}

export function getTierInfo(tier: SubscriptionTier | null): TierInfo | null {
    if (!tier) return null;
    return TIER_INFO[tier];
}
