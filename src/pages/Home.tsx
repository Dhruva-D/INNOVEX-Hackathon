import React, { useEffect } from 'react';
import { Heart, Utensils, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ParticlesBackground from '../components/ParticlesBackground';

const Home: React.FC = () => {
  // Add scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.1 * (index + 1);
        const yPos = -(scrollY * speed);
        
        // Apply transform based on scroll position
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <ParticlesBackground particleCount={40} zIndex={-1} />
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl parallax">
            <span className="block">Sharing Food,</span>
            <span className="block text-green-600 dark:text-green-400">Spreading Love</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl parallax">
            Join our community-driven platform to reduce food waste and help those in need.
            Connect with donors, food seekers, and volunteers in your area.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Donors Card */}
          <div className="card-3d bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="card-3d-content p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">For Donors</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Share your excess food with those who need it. Make a difference in your community
                while reducing food waste.
              </p>
              <div className="mt-6 flex space-x-3">
                <Link 
                  to="/signin?role=donor" 
                  className="float-on-hover inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup?role=donor" 
                  className="float-on-hover inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Food Seekers Card */}
          <div className="card-3d bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="card-3d-content p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">For Food Seekers</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Find available food donations near you. Connect with donors and volunteers
                to receive the help you need.
              </p>
              <div className="mt-6 flex space-x-3">
                <Link 
                  to="/signin?role=seeker" 
                  className="float-on-hover inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup?role=seeker" 
                  className="float-on-hover inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Volunteers Card */}
          <div className="card-3d bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="card-3d-content p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">For Volunteers</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Help bridge the gap between donors and seekers. Make deliveries and
                contribute to your community.
              </p>
              <div className="mt-6 flex space-x-3">
                <Link 
                  to="/signin?role=volunteer" 
                  className="float-on-hover inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup?role=volunteer" 
                  className="float-on-hover inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 dark:bg-green-700 transition-all duration-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div className="glass p-6 rounded-lg">
              <div className="text-4xl font-extrabold text-white">1,000+</div>
              <div className="mt-2 text-lg text-green-100">Active Donors</div>
            </div>
            <div className="glass p-6 rounded-lg">
              <div className="text-4xl font-extrabold text-white">5,000+</div>
              <div className="mt-2 text-lg text-green-100">Meals Shared</div>
            </div>
            <div className="glass p-6 rounded-lg">
              <div className="text-4xl font-extrabold text-white">500+</div>
              <div className="mt-2 text-lg text-green-100">Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 