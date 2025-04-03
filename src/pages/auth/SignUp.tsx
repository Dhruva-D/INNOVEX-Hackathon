import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Users, Truck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

type SignUpRole = 'donor' | 'seeker' | 'volunteer' | null;

// Common form fields interface
interface FormFields {
  fullName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  foodSafetyAccepted: boolean;
}

// Additional fields by role
interface DonorFields extends FormFields {
  aadhaarNumber: string;
}

interface SeekerFields extends FormFields {
  userType: 'individual' | 'organization' | 'ngo' | 'orphanage';
  foodRequirements: string;
  familySize: number;
}

interface VolunteerFields extends FormFields {
  aadhaarNumber: string;
  vehicleType: 'bike' | 'car' | 'van' | 'truck';
  vehicleNumber: string;
  availableDate: string;
  availableTime: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const [role, setRole] = useState<SignUpRole>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Initialize all possible form fields with empty values
  const [formData, setFormData] = useState<DonorFields & SeekerFields & VolunteerFields>({
    fullName: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    foodSafetyAccepted: false,
    aadhaarNumber: '',
    userType: 'individual',
    vehicleType: 'bike',
    vehicleNumber: '',
    availableDate: '',
    availableTime: '',
    foodRequirements: '',
    familySize: 1,
  });

  // Extract role from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as SignUpRole;
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!role) {
      setError('Please select a role');
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate terms acceptance
    if (!formData.termsAccepted || !formData.foodSafetyAccepted) {
      setError('You must accept the terms and food safety guidelines');
      return;
    }
    
    try {
      setLoading(true);
      // Convert SignUpRole to UserRole by removing null
      const success = await signUp(formData, role);
      
      if (success) {
        navigate(`/dashboard/${role}`);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign up.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'donor', name: 'Donor', icon: <Utensils className="h-6 w-6" /> },
    { id: 'seeker', name: 'Food Seeker', icon: <Users className="h-6 w-6" /> },
    { id: 'volunteer', name: 'Volunteer', icon: <Truck className="h-6 w-6" /> }
  ];

  // Render role selection if no role is selected yet
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        <div className="max-w-md mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Select your role</h3>
            <div className="space-y-4">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRole(option.id as SignUpRole)}
                  className="w-full flex items-center justify-between p-4 border rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      {option.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <p className="text-sm font-medium text-gray-900">{option.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <div className="max-w-md mx-auto pt-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
          <div className="flex items-center justify-center mt-4">
            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              {roleOptions.find(r => r.id === role)?.icon}
            </div>
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              as a {roleOptions.find(r => r.id === role)?.name}
            </h3>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'donor' && (
              <div>
                <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                  Aadhaar Number (for verification)
                </label>
                <div className="mt-1">
                  <input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    type="text"
                    required
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {role === 'seeker' && (
              <>
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                    User Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="userType"
                      name="userType"
                      required
                      value={formData.userType}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="individual">Individual</option>
                      <option value="organization">Organization</option>
                      <option value="ngo">NGO</option>
                      <option value="orphanage">Orphanage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="foodRequirements" className="block text-sm font-medium text-gray-700">
                    Food Requirements
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="foodRequirements"
                      name="foodRequirements"
                      rows={3}
                      required
                      value={formData.foodRequirements}
                      onChange={handleChange}
                      placeholder="Please specify any dietary restrictions or preferences"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="familySize" className="block text-sm font-medium text-gray-700">
                    Family Size
                  </label>
                  <div className="mt-1">
                    <input
                      id="familySize"
                      name="familySize"
                      type="number"
                      min="1"
                      required
                      value={formData.familySize}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {role === 'volunteer' && (
              <>
                <div>
                  <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                    Aadhaar Number (for verification)
                  </label>
                  <div className="mt-1">
                    <input
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      type="text"
                      required
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      required
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="bike">Bike</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                    Vehicle Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="vehicleNumber"
                      name="vehicleNumber"
                      type="text"
                      required
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="availableDate" className="block text-sm font-medium text-gray-700">
                      Available Date
                    </label>
                    <div className="mt-1">
                      <input
                        id="availableDate"
                        name="availableDate"
                        type="date"
                        required
                        value={formData.availableDate}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="availableTime" className="block text-sm font-medium text-gray-700">
                      Available Time
                    </label>
                    <div className="mt-1">
                      <input
                        id="availableTime"
                        name="availableTime"
                        type="time"
                        required
                        value={formData.availableTime}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email & Password Fields */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Mandatory Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                  I accept the <a href="#" className="text-green-600 hover:text-green-500">Terms & Conditions</a>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="foodSafetyAccepted"
                  name="foodSafetyAccepted"
                  type="checkbox"
                  required
                  checked={formData.foodSafetyAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="foodSafetyAccepted" className="ml-2 block text-sm text-gray-900">
                  I have read and acknowledge the <a href="#" className="text-green-600 hover:text-green-500">Legal Food Safety Guidelines</a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 