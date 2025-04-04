import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Clock, Package2, Truck, ArrowRight } from 'lucide-react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  donationDetails?: {
    foodName: string;
    quantity: number;
    location: string;
    estimatedTime?: string;
  };
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  donationDetails 
}) => {
  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 300,
              bounce: 0.4 
            }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
          >
            {/* Confetti Animation (CSS) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="confetti-container">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="confetti"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ 
                      y: ['0%', '100%'],
                      x: ['-10%', '10%'],
                      rotate: [0, 360],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: Math.random() * 2 + 3,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="p-6 text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.6, 1],
                  delay: 0.2,
                  type: 'spring'
                }}
                className="w-24 h-24 mx-auto mb-6 text-green-500 dark:text-green-400"
              >
                <CheckCircle className="w-full h-full" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {title}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              >
                {message}
              </motion.p>

              {/* Steps Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6 text-left bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Next Steps:</h3>
                
                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Package2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <p className="font-medium text-gray-900 dark:text-white">Pack the Food</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Please pack the food securely in clean containers to maintain freshness.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <p className="font-medium text-gray-900 dark:text-white">Estimated Pickup Time</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Our volunteer will arrive within {donationDetails?.estimatedTime || '30 minutes'}.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <p className="font-medium text-gray-900 dark:text-white">Volunteer On The Way</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">A verified volunteer has been assigned and will handle the pickup with care.</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Donation Details */}
            {donationDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="px-6 pb-6 mt-4"
              >
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Donation Summary:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-400">Food Item:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{donationDetails.foodName}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-600">
                      <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{donationDetails.quantity} plates</span>
                    </li>
                    <li className="flex justify-between items-center py-1">
                      <span className="text-gray-500 dark:text-gray-400">Pickup Location:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{donationDetails.location}</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Close Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-6 pt-0"
            >
              <button
                onClick={onClose}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-medium rounded-xl
                       hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Got it, thanks!
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPopup;
