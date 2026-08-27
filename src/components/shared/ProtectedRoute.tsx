import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useRoles from "../../hooks/useRoles";
import TokenService from "../../services/shared/TokenService";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  /** Roles that are allowed to access this route. If empty, any authenticated user can access. */
  allowedRoles?: string[];
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  children,
}) => {
  const location = useLocation();
  const { hasAnyRole } = useRoles();
  const { userLoading } = useAppSelector((state) => state.user);
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

  // If loading user profile, show loading indicator instead of immediate unauthorized redirect
  if (userLoading && allowedRoles.length > 0 && !hasAnyRole(...allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#0e8a67] border-t-transparent rounded-full animate-spin" />
      </div>
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
