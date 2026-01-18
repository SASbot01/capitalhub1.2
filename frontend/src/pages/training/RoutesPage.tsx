import { useNavigate } from 'react-router-dom';
import { mockRoutes } from '../../data/trainingMockData';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';

export default function RoutesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Elige tu Ruta Profesional
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Selecciona la ruta que mejor se adapte a tus objetivos profesionales.
                            Cada ruta está diseñada para llevarte desde cero hasta experto en menos de 90 días.
                        </p>
                    </div>
                </div>
            </div>

            {/* Routes Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mockRoutes.map((route) => (
                        <div
                            key={route.id}
                            onClick={() => navigate(`/training/routes/${route.id}/formations`)}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={route.imageUrl}
                                    alt={route.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                    Activa
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {route.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                                    {route.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>40-60 horas</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        <span>Alta demanda</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                                    Ver Formaciones
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        ¿No estás seguro qué ruta elegir?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Agenda una sesión de orientación gratuita con nuestro equipo
                    </p>
                    <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                        Agendar Orientación
                    </button>
                </div>
            </div>
        </div>
    );
}
