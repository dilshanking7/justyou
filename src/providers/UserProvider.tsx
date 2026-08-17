import React, { createContext, useContext, useEffect, useState } from 'react';
import { userApiService } from '../services/userService';
import { useAuth } from './AuthProvider';

interface UserContextType {
  settings: any;
  devices: any[];
  notifications: any[];
  isLoading: boolean;
  addNotification: (notif: any) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  updateProfile: (updates: any) => Promise<void>;
  updateSettings: (newSettings: any) => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refetchProfile = async () => {
    if (!isAuthenticated || !user) return;
    setIsLoading(true);
    try {
      const data = await userApiService.getMe();
      setSettings(data.settings);
      setDevices(data.devices || []);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('[UserProvider] Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchProfile();
  }, [isAuthenticated, user?.id]);

  const addNotification = (notif: any) => {
    setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const updateProfile = async (updates: any) => {
    setIsLoading(true);
    try {
      await userApiService.updateMe(updates);
      await refetchProfile();
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: any) => {
    setIsLoading(true);
    try {
      const res = await userApiService.updateSettings(newSettings);
      setSettings(res.settings);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        settings,
        devices,
        notifications,
        isLoading,
        addNotification,
        clearNotifications,
        markAsRead,
        updateProfile,
        updateSettings,
        refetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
