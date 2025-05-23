import React, { useState } from 'react';
import { MapPin, Clock, ChevronDown, Check, X, Bell, Menu, User, LogOut, Sun, Moon, Home, Navigation, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const VolunteerDashboard: React.FC = () => {
  // State management
  const [isAvailable, setIsAvailable] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [newDestination, setNewDestination] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Navigation
  const navigate = useNavigate();

  // Initialize theme preference from localStorage or system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
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

  // Add a new destination to the list
  const addDestination = () => {
    if (newDestination.trim()) {
      setDestinations([...destinations, newDestination.trim()]);
      setNewDestination('');
    }
  };

  // Remove a destination from the list
  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotification(true);
    setFormSubmitted(true);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Dummy upcoming delivery data
  const upcomingDelivery = {
    id: "DEL12345",
    pickup: "Whitefield, Bangalore",
    dropoff: "Nagarbhavi, Bangalore", 
    distance: "18.5 km",
    estimatedTime: "45 mins",
    items: "3 food packages"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/dashboard/volunteer" className="flex items-center">
                <Bell className="h-8 w-8 text-green-600 dark:text-green-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FoodShare</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Home Link */}
              <Link 
                to="/dashboard/volunteer" 
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="h-5 w-5 mr-1" />
                <span>Home</span>
              </Link>
              
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
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="mr-1">Alex Johnson</span>
                  <span className="text-sm text-gray-500">(Volunteer)</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to="/dashboard/volunteer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Home className="mr-2 h-4 w-4" /> Home
                      </Link>
                      <Link
                        to="/admin-dashboard/volunteer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Menu className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                      <Link
                        to="/stats/volunteer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Stats
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-4">Volunteer Portal</h1>
            <p className="max-w-2xl mb-6">
              Help connect donors with those in need by delivering food donations. 
              Toggle your availability below and enter your current location to start.
            </p>
            
            {/* Availability Toggle */}
            <div className="flex items-center justify-center mt-2">
              <span className="mr-3 text-sm font-medium text-white">
                {isAvailable ? "You're Available" : "You're Unavailable"}
              </span>
              <button 
                onClick={() => setIsAvailable(!isAvailable)} 
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${isAvailable ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full 
                    bg-white shadow ring-0 transition duration-200 ease
                    ${isAvailable ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Location Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Set Your Delivery Information
          </h2>
          
          {/* Current Location */}
          <div className="mb-6">
            <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Location
            </label>
            <div className="relative">
              <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="currentLocation"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Enter your current location"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          
          {/* Destinations Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Areas You Can Deliver To
            </label>
            
            {/* Add new destination */}
            <div className="flex mb-3">
              <div className="relative flex-grow">
                <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  placeholder="Add a location you can deliver to"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={addDestination}
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {/* Destination list */}
            <div className="space-y-2">
              {destinations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Add locations where you're willing to deliver food
                </p>
              ) : (
                destinations.map((destination, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{destination}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDestination(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isAvailable}
            className={`
              w-full py-3 rounded-lg font-medium transition-colors
              flex items-center justify-center
              ${isAvailable 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
            `}
          >
            {isAvailable ? (
              <>Update Availability <Check className="ml-2 h-5 w-5" /></>
            ) : (
              <>Toggle Availability to Continue <X className="ml-2 h-5 w-5" /></>
            )}
          </button>
          
          {!isAvailable && (
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              You need to mark yourself as available to submit
            </p>
          )}
        </form>
        
        {/* Conditional rendering for Upcoming Deliveries Section */}
        {formSubmitted && (
          <div className="space-y-8">
            {/* Upcoming Deliveries Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Upcoming Deliveries
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      New Delivery Assignment
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Order #{upcomingDelivery.id}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    Assigned
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pickup Location</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{upcomingDelivery.pickup}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Dropoff Location</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{upcomingDelivery.dropoff}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <Navigation className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Distance</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{upcomingDelivery.distance}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Estimated Time</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{upcomingDelivery.estimatedTime}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end">
                  <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Start Navigation <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Google Maps Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Delivery Route
              </h2>
              
              {/* Enhanced Google Maps - Frontend only implementation */}
              <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner transition-all duration-300">
                {/* Map background with more realistic styling */}
                <div className="absolute inset-0 bg-[#F5F5F5] dark:bg-[#242f3e]" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                        backgroundPosition: '0 0, 15px 15px'
                    }}>
                </div>
                
                {/* City blocks pattern */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                  {Array(48).fill(0).map((_, i) => (
                    <div key={i} className="border border-gray-200/20 dark:border-gray-600/20"></div>
                  ))}
                </div>
                
                {/* Main roads with better styling */}
                <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-300/80 dark:bg-gray-500/60 transform -translate-y-1/2 shadow-sm"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-3 bg-gray-300/80 dark:bg-gray-500/60 transform -translate-x-1/2 shadow-sm"></div>
                <div className="absolute top-0 bottom-0 left-3/4 w-3 bg-gray-300/80 dark:bg-gray-500/60 transform -translate-x-1/2 shadow-sm"></div>
                
                {/* Secondary roads */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300/50 dark:bg-gray-600/40"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300/50 dark:bg-gray-600/40"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300/50 dark:bg-gray-600/40"></div>
                
                {/* Animated pulsing ripple at pickup point */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-[5]">
                  <div className="h-4 w-4 bg-green-500/20 rounded-full animate-ping absolute"></div>
                  <div className="h-8 w-8 bg-green-500/10 rounded-full animate-pulse absolute -top-2 -left-2"></div>
                  <div className="h-12 w-12 bg-green-500/5 rounded-full animate-pulse absolute -top-4 -left-4" style={{animationDelay: '0.3s'}}></div>
                </div>
                
                {/* Enhanced route line with gradient and animation */}
                <div className="absolute" style={{ top: '25%', left: '25%', width: '50%', height: '50%' }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <path 
                      d="M0,50 C20,20 40,80 60,40 S80,60 100,50" 
                      stroke="url(#routeGradient)" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeDasharray="5,3"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      className="opacity-90"
                    >
                      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="15s" repeatCount="indefinite" />
                    </path>
                    
                    {/* Route direction indicator */}
                    <circle r="2" fill="#10b981" opacity="0.8">
                      <animateMotion
                        path="M0,50 C20,20 40,80 60,40 S80,60 100,50"
                        dur="6s"
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </circle>
                  </svg>
                </div>
                
                {/* Start marker - Whitefield with enhanced styling */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-10" title="Whitefield">
                  <div className="relative">
                    <div className="absolute -top-14 -left-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap transition-all duration-300 border border-green-100 dark:border-green-900/30">
                      <div className="font-medium mb-1">Whitefield (Pickup)</div>
                      <div className="text-green-600 dark:text-green-400 text-[10px] flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>ETA: 10:45 AM</span>
                      </div>
                      <div className="absolute -bottom-2 left-[calc(50%-4px)] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white dark:border-t-gray-800"></div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-green-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                      <div className="h-8 w-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md transform hover:scale-110 transition-transform duration-200 cursor-pointer z-20">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* End marker - Nagarbhavi with enhanced styling */}
                <div className="absolute top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 z-10" title="Nagarbhavi">
                  <div className="relative">
                    <div className="absolute -top-14 -left-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap transition-all duration-300 border border-red-100 dark:border-red-900/30">
                      <div className="font-medium mb-1">Nagarbhavi (Dropoff)</div>
                      <div className="text-red-600 dark:text-red-400 text-[10px] flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>ETA: 11:30 AM</span>
                      </div>
                      <div className="absolute -bottom-2 left-[calc(50%-4px)] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white dark:border-t-gray-800"></div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-red-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                      <div className="h-8 w-8 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md transform hover:scale-110 transition-transform duration-200 cursor-pointer z-20">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Way points */}
                <div className="absolute top-[45%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 z-5">
                  <div className="h-3 w-3 bg-green-400 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
                <div className="absolute top-[60%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-5">
                  <div className="h-3 w-3 bg-green-400 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
                
                {/* Mock controls with better styling and hover effects */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 border border-gray-200 dark:border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  </button>
                </div>
                
                {/* Traffic indicators */}
                <div className="absolute top-[30%] left-[35%] bg-yellow-400/70 dark:bg-yellow-500/50 h-1 w-8 rounded-full"></div>
                <div className="absolute top-[65%] left-[60%] bg-red-400/70 dark:bg-red-500/50 h-1 w-10 rounded-full"></div>
                
                {/* Google Maps logo and attribution mockup */}
                <div className="absolute bottom-4 left-4 flex flex-col space-y-1">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-gray-700 dark:text-gray-300 shadow-sm">
                    Map data ©2023 Google
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-1 rounded shadow-sm">
                      <svg height="12" viewBox="0 0 55 20" width="33">
                        <path d="M10 5.6c0-.6-.5-1-1-1H5.6c-.6 0-1 .5-1 1v3.7c0 .6.5 1 1 1v2.8c0 .6.5 1 1 1h1.7c.6 0 1-.5 1-1v-2.8c.6 0 1-.5 1-1z" fill="#4285F4"></path>
                        <path d="M19 5.6c0-.6-.5-1-1-1h-3.7c-.6 0-1 .5-1 1v3.7c0 .6.5 1 1 1v2.8c0 .6.5 1 1 1h1.7c.6 0 1-.5 1-1v-2.8c.6 0 1-.5 1-1z" fill="#EA4335"></path>
                        <path d="M28 5.6c0-.6-.5-1-1-1h-3.7c-.6 0-1 .5-1 1v3.7c0 .6.5 1 1 1v2.8c0 .6.5 1 1 1h1.7c.6 0 1-.5 1-1v-2.8c.6 0 1-.5 1-1z" fill="#FBBC05"></path>
                        <path d="M37 5.6c0-.6-.5-1-1-1h-3.7c-.6 0-1 .5-1 1v3.7c0 .6.5 1 1 1v2.8c0 .6.5 1 1 1h1.7c.6 0 1-.5 1-1v-2.8c.6 0 1-.5 1-1z" fill="#34A853"></path>
                        <path d="M46 5.6c0-.6-.5-1-1-1h-3.7c-.6 0-1 .5-1 1v3.7c0 .6.5 1 1 1v2.8c0 .6.5 1 1 1h1.7c.6 0 1-.5 1-1v-2.8c.6 0 1-.5 1-1z" fill="#4285F4"></path>
                      </svg>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-1 py-0.5 rounded text-[8px] text-gray-500 dark:text-gray-400 shadow-sm">
                      Terms of Use
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced route info panel */}
              <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex space-x-6 mb-4 md:mb-0">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-green-500 rounded-full mr-2 shadow-sm border border-white dark:border-gray-900"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Whitefield</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-red-500 rounded-full mr-2 shadow-sm border border-white dark:border-gray-900"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nagarbhavi</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:space-x-4 text-sm">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Navigation className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">18.5 km</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">~45 mins</span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-500 ml-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <span className="ml-1">Medium traffic</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Turn by turn directions - simplified version */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Turn-by-turn directions</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-green-700 dark:text-green-400 font-medium">1</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Head southwest on Whitefield Main Road toward ITPL Road
                        <span className="text-gray-500 dark:text-gray-400 ml-2">3.5 km</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">2</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Turn right onto Old Airport Road
                        <span className="text-gray-500 dark:text-gray-400 ml-2">5.2 km</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">3</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Continue onto Outer Ring Road
                        <span className="text-gray-500 dark:text-gray-400 ml-2">4.8 km</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-red-700 dark:text-red-400 font-medium">4</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Turn left onto Nagarbhavi Main Road, destination will be on the right
                        <span className="text-gray-500 dark:text-gray-400 ml-2">5.0 km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty state when no form has been submitted */}
        {!formSubmitted && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Upcoming Deliveries
            </h2>
            
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No Active Deliveries</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                You don't have any scheduled deliveries yet. Update your availability and location above to get started.
              </p>
            </div>
          </div>
        )}
      </main>
      
      {/* Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm z-50 border-l-4 border-green-500"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Availability Updated!
                </h3>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  We'll notify you when there's a food delivery request matching your location. Thank you for volunteering!
                </div>
                <div className="mt-2 flex">
                  <button
                    type="button"
                    onClick={() => setShowNotification(false)}
                    className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerDashboard; 