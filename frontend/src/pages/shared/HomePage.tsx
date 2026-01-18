import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, GraduationCap, LogOut } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarketplace = () => {
    if (user?.role === 'REP') {
      navigate('/rep/dashboard');
    } else if (user?.role === 'COMPANY') {
      navigate('/company/dashboard');
    }
  };

  const handleTraining = () => {
    navigate('/training/routes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  CapitalHub
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bienvenido, {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
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
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Qué quieres hacer hoy?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Selecciona la plataforma que necesitas
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Marketplace Card */}
          <button
            onClick={handleMarketplace}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-8">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Marketplace
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accede a ofertas de trabajo, gestiona tu perfil profesional y conecta con empresas
              </p>

              {/* Features */}
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Ofertas de trabajo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Perfil profesional</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Aplicaciones</span>
                </div>
              </div>

              {/* CTA */}
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                <span>Ir al Marketplace</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Training Card */}
          <button
            onClick={handleTraining}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-8">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Formación
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accede a cursos profesionales, certifícate y mejora tus habilidades digitales
              </p>

              {/* Features */}
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Rutas de aprendizaje</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Certificaciones oficiales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Comunidad exclusiva</span>
                </div>
              </div>

              {/* CTA */}
              <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all">
                <span>Ir a Formación</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            ¿Necesitas ayuda? Contacta con soporte en{' '}
            <a href="mailto:soporte@capitalhub.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              soporte@capitalhub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
