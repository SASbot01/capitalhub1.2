import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { TIER_INFO } from '../../types/subscription';
import { Button } from '../../components/ui/Button';

export default function SuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refreshAccess, tier, isLoading } = useSubscription();
    const [refreshed, setRefreshed] = useState(false);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Refresh subscription data after payment
        const refresh = async () => {
            await refreshAccess();
            setRefreshed(true);
        };
        refresh();
    }, [refreshAccess]);

    const tierInfo = tier ? TIER_INFO[tier] : null;

    return (
        <div className="min-h-screen bg-carbon flex items-center justify-center">
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                {/* Success Icon */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-display font-bold text-offwhite mb-4">
                    ¡Pago Completado!
                </h1>

                {/* Description */}
                <p className="text-lg text-muted mb-8">
                    Tu suscripción ha sido activada correctamente.
                    {tierInfo && (
                        <span className="block mt-2 text-accent font-medium">
                            Plan: {tierInfo.displayName}
                        </span>
                    )}
                </p>

                {/* Loading state */}
                {isLoading && !refreshed && (
                    <div className="mb-8">
                        <div className="w-8 h-8 border-4 border-graphite border-t-accent rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm text-muted mt-2">Actualizando tu acceso...</p>
                    </div>
                )}

                {/* Features unlocked */}
                {tierInfo && refreshed && (
                    <div className="bg-panel border border-graphite rounded-xl p-6 mb-8 text-left">
                        <h3 className="text-sm font-semibold text-offwhite mb-4 uppercase tracking-wider">
                            Ahora tienes acceso a:
                        </h3>
                        <ul className="space-y-2">
                            {tierInfo.features.slice(0, 4).map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-offwhite/80">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => navigate('/home')}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Ir al Inicio
                    </Button>

                    <Button
                        onClick={() => navigate('/training/routes')}
                        className="flex items-center gap-2"
                    >
                        Comenzar Formación
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Session ID (for reference) */}
                {sessionId && (
                    <p className="text-xs text-muted mt-8">
                        Referencia: {sessionId.substring(0, 20)}...
                    </p>
                )}
            </div>
        </div>
    );
}
