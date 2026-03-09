import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ChevronDown, ChevronRight, Lock, Play,
    Clock, Award, Users, BookOpen, Loader2, Shield
} from 'lucide-react';
import {
    getFormation, getModulesAccess, getLessons, getFormationProgress as getProgress, getRoute
} from '../../api/training';
import { useSubscription } from '../../context/SubscriptionContext';
import type { Formation, ModuleAccessInfo, Lesson, FormationProgress, Route } from '../../api/training';

export default function FormationDetailPage() {
    const { formationId } = useParams<{ formationId: string }>();
    const navigate = useNavigate();
    const { isInTrial, access } = useSubscription();

    const [formation, setFormation] = useState<Formation | null>(null);
    const [route, setRoute] = useState<Route | null>(null);
    const [modulesAccess, setModulesAccess] = useState<ModuleAccessInfo[]>([]);
    const [lessonsByModule, setLessonsByModule] = useState<Record<number, Lesson[]>>({});
    const [progress, setProgress] = useState<FormationProgress | null>(null);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingLessons, setLoadingLessons] = useState<number | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const fId = Number(formationId);
                const [formationData, modulesData, progressData] = await Promise.all([
                    getFormation(fId),
                    getModulesAccess(fId),
                    getProgress(fId).catch(() => null)
                ]);
                setFormation(formationData);
                setModulesAccess(modulesData);
                setProgress(progressData);

                // Load route
                if (formationData.routeId) {
                    const routeData = await getRoute(formationData.routeId);
                    setRoute(routeData);
                }

                // Expand first module by default
                if (modulesData.length > 0) {
                    setExpandedModules([modulesData[0].module.id]);
                }
            } catch (err) {
                console.error('Error loading formation:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [formationId]);

    const toggleModule = async (moduleId: number) => {
        if (expandedModules.includes(moduleId)) {
            setExpandedModules(prev => prev.filter(id => id !== moduleId));
        } else {
            setExpandedModules(prev => [...prev, moduleId]);
            // Load lessons if not loaded
            if (!lessonsByModule[moduleId]) {
                setLoadingLessons(moduleId);
                try {
                    const lessons = await getLessons(moduleId);
                    setLessonsByModule(prev => ({ ...prev, [moduleId]: lessons }));
                } catch (err) {
                    console.error('Error loading lessons:', err);
                } finally {
                    setLoadingLessons(null);
                }
            }
        }
    };

    const getTrialDaysRemaining = () => {
        if (!access?.tierExpiresAt) return 0;
        const expiry = new Date(access.tierExpiresAt);
        const now = new Date();
        return Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    if (!formation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-carbon">
                <p className="text-xl text-muted">Formación no encontrada</p>
            </div>
        );
    }

    const progressPercentage = progress?.progressPercentage ?? 0;
    const completedLessons = progress?.completedLessons ?? 0;
    const totalLessons = progress?.totalLessons ?? 0;

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
                    <button
                        onClick={() => navigate(`/training/routes/${formation.routeId}/formations`)}
                        className="flex items-center text-muted hover:text-offwhite mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver a {route?.name ?? 'Formaciones'}
                    </button>

                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-offwhite mb-3">
                                {formation.name}
                            </h1>
                            <p className="text-xl text-muted mb-6">
                                {formation.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-muted">
                                <div className="flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    <span>{modulesAccess.length} Módulos</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>{formation.estimatedHours || 40} horas</span>
                                </div>
                                <div className="flex items-center">
                                    <Award className="w-5 h-5 mr-2" />
                                    <span>Certificación al completar</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    <span>Comunidad privada</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-graphite rounded-xl p-6 min-w-[280px] border border-graphite">
                            <div className="text-center mb-4">
                                <div className="text-4xl font-bold text-offwhite mb-1">
                                    {progressPercentage}%
                                </div>
                                <div className="text-sm text-muted">
                                    Progreso completado
                                </div>
                            </div>
                            <div className="w-full bg-carbon rounded-full h-3 mb-4">
                                <div
                                    className="bg-offwhite h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <div className="text-sm text-muted text-center">
                                {completedLessons} de {totalLessons} lecciones
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Modules & Lessons */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-offwhite mb-6">
                            Contenido del Curso
                        </h2>

                        <div className="space-y-4">
                            {modulesAccess.map((item, _moduleIndex) => {
                                const { module, accessible, lockReason, contentType } = item;
                                const isExpanded = expandedModules.includes(module.id);
                                const lessons = lessonsByModule[module.id] || [];
                                const isLoadingModule = loadingLessons === module.id;
                                const isMindset = contentType === 'MINDSET';

                                return (
                                    <div
                                        key={module.id}
                                        className={`bg-panel rounded-xl overflow-hidden border shadow-card ${
                                            !accessible ? 'border-graphite/50 opacity-75' : 'border-graphite'
                                        }`}
                                    >
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-graphite/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                {isExpanded ? (
                                                    <ChevronDown className="w-5 h-5 text-muted" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-muted" />
                                                )}
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-semibold text-offwhite">
                                                            {module.name}
                                                        </h3>
                                                        {isMindset && (
                                                            <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded font-semibold uppercase">
                                                                Mentalidad
                                                            </span>
                                                        )}
                                                        {!accessible && (
                                                            <Lock className="w-4 h-4 text-muted" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted">
                                                        {module.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Lock reason badge */}
                                            {lockReason === 'TRIAL_LIMIT' && (
                                                <span className="text-xs bg-amber-900/30 text-amber-400 px-3 py-1 rounded-lg font-semibold whitespace-nowrap">
                                                    Suscríbete para desbloquear
                                                </span>
                                            )}
                                            {lockReason === 'ANNUAL_PLAN_REQUIRED' && (
                                                <span className="text-xs bg-purple-900/30 text-purple-400 px-3 py-1 rounded-lg font-semibold whitespace-nowrap">
                                                    Plan Anual
                                                </span>
                                            )}
                                            {lockReason === 'FORMATION_LOCKED' && (
                                                <span className="text-xs bg-graphite text-muted px-3 py-1 rounded-lg font-semibold whitespace-nowrap">
                                                    Formación bloqueada
                                                </span>
                                            )}
                                        </button>

                                        {/* Lock overlay for inaccessible modules */}
                                        {isExpanded && !accessible && (
                                            <div className="border-t border-graphite px-6 py-8 text-center">
                                                <Lock className="w-8 h-8 text-muted mx-auto mb-3" />
                                                {lockReason === 'TRIAL_LIMIT' && (
                                                    <>
                                                        <p className="text-offwhite font-medium mb-2">Módulo bloqueado</p>
                                                        <p className="text-sm text-muted mb-4">
                                                            Suscríbete para acceder a todos los módulos de esta formación.
                                                        </p>
                                                        <button
                                                            onClick={() => navigate('/upgrade')}
                                                            className="bg-accent text-carbon font-semibold px-6 py-2 rounded-lg hover:bg-accent/80 transition-colors text-sm"
                                                        >
                                                            Suscríbete por 44€/mes
                                                        </button>
                                                    </>
                                                )}
                                                {lockReason === 'ANNUAL_PLAN_REQUIRED' && (
                                                    <>
                                                        <p className="text-offwhite font-medium mb-2">Disponible en Plan Anual</p>
                                                        <p className="text-sm text-muted">
                                                            El contenido de mentalidad está disponible con el plan anual.
                                                        </p>
                                                    </>
                                                )}
                                                {lockReason === 'FORMATION_LOCKED' && (
                                                    <>
                                                        <p className="text-offwhite font-medium mb-2">Formación bloqueada</p>
                                                        <p className="text-sm text-muted">
                                                            Desbloquea esta formación con una moneda para acceder a su contenido.
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Lessons */}
                                        {isExpanded && accessible && (
                                            <div className="border-t border-graphite">
                                                {isLoadingModule ? (
                                                    <div className="px-6 py-8 text-center">
                                                        <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto" />
                                                    </div>
                                                ) : lessons.length > 0 ? (
                                                    lessons.map((lesson, lessonIndex) => (
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => navigate(`/training/lessons/${lesson.id}`)}
                                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-graphite/50 transition-colors border-b border-graphite last:border-b-0 cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <Play className="w-5 h-5 text-muted" />
                                                                <div className="text-left">
                                                                    <div className="font-medium text-offwhite">
                                                                        {lessonIndex + 1}. {lesson.title}
                                                                    </div>
                                                                    <div className="text-sm text-muted">
                                                                        {lesson.duration}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-6 py-4 text-sm text-muted text-center">
                                                        No hay lecciones disponibles
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* CTA Card */}
                        {isInTrial && (
                            <div className="bg-blue-900/20 rounded-xl p-6 text-offwhite border border-blue-700/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    <h3 className="text-lg font-bold">
                                        Prueba Gratuita
                                    </h3>
                                </div>
                                <p className="text-sm text-blue-200 mb-4">
                                    Tienes acceso a los primeros 3 módulos. Suscríbete para desbloquear todo el contenido.
                                </p>
                                <button
                                    onClick={() => navigate('/upgrade')}
                                    className="w-full bg-accent text-carbon font-semibold py-3 px-6 rounded-lg hover:bg-accent/80 transition-colors"
                                >
                                    Suscribirme — 44€/mes
                                </button>
                            </div>
                        )}

                        {/* Community Card */}
                        <div className="bg-panel rounded-xl p-6 shadow-card border border-graphite">
                            <h3 className="text-lg font-bold text-offwhite mb-3">
                                Comunidad Privada
                            </h3>
                            <p className="text-sm text-muted mb-4">
                                Accede a nuestra comunidad exclusiva en Discord para conectar con otros estudiantes
                            </p>
                            <a
                                href="https://discord.gg/WpEznQPeZb"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-graphite hover:bg-graphite/80 text-offwhite font-semibold py-3 px-6 rounded-lg transition-colors border border-graphite"
                            >
                                Unirse a Discord
                            </a>
                        </div>

                        {/* Certification Card */}
                        <div className="bg-panel rounded-xl p-6 shadow-card border border-graphite">
                            <div className="flex items-center gap-3 mb-3">
                                <Award className="w-6 h-6 text-amber-400" />
                                <h3 className="text-lg font-bold text-offwhite">
                                    Certificación
                                </h3>
                            </div>
                            <p className="text-sm text-muted mb-4">
                                Al completar esta formación, recibirás un certificado oficial que valida tus habilidades
                            </p>
                            <div className="text-xs text-muted">
                                • Examen final de 10 preguntas<br />
                                • 70% mínimo para aprobar<br />
                                • Certificado digital descargable
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
