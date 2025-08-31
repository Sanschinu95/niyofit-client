'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'niyofit_auth_token';
const USER_KEY = 'niyofit_user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Secure token storage functions
  const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  };

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  };

  const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.clear();
    }
  };

  const setUserData = (userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
  };

  const getUserData = (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  // Login function
  const login = (token: string, userData: User) => {
    setAuthToken(token);
    setUserData(userData);
    setUser(userData);
  };

  // Logout function with API call
  const logout = async () => {
    setIsLoading(true);
    
    try {
      const token = getAuthToken();
      
      if (token) {
        // Call logout API endpoint
        await fetch('http://localhost:4170/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear all local storage and state
      removeAuthToken();
      setUser(null);
      setIsLoading(false);
      
      // Redirect to login page
      router.push('/login');
    }
  };

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    try {
      const token = getAuthToken();
      const userData = getUserData();
      
      if (token && userData) {
        // Verify token with backend
        const response = await fetch('http://localhost:4170/api/v1/auth/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const verifiedUser = await response.json();
          setUser(verifiedUser.user || userData);
        } else {
          // Token is invalid, clear storage
          removeAuthToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      // If verification fails, use stored user data as fallback
      const userData = getUserData();
      if (userData) {
        setUser(userData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };