import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Building2, GraduationCap, LogOut, Lock, Settings, Shield } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasMarketplaceAccess, hasFullFormationAccess, tier, access } = useSubscription();

  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarketplace = () => {
    if (isAdmin) {
      navigate('/rep/profile');
      return;
    }
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
    if (!isAdmin && !hasFullFormationAccess) {
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/rep/settings')}
                className="flex items-center gap-2 px-4 py-2 text-muted hover:text-offwhite transition-colors"
                title="Ajustes"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Ajustes</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-muted hover:text-offwhite transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar sesion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-offwhite mb-4">
            {isAdmin ? 'Panel de Control' : '¿Por donde empezamos?'}
          </h2>

          {/* Admin Badge */}
          {isAdmin && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent">Administrador</span>
            </div>
          )}

          {/* Tier Badge */}
          {!isAdmin && tier && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-panel border border-graphite rounded-full">
              <span className="text-xs text-muted">Tu plan:</span>
              <span className="text-xs font-bold text-offwhite">{access?.tierDisplayName || tier}</span>
              {access?.hasCertification && (
                <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-700/30 px-2 py-0.5 rounded-full">Certificado</span>
              )}
            </div>
          )}
          {!isAdmin && !tier && user?.role === 'REP' && (
            <button
              onClick={() => navigate('/upgrade')}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-accent text-carbon text-xs font-bold rounded-full hover:bg-offwhite transition"
            >
              Elige tu plan para empezar
            </button>
          )}
        </div>

        {/* Admin Panel Card - FIRST for admins */}
        {isAdmin && (
          <div className="max-w-5xl mx-auto mb-8">
            <button
              onClick={() => navigate('/admin/routes')}
              className="w-full group relative bg-panel rounded-xl shadow-card transition-all duration-300 overflow-hidden border border-accent/30 hover:border-accent hover:shadow-glow transform hover:-translate-y-1"
            >
              <div className="p-8 flex items-center gap-6">
                <div className="w-20 h-20 bg-accent/10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Shield className="w-10 h-10 text-accent" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-offwhite">Gestionar Formaciones</h3>
                  <p className="text-sm text-muted mt-2">Crea y organiza rutas, formaciones, bloques y clases con URLs de GoHighLevel</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="px-4 py-2 bg-accent text-carbon text-sm font-bold rounded-lg">
                    Abrir Panel
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Marketplace Card */}
          <button
            onClick={handleMarketplace}
            className={`group relative bg-panel rounded-xl shadow-card transition-all duration-300 overflow-hidden border transform hover:-translate-y-2 ${
              hasMarketplaceAccess || user?.role === 'COMPANY' || isAdmin
                ? 'hover:shadow-glow border-graphite hover:border-offwhite/30'
                : 'border-graphite/50 opacity-80'
            }`}
          >
            <div className="relative p-8">
              {/* Lock overlay for REP without marketplace */}
              {!hasMarketplaceAccess && user?.role === 'REP' && !isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-graphite/80 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-muted" />
                  <span className="text-[10px] text-muted font-medium">Requiere Membresia (44€/mes)</span>
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
                Encuentra tu proximo trabajo remoto
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
                <span>{hasMarketplaceAccess || user?.role === 'COMPANY' || isAdmin ? 'Ir al Marketplace' : 'Desbloquear Marketplace'}</span>
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
              hasFullFormationAccess || isAdmin
                ? 'hover:shadow-glow border-graphite hover:border-offwhite/30'
                : 'border-graphite/50 opacity-80'
            }`}
          >
            <div className="relative p-8">
              {/* Lock overlay */}
              {!hasFullFormationAccess && !isAdmin && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-graphite/80 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-muted" />
                  <span className="text-[10px] text-muted font-medium">Requiere suscripcion</span>
                </div>
              )}

              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-graphite rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <GraduationCap className="w-10 h-10 text-offwhite" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-offwhite mb-3">
                Formacion
              </h3>
              <p className="text-muted mb-6">
                Formate en una profesion digital y certificate
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
                <span>{hasFullFormationAccess || isAdmin ? 'Ir a Formacion' : 'Desbloquear Formacion'}</span>
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
