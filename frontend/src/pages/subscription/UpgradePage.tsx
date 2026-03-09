import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Check, Star } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { TIER_INFO, SubscriptionTier } from '../../types/subscription';
import { Button } from '../../components/ui/Button';

export default function UpgradePage() {
    const navigate = useNavigate();
    const { tier: currentTier, isSubscriptionActive, upgradeTo, isLoading, hasCancelledBefore } = useSubscription();
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
                            {hasCancelledBefore ? 'Volver a Capital Hub' : 'Elige tu Plan'}
                        </h1>
                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            {hasCancelledBefore
                                ? 'Re-activa tu cuenta y recupera el acceso a todas tus formaciones desbloqueadas.'
                                : 'Desbloquea todo tu potencial como profesional digital.'
                            }
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

            {/* Plans */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {hasCancelledBefore ? (
                    /* Re-matriculación view */
                    <div className="max-w-lg mx-auto">
                        <div className="relative bg-panel rounded-xl p-8 border-2 border-accent shadow-lg shadow-accent/20">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-carbon text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                RE-MATRICULACIÓN
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-display font-bold text-offwhite mb-2">
                                    Membresía Completa
                                </h3>
                                <div className="mb-2">
                                    <span className="text-4xl font-display font-bold text-accent">150€</span>
                                    <span className="text-muted ml-1">pago único</span>
                                </div>
                                <p className="text-sm text-muted">
                                    + 44€/mes a partir del segundo mes
                                </p>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {[
                                    'Recupera todas tus formaciones desbloqueadas',
                                    'Acceso completo a la formación',
                                    'Bolsa de trabajo y marketplace',
                                    'Comunidad de alumnos',
                                    'Asistente IA integrado',
                                    '+1 moneda de bienvenida'
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-offwhite/80">
                                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => handleUpgrade('T1')}
                                disabled={isLoading || upgrading !== null}
                                className="w-full bg-accent hover:bg-accent/80"
                            >
                                {upgrading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Procesando...
                                    </span>
                                ) : (
                                    'Re-activar mi cuenta — 150€'
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Normal subscription view */
                    <div className="max-w-lg mx-auto">
                        <div className="relative bg-panel rounded-xl p-8 border-2 border-accent shadow-lg shadow-accent/20">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-carbon text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                RECOMENDADO
                            </div>

                            {currentTier === 'T1' && isSubscriptionActive && (
                                <div className="absolute -top-3 right-4 bg-emerald-600 text-offwhite text-xs font-bold px-3 py-1 rounded-full">
                                    TU PLAN
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-display font-bold text-offwhite mb-2">
                                    Membresía Completa
                                </h3>
                                <span className="text-4xl font-display font-bold text-accent">
                                    44€/mes
                                </span>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {TIER_INFO['T1'].features.concat(['+1 moneda cada mes para desbloquear formaciones']).map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-offwhite/80">
                                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => handleUpgrade('T1')}
                                disabled={(currentTier === 'T1' && isSubscriptionActive) || isLoading || upgrading !== null}
                                className={`w-full ${
                                    currentTier === 'T1' && isSubscriptionActive
                                        ? 'bg-graphite text-muted cursor-not-allowed'
                                        : 'bg-accent hover:bg-accent/80'
                                }`}
                            >
                                {upgrading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Procesando...
                                    </span>
                                ) : currentTier === 'T1' && isSubscriptionActive ? (
                                    'Plan Actual'
                                ) : (
                                    'Suscribirme — 44€/mes'
                                )}
                            </Button>
                        </div>
                    </div>
                )}

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
