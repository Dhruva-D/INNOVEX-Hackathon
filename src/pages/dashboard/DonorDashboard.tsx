import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import DonationForm from '../../components/DonationForm';
import ConfirmationPopup from '../../components/ConfirmationPopup';
import DonatedFoodsList from '../../components/DonatedFoodsList';
import { Heart } from 'lucide-react';
import { submitDonation, getDonorDonations, DonationFormData, DonationResponse } from '../../services/donationService';

const DonorDashboard: React.FC = () => {
  const [isDonationFormOpen, setIsDonationFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [lastDonation, setLastDonation] = useState<{
    foodName: string;
    quantity: number;
    location: string;
  } | null>(null);
  const [donations, setDonations] = useState<DonationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch donations when component mounts
  useEffect(() => {
    fetchDonations();
  }, []);

  // Function to fetch donations from the API
  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const donationsData = await getDonorDonations();
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonateClick = () => {
    setIsDonationFormOpen(true);
  };

  const handleDonationSubmit = async (formData: DonationFormData) => {
    try {
      // Store the donation details for the confirmation popup
      setLastDonation({
        foodName: formData.foodName,
        quantity: formData.quantityInPlates,
        location: formData.location
      });
      
      // Close the donation form
      setIsDonationFormOpen(false);
      
      // Show the confirmation popup
      setIsConfirmationOpen(true);

      return Promise.resolve();
    } catch (error) {
      console.error('Error handling donation:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            Make a <span className="text-green-600 dark:text-green-400">Difference</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your food donation can help reduce waste and feed those in need. Every contribution counts towards a better community.
          </p>
          
          {/* 3D Animated Donate Button */}
          <div className="perspective-1000">
            <button 
              onClick={handleDonateClick}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white 
                       bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-2xl
                       transform-gpu transition-all duration-500 ease-out
                       hover:scale-105 hover:-translate-y-2 hover:rotate-1 hover:shadow-3xl
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       active:scale-95"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 rounded-xl 
                            transform-gpu transition-opacity duration-500
                            opacity-0 group-hover:opacity-100"
                   style={{ transform: 'translateZ(20px)' }}
              ></div>
              <Heart className="mr-3 h-6 w-6 transform-gpu transition-transform duration-500 group-hover:scale-110" />
              <span className="transform-gpu transition-all duration-500 group-hover:tracking-wider">
                Donate Food
              </span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Donated Foods List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <DonatedFoodsList donations={donations} loading={isLoading} />
      </div>

      {/* Donation Form Modal */}
      <DonationForm 
        isOpen={isDonationFormOpen} 
        onClose={() => setIsDonationFormOpen(false)}
        onSubmit={handleDonationSubmit}
      />
      
      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        title="Thank You for Your Donation!"
        message="Your food donation has been registered successfully. Our volunteers will pick it up before the expiry time."
        donationDetails={lastDonation || undefined}
      />
    </div>
  );
};

export default DonorDashboard; 