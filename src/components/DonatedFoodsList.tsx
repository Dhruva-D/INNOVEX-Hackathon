import React from 'react';
import { Clock, MapPin, Package2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DonationResponse } from '../services/donationService';

interface DonatedFoodsListProps {
  donations: DonationResponse[];
  loading: boolean;
}

// Dummy data for testing
const dummyDonations: DonationResponse[] = [
  {
    _id: '1',
    foodName: 'Homemade Pizza',
    quantityInPlates: 4,
    location: '123 Main St, City',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  },
  {
    _id: '2',
    foodName: 'Vegetable Curry',
    quantityInPlates: 6,
    location: '456 Oak Ave, Town',
    status: 'Claimed',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
  },
  {
    _id: '3',
    foodName: 'Fresh Sandwiches',
    quantityInPlates: 8,
    location: '789 Pine Rd, Village',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    expiryDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];

const DonatedFoodsList: React.FC<DonatedFoodsListProps> = ({ donations: propDonations, loading }) => {
  const donations = propDonations.length > 0 ? propDonations : dummyDonations;
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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    show: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'claimed':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
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
            <div className="relative group">
              {donation.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={donation.imageUrl}
                    alt={donation.foodName}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-300">
                    {donation.foodName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(donation.status)}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Package2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{donation.quantityInPlates} plates</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{donation.location}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Expires: {formatDate(donation.expiryDate)}</span>
                  </motion.div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Donated on: {formatDate(donation.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DonatedFoodsList;
