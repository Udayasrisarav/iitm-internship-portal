import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '../types';
import { useRole } from '../contexts/RoleContext';

interface ProtectedRouteProps {
  allow: Role[];
}

export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const { role } = useRole();
  const location = useLocation();

  // Auth integration placeholder. When real auth is added, gate on session
  // presence here and redirect to a login page. For now we only enforce role.
  if (!allow.includes(role)) {
    const fallback = role === 'admin' ? '/admin/dashboard' : `/${role}`;
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
