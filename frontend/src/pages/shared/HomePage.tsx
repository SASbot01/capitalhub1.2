import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Building2, GraduationCap, LogOut, Lock } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasMarketplaceAccess, hasFullFormationAccess, tier, access } = useSubscription();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarketplace = () => {
    if (!hasMarketplaceAccess && user?.role === 'REP') {
      navigate('/upgrade');
      return;
    }
    if (user?.role === 'REP') {
      navigate('/rep/profile');
    } else if (user?.role === 'COMPANY') {
      navigate('/company/dashboard');
    }
  };

  const handleTraining = () => {
    if (!hasFullFormationAccess) {
      navigate('/upgrade');
      return;
    }
    navigate('/training/routes');
  };

  return (
    <div className="min-h-screen bg-carbon">
      {/* Header */}
      <div className="bg-panel border-b border-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-offwhite rounded-lg flex items-center justify-center">
                <span className="text-carbon font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-offwhite">
                  CapitalHub
                </h1>
                <p className="text-sm text-muted">
                  Bienvenido, {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-muted hover:text-offwhite transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-offwhite mb-4">
            ¿Por dónde empezamos?
          </h2>

          {/* Tier Badge */}
          {tier && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-panel border border-graphite rounded-full">
              <span className="text-xs text-muted">Tu plan:</span>
              <span className="text-xs font-bold text-offwhite">{access?.tierDisplayName || tier}</span>
              {access?.hasCertification && (
                <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-700/30 px-2 py-0.5 rounded-full">Certificado</span>
              )}
            </div>
          )}
          {!tier && user?.role === 'REP' && (
            <button
              onClick={() => navigate('/upgrade')}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-accent text-carbon text-xs font-bold rounded-full hover:bg-offwhite transition"
            >
              Elige tu plan para empezar
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Marketplace Card */}
          <button
            onClick={handleMarketplace}
            className={`group relative bg-panel rounded-xl shadow-card transition-all duration-300 overflow-hidden border transform hover:-translate-y-2 ${
              hasMarketplaceAccess || user?.role === 'COMPANY'
                ? 'hover:shadow-glow border-graphite hover:border-offwhite/30'
                : 'border-graphite/50 opacity-80'
            }`}
          >
            <div className="relative p-8">
              {/* Lock overlay for REP without marketplace */}
              {!hasMarketplaceAccess && user?.role === 'REP' && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-graphite/80 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-muted" />
                  <span className="text-[10px] text-muted font-medium">Requiere Membresía (44€/mes)</span>
                </div>
              )}

              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-graphite rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-offwhite" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-offwhite mb-3">
                Marketplace
              </h3>
              <p className="text-muted mb-6">
                Encuentra tu próximo trabajo remoto
              </p>

              {/* Features */}
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-1.5 h-1.5 bg-offwhite rounded-full" />
                  <span>Ofertas de trabajo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-1.5 h-1.5 bg-offwhite rounded-full" />
                  <span>Tu perfil</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-1.5 h-1.5 bg-offwhite rounded-full" />
                  <span>Tus candidaturas</span>
                </div>
              </div>

              {/* CTA */}
              <div className="inline-flex items-center gap-2 text-offwhite font-semibold group-hover:gap-3 transition-all">
                <span>{hasMarketplaceAccess || user?.role === 'COMPANY' ? 'Ir al Marketplace' : 'Desbloquear Marketplace'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Training Card */}
          <button
            onClick={handleTraining}
            className={`group relative bg-panel rounded-xl shadow-card transition-all duration-300 overflow-hidden border transform hover:-translate-y-2 ${
              hasFullFormationAccess
                ? 'hover:shadow-glow border-graphite hover:border-offwhite/30'
                : 'border-graphite/50 opacity-80'
            }`}
          >
            <div className="relative p-8">
              {/* Lock overlay */}
              {!hasFullFormationAccess && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-graphite/80 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-muted" />
                  <span className="text-[10px] text-muted font-medium">Requiere suscripción</span>
                </div>
              )}

              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-graphite rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <GraduationCap className="w-10 h-10 text-offwhite" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-offwhite mb-3">
                Formación
              </h3>
              <p className="text-muted mb-6">
                Fórmate en una profesión digital y certifícate
              </p>

              {/* Features */}
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-1.5 h-1.5 bg-offwhite rounded-full" />
                  <span>Rutas de aprendizaje</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-1.5 h-1.5 bg-offwhite rounded-full" />
                  <span>Certificaciones oficiales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-1.5 h-1.5 bg-offwhite rounded-full" />
                  <span>Comunidad exclusiva</span>
                </div>
              </div>

              {/* CTA */}
              <div className="inline-flex items-center gap-2 text-offwhite font-semibold group-hover:gap-3 transition-all">
                <span>{hasFullFormationAccess ? 'Ir a Formación' : 'Desbloquear Formación'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <p className="text-muted">
            ¿Necesitas ayuda? Contacta con soporte en{' '}
            <a href="mailto:soporte@capitalhub.com" className="text-offwhite hover:underline">
              soporte@capitalhub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
