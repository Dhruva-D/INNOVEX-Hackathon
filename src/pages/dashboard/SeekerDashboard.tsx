import React from 'react';
import Navbar from '../../components/Navbar';

const SeekerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Food Seeker Dashboard</h1>
        <div className="card-3d bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-all duration-300">
          <div className="card-3d-content px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Welcome to your food seeker dashboard</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
              From here, you can find and request available food donations.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">0</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">0</dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Received Donations</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">0</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="float-on-hover px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300">
            Browse Available Donations
          </button>
        </div>

        {/* Available Donations */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Food Donations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Empty state */}
            <div className="glass card-3d bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-gray-400 dark:text-gray-300 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">No donations available in your area right now</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check back later or expand your search radius</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard; 