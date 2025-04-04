import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Award, TrendingUp, MapPin, Clock, Users, Truck, Star, CheckCircle, Trophy, Route } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsHeader from '../../components/StatsHeader';

// Mock data for volunteer statistics
const mockVolunteerStats = {
  hoursVolunteered: 24,
  deliveriesCompleted: 15,
  peopleHelped: 62,
  kmTraveled: 187,
  currentStreak: 2,
  lastActive: '2023-04-01',
  badges: [
    { id: 1, name: 'First Delivery', description: 'Completed your first food delivery', icon: Truck, earned: true, date: '2023-01-20' },
    { id: 2, name: 'Route Master', description: 'Traveled more than 100km delivering food', icon: Route, earned: true, date: '2023-02-15' },
    { id: 3, name: 'Helping Hand', description: 'Helped 50+ people through deliveries', icon: Users, earned: true, date: '2023-03-05' },
    { id: 4, name: 'Regular Volunteer', description: 'Volunteered for 5 consecutive weeks', icon: Clock, earned: false, progress: 3, target: 5 },
    { id: 5, name: 'Delivery Champion', description: 'Complete 25 deliveries', icon: Trophy, earned: false, progress: 15, target: 25 }
  ],
  deliveryHistory: [
    { id: 'V1001', date: '2023-04-01', route: 'Whitefield to Nagarbhavi', distance: '18.5 km', peopleHelped: 6 },
    { id: 'V1002', date: '2023-03-25', route: 'Koramangala to HSR Layout', distance: '8.2 km', peopleHelped: 4 },
    { id: 'V1003', date: '2023-03-18', route: 'Indiranagar to JP Nagar', distance: '12.7 km', peopleHelped: 8 },
    { id: 'V1004', date: '2023-03-10', route: 'Electronic City to BTM Layout', distance: '15.3 km', peopleHelped: 5 }
  ],
  leaderboard: [
    { rank: 1, name: 'Michael Patel', deliveries: 42, hours: 65, badge: 'Platinum Volunteer' },
    { rank: 2, name: 'Jessica Lee', deliveries: 36, hours: 51, badge: 'Gold Volunteer' },
    { rank: 3, name: 'Robert Wilson', deliveries: 28, hours: 39, badge: 'Silver Volunteer' },
    { rank: 4, name: 'Alex Johnson', deliveries: 15, hours: 24, badge: 'Bronze Volunteer' } // Current user
  ],
  userRank: 4,
  impactAreas: [
    { area: 'Whitefield', deliveries: 4, peopleHelped: 15 },
    { area: 'Koramangala', deliveries: 3, peopleHelped: 12 },
    { area: 'Indiranagar', deliveries: 2, peopleHelped: 8 },
    { area: 'Electronic City', deliveries: 2, peopleHelped: 10 },
    { area: 'HSR Layout', deliveries: 2, peopleHelped: 8 },
    { area: 'BTM Layout', deliveries: 1, peopleHelped: 5 },
    { area: 'JP Nagar', deliveries: 1, peopleHelped: 4 }
  ]
};

const VolunteerStats: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockVolunteerStats);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize theme preference
  useEffect(() => {
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

  // In a real app, you would fetch the user's stats from an API
  useEffect(() => {
    // Simulating an API call with setTimeout
    const fetchStats = async () => {
      // In a real app, you would make an API call here using the user's ID
      // const response = await api.get(`/volunteer/stats/${user?._id}`);
      // setStats(response.data);
      
      // For now, we're using mock data
      setStats(mockVolunteerStats);
    };

    fetchStats();
  }, [user]);

  // Calculate remaining time for streak to expire
  const getStreakTimeRemaining = () => {
    const now = new Date();
    const lastActiveDate = new Date(stats.lastActive);
    const daysSinceLastActive = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActive > 7) {
      return "Streak expired";
    }
    
    const daysRemaining = 7 - daysSinceLastActive;
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <StatsHeader 
        title="Volunteer Statistics" 
        description="Track your volunteer activity, impact, and achievements."
      />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Hours Volunteered Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours Volunteered</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.hoursVolunteered}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+5 this month</span>
              </div>
            </div>
          </motion.div>

          {/* Deliveries Completed Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Deliveries Completed</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.deliveriesCompleted}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+3 this month</span>
              </div>
            </div>
          </motion.div>

          {/* People Helped Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">People Helped</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.peopleHelped}</h3>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+12 this month</span>
              </div>
            </div>
          </motion.div>

          {/* Distance Traveled Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Distance Traveled</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.kmTraveled} km</h3>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Route className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+42 km this month</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Badges & Achievements */}
          <div className="lg:col-span-2">
            {/* Badges Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Badges & Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.badges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`
                      p-4 rounded-lg border ${badge.earned 
                        ? 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                      }
                    `}
                  >
                    <div className="flex items-start">
                      <div className={`
                        p-2 rounded-full mr-3 ${badge.earned 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }
                      `}>
                        <badge.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{badge.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                        
                        {badge.earned ? (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            Earned on {badge.date ? new Date(badge.date).toLocaleDateString() : 'Unknown date'}
                          </p>
                        ) : (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${badge.progress && badge.target ? (badge.progress / badge.target) * 100 : 0}%` }}>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Progress: {badge.progress || 0}/{badge.target || 0}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Delivery History</h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivery ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Route</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distance</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">People Helped</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.deliveryHistory.map((delivery) => (
                      <tr key={delivery.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{delivery.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(delivery.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{delivery.route}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">{delivery.distance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{delivery.peopleHelped}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard & Impact Areas */}
          <div className="lg:col-span-1">
            {/* Volunteer Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Volunteer Leaderboard</h2>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">This Month</span>
              </div>
              
              <div className="space-y-4">
                {stats.leaderboard.map((volunteer) => (
                  <div 
                    key={volunteer.rank}
                    className={`flex items-center p-3 rounded-lg ${volunteer.rank === stats.userRank 
                      ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' 
                      : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${volunteer.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200' : 
                        volunteer.rank === 2 ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 
                        volunteer.rank === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200' : 
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}
                    `}>
                      {volunteer.rank}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {volunteer.name} {volunteer.rank === stats.userRank && "(You)"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{volunteer.badge}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center justify-end mb-1">
                        <Truck className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs font-medium text-gray-900 dark:text-white">{volunteer.deliveries}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <Clock className="w-3 h-3 text-blue-500 mr-1" />
                        <span className="text-xs font-medium text-gray-900 dark:text-white">{volunteer.hours} hrs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  View Full Leaderboard
                </button>
              </div>
            </div>

            {/* Impact Areas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Impact Areas</h2>
              
              <div className="space-y-3">
                {stats.impactAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{area.area}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {area.deliveries} deliveries | {area.peopleHelped} people helped
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Streak</h2>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.currentStreak}</div>
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">Day Streak</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getStreakTimeRemaining()}</p>
                
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                        i < stats.currentStreak
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {i < stats.currentStreak ? <CheckCircle className="h-4 w-4" /> : (i + 1)}
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                  Volunteer for 7 consecutive days to earn the "Weekly Hero" badge!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerStats; 