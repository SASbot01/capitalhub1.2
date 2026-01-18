import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockLessons, mockModules, getFormationById } from '../../data/trainingMockData';
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen, Clock } from 'lucide-react';

export default function LessonViewer() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const [isCompleted, setIsCompleted] = useState(false);

    const lesson = mockLessons.find(l => l.id === Number(lessonId));
    const module = lesson ? mockModules.find(m => m.id === lesson.moduleId) : null;
    const formation = module ? getFormationById(module.formationId) : null;

    if (!lesson || !module || !formation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Lección no encontrada</p>
            </div>
        );
    }

    const allLessons = mockLessons.filter(l => l.moduleId === module.id);
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const handleComplete = () => {
        setIsCompleted(true);
        // In real app, this would call API to mark lesson as completed
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(`/training/formations/${formation.id}`)}
                            className="flex items-center text-gray-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Volver al curso
                        </button>
                        <div className="text-sm text-gray-400">
                            {module.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video */}
                        <div className="bg-black rounded-xl overflow-hidden aspect-video">
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
                        </div>

                        {/* Lesson Info */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-white mb-2">
                                        {lesson.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {lesson.duration}
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            {formation.name}
                                        </div>
                                    </div>
                                </div>
                                {!isCompleted && lesson.status !== 'completed' && (
                                    <button
                                        onClick={handleComplete}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Marcar como completada
                                    </button>
                                )}
                                {(isCompleted || lesson.status === 'completed') && (
                                    <div className="bg-green-600/20 text-green-400 font-semibold py-2 px-6 rounded-lg flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Completada
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Descripción
                                </h3>
                                <p className="text-gray-300">
                                    {lesson.content}
                                </p>
                            </div>
                        </div>

                        {/* Next Lesson */}
                        {nextLesson && (
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-blue-100 mb-1">
                                            Siguiente lección
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            {nextLesson.title}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/training/lessons/${nextLesson.id}`)}
                                        className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                                    >
                                        Continuar
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Module Lessons */}
                    <div className="bg-gray-800 rounded-xl p-6 h-fit">
                        <h3 className="text-lg font-bold text-white mb-4">
                            Contenido del Módulo
                        </h3>
                        <div className="space-y-2">
                            {allLessons.map((l, index) => (
                                <button
                                    key={l.id}
                                    onClick={() => {
                                        if (l.status !== 'locked') {
                                            navigate(`/training/lessons/${l.id}`);
                                        }
                                    }}
                                    disabled={l.status === 'locked'}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${l.id === lesson.id
                                            ? 'bg-blue-600 text-white'
                                            : l.status === 'locked'
                                                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {l.status === 'completed' && (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            )}
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {index + 1}. {l.title}
                                                </div>
                                                <div className="text-xs opacity-75">
                                                    {l.duration}
                                                </div>
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
