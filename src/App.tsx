import React from 'react';
import { Heart, Utensils, Truck, Users } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LeftOverLove</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-green-600 hover:text-green-700">Login</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Sharing Food,</span>
            <span className="block text-green-600">Spreading Love</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our community-driven platform to reduce food waste and help those in need.
            Connect with donors, food seekers, and volunteers in your area.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Donors Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">For Donors</h3>
              <p className="mt-2 text-base text-gray-500">
                Share your excess food with those who need it. Make a difference in your community
                while reducing food waste.
              </p>
            </div>
          </div>

          {/* Food Seekers Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">For Food Seekers</h3>
              <p className="mt-2 text-base text-gray-500">
                Find available food donations near you. Connect with donors and volunteers
                to receive the help you need.
              </p>
            </div>
          </div>

          {/* Volunteers Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">For Volunteers</h3>
              <p className="mt-2 text-base text-gray-500">
                Help bridge the gap between donors and seekers. Make deliveries and
                contribute to your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-extrabold text-white">1,000+</div>
              <div className="mt-2 text-lg text-green-100">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white">5,000+</div>
              <div className="mt-2 text-lg text-green-100">Meals Shared</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white">500+</div>
              <div className="mt-2 text-lg text-green-100">Volunteers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;