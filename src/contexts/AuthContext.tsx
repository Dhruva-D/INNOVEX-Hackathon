import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '../services/api';

// User types
type UserRole = 'donor' | 'seeker' | 'volunteer';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  userType: string;
  token: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signUp: (userData: any, role: UserRole) => Promise<boolean>;
  signOut: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth - check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // If there's an error parsing user data, clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      const userData = await authApi.login(email, password, role);
      
      // Store token separately for easier access in API interceptor
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (userData: any, role: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      const newUser = await authApi.register(userData, role);
      
      // Store token separately for easier access in API interceptor
      localStorage.setItem('token', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 