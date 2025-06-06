import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'donor' | 'seeker' | 'volunteer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Convert backend userType to frontend role for comparison
  const userRole = user.userType === 'foodSeeker' ? 'seeker' : user.userType;

  // Check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // Navigate to the user's homepage based on their role
    const redirectPath = `/dashboard/${userRole === 'seeker' ? 'seeker' : userRole}`;
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute; 