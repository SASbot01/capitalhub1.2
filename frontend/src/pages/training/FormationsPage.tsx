import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Clock, Award, Users, Home, Coins,
    Lock, Loader2, CheckCircle
} from 'lucide-react';
import { getRoute, getFormationsAccess, unlockFormation } from '../../api/training';
import { useSubscription } from '../../context/SubscriptionContext';
import type { Route, FormationAccessInfo } from '../../api/training';

export default function FormationsPage() {
    const { routeId } = useParams<{ routeId: string }>();
    const navigate = useNavigate();
    const { coinBalance, isInTrial, refreshAccess, access } = useSubscription();

    const [route, setRoute] = useState<Route | null>(null);
    const [formationsAccess, setFormationsAccess] = useState<FormationAccessInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlocking, setUnlocking] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [routeData, accessData] = await Promise.all([
                    getRoute(Number(routeId)),
                    getFormationsAccess(Number(routeId))
                ]);
                setRoute(routeData);
                setFormationsAccess(accessData);
            } catch (err) {
                console.error('Error loading formations:', err);
                setError('Error al cargar las formaciones');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [routeId]);

    const handleUnlock = async (formationId: number) => {
        if (coinBalance <= 0) return;
        setUnlocking(formationId);
        setError(null);
        try {
            await unlockFormation(formationId);
            await refreshAccess();
            // Reload formations access
            const accessData = await getFormationsAccess(Number(routeId));
            setFormationsAccess(accessData);
        } catch (err: any) {
            setError(err.message || 'Error al desbloquear la formación');
        } finally {
            setUnlocking(null);
        }
    };

    const handleFormationClick = (item: FormationAccessInfo) => {
        if (item.status !== 'LOCKED') {
            navigate(`/training/formations/${item.formation.id}`);
        }
    };

    // Calculate trial days remaining
    const getTrialDaysRemaining = () => {
        if (!access?.tierExpiresAt) return 0;
        const expiry = new Date(access.tierExpiresAt);
        const now = new Date();
        return Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Básico':
                return 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30';
            case 'Intermedio':
                return 'bg-amber-900/30 text-amber-400 border-amber-700/30';
            case 'Avanzado':
                return 'bg-red-900/30 text-red-400 border-red-700/30';
            default:
                return 'bg-graphite text-muted';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    if (!route) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-carbon">
                <p className="text-xl text-muted">Ruta no encontrada</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-carbon">
            {/* Trial Banner */}
            {isInTrial && (
                <div className="bg-blue-900/30 border-b border-blue-700/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-blue-300">
                                Prueba gratuita: <span className="font-bold">{getTrialDaysRemaining()} días restantes</span>
                            </p>
                            <button
                                onClick={() => navigate('/upgrade')}
                                className="text-xs bg-accent text-carbon font-bold px-3 py-1 rounded-lg hover:bg-accent/80 transition-colors"
                            >
                                Suscríbete por 44€/mes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-panel border-b border-graphite">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/training/routes')}
                            className="flex items-center text-accent hover:text-accent/80 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Volver a Rutas
                        </button>
                        <div className="flex items-center gap-4">
                            {/* Coin Balance */}
                            <div className="flex items-center gap-2 bg-graphite px-4 py-2 rounded-lg">
                                <Coins className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-bold text-offwhite">{coinBalance}</span>
                                <span className="text-xs text-muted">monedas</span>
                            </div>
                            <button
                                onClick={() => navigate('/home')}
                                className="flex items-center gap-2 text-muted hover:text-offwhite transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                <span className="text-sm font-medium">Inicio</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-6">
                        {route.imageUrl && (
                            <img
                                src={route.imageUrl}
                                alt={route.name}
                                className="w-32 h-32 rounded-xl object-cover shadow-card border border-graphite"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-4xl font-display font-bold text-offwhite mb-3">
                                {route.name}
                            </h1>
                            <p className="text-xl text-muted mb-4">
                                {route.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-muted">
                                <div className="flex items-center">
                                    <Award className="w-5 h-5 mr-2" />
                                    <span>{formationsAccess.length} Formaciones</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    <span>Comunidad activa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-red-400 text-sm">
                        {error}
                    </div>
                </div>
            )}

            {/* Formations List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-offwhite mb-2">
                        Formaciones Disponibles
                    </h2>
                    <p className="text-muted">
                        Selecciona una formación para comenzar tu camino profesional
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formationsAccess.map((item) => {
                        const { formation, status } = item;
                        const isUnlocked = status === 'UNLOCKED';
                        const isTrial = status === 'TRIAL_ACCESS';
                        const isLocked = status === 'LOCKED';

                        return (
                            <div
                                key={formation.id}
                                onClick={() => handleFormationClick(item)}
                                className={`group bg-panel rounded-xl shadow-card transition-all duration-300 overflow-hidden border ${
                                    isUnlocked
                                        ? 'border-emerald-700/50 hover:border-emerald-500/70 cursor-pointer'
                                        : isTrial
                                        ? 'border-blue-700/50 hover:border-blue-500/70 cursor-pointer'
                                        : 'border-graphite opacity-75'
                                }`}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-display font-bold mb-2 transition-colors ${
                                                isLocked ? 'text-muted' : 'text-offwhite group-hover:text-accent'
                                            }`}>
                                                {formation.name}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getLevelColor(formation.level)}`}>
                                                {formation.level}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        {isUnlocked && (
                                            <div className="flex items-center gap-1 bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-lg text-xs font-semibold">
                                                <CheckCircle className="w-3 h-3" />
                                                Desbloqueada
                                            </div>
                                        )}
                                        {isTrial && (
                                            <div className="flex items-center gap-1 bg-blue-900/30 text-blue-400 px-3 py-1 rounded-lg text-xs font-semibold">
                                                Prueba Gratuita
                                            </div>
                                        )}
                                        {isLocked && (
                                            <Lock className="w-5 h-5 text-muted" />
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className={`mb-6 line-clamp-2 ${isLocked ? 'text-muted/60' : 'text-muted'}`}>
                                        {formation.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-graphite">
                                        <div className="flex items-center text-sm text-muted">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>{formation.estimatedHours || 40} horas</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            <span>Certificación incluida</span>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    {isUnlocked && (
                                        <button className="w-full bg-accent hover:bg-accent/80 text-carbon font-semibold py-3 px-6 rounded-lg transition-colors">
                                            Ver Contenido
                                        </button>
                                    )}
                                    {isTrial && (
                                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-offwhite font-semibold py-3 px-6 rounded-lg transition-colors">
                                            Ver Contenido (Prueba)
                                        </button>
                                    )}
                                    {isLocked && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (coinBalance > 0) handleUnlock(formation.id);
                                            }}
                                            disabled={coinBalance <= 0 || unlocking === formation.id}
                                            className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                                coinBalance > 0
                                                    ? 'bg-amber-600 hover:bg-amber-500 text-offwhite'
                                                    : 'bg-graphite text-muted cursor-not-allowed'
                                            }`}
                                        >
                                            {unlocking === formation.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Coins className="w-4 h-4" />
                                                    {coinBalance > 0
                                                        ? 'Desbloquear (1 Moneda)'
                                                        : 'Sin monedas disponibles'
                                                    }
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* No coins hint */}
                                    {isLocked && coinBalance <= 0 && (
                                        <p className="text-xs text-muted text-center mt-2">
                                            Recibes 1 moneda cada mes con tu suscripción
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Community CTA */}
                <div className="mt-12 bg-panel rounded-xl p-8 text-offwhite border border-graphite">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-display font-bold mb-2">
                                Únete a la Comunidad {route.name}
                            </h3>
                            <p className="text-lg text-muted">
                                Conecta con otros profesionales, comparte experiencias y crece juntos
                            </p>
                        </div>
                        <a
                            href="https://discord.gg/WpEznQPeZb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-accent text-carbon font-semibold py-3 px-8 rounded-lg hover:bg-accent/80 transition-colors whitespace-nowrap"
                        >
                            Acceder a Discord
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
