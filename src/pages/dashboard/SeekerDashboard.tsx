import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X, Heart, Gift, ChevronRight, ArrowRight, MapPin, LogOut, User, Sun, Moon, Home, Menu, ChevronDown, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Food item interface
interface FoodItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  servesCount: number;
  foodType: string;
}

// Dummy food data
const dummyFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Homemade Vegetable Biryani',
    description: 'Fragrant rice with mixed vegetables, perfect for families in need',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
    category: 'Meals',
    servesCount: 4,
    foodType: 'Vegetarian'
  },
  {
    id: '2',
    name: 'Nourishing Lentil Soup',
    description: 'Protein-rich soup that warms hearts and fills stomachs',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
    category: 'Soups',
    servesCount: 3,
    foodType: 'Vegetarian'
  },
  {
    id: '3',
    name: 'Fresh Fruit Basket',
    description: 'Assorted seasonal fruits to provide essential vitamins and joy',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf',
    category: 'Fruits',
    servesCount: 2,
    foodType: 'Vegan'
  },
  {
    id: '4',
    name: 'Homestyle Chicken Curry',
    description: 'Comforting curry made with love to share with those in need',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    category: 'Meals',
    servesCount: 4,
    foodType: 'Non-Vegetarian'
  },
  {
    id: '5',
    name: 'Whole Grain Bread Loaves',
    description: 'Freshly baked bread to provide sustenance and comfort',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df',
    category: 'Bakery',
    servesCount: 6,
    foodType: 'Vegetarian'
  },
  {
    id: '6',
    name: 'Nutritious Vegetable Platter',
    description: 'Fresh vegetables arranged with care for families to enjoy',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    category: 'Vegetables',
    servesCount: 3,
    foodType: 'Vegan'
  },
  {
    id: '7',
    name: 'Healthy Kids Lunch Box',
    description: 'Balanced meal packs designed specially for children',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    category: 'Kids Meals',
    servesCount: 2,
    foodType: 'Vegetarian'
  },
  {
    id: '8',
    name: 'Protein-Rich Meal Bowl',
    description: 'Complete nutrition in one bowl for those needing strength',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    category: 'Meals',
    servesCount: 1,
    foodType: 'Vegetarian'
  }
];

// Food categories
const categories = ['All', 'Meals', 'Soups', 'Fruits', 'Vegetables', 'Bakery', 'Kids Meals'];

// Donation item interface
interface DonationItem extends FoodItem {
  quantity: number;
}

// Food Seekers Dashboard (Homepage)
const SeekerDashboard: React.FC = () => {
  // State for donation items
  const [donationItems, setDonationItems] = useState<DonationItem[]>([]);
  
  // State for donation bag open/closed
  const [isDonationBagOpen, setIsDonationBagOpen] = useState(false);
  
  // State for donation details
  const [isDonationDetailsOpen, setIsDonationDetailsOpen] = useState(false);
  
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // State for donation form
  const [donationForm, setDonationForm] = useState({
    name: 'John Doe',
    address: '',
    addressType: 'home',
    deliveryTime: 'anytime',
    message: ''
  });
  
  // State for donation complete
  const [donationComplete, setDonationComplete] = useState(false);

  // Navbar related state
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Initialize theme preference
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Simulation of user data for demo
  const user = {
    name: "John Doe",
    userType: "foodSeeker"
  };

  // Calculate donation total
  const donationTotal = donationItems.reduce((total, item) => total + (item.servesCount * item.quantity), 0);
  
  // Add food item to donation bag
  const addToDonationBag = (item: FoodItem) => {
    const existingItem = donationItems.find(donationItem => donationItem.id === item.id);
    
    if (existingItem) {
      // If item exists, increment quantity
      setDonationItems(donationItems.map(donationItem => 
        donationItem.id === item.id 
          ? { ...donationItem, quantity: donationItem.quantity + 1 } 
          : donationItem
      ));
    } else {
      // If item does not exist, add with quantity 1
      setDonationItems([...donationItems, { ...item, quantity: 1 }]);
    }
  };
  
  // Remove item from donation bag
  const removeFromDonationBag = (id: string) => {
    const existingItem = donationItems.find(item => item.id === id);
    
    if (existingItem && existingItem.quantity > 1) {
      // If quantity > 1, decrement quantity
      setDonationItems(donationItems.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      // If quantity is 1, remove item
      setDonationItems(donationItems.filter(item => item.id !== id));
    }
  };
  
  // Delete item from donation bag
  const deleteFromDonationBag = (id: string) => {
    setDonationItems(donationItems.filter(item => item.id !== id));
  };
  
  // Handle donation form change
  const handleDonationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonationForm({
      ...donationForm,
      [name]: value
    });
  };
  
  // Handle donation submission
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the donation details to an API
    setDonationComplete(true);
    
    // Reset the form after 5 seconds
    setTimeout(() => {
      setDonationItems([]);
      setIsDonationDetailsOpen(false);
      setIsDonationBagOpen(false);
      setDonationComplete(false);
    }, 5000);
  };
  
  // Filter foods by category
  const filteredFoods = selectedCategory === 'All' 
    ? dummyFoodItems 
    : dummyFoodItems.filter(item => item.category === selectedCategory);
  
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
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const slideIn = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      x: '100%',
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };
  
  // Confetti animation for donation success
  const confettiVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const confettiItemVariants = {
    initial: { y: -10, opacity: 0 },
    animate: (i: number) => ({
      y: [0, -50 * Math.random() - 20],
      x: [0, (Math.random() - 0.5) * 100],
      rotate: [0, Math.random() * 360],
      opacity: [1, 0],
      transition: { 
        duration: 1.5 + Math.random(), 
        ease: "easeOut",
        delay: i * 0.07
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/dashboard/seeker" className="flex items-center">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FoodSeekers</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Home Link */}
              <Link 
                to="/dashboard/seeker" 
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="h-5 w-5 mr-1" />
                <span>Home</span>
              </Link>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="mr-1">{user.name}</span>
                  <span className="text-sm text-gray-500">(Food Seeker)</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to="/dashboard/seeker"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Home className="mr-2 h-4 w-4" /> Home
                      </Link>
                      <Link
                        to="/admin-dashboard/foodSeeker"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Menu className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Donation Bag Icon (Below Navbar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
        <button 
          onClick={() => setIsDonationBagOpen(true)}
          className="relative p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/40 transition-all duration-300"
        >
          <Package className="h-6 w-6" />
          {donationItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {donationItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Banner */}
        <div className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 mb-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Share Food, Spread Kindness</h1>
            <p className="mt-4 text-green-100 max-w-2xl">
              Help us bring meals to families in need. Each order makes a difference in someone's life.
              Select food items below to provide nourishment and hope to our community.
            </p>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredFoods.map(food => (
            <motion.div
              key={food.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={`${food.image}?w=500&auto=format&fit=crop`} 
                  alt={food.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 text-xs font-medium px-2 py-1 rounded-full">
                  {food.foodType}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{food.name}</h3>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Package className="h-4 w-4 mr-1" />
                  <span>Serves {food.servesCount} people</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{food.description}</p>
                <button
                  onClick={() => addToDonationBag(food)}
                  className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Gift className="w-4 h-4 mr-2" /> Order This
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Donation Bag Sidebar */}
      <AnimatePresence>
        {isDonationBagOpen && !isDonationDetailsOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideIn}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Order Items</h2>
              <button 
                onClick={() => setIsDonationBagOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {donationItems.length === 0 ? (
                <div className="text-center py-10">
                  <Package className="w-16 h-16 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Your order is empty</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Select items to order for those in need</p>
                  <button 
                    onClick={() => setIsDonationBagOpen(false)}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Browse Food Items
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Thank you for your kindness. These items will be delivered to those who need them most.
                  </p>
                  
                  <div className="space-y-3 mt-4">
                    {donationItems.map(item => (
                      <div key={item.id} className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <img 
                          src={`${item.image}?w=100&auto=format&fit=crop`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="ml-3 flex-1">
                          <h3 className="text-gray-900 dark:text-white font-medium">{item.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">{item.foodType} • Serves {item.servesCount}</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => removeFromDonationBag(item.id)}
                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                          </button>
                          <span className="mx-2 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => addToDonationBag(item)}
                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                          </button>
                        </div>
                        <button 
                          onClick={() => deleteFromDonationBag(item.id)}
                          className="ml-2 p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {donationItems.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    You're ordering <span className="font-bold">{donationItems.reduce((total, item) => total + item.quantity, 0)} items</span> that will help feed approximately <span className="font-bold">{donationItems.reduce((total, item) => total + (item.servesCount * item.quantity), 0)} people</span>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsDonationDetailsOpen(true);
                    setIsDonationBagOpen(false);
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Continue to Checkout <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donation Details Form */}
      <AnimatePresence>
        {isDonationDetailsOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideIn}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Details</h2>
              <button 
                onClick={() => {
                  setIsDonationDetailsOpen(false);
                  setIsDonationBagOpen(true);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {donationComplete ? (
                <div className="text-center py-10">
                  {/* Confetti Animation */}
                  <motion.div 
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    initial="initial"
                    animate="animate"
                    variants={confettiVariants}
                  >
                    {Array.from({ length: 100 }).map((_, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={confettiItemVariants}
                        className="absolute h-3 w-3 rounded-full"
                        style={{
                          top: "50%",
                          left: `${Math.random() * 100}%`,
                          background: `hsl(${Math.floor(Math.random() * 3) * 120}, 80%, 60%)`
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Success Animation with 3D effect */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 10
                      }
                    }}
                    className="relative mb-8"
                  >
                    <motion.div 
                      animate={{ 
                        rotateY: [0, 360],
                        transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }
                      }}
                      className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Heart className="w-12 h-12 text-white" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Your Food is on its Way!
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.7 } }}
                    className="text-gray-600 dark:text-gray-400 mb-4"
                  >
                    Thank you for spreading kindness and helping those in need.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.9 } }}
                    className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Number: #FD{Math.floor(Math.random() * 1000000)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Delivery: Today (within 3 hours)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Items Ordered: {donationItems.reduce((total, item) => total + item.quantity, 0)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">People Helped: {donationItems.reduce((total, item) => total + (item.servesCount * item.quantity), 0)}</p>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleDonationSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={donationForm.name}
                        onChange={handleDonationFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Type</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressType"
                            value="home"
                            checked={donationForm.addressType === 'home'}
                            onChange={handleDonationFormChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Home</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressType"
                            value="work"
                            checked={donationForm.addressType === 'work'}
                            onChange={handleDonationFormChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Work</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Delivery Time</label>
                      <div className="relative">
                        <Clock className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
                        <select
                          id="deliveryTime"
                          name="deliveryTime"
                          value={donationForm.deliveryTime}
                          onChange={handleDonationFormChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="anytime">Anytime (As Soon As Possible)</option>
                          <option value="morning">Morning (8am - 12pm)</option>
                          <option value="afternoon">Afternoon (12pm - 5pm)</option>
                          <option value="evening">Evening (5pm - 8pm)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Message (Optional)</label>
                      <textarea
                        id="message"
                        name="message"
                        value={donationForm.message}
                        onChange={handleDonationFormChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Any special instructions or notes about your order"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Items Being Ordered</span>
                      <span className="font-medium text-gray-900 dark:text-white">{donationItems.reduce((total, item) => total + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">People Who Will Be Helped</span>
                      <span className="font-medium text-gray-900 dark:text-white">{donationItems.reduce((total, item) => total + (item.servesCount * item.quantity), 0)}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    Place Order <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay */}
      <AnimatePresence>
        {(isDonationBagOpen || isDonationDetailsOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => {
              setIsDonationBagOpen(false);
              setIsDonationDetailsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeekerDashboard; 