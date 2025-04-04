import React from 'react';
import { Clock, MapPin, Package2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DonationResponse } from '../services/donationService';

interface DonatedFoodsListProps {
  donations: DonationResponse[];
  loading: boolean;
}

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

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          <Package2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No donations yet</p>
          <p className="mt-2">Your donated food items will appear here.</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Donated Foods
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {donations.map((donation) => (
          <motion.div
            key={donation._id}
            variants={item}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          >
            {donation.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={donation.imageUrl} 
                  alt={donation.foodName} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  {donation.foodName}
                </h3>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(donation.status)}`}>
                  {donation.status}
                </span>
              </div>
              
              <div className="space-y-3 mt-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Package2 className="h-4 w-4 mr-2" />
                  <span>{donation.quantityInPlates} plates</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{donation.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Expires: {formatDate(donation.expiryDate)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Donated on: {formatDate(donation.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DonatedFoodsList;
