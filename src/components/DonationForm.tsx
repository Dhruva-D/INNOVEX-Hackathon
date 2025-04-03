import React, { useState, useRef } from 'react';
import { X, Upload, Calendar, MapPin, DollarSign } from 'lucide-react';

// Food type options
const FOOD_TYPES = [
  'Vegetables',
  'Fruits',
  'Cooked Meals',
  'Bakery Items',
  'Canned Goods',
  'Dairy Products',
  'Grains & Cereals',
  'Beverages',
  'Other'
];

interface DonationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [location, setLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [price, setPrice] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
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
          // This is just a simulation - in a real app, you would use reverse geocoding
          setLocation('Detected Location (Coordinates saved)');
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create form data object
    const formData = {
      foodImage,
      foodType,
      quantity: `${quantity} ${quantityUnit}`,
      location,
      expiryDate,
      price: price ? parseFloat(price) : undefined
    };
    
    // Call the onSubmit callback with the form data
    onSubmit(formData);
    
    // Reset form
    setFoodImage(null);
    setImagePreview(null);
    setFoodType('');
    setQuantity('');
    setQuantityUnit('kg');
    setLocation('');
    setExpiryDate('');
    setPrice('');
    
    // Close the form
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="card-3d bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all duration-500 ease-in-out"
        style={{ 
          transform: 'perspective(1000px) rotateX(0deg)', 
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donate Food</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-auto max-h-[70vh]">
          {/* Food Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Food Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative hover:border-green-500 dark:hover:border-green-400 transition-colors duration-300 group">
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <img 
                    src={imagePreview} 
                    alt="Food preview" 
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="food-image"
                      className="relative cursor-pointer rounded-md font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
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

          {/* Food Type */}
          <div className="mb-6">
            <label htmlFor="food-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Food Type
            </label>
            <select
              id="food-type"
              name="food-type"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
              className="form-select block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            >
              <option value="" disabled>Select food type</option>
              {FOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Food Quantity */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Food Quantity
            </label>
            <div className="flex">
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.1"
                required
                className="form-input block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="Enter quantity"
              />
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                className="form-select border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lbs">lbs</option>
                <option value="oz">oz</option>
                <option value="l">liters</option>
                <option value="ml">ml</option>
                <option value="portions">portions</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pickup Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input block w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="Enter pickup location"
                required
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300"
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>
            {isDetectingLocation && (
              <p className="mt-1 text-sm text-green-500 dark:text-green-400">
                Detecting your location...
              </p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="mb-6">
            <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="expiry-date"
                name="expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Set min to today
                required
                className="form-input block w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Original Price (Optional) */}
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Price (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="form-input block w-full p-3 pl-8 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 mr-4 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="float-on-hover px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              Donate Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm; 