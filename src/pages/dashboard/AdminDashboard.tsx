import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for dashboard
const donorData = {
  totalDonations: 125,
  activeDonors: 42,
  foodTypeDistribution: [
    { name: 'Vegetables', value: 35 },
    { name: 'Cooked Meals', value: 45 },
    { name: 'Bakery Items', value: 30 },
    { name: 'Canned Goods', value: 15 }
  ],
  monthlyDonations: [
    { month: 'Jan', donations: 15 },
    { month: 'Feb', donations: 20 },
    { month: 'Mar', donations: 35 },
    { month: 'Apr', donations: 25 },
    { month: 'May', donations: 30 }
  ],
  totalQuantity: '850 kg'
};

const seekerData = {
  totalRequests: 98,
  activeSeekers: 36,
  foodTypeRequested: [
    { name: 'Vegetables', value: 25 },
    { name: 'Cooked Meals', value: 40 },
    { name: 'Bakery Items', value: 20 },
    { name: 'Canned Goods', value: 13 }
  ],
  monthlyRequests: [
    { month: 'Jan', requests: 12 },
    { month: 'Feb', requests: 18 },
    { month: 'Mar', requests: 30 },
    { month: 'Apr', requests: 22 },
    { month: 'May', requests: 28 }
  ],
  totalQuantityNeeded: '720 kg'
};

const volunteerData = {
  activeVolunteers: 28,
  completedDeliveries: 87,
  availabilityDistribution: [
    { name: 'Morning', value: 40 },
    { name: 'Afternoon', value: 35 },
    { name: 'Evening', value: 25 }
  ],
  deliveriesByMonth: [
    { month: 'Jan', deliveries: 10 },
    { month: 'Feb', deliveries: 15 },
    { month: 'Mar', deliveries: 25 },
    { month: 'Apr', deliveries: 18 },
    { month: 'May', deliveries: 19 }
  ]
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Type definitions for chart labels
interface PieChartLabel {
  name: string;
  percent: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'donor' | 'seeker' | 'volunteer'>(
    user?.userType === 'foodSeeker' ? 'seeker' : (user?.userType as any) || 'donor'
  );

  // Custom label renderer for pie charts
  const renderCustomizedLabel = ({ name, percent }: PieChartLabel) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Dashboard</h1>
        
        {/* Tabs for switching between different views */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('donor')}
              className={`${
                activeTab === 'donor'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base sm:px-4 mr-8`}
            >
              Donors
            </button>
            <button
              onClick={() => setActiveTab('seeker')}
              className={`${
                activeTab === 'seeker'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base sm:px-4 mr-8`}
            >
              Food Seekers
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`${
                activeTab === 'volunteer'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base sm:px-4`}
            >
              Volunteers
            </button>
          </nav>
        </div>

        {/* Donor Dashboard */}
        {activeTab === 'donor' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Donations</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{donorData.totalDonations}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Donors</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{donorData.activeDonors}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Quantity</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{donorData.totalQuantity}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Latest Donation</h3>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-2">Today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Donation Distribution by Food Type</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donorData.foodTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {donorData.foodTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Donations</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={donorData.monthlyDonations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="donations" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Food Seeker Dashboard */}
        {activeTab === 'seeker' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Requests</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{seekerData.totalRequests}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Seekers</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{seekerData.activeSeekers}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Quantity Needed</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{seekerData.totalQuantityNeeded}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Latest Request</h3>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-2">Yesterday</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Food Types Requested</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={seekerData.foodTypeRequested}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {seekerData.foodTypeRequested.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Requests</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seekerData.monthlyRequests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Dashboard */}
        {activeTab === 'volunteer' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Volunteers</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{volunteerData.activeVolunteers}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed Deliveries</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{volunteerData.completedDeliveries}</p>
              </div>
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Success Rate</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">94%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Volunteer Availability</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={volunteerData.availabilityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {volunteerData.availabilityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-3d bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Deliveries</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volunteerData.deliveriesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="deliveries" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 