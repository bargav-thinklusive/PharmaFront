import { Navigate, useLocation } from 'react-router-dom';
import TokenService from '../../services/shared/TokenService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps authenticated-only pages.
 * If no valid token exists, immediately redirects to /login
 * and records the attempted path so the user can be sent back after login.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!TokenService.getToken();

  if (!isAuthenticated) {
    // Replace the current entry so pressing Back from login goes to public page,
    // not the protected page.
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
