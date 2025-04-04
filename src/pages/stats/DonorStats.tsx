import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Award, TrendingUp, Calendar, Heart, Users, Gift, Star, Clock, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsHeader from '../../components/StatsHeader';

// Define Badge interface
interface Badge {
  id: number;
  name: string;
  description: string;
  icon: React.FC<any>;
  earned: boolean;
  date?: string;
  progress?: number;
  target?: number;
}

// Mock data for donor statistics
const mockDonorStats = {
  totalDonations: 12,
  peopleHelped: 45,
  streak: 3,
  lastDonation: '2023-04-01',
  badges: [
    { id: 1, name: 'First Time Donor', description: 'Made your first donation', icon: BadgeCheck, earned: true, date: '2023-01-15' },
    { id: 2, name: 'Consistent Giver', description: 'Donated for 3 consecutive weeks', icon: Calendar, earned: true, date: '2023-02-20' },
    { id: 3, name: 'Community Hero', description: 'Helped 50+ people with your donations', icon: Award, earned: false, progress: 45, target: 50 },
    { id: 4, name: 'Variety Provider', description: 'Donated 5 different types of food', icon: Gift, earned: true, date: '2023-03-10' },
    { id: 5, name: 'Donation Streak', description: 'Donated 5 days in a row', icon: TrendingUp, earned: false, progress: 3, target: 5 }
  ],
  donationHistory: [
    { id: 'D1001', date: '2023-04-01', items: 'Vegetable Biryani, Fresh Fruits', peopleHelped: 6 },
    { id: 'D1002', date: '2023-03-25', items: 'Whole Grain Bread, Soup Packets', peopleHelped: 4 },
    { id: 'D1003', date: '2023-03-18', items: 'Rice Bags, Lentils, Cooking Oil', peopleHelped: 12 },
    { id: 'D1004', date: '2023-03-10', items: 'Mixed Vegetables, Dairy Products', peopleHelped: 5 }
  ],
  leaderboard: [
    { rank: 1, name: 'Sarah Johnson', donations: 36, badge: 'Community Champion' },
    { rank: 2, name: 'David Chen', donations: 29, badge: 'Regular Giver' },
    { rank: 3, name: 'Maria Garcia', donations: 24, badge: 'Consistent Donor' },
    { rank: 4, name: 'John Doe', donations: 12, badge: 'Rising Star' } // Current user
  ],
  userRank: 4
};

const DonorStats: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockDonorStats);
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
      // const response = await api.get(`/donor/stats/${user?._id}`);
      // setStats(response.data);
      
      // For now, we're using mock data
      setStats(mockDonorStats);
    };

    fetchStats();
  }, [user]);

  // Calculate remaining time for streak to expire
  const getStreakTimeRemaining = () => {
    const now = new Date();
    const lastDonationDate = new Date(stats.lastDonation);
    const daysSinceLastDonation = Math.floor((now.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastDonation > 7) {
      return "Streak expired";
    }
    
    const daysRemaining = 7 - daysSinceLastDonation;
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
  };

  // Function to calculate days since last donation
  const daysSinceLastDonation = () => {
    if (!stats.lastDonation) return 'N/A';
    
    const lastDate = new Date(stats.lastDonation);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Calculate badge progress percentage
  const calculateProgress = (badge: Badge) => {
    if (badge.progress === undefined || badge.target === undefined) {
      return 0;
    }
    return Math.min(100, Math.round((badge.progress / badge.target) * 100));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <StatsHeader 
        title="Donor Statistics" 
        description="Track your donation history, impact, and achievements as a food donor."
      />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Donations Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Donations</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDonations}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+16 this month</span>
              </div>
            </div>
          </motion.div>

          {/* Current Streak Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.streak} days</h3>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-xs font-medium text-gray-500">{getStreakTimeRemaining()}</span>
              </div>
            </div>
          </motion.div>

          {/* Badges Earned Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Badges Earned</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.badges.filter(badge => badge.earned).length}/{stats.badges.length}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs font-medium text-yellow-500">1 badge close to unlock</span>
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
                            Earned on {new Date(badge.date).toLocaleDateString()}
                          </p>
                        ) : (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full" style={{ width: `${(badge.progress / badge.target) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Progress: {badge.progress}/{badge.target}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Donation History</h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Donation ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">People Helped</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.donationHistory.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{donation.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(donation.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{donation.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{donation.peopleHelped}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard & Milestones */}
          <div className="lg:col-span-1">
            {/* Donor Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Donor Leaderboard</h2>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">This Month</span>
              </div>
              
              <div className="space-y-4">
                {stats.leaderboard.map((donor, index) => (
                  <div 
                    key={donor.rank}
                    className={`flex items-center p-3 rounded-lg ${donor.rank === stats.userRank 
                      ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' 
                      : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${donor.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200' : 
                        donor.rank === 2 ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 
                        donor.rank === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200' : 
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}
                    `}>
                      {donor.rank}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {donor.name} {donor.rank === stats.userRank && "(You)"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{donor.badge}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <Gift className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{donor.donations}</span>
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

            {/* Next Milestones */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Next Milestones</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Donation Master</h3>
                    </div>
                    <span className="text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 px-2 py-1 rounded-full">8 more</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Make 20 donations to achieve this milestone
                  </p>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-pink-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Community Hero</h3>
                    </div>
                    <span className="text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200 px-2 py-1 rounded-full">5 more</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Help 50 people with your donations
                  </p>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Consistent Donor</h3>
                    </div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 rounded-full">2 more</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Maintain a 5-day donation streak
                  </p>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorStats; 