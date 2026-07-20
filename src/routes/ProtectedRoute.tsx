import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '../types';
import { useAuth } from '../contexts/RoleContext';

interface ProtectedRouteProps {
  allow: Role[];
}

export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allow.includes(role)) {
    const fallback = role === 'admin' ? '/admin/dashboard' : '/applications';
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
