import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useRoles from "../../hooks/useRoles";
import TokenService from "../../services/shared/TokenService";

interface ProtectedRouteProps {
  /** Roles that are allowed to access this route. If empty, any authenticated user can access. */
  allowedRoles?: string[];
  children: ReactNode;
}

/**
 * ProtectedRoute — wraps a route element with authentication + role checks.
 *
 * Behaviour:
 *  1. If not authenticated (no token)       → redirect to /login
 *  2. If authenticated but wrong role       → show /unauthorized
 *  3. If authenticated and role matches     → render children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  children,
}) => {
  const { hasAnyRole } = useRoles();
  const isAuthenticated = !!TokenService.getToken();

  // 1. Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role check (skip if no allowedRoles specified — any auth user can access)
  if (allowedRoles.length > 0 && !hasAnyRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
