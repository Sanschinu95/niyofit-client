'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
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
      apiService.setToken(token);
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
      apiService.setToken(null);
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

  // Login function with API integration
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiService.loginUser({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setAuthToken(token);
        setUserData(userData);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Register function with API integration
  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiService.registerUser(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        setAuthToken(token);
        setUserData(newUser);
        setUser(newUser);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function with API call
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiService.logoutUser();
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
        // Set token in API service
        apiService.setToken(token);
        
        // Verify token with backend
        const response = await apiService.verifyToken();
        
        if (response.success && response.data) {
          setUser(response.data.user);
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
    register,
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