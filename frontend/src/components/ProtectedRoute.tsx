import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import type { SubscriptionTier } from '../types/subscription';

interface ProtectedRouteProps {
  allowedRoles: Array<'REP' | 'COMPANY' | 'ADMIN'>;
  requiredTier?: SubscriptionTier;
  requireMarketplace?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requiredTier,
  requireMarketplace = false
}) => {
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  const { canAccessTier, hasMarketplaceAccess, isLoading: subLoading, tier } = useSubscription();

  // Show loading while checking auth status
  if (authLoading || subLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Cargando sesión...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  // Check tier requirement — redirect to onboarding if no tier at all, upgrade if expired
  if (requiredTier && !canAccessTier(requiredTier)) {
    if (!tier) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/upgrade" replace />;
  }

  // Check marketplace access requirement
  if (requireMarketplace && !hasMarketplaceAccess) {
    return <Navigate to="/upgrade" replace />;
  }

  // All checks passed, render nested routes
  return <Outlet />;
};
