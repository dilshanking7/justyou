import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApiService, AuthResponse } from '../services/authService';
import { userApiService } from '../services/userService';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  tokens: AuthResponse['tokens'] | null;
  token: string;
  isGuest: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  guestLogin: (nickname?: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, nickname?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [tokens, setTokens] = useState<AuthResponse['tokens'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setTokens(data.tokens);
    localStorage.setItem('justyou_access_token', data.tokens.accessToken);
    localStorage.setItem('justyou_refresh_token', data.tokens.refreshToken);
    setError(null);
  };

  const guestLogin = useCallback(async (nickname?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApiService.guestLogin(nickname);
      handleAuthSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate guest session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApiService.login({ email, password: pass });
      handleAuthSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, nickname?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApiService.register({ email, password: pass, nickname });
      handleAuthSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem('justyou_refresh_token') || undefined;
      await authApiService.logout(refreshToken);
    } catch {
      // Ignore
    } finally {
      setUser(null);
      setTokens(null);
      // Re-initialize guest session on logout so user is never left stuck
      await guestLogin();
    }
  };

  // Bootstrap session on mount
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('justyou_access_token');
      if (!token) {
        // Auto initialize Guest Login
        await guestLogin();
        return;
      }

      try {
        const profile = await userApiService.getMe();
        setUser(profile.user);
        setTokens({
          accessToken: token,
          refreshToken: localStorage.getItem('justyou_refresh_token') || '',
        });
      } catch {
        // Token invalid, fallback to Guest Login
        await guestLogin();
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [guestLogin]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        token: tokens?.accessToken || (typeof window !== 'undefined' ? localStorage.getItem('justyou_access_token') || '' : ''),
        isGuest: !!user?.isGuest,
        isAuthenticated: !!user,
        isLoading,
        error,
        guestLogin,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
