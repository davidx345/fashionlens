// frontend/app/hooks/useSession.ts

import { useEffect, useState } from 'react';
import { initializeSession, checkSession, logoutUser } from '@/app/api/services/auth-service';
import useStore from '@/store/useStore';

interface UseSessionReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  checkSessionValidity: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Custom hook for managing user session state and persistence.
 * 
 * Features:
 * - Automatically initializes session on mount
 * - Provides session validity checking
 * - Handles session expiration
 * - Integrates with Zustand store
 */
export const useSession = (): UseSessionReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useStore();

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        await initializeSession();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);
  const checkSessionValidity = async () => {
    try {
      await checkSession();
      // If checkSession succeeds, the session is valid
    } catch (error) {
      console.error('Session check failed:', error);
      await logoutUser();
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    checkSessionValidity,
    logout
  };
};
