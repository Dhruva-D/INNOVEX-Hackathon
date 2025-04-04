import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StatsRouter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If not logged in, redirect to sign in
      navigate('/signin');
      return;
    }

    // Redirect to the appropriate stats page based on user role
    switch (user.userType) {
      case 'donor':
        navigate('/stats/donor');
        break;
      case 'seeker':
        navigate('/stats/seeker');
        break;
      case 'volunteer':
        navigate('/stats/volunteer');
        break;
      default:
        // If unknown role, redirect to home
        navigate('/');
    }
  }, [user, navigate]);

  // This component doesn't render anything as it immediately redirects
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Redirecting to your stats page...</p>
    </div>
  </div>;
};

export default StatsRouter; 