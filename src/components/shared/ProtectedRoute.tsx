import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
 *  1. If not authenticated (no token)       → redirect to /login (preserving attempted path)
 *  2. If authenticated but wrong role       → redirect to /unauthorized
 *  3. If authenticated and role matches     → render children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  children,
}) => {
  const location = useLocation();
  const { hasAnyRole } = useRoles();
  const isAuthenticated = !!TokenService.getToken();

  // 1. Not logged in — record attempted path so login can redirect back
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 2. Role check (skip if no allowedRoles specified — any auth user can access)
  if (allowedRoles.length > 0 && !hasAnyRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
