'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          login(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [login]);

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; 