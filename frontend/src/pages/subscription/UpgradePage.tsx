import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Check, Star } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { TIER_INFO, SubscriptionTier } from '../../types/subscription';
import { Button } from '../../components/ui/Button';

export default function UpgradePage() {
    const navigate = useNavigate();
    const { tier: currentTier, isSubscriptionActive, upgradeTo, isLoading } = useSubscription();
    const [upgrading, setUpgrading] = useState<SubscriptionTier | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpgrade = async (tier: SubscriptionTier) => {
        setUpgrading(tier);
        setError(null);

        try {
            await upgradeTo(tier);
        } catch (err: any) {
            setError(err.message || 'Error al procesar el pago');
            setUpgrading(null);
        }
    };

    const tiers: SubscriptionTier[] = ['T0', 'T1'];

    return (
        <div className="min-h-screen bg-carbon">
            {/* Header */}
            <div className="bg-panel border-b border-graphite">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 text-muted hover:text-offwhite transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            <span className="text-sm font-medium">Inicio</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl font-display font-bold text-offwhite mb-4">
                            Elige tu Plan
                        </h1>
                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            Desbloquea todo tu potencial como profesional digital.
                            {currentTier && isSubscriptionActive && (
                                <span className="block mt-2 text-accent">
                                    Actualmente tienes: {TIER_INFO[currentTier].displayName}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-red-400 text-sm">
                        {error}
                    </div>
                </div>
            )}

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {tiers.map((tierKey) => {
                        const tierInfo = TIER_INFO[tierKey];
                        const isCurrentTier = currentTier === tierKey && isSubscriptionActive;
                        const isRecommended = tierKey === 'T1';
                        const isUpgrading = upgrading === tierKey;

                        return (
                            <div
                                key={tierKey}
                                className={`relative bg-panel rounded-xl p-6 border transition-all ${
                                    isRecommended
                                        ? 'border-2 border-accent shadow-lg shadow-accent/20'
                                        : 'border-graphite hover:border-graphite/80'
                                } ${isCurrentTier ? 'ring-2 ring-emerald-500' : ''}`}
                            >
                                {/* Recommended badge */}
                                {isRecommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-carbon text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        RECOMENDADO
                                    </div>
                                )}

                                {/* Current tier badge */}
                                {isCurrentTier && (
                                    <div className="absolute -top-3 right-4 bg-emerald-600 text-offwhite text-xs font-bold px-3 py-1 rounded-full">
                                        TU PLAN
                                    </div>
                                )}

                                {/* Tier level */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                        isRecommended
                                            ? 'bg-accent text-carbon'
                                            : 'bg-graphite text-muted'
                                    }`}>
                                        {tierKey.replace('T', '')}
                                    </div>
                                    <span className={`text-xs uppercase tracking-wider ${
                                        isRecommended ? 'text-accent' : 'text-muted'
                                    }`}>
                                        Nivel {tierKey.replace('T', '')}
                                    </span>
                                </div>

                                {/* Plan name */}
                                <h3 className="text-xl font-display font-bold text-offwhite mb-2">
                                    {tierInfo.displayName}
                                </h3>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-3xl font-display font-bold text-accent">
                                        {tierInfo.priceLabel}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    {tierInfo.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-offwhite/80">
                                            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleUpgrade(tierKey)}
                                    disabled={isCurrentTier || isLoading || isUpgrading}
                                    className={`w-full ${
                                        isCurrentTier
                                            ? 'bg-graphite text-muted cursor-not-allowed'
                                            : isRecommended
                                            ? 'bg-accent hover:bg-accent/80'
                                            : ''
                                    }`}
                                >
                                    {isUpgrading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Procesando...
                                        </span>
                                    ) : isCurrentTier ? (
                                        'Plan Actual'
                                    ) : (
                                        'Seleccionar'
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ or additional info */}
                <div className="mt-12 text-center">
                    <p className="text-muted text-sm">
                        ¿Tienes dudas? Contáctanos en{' '}
                        <a href="mailto:info@capitalhub.es" className="text-accent hover:underline">
                            info@capitalhub.es
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
