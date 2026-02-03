import { useNavigate } from 'react-router-dom';
import { mockRoutes } from '../../data/trainingMockData';
import { ArrowRight, Clock, TrendingUp, Home, Users, Award, Zap } from 'lucide-react';

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

            {/* Escalera de Valor */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Pricing Tiers */}
                <div className="mb-12">
                    <h2 className="text-2xl font-display font-bold text-offwhite text-center mb-8">
                        La Escalera de Valor FPD
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Nivel 0 - Gancho */}
                        <div className="bg-panel border border-graphite rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-graphite flex items-center justify-center text-muted text-sm font-bold">0</div>
                                <span className="text-xs text-muted uppercase tracking-wider">Gancho</span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-offwhite mb-1">Prueba 2 Semanas</h3>
                            <p className="text-2xl font-display font-bold text-accent mb-2">8€</p>
                            <p className="text-xs text-muted">Entrada de bajo riesgo. Evalúa si esto es para ti.</p>
                        </div>

                        {/* Nivel 1 - Frontend */}
                        <div className="bg-panel border border-graphite rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-graphite flex items-center justify-center text-muted text-sm font-bold">1</div>
                                <span className="text-xs text-muted uppercase tracking-wider">Frontend</span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-offwhite mb-1">Membresía Básica</h3>
                            <p className="text-2xl font-display font-bold text-accent mb-2">44€<span className="text-sm text-muted">/mes</span></p>
                            <p className="text-xs text-muted">Acceso a formaciones + bolsa de trabajo básica.</p>
                        </div>

                        {/* Nivel 2 - Core Offer */}
                        <div className="bg-panel border-2 border-accent rounded-xl p-5 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-offwhite text-xs font-bold px-3 py-1 rounded-full">
                                RECOMENDADO
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-offwhite text-sm font-bold">2</div>
                                <span className="text-xs text-accent uppercase tracking-wider">Core Offer</span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-offwhite mb-1">High Ticket Intensivo</h3>
                            <p className="text-2xl font-display font-bold text-accent mb-2">1.900€</p>
                            <p className="text-xs text-muted">4 meses intensivos + tutor + certificación oficial.</p>
                            <p className="text-[10px] text-muted mt-1">(1.500€ sin certificado)</p>
                        </div>

                        {/* Nivel 3 - Continuidad */}
                        <div className="bg-panel border border-graphite rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-graphite flex items-center justify-center text-muted text-sm font-bold">3</div>
                                <span className="text-xs text-muted uppercase tracking-wider">Continuidad</span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-offwhite mb-1">Membresía Pro</h3>
                            <p className="text-2xl font-display font-bold text-accent mb-2">97€<span className="text-sm text-muted">/mes</span></p>
                            <p className="text-xs text-muted">Mantén tu certificación activa y acceso al marketplace.</p>
                        </div>
                    </div>
                </div>

                {/* Qué incluye el High Ticket */}
                <div className="bg-panel border border-graphite rounded-xl p-6 mb-12">
                    <h3 className="text-lg font-display font-bold text-offwhite mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-accent" />
                        ¿Qué incluye el High Ticket Intensivo?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-offwhite">4 Meses Intensivos</p>
                                <p className="text-xs text-muted">Dentro de 1 año de acceso total</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-offwhite">Grupos Reducidos</p>
                                <p className="text-xs text-muted">Máximo 8 personas por grupo</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Award className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-offwhite">2 Calls/Semana</p>
                                <p className="text-xs text-muted">Acompañamiento con tutor dedicado</p>
                            </div>
                        </div>
                    </div>
                </div>

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
