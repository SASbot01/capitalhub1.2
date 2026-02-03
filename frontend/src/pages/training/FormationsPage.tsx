import { useParams, useNavigate } from 'react-router-dom';
import { getRouteById, getFormationsByRoute } from '../../data/trainingMockData';
import { ArrowLeft, Clock, Award, Users, CheckCircle, Home } from 'lucide-react';

export default function FormationsPage() {
    const { routeId } = useParams<{ routeId: string }>();
    const navigate = useNavigate();

    const route = getRouteById(Number(routeId));
    const formations = getFormationsByRoute(Number(routeId));

    if (!route) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-carbon">
                <p className="text-xl text-muted">Ruta no encontrada</p>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen bg-carbon">
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
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 text-muted hover:text-offwhite transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            <span className="text-sm font-medium">Inicio</span>
                        </button>
                    </div>

                    <div className="flex items-start gap-6">
                        <img
                            src={route.imageUrl}
                            alt={route.name}
                            className="w-32 h-32 rounded-xl object-cover shadow-card border border-graphite"
                        />
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
                    <h2 className="text-2xl font-display font-bold text-offwhite mb-2">
                        Formaciones Disponibles
                    </h2>
                    <p className="text-muted">
                        Selecciona una formación para comenzar tu camino profesional
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {formations.map((formation) => (
                        <div
                            key={formation.id}
                            onClick={() => navigate(`/training/formations/${formation.id}`)}
                            className="group bg-panel rounded-xl shadow-card transition-all duration-300 cursor-pointer overflow-hidden border border-graphite hover:border-accent/50"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-display font-bold text-offwhite mb-2 group-hover:text-accent transition-colors">
                                            {formation.name}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getLevelColor(formation.level)}`}>
                                            {formation.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-muted mb-6 line-clamp-2">
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
                                <button className="w-full bg-accent hover:bg-accent/80 text-offwhite font-semibold py-3 px-6 rounded-lg transition-colors">
                                    Ver Contenido
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Community CTA */}
                <div className="mt-12 bg-gradient-to-r from-accent to-purple-800 rounded-xl p-8 text-offwhite border border-accent/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-display font-bold mb-2">
                                Únete a la Comunidad {route.name}
                            </h3>
                            <p className="text-lg opacity-90">
                                Conecta con otros profesionales, comparte experiencias y crece juntos
                            </p>
                        </div>
                        <button className="bg-offwhite text-carbon font-semibold py-3 px-8 rounded-lg hover:bg-offwhite/90 transition-colors whitespace-nowrap">
                            Acceder a Discord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
