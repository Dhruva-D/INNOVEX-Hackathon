import React, { createContext, useContext, useState, ReactNode } from 'react';

// User types
type UserRole = 'donor' | 'seeker' | 'volunteer';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
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

  // Initialize auth - check for existing session (e.g., in localStorage)
  React.useEffect(() => {
    // In a real app, you would check for a token in localStorage or cookies
    // and validate it with the server
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to authenticate the user
      // For now, we'll simulate a successful login
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        fullName: 'Test User',
        role,
      };

      // Store user in state and localStorage
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  // Sign up function
  const signUp = async (userData: any, role: UserRole): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to create a new user
      // For now, we'll simulate a successful registration
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: userData.email,
        fullName: userData.fullName,
        role,
      };

      // Store user in state and localStorage
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  // Sign out function
  const signOut = () => {
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
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