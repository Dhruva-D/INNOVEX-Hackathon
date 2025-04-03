import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, Users, Truck } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'donor' | 'seeker' | 'volunteer' | null>(null);
  
  // Extract role from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as 'donor' | 'seeker' | 'volunteer' | null;
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!role) {
      setError('Please select a role');
      return;
    }
    
    try {
      setLoading(true);
      const success = await signIn(email, password, role);
      
      if (success) {
        navigate(`/dashboard/${role}`);
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during sign in.');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      <div className="max-w-md mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Or{' '}
            <Link to="/signup" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        {!role ? (
          <div className="card-3d bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Select your role</h3>
            <div className="space-y-4">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRole(option.id as 'donor' | 'seeker' | 'volunteer')}
                  className="card-3d-content w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      {option.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{option.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="card-3d bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                {roleOptions.find(r => r.id === role)?.icon}
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                Sign in as {roleOptions.find(r => r.id === role)?.name}
              </h3>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 dark:bg-gray-700 dark:text-white sm:text-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="float-on-hover w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Not a {roleOptions.find(r => r.id === role)?.name} yet?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/signup?role=${role}`}
                  className="float-on-hover w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn; 