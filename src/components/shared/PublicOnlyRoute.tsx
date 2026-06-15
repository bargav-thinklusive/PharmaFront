import React from 'react';
import { Navigate } from 'react-router-dom';
import TokenService from '../../services/shared/TokenService';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * PublicOnlyRoute
 *
 * The inverse of ProtectedRoute.
 * - If the user is NOT authenticated → render the page normally (public access).
 * - If the user IS already authenticated → redirect to /home immediately.
 *
 * This prevents logged-in users from going back to the landing page,
 * areas served, contact us, etc. through the browser back button or direct URL.
 */
const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const isAuthenticated = !!TokenService.getToken();

  if (isAuthenticated) {
    // Already logged in — send to the main app dashboard
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
