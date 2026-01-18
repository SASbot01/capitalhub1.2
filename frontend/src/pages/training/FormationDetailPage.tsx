import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getFormationById,
    getModulesByFormation,
    getLessonsByModule,
    mockUserProgress,
    getRouteById
} from '../../data/trainingMockData';
import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    Lock,
    Play,
    CheckCircle2,
    Clock,
    Award,
    Users,
    BookOpen
} from 'lucide-react';

export default function FormationDetailPage() {
    const { formationId } = useParams<{ formationId: string }>();
    const navigate = useNavigate();
    const [expandedModules, setExpandedModules] = useState<number[]>([1]); // First module expanded by default

    const formation = getFormationById(Number(formationId));
    const modules = getModulesByFormation(Number(formationId));

    if (!formation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Formación no encontrada</p>
            </div>
        );
    }

    const route = getRouteById(formation.routeId);

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const getLessonIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'in-progress':
                return <Play className="w-5 h-5 text-blue-500" />;
            case 'locked':
                return <Lock className="w-5 h-5 text-gray-400" />;
            default:
                return <Play className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(`/training/routes/${formation.routeId}/formations`)}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver a {route?.name}
                    </button>

                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                {formation.name}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                                {formation.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    <span>{modules.length} Módulos</span>
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
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 min-w-[280px]">
                            <div className="text-center mb-4">
                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                    {mockUserProgress.progressPercentage}%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Progreso completado
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${mockUserProgress.progressPercentage}%` }}
                                />
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                {mockUserProgress.completedLessons} de {mockUserProgress.totalLessons} lecciones
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Contenido del Curso
                        </h2>

                        <div className="space-y-4">
                            {modules.map((module) => {
                                const lessons = getLessonsByModule(module.id);
                                const isExpanded = expandedModules.includes(module.id);
                                const completedLessons = lessons.filter(l => l.status === 'completed').length;

                                return (
                                    <div
                                        key={module.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                                    >
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                {isExpanded ? (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                )}
                                                <div className="text-left">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {module.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {module.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {completedLessons}/{lessons.length} lecciones
                                            </div>
                                        </button>

                                        {/* Lessons */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-200 dark:border-gray-700">
                                                {lessons.map((lesson, lessonIndex) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            if (lesson.status !== 'locked') {
                                                                navigate(`/training/lessons/${lesson.id}`);
                                                            }
                                                        }}
                                                        disabled={lesson.status === 'locked'}
                                                        className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 ${lesson.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {getLessonIcon(lesson.status)}
                                                            <div className="text-left">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {lessonIndex + 1}. {lesson.title}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {lesson.duration}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {lesson.status === 'in-progress' && (
                                                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
                                                                En progreso
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}
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
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-3">
                                ¿Listo para empezar?
                            </h3>
                            <p className="text-sm opacity-90 mb-4">
                                Comienza tu formación ahora y obtén tu certificación en menos de 90 días
                            </p>
                            <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                                Activar Formación
                            </button>
                        </div>

                        {/* Community Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                Comunidad Privada
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Accede a nuestra comunidad exclusiva en Discord para conectar con otros estudiantes
                            </p>
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                                Unirse a Discord
                            </button>
                        </div>

                        {/* Certification Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <Award className="w-6 h-6 text-yellow-500" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Certificación
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Al completar esta formación, recibirás un certificado oficial que valida tus habilidades
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
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
