import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Sun, Moon, ArrowLeft, BarChart2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface StatsHeaderProps {
  title: string;
  description: string;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ title, description }) => {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme preference from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Get the appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.userType) {
      case 'donor': return '/dashboard/donor';
      case 'seeker': return '/dashboard/foodseeker';
      case 'volunteer': return '/dashboard/volunteer';
      default: return '/';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to={getDashboardLink()} className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-start md:items-center flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-3">
              <BarChart2 className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">{description}</p>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to={getDashboardLink()} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Home className="mr-2 -ml-1 h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader; 