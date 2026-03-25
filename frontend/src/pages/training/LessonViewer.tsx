import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { getLesson, getLessons, getFormation, completeLesson } from '../../api/training';
import type { Lesson, Formation } from '../../api/training';

export default function LessonViewer() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [formation, setFormation] = useState<Formation | null>(null);
    const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setIsCompleted(false);
            try {
                const lessonData = await getLesson(Number(lessonId));
                setLesson(lessonData);

                // Load sibling lessons in the same module
                const siblings = await getLessons(lessonData.moduleId);
                setModuleLessons(siblings);

                // We need to get the formation — the lesson has a moduleId,
                // and the module has a formationId
                // For now, we'll try to get the formation from the module
                const moduleRes = await fetch(`/api/training/modules/${lessonData.moduleId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`
                    }
                });
                if (moduleRes.ok) {
                    const moduleData = await moduleRes.json();
                    const formationData = await getFormation(moduleData.formationId);
                    setFormation(formationData);
                }
            } catch (err) {
                console.error('Error loading lesson:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [lessonId]);

    const handleComplete = async () => {
        if (!lesson || completing) return;
        setCompleting(true);
        try {
            await completeLesson(lesson.id);
            setIsCompleted(true);
        } catch (err) {
            console.error('Error completing lesson:', err);
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-carbon">
                <p className="text-xl text-muted">Lección no encontrada</p>
            </div>
        );
    }

    const currentIndex = moduleLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-carbon">
            {/* Header */}
            <div className="bg-panel border-b border-graphite">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => formation && navigate(`/training/formations/${formation.id}`)}
                            className="flex items-center text-muted hover:text-offwhite transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Volver al curso
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Player */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video */}
                        {lesson.videoUrl && (
                            <div className="bg-carbon rounded-xl overflow-hidden aspect-video border border-graphite">
                                {/\.(mp4|mov|webm|ogg)(\?|$)/i.test(lesson.videoUrl) ? (
                                    <video
                                        controls
                                        controlsList="nodownload"
                                        className="w-full h-full"
                                        key={lesson.videoUrl}
                                    >
                                        <source src={lesson.videoUrl} type={lesson.videoUrl.endsWith('.mov') ? 'video/mp4' : undefined} />
                                        Tu navegador no soporta la reproducción de video.
                                    </video>
                                ) : (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={lesson.videoUrl}
                                        title={lesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                )}
                            </div>
                        )}

                        {/* Lesson Info */}
                        <div className="bg-panel rounded-xl p-6 border border-graphite">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-offwhite mb-2">
                                        {lesson.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-muted">
                                        {formation && (
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                {formation.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!isCompleted ? (
                                    <button
                                        onClick={handleComplete}
                                        disabled={completing}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center disabled:opacity-50"
                                    >
                                        {completing ? (
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                        )}
                                        Marcar como completada
                                    </button>
                                ) : (
                                    <div className="bg-emerald-900/30 text-emerald-400 font-semibold py-2 px-6 rounded-lg flex items-center border border-emerald-700/30">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Completada
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {lesson.description && (
                                <div className="border-t border-graphite pt-4">
                                    <h3 className="text-lg font-semibold text-offwhite mb-2">
                                        Descripción
                                    </h3>
                                    <p className="text-offwhite/80">
                                        {lesson.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Next Lesson */}
                        {nextLesson && (
                            <div className="bg-graphite rounded-xl p-6 border border-graphite">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted mb-1">
                                            Siguiente lección
                                        </div>
                                        <div className="text-xl font-bold text-offwhite">
                                            {nextLesson.title}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/training/lessons/${nextLesson.id}`)}
                                        className="bg-accent text-carbon font-semibold py-3 px-6 rounded-lg hover:bg-accent/80 transition-colors flex items-center"
                                    >
                                        Continuar
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Module Lessons */}
                    <div className="bg-panel rounded-xl p-6 h-fit border border-graphite">
                        <h3 className="text-lg font-bold text-offwhite mb-4">
                            Lecciones del Módulo
                        </h3>
                        <div className="space-y-2">
                            {moduleLessons.map((l, index) => (
                                <button
                                    key={l.id}
                                    onClick={() => navigate(`/training/lessons/${l.id}`)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                                        l.id === lesson.id
                                            ? 'bg-accent text-carbon'
                                            : 'bg-graphite text-offwhite hover:bg-graphite/80'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-medium text-sm">
                                                {index + 1}. {l.title}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
