import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { getRoutes, getFormations, startTrial } from '../../api/training';
import { useSubscription } from '../../context/SubscriptionContext';
import type { Route, Formation } from '../../api/training';

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { refreshAccess } = useSubscription();

    const [step, setStep] = useState(1);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [formations, setFormations] = useState<Formation[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load routes
    useEffect(() => {
        async function load() {
            try {
                const data = await getRoutes();
                setRoutes(data);
            } catch (err) {
                setError('Error al cargar las rutas');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Load formations when route is selected
    useEffect(() => {
        if (!selectedRoute) return;
        async function loadFormations() {
            try {
                const data = await getFormations(selectedRoute!.id);
                setFormations(data);
            } catch (err) {
                setError('Error al cargar las formaciones');
            }
        }
        loadFormations();
    }, [selectedRoute]);

    const handleRouteSelect = (route: Route) => {
        setSelectedRoute(route);
        setSelectedFormation(null);
        setStep(2);
    };

    const handleFormationSelect = async (formation: Formation) => {
        setSelectedFormation(formation);
        setSubmitting(true);
        setError(null);

        try {
            await startTrial(selectedRoute!.id, formation.id);
            await refreshAccess();
            navigate(`/training/formations/${formation.id}`);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar el trial');
            setSubmitting(false);
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                step >= 1 ? 'bg-accent text-carbon' : 'bg-graphite text-muted'
                            }`}>
                                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                            </div>
                            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-accent' : 'bg-graphite'}`} />
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                step >= 2 ? 'bg-accent text-carbon' : 'bg-graphite text-muted'
                            }`}>
                                2
                            </div>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-offwhite mb-3">
                            {step === 1 ? 'Elige tu profesión' : 'Elige tu formación'}
                        </h1>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            {step === 1
                                ? 'Selecciona la ruta profesional que más te interese. Podrás cambiarla más adelante.'
                                : `Elige la formación con la que quieres empezar tu prueba gratuita de 14 días.`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-red-400 text-sm">
                        {error}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routes.map((route) => (
                            <button
                                key={route.id}
                                onClick={() => handleRouteSelect(route)}
                                className="group bg-panel rounded-xl p-6 border border-graphite hover:border-accent/50 transition-all text-left"
                            >
                                {route.imageUrl && (
                                    <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                                        <img
                                            src={route.imageUrl}
                                            alt={route.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 to-transparent" />
                                    </div>
                                )}
                                <h3 className="text-xl font-display font-bold text-offwhite mb-2 group-hover:text-accent transition-colors">
                                    {route.name}
                                </h3>
                                <p className="text-muted text-sm mb-4 line-clamp-2">
                                    {route.description}
                                </p>
                                <div className="flex items-center text-accent text-sm font-medium">
                                    Seleccionar
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <>
                        <button
                            onClick={() => setStep(1)}
                            className="flex items-center text-muted hover:text-offwhite mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Cambiar ruta
                        </button>

                        <div className="mb-6 bg-panel rounded-lg p-4 border border-graphite">
                            <p className="text-sm text-muted">
                                Ruta seleccionada: <span className="text-offwhite font-medium">{selectedRoute?.name}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formations.map((formation) => (
                                <button
                                    key={formation.id}
                                    onClick={() => handleFormationSelect(formation)}
                                    disabled={submitting}
                                    className="group bg-panel rounded-xl p-6 border border-graphite hover:border-accent/50 transition-all text-left disabled:opacity-50"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-display font-bold text-offwhite group-hover:text-accent transition-colors">
                                            {formation.name}
                                        </h3>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                            formation.level === 'Básico' ? 'bg-emerald-900/30 text-emerald-400' :
                                            formation.level === 'Intermedio' ? 'bg-amber-900/30 text-amber-400' :
                                            'bg-red-900/30 text-red-400'
                                        }`}>
                                            {formation.level}
                                        </span>
                                    </div>
                                    <p className="text-muted text-sm mb-4 line-clamp-2">
                                        {formation.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted">
                                            {formation.estimatedHours || 40} horas
                                        </span>
                                        {submitting && selectedFormation?.id === formation.id ? (
                                            <Loader2 className="w-4 h-4 text-accent animate-spin" />
                                        ) : (
                                            <span className="text-accent text-sm font-medium flex items-center">
                                                Empezar prueba gratuita
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
