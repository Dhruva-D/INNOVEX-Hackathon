import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Award, TrendingUp, Calendar, Heart, Users, Gift, Star, Clock, Trophy, UtensilsCrossed } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsHeader from '../../components/StatsHeader';

// Mock data for food seeker statistics
const mockSeekerStats = {
  totalMealsReceived: 27,
  lastMealDate: '2023-04-01',
  peopleInFamily: 4,
  foodPreferences: ['Vegetarian', 'Non-Spicy', 'Dairy-Free'],
  eligibilityStatus: 'Eligible',
  badges: [
    { id: 1, name: 'First Time Receiver', description: 'Received your first meal donation', icon: UtensilsCrossed, earned: true, date: '2023-01-15' },
    { id: 2, name: 'Regular Member', description: 'Received meals for 3 consecutive weeks', icon: Calendar, earned: true, date: '2023-02-20' },
    { id: 3, name: 'Community Participant', description: 'Joined 5 community events', icon: Users, earned: false, progress: 3, target: 5 },
    { id: 4, name: 'Feedback Star', description: 'Provided feedback for 10 meal donations', icon: Star, earned: false, progress: 7, target: 10 },
    { id: 5, name: 'Sustainability Ally', description: 'Participated in 3 zero-waste programs', icon: Award, earned: true, date: '2023-03-10' }
  ],
  donationHistory: [
    { id: 'S1001', date: '2023-04-01', items: 'Vegetable Biryani, Fresh Fruits', donor: 'Sarah Johnson', feedbackProvided: true },
    { id: 'S1002', date: '2023-03-25', items: 'Whole Grain Bread, Soup Packets', donor: 'David Chen', feedbackProvided: true },
    { id: 'S1003', date: '2023-03-18', items: 'Rice Bags, Lentils, Cooking Oil', donor: 'Food Bank Central', feedbackProvided: true },
    { id: 'S1004', date: '2023-03-10', items: 'Mixed Vegetables, Dairy Products', donor: 'Maria Garcia', feedbackProvided: false }
  ],
  upcomingDonations: [
    { id: 'U1001', expectedDate: '2023-04-10', items: 'Weekly Meal Pack', donor: 'Local Restaurant Coalition', status: 'Confirmed' },
    { id: 'U1002', expectedDate: '2023-04-17', items: 'Grocery Essentials', donor: 'Community Pantry', status: 'Tentative' }
  ],
  nutritionStats: {
    proteinRich: 8,
    fruitsVegetables: 12,
    grains: 15,
    dairyProducts: 5
  },
  communityEvents: [
    { id: 'E1001', name: 'Cooking Workshop', date: '2023-04-15', status: 'Registered' },
    { id: 'E1002', name: 'Nutrition Education', date: '2023-04-22', status: 'Open' }
  ]
};

const SeekerStats: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockSeekerStats);
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
      // const response = await api.get(`/seeker/stats/${user?._id}`);
      // setStats(response.data);
      
      // For now, we're using mock data
      setStats(mockSeekerStats);
    };

    fetchStats();
  }, [user]);

  // Calculate days since last meal
  const getDaysSinceLastMeal = () => {
    const now = new Date();
    const lastMealDate = new Date(stats.lastMealDate);
    const daysSinceLastMeal = Math.floor((now.getTime() - lastMealDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastMeal;
  };

  // Calculate eligibility status expiration
  const getEligibilityTimeRemaining = () => {
    if (stats.eligibilityStatus !== 'Eligible') {
      return 'Not currently eligible';
    }
    
    const daysSinceLastMeal = getDaysSinceLastMeal();
    const daysRemaining = 30 - daysSinceLastMeal;
    
    if (daysRemaining <= 0) {
      return "Eligibility needs renewal";
    }
    
    return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
  };

  // Return next upcoming donation date
  const getNextDonationDate = () => {
    if (stats.upcomingDonations.length === 0) {
      return 'No upcoming donations';
    }
    
    const nextDonation = stats.upcomingDonations[0];
    return new Date(nextDonation.expectedDate).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <StatsHeader 
        title="Food Seeker Statistics" 
        description="Track your received donations, nutrition balance, and community engagement."
      />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Status Banner */}
        <div className={`rounded-xl p-4 mb-8 flex items-center justify-between ${
          stats.eligibilityStatus === 'Eligible' 
            ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' 
            : 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              stats.eligibilityStatus === 'Eligible'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
            }`}>
              {stats.eligibilityStatus === 'Eligible' ? (
                <BadgeCheck className="h-6 w-6" />
              ) : (
                <Clock className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {stats.eligibilityStatus === 'Eligible' ? 'Currently Eligible' : 'Eligibility Status'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getEligibilityTimeRemaining()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Next Donation: <span className="font-bold">{getNextDonationDate()}</span>
            </p>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Meals Received Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Meals Received</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalMealsReceived}</h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <UtensilsCrossed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-500">+5 this month</span>
              </div>
            </div>
          </motion.div>

          {/* Family Members Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Family Members</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.peopleInFamily}</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Last updated 30 days ago</span>
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
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs font-medium text-yellow-500">1 badge close to unlock</span>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Donations Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Donations</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.upcomingDonations.length}</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-xs font-medium text-gray-500">Next in {stats.upcomingDonations.length > 0 ? '9 days' : 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Badges & Donation History */}
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

            {/* Donation History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Donation History</h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Donor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.donationHistory.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{donation.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(donation.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{donation.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{donation.donor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {donation.feedbackProvided ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                              Provided
                            </span>
                          ) : (
                            <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                              Give Feedback
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Donations & Nutrition */}
          <div className="lg:col-span-1">
            {/* Upcoming Donations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Donations</h2>
              
              {stats.upcomingDonations.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming donations scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.upcomingDonations.map(donation => (
                    <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{donation.items}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          donation.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                        }`}>
                          {donation.status}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Expected: {new Date(donation.expectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        From: {donation.donor}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                  Request Additional Assistance
                </button>
              </div>
            </div>

            {/* Food Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Food Preferences</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {stats.foodPreferences.map((pref, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    {pref}
                  </span>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Update Preferences
                </button>
              </div>
            </div>

            {/* Nutrition Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nutrition Balance</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Protein-rich Foods</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.nutritionStats.proteinRich} meals</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fruits & Vegetables</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.nutritionStats.fruitsVegetables} meals</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grains</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.nutritionStats.grains} meals</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dairy Products</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.nutritionStats.dairyProducts} meals</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  For a balanced diet, try to request more protein-rich and dairy foods in your next donations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerStats; 