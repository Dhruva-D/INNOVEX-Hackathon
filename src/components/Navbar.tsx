import React, { useState, useEffect } from 'react';
import { Heart, LogOut, User, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme preference from localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const getUserDashboardLink = () => {
    if (!user) return '/';
    return `/dashboard/${user.role}`;
  };

  const getUserRoleLabel = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'donor': return 'Donor';
      case 'seeker': return 'Food Seeker';
      case 'volunteer': return 'Volunteer';
      default: return '';
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">LeftOverLove</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {user ? (
              <>
                <Link to={getUserDashboardLink()} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <User className="h-5 w-5 mr-1" />
                  <span>{user.fullName} ({getUserRoleLabel()})</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/signin" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 