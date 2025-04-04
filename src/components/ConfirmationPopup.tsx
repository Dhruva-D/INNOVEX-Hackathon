import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  donationDetails?: {
    foodName: string;
    quantity: number;
    location: string;
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
          >
            {/* Confetti Animation (CSS) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="confetti-container">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${Math.random() * 2 + 3}s`
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
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
                className="w-20 h-20 mx-auto mb-4 text-green-500 dark:text-green-400"
              >
                <CheckCircle className="w-full h-full" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              >
                {title}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300"
              >
                {message}
              </motion.p>
            </div>

            {/* Donation Details */}
            {donationDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="px-6 pb-6"
              >
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Donation Details:</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Food Name:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{donationDetails.foodName}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{donationDetails.quantity} plates</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{donationDetails.location}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Pending Pickup</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Close Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 pt-0"
            >
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl
                       hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPopup;
