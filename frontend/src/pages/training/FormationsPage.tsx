import { useParams, useNavigate } from 'react-router-dom';
import { getRouteById, getFormationsByRoute } from '../../data/trainingMockData';
import { ArrowLeft, Clock, Award, Users, CheckCircle } from 'lucide-react';

export default function FormationsPage() {
    const { routeId } = useParams<{ routeId: string }>();
    const navigate = useNavigate();

    const route = getRouteById(Number(routeId));
    const formations = getFormationsByRoute(Number(routeId));

    if (!route) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Ruta no encontrada</p>
            </div>
        );
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Básico':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Intermedio':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Avanzado':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate('/training/routes')}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver a Rutas
                    </button>

                    <div className="flex items-start gap-6">
                        <img
                            src={route.imageUrl}
                            alt={route.name}
                            className="w-32 h-32 rounded-xl object-cover shadow-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                {route.name}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                                {route.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <Award className="w-5 h-5 mr-2" />
                                    <span>{formations.length} Formaciones</span>
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

            {/* Formations List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Formaciones Disponibles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Selecciona una formación para comenzar tu camino profesional
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formations.map((formation) => (
                        <div
                            key={formation.id}
                            onClick={() => navigate(`/training/formations/${formation.id}`)}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {formation.name}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(formation.level)}`}>
                                            {formation.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                                    {formation.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>{formation.estimatedHours || 40} horas</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        <span>Certificación incluida</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors group-hover:bg-blue-700">
                                    Ver Contenido
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Community CTA */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">
                                Únete a la Comunidad {route.name}
                            </h3>
                            <p className="text-lg opacity-90">
                                Conecta con otros profesionales, comparte experiencias y crece juntos
                            </p>
                        </div>
                        <button className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                            Acceder a Discord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
