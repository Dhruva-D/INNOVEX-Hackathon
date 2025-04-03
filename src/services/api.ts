import axios, { InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Authentication API calls
export const authApi = {
  // Convert frontend role names to backend roles
  mapRoleToUserType: (role: string) => {
    switch (role) {
      case 'donor': return 'donor';
      case 'seeker': return 'foodSeeker';
      case 'volunteer': return 'volunteer';
      default: throw new Error(`Invalid role: ${role}`);
    }
  },
  
  // Login user
  login: async (email: string, password: string, role: string) => {
    const userType = authApi.mapRoleToUserType(role);
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        userType
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register new user
  register: async (userData: any, role: string) => {
    const userType = authApi.mapRoleToUserType(role);
    
    // Transform frontend form data to match backend expectations
    const transformedData = {
      userType,
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phoneNumber,
      location: userData.address,
      // Additional fields based on role
      ...(userType === 'donor' && userData.aadhaarNumber && {
        aadhaarNumber: userData.aadhaarNumber
      }),
      ...(userType === 'foodSeeker' && {
        foodRequirements: 'General', // Default value
        familySize: 1, // Default value 
      }),
      ...(userType === 'volunteer' && {
        availability: userData.availableDate && userData.availableTime 
          ? `${userData.availableDate} ${userData.availableTime}`
          : 'Flexible',
        skills: ['Delivery'], // Default skills
      })
    };
    
    try {
      const response = await api.post('/auth/signup', transformedData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};

export default api; 