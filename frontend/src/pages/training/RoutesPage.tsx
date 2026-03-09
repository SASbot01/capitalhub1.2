import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, TrendingUp, Home, Coins, RefreshCw, Loader2 } from 'lucide-react';
import { getRoutes, getActiveRoute, switchRoute as switchRouteApi } from '../../api/training';
import { useSubscription } from '../../context/SubscriptionContext';
import type { Route } from '../../api/training';

export default function RoutesPage() {
    const navigate = useNavigate();
    const { coinBalance, activeRouteId, refreshAccess } = useSubscription();

    const [routes, setRoutes] = useState<Route[]>([]);
    const [currentActiveRouteId, setCurrentActiveRouteId] = useState<number | null>(activeRouteId);
    const [loading, setLoading] = useState(true);
    const [switchingRoute, setSwitchingRoute] = useState<number | null>(null);
    const [showSwitchModal, setShowSwitchModal] = useState<Route | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [routesData, activeRoute] = await Promise.all([
                    getRoutes(),
                    getActiveRoute()
                ]);
                setRoutes(routesData);
                setCurrentActiveRouteId(activeRoute?.id ?? activeRouteId);
            } catch (err) {
                console.error('Error loading routes:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [activeRouteId]);

    const handleSwitchRoute = async (route: Route) => {
        setSwitchingRoute(route.id);
        setShowSwitchModal(null);
        try {
            await switchRouteApi(route.id);
            setCurrentActiveRouteId(route.id);
            await refreshAccess();
        } catch (err) {
            console.error('Error switching route:', err);
        } finally {
            setSwitchingRoute(null);
        }
    };

    const handleRouteClick = (route: Route) => {
        if (currentActiveRouteId && currentActiveRouteId !== route.id) {
            setShowSwitchModal(route);
        } else {
            navigate(`/training/routes/${route.id}/formations`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

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

                        {/* Coin Balance */}
                        <div className="flex items-center gap-2 bg-graphite px-4 py-2 rounded-lg">
                            <Coins className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-bold text-offwhite">{coinBalance}</span>
                            <span className="text-xs text-muted">monedas</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl font-display font-bold text-offwhite mb-4">
                            Elige tu profesión
                        </h1>
                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            Elige tu ruta y conviértete en un profesional digital certificado.
                            Formación intensiva y bolsa de empleo.
                        </p>
                    </div>
                </div>
            </div>

            {/* Routes Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {routes.map((route) => {
                        const isActive = currentActiveRouteId === route.id;
                        const isSwitching = switchingRoute === route.id;

                        return (
                            <div
                                key={route.id}
                                onClick={() => !isSwitching && handleRouteClick(route)}
                                className={`group relative bg-panel rounded-xl overflow-hidden shadow-card border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                                    isActive
                                        ? 'border-2 border-accent shadow-lg shadow-accent/10'
                                        : 'border-graphite hover:border-accent/50'
                                }`}
                            >
                                {/* Active badge */}
                                {isActive && (
                                    <div className="absolute top-4 left-4 z-10 bg-accent text-carbon px-3 py-1 rounded-lg text-xs font-bold">
                                        TU RUTA ACTIVA
                                    </div>
                                )}

                                {/* Image */}
                                {route.imageUrl && (
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={route.imageUrl}
                                            alt={route.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-display font-bold text-offwhite mb-3 group-hover:text-accent transition-colors">
                                        {route.name}
                                    </h3>
                                    <p className="text-muted mb-6 line-clamp-3">
                                        {route.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-sm text-muted">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>40-60 horas</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted">
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            <span>Alta demanda</span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    {isActive ? (
                                        <button className="w-full bg-accent hover:bg-accent/80 text-carbon font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
                                            Ver Formaciones
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : currentActiveRouteId ? (
                                        <button
                                            disabled={isSwitching}
                                            className="w-full bg-graphite hover:bg-graphite/80 text-offwhite font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            {isSwitching ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Cambiar a esta ruta
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button className="w-full bg-accent hover:bg-accent/80 text-carbon font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
                                            Ver Formaciones
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center bg-panel rounded-xl p-12 text-offwhite border border-graphite">
                    <h2 className="text-3xl font-display font-bold mb-4">
                        Únete a la Comunidad Comercial PRO
                    </h2>
                    <p className="text-xl mb-8 text-muted">
                        Conecta con otros profesionales, comparte experiencias y crece juntos
                    </p>
                    <a
                        href="https://discord.gg/WpEznQPeZb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-accent text-carbon font-semibold py-3 px-8 rounded-lg hover:bg-accent/80 transition-colors"
                    >
                        Únete a la Comunidad Comercial PRO
                    </a>
                </div>
            </div>

            {/* Switch Route Modal */}
            {showSwitchModal && (
                <div className="fixed inset-0 bg-carbon/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-panel rounded-xl p-6 max-w-md w-full border border-graphite">
                        <h3 className="text-xl font-display font-bold text-offwhite mb-3">
                            Cambiar de ruta
                        </h3>
                        <p className="text-muted mb-6">
                            ¿Quieres cambiar a <span className="text-offwhite font-medium">{showSwitchModal.name}</span>?
                            Las formaciones de tu ruta anterior quedarán pausadas pero no perderás tu progreso.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSwitchModal(null)}
                                className="flex-1 bg-graphite hover:bg-graphite/80 text-offwhite font-medium py-2.5 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleSwitchRoute(showSwitchModal)}
                                className="flex-1 bg-accent hover:bg-accent/80 text-carbon font-medium py-2.5 rounded-lg transition-colors"
                            >
                                Cambiar ruta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
