import React, { useState, useRef } from 'react';
import { X, Camera, Calendar, MapPin } from 'lucide-react';
import ConfirmationPopup from './ConfirmationPopup';
import { DonationFormData } from '../services/donationService';

interface DonationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: DonationFormData) => Promise<void>;
}

const DonationForm: React.FC<DonationFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoodImage(file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Function to detect current location
  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsDetectingLocation(false);
          alert('Could not detect your location. Please enter it manually.');
        }
      );
    } else {
      setIsDetectingLocation(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Function to remove uploaded image
  const removeImage = () => {
    setFoodImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      // Create form data object
      const formData: DonationFormData = {
        foodName,
        quantityInPlates: parseInt(quantity),
        location,
        expiryDate,

        foodImage: foodImage || undefined,
      };
      
      // Call the onSubmit callback with the form data
      await onSubmit(formData);
      
      // Show confirmation popup
      setShowConfirmation(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setFoodImage(null);
        setImagePreview(null);
        setFoodName('');
        setQuantity('');
        setLocation('');
        setExpiryDate('');
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting donation form:', error);
      alert('Failed to submit donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Donation Submitted Successfully!"
        message="Thank you for your generosity. Your food donation has been recorded."
        donationDetails={{
          foodName,
          quantity: parseInt(quantity),
          location,
          estimatedTime: '15-30 minutes'
        }}
      />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-500 ease-out"
        >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-600">
          <h2 className="text-2xl font-bold text-white">Donate Food</h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[70vh] space-y-6">
          {/* Food Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Food Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl relative hover:border-green-500 dark:hover:border-green-400 transition-colors duration-300 group">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img 
                    src={imagePreview} 
                    alt="Food preview" 
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="food-image"
                      className="relative cursor-pointer rounded-md font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 focus-within:outline-none"
                    >
                      <span>Upload a photo</span>
                      <input
                        id="food-image"
                        ref={fileInputRef}
                        name="food-image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Food Name */}
          <div className="space-y-2">
            <label htmlFor="food-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Food Name
            </label>
            <input
              type="text"
              id="food-name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              placeholder="e.g., Veg Biryani, Chapati with Curry"
            />
          </div>

          {/* Food Quantity */}
          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity (in plates)
            </label>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                step="1"
                required
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="Enter number of plates"
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pickup Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="block w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="Enter pickup location"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300"
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>



          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl 
                        hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Donation'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default DonationForm; 