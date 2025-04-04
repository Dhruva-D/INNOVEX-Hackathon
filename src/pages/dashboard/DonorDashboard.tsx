import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Trophy, Star, Gift, Crown, 
  TrendingUp, Calendar, Award,
  ChevronRight, Zap, Shield
} from 'lucide-react';
import Navbar from '../../components/Navbar';

// Types for our gamification system
interface UserStats {
  name: string;
  level: number;
  xp: number;
  xpToday: number;
  streak: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  coins: number;
  achievements: Achievement[];
  weeklyProgress: boolean[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const DonorDashboard: React.FC = () => {
  // Mock user data - in production, this would come from an API
  const [userStats, setUserStats] = useState<UserStats>({
    name: 'Alex',
    level: 12,
    xp: 1250,
    xpToday: 150,
    streak: 5,
    tier: 'Gold',
    coins: 750,
    weeklyProgress: [true, true, true, true, true, false, false], // Mon-Sun
    achievements: [
      {
        id: '1',
        name: 'First Steps',
        description: 'Made your first contribution',
        icon: <Gift className="w-6 h-6" />,
        unlocked: true,
        progress: 1,
        maxProgress: 1
      },
      {
        id: '2',
        name: 'Rising Star',
        description: 'Reach level 10',
        icon: <Star className="w-6 h-6" />,
        unlocked: true,
        progress: 12,
        maxProgress: 10
      },
      {
        id: '3',
        name: 'Champion',
        description: 'Maintain a 7-day streak',
        icon: <Trophy className="w-6 h-6" />,
        unlocked: false,
        progress: 5,
        maxProgress: 7
      }
    ]
  });

  // Calculate XP progress percentage
  const xpProgress = (userStats.xp % 1000) / 1000; // Assumes 1000 XP per level
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Helper function to get tier color
  const getTierColor = (tier: UserStats['tier']) => {
    switch (tier) {
      case 'Diamond':
        return 'from-blue-400 to-purple-600';
      case 'Platinum':
        return 'from-purple-400 to-pink-600';
      case 'Gold':
        return 'from-yellow-400 to-orange-600';
      case 'Silver':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-amber-700 to-amber-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Welcome back, {userStats.name} 👋
            </span>
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Day {userStats.streak} Streak</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>+{userStats.xpToday} XP Today</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Level {userStats.level}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explorer Rank</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {userStats.xp % 1000} / 1000 XP to Level {userStats.level + 1}
            </p>
          </motion.div>

          {/* Tier Card */}
          <motion.div 
            variants={itemVariants}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${getTierColor(userStats.tier)}`} />
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userStats.tier} Tier</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Ranking</p>
              </div>
              <div className={`p-2 bg-gradient-to-r ${getTierColor(userStats.tier)} rounded-xl`}>
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <motion.div 
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
                           bg-gradient-to-r ${getTierColor(userStats.tier)} text-white`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Shield className="w-4 h-4" />
                <span>Tier Benefits</span>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>

          {/* Weekly Progress Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week's Activity</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex justify-between items-center space-x-2">
              {userStats.weeklyProgress.map((day, index) => (
                <motion.div
                  key={index}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center
                             ${day ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {day ? '✓' : '·'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Award className="w-5 h-5" />
              <span>{userStats.achievements.filter(a => a.unlocked).length} / {userStats.achievements.length}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStats.achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300
                          ${achievement.unlocked 
                            ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-green-500 dark:bg-green-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {achievement.progress} / {achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DonorDashboard;