import React from 'react';
import { Clock, MapPin, Package2, Star, Utensils, Users, Award, ArrowUpRight, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DonationResponse } from '../services/donationService';

interface DonatedFoodsListProps {
  donations: DonationResponse[];
  loading: boolean;
}

// Dummy food donations data
const dummyFoodDonations = [
  {
    _id: 'dummy1',
    foodName: 'Homemade Veg Biryani',
    quantityInPlates: 10,
    location: 'Green Park, New Delhi',
    expiryDate: new Date(Date.now() + 3600000 * 3).toISOString(), // 3 hours from now
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    timestamp: new Date().toISOString(),
    rating: 4.8,
    fresh: true,
    servings: 12,
    cuisine: 'Indian'
  },
  
  {
    _id: 'dummy3',
    foodName: 'Pizza Margherita Family Size',
    quantityInPlates: 8,
    location: 'Vasant Kunj, Delhi',
    expiryDate: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    rating: 4.7,
    fresh: true,
    servings: 8,
    cuisine: 'Italian'
  },
  {
    _id: 'dummy4',
    foodName: 'Mixed Vegetable Curry & Rice',
    quantityInPlates: 15,
    location: 'Gurgaon, Haryana',
    expiryDate: new Date(Date.now() + 3600000 * 4).toISOString(), // 4 hours from now
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    rating: 4.6,
    fresh: true,
    servings: 20,
    cuisine: 'Indian'
  },
  
];

const DonatedFoodsList: React.FC<DonatedFoodsListProps> = ({ donations, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use dummy donations if real donations are empty
  const displayDonations = donations.length > 0 ? donations : dummyFoodDonations;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time remaining
  const getTimeRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'claimed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15
      }
    }
  };

  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'text-amber-400 fill-amber-400'
                : star <= rating
                ? 'text-amber-400 fill-amber-400 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Donated Foods
        </h2>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            Latest
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Popular
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Nearby
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayDonations.map((donation: any) => (
            <motion.div
              key={donation._id}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
            >
              {donation.imageUrl && (
                <div className="relative h-60 w-full overflow-hidden">
                  <img 
                    src={donation.imageUrl} 
                    alt={donation.foodName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Time Remaining Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeRemaining(donation.expiryDate)}
                  </div>
                  
                  {/* Cuisine Type Badge */}
                  {donation.cuisine && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
                      {donation.cuisine}
                    </div>
                  )}
                  
                  {/* Quick Actions - Share & More */}
                  <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {donation.foodName}
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(donation.status)}`}>
                    {donation.status}
                  </span>
                </div>
                
                {/* Rating */}
                {donation.rating && (
                  <div className="flex justify-between items-center">
                    <RatingStars rating={donation.rating} />
                    
                    {donation.fresh && (
                      <span className="flex items-center text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">
                        <Award className="h-3 w-3 mr-1" />
                        Fresh
                      </span>
                    )}
                  </div>
                )}
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Package2 className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{donation.quantityInPlates} plates</span>
                  </div>
                  
                  {donation.servings && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Serves {donation.servings} people</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{donation.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Utensils className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Expires: {formatDate(donation.expiryDate)}</span>
                  </div>
                </div>
                
                {/* Claim Button */}
                <button className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Claim Donation
                </button>
                
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  Listed {new Date(donation.timestamp).toLocaleDateString()} • {new Date(donation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DonatedFoodsList;
