// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  // Lista de roles permitidos para acceder a esta ruta (ej: ['REP'] o ['COMPANY'])
  allowedRoles: Array<'REP' | 'COMPANY' | 'ADMIN'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Paso 1: Muestra un componente de carga mientras se verifica el estado inicial de la sesión
  if (isLoading) {
    // Puedes reemplazar esto con un spinner o un esqueleto de carga
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Cargando sesión...
      </div>
    ); 
  }

  // Paso 2: Si no está autenticado, forzamos la redirección a la página de Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Paso 3: Si está autenticado, verificamos si su rol está en la lista de roles permitidos
  if (role && !allowedRoles.includes(role)) {
    // Si tiene sesión pero el rol no es el correcto, lo redirigimos a su dashboard principal

    if (role === 'REP') {
      return <Navigate to="/rep/dashboard" replace />;
    } 
    if (role === 'COMPANY') {
      return <Navigate to="/company/dashboard" replace />;
    }
    
    // Si no es un rol conocido, lo mandamos a la página principal
    return <Navigate to="/" replace />; 
  }

  // Paso 4: Si está autenticado y el rol es correcto, renderizamos las rutas anidadas
  return <Outlet />;
};