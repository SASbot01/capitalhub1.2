import { useNavigate } from 'react-router-dom';
import { mockRoutes } from '../../data/trainingMockData';
import { ArrowRight, Clock, TrendingUp, Home } from 'lucide-react';

export default function RoutesPage() {
    const navigate = useNavigate();

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
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl font-display font-bold text-offwhite mb-4">
                            Formación Profesional Digital
                        </h1>
                        <p className="text-xl text-muted max-w-3xl mx-auto">
                            Elige tu ruta y transfórmate en un profesional digital certificado.
                            Formación intensiva de 4 meses con acompañamiento personalizado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Routes Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Routes Grid */}
                <h2 className="text-2xl font-display font-bold text-offwhite text-center mb-8">
                    Elige tu Ruta
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mockRoutes.map((route) => (
                        <div
                            key={route.id}
                            onClick={() => navigate(`/training/routes/${route.id}/formations`)}
                            className="group relative bg-panel rounded-xl overflow-hidden shadow-card border border-graphite hover:border-accent/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={route.imageUrl}
                                    alt={route.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />

                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-accent text-offwhite px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                                    Activa
                                </div>
                            </div>

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
                                <button className="w-full bg-accent hover:bg-accent/80 text-offwhite font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
                                    Ver Formaciones
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center bg-gradient-to-r from-accent to-purple-800 rounded-xl p-12 text-offwhite border border-accent/30">
                    <h2 className="text-3xl font-display font-bold mb-4">
                        ¿Listo para transformar tu carrera?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Únete a la comunidad de profesionales digitales certificados
                    </p>
                    <button className="bg-offwhite text-carbon font-semibold py-3 px-8 rounded-lg hover:bg-offwhite/90 transition-colors">
                        Agendar Orientación Gratuita
                    </button>
                </div>
            </div>
        </div>
    );
}
