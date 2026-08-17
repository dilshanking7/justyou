import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { useUser } from './UserProvider';
import { useToastStore } from '../lib/toastStore';
import { PresenceStatsResponse, presenceApiService } from '../services/presenceService';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  presenceStats: PresenceStatsResponse | null;
  refetchPresence: () => Promise<void>;
  mySocketUserId: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useUser();
  const { addToast } = useToastStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [presenceStats, setPresenceStats] = useState<PresenceStatsResponse | null>(null);

  // Ensure each tab gets a unique Guest ID if unauthenticated so 2 local tabs can connect to each other!
  let tabGuestId = sessionStorage.getItem('justyou_tab_guest_id');
  if (!tabGuestId) {
    tabGuestId = `Guest-${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem('justyou_tab_guest_id', tabGuestId);
  }
  const mySocketUserId = user?.id || tabGuestId;

  const fetchPresenceStats = async () => {
    try {
      const stats = await presenceApiService.getPresence();
      setPresenceStats(stats);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchPresenceStats();

    const socketUrl = window.location.origin;
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      query: {
        userId: mySocketUserId,
        country: user?.country || 'US',
        language: user?.language || 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('presence:update', (stats: PresenceStatsResponse) => {
      setPresenceStats(stats);
    });

    // Real-time incoming notification handler
    newSocket.on('notification:new', (notif: any) => {
      addNotification(notif);
      addToast(notif.title, notif.message, 'info', 5000);
    });

    // Handle friend request acceptance event
    newSocket.on('friend_request_accepted', () => {
      addToast('Friend Accepted! 🎉', 'You are now connected and can call each other directly.', 'success', 5000);
    });

    setSocket(newSocket);

    // Heartbeat ping interval
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('presence:ping');
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      newSocket.disconnect();
    };
  }, [mySocketUserId, user?.country, user?.language]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        presenceStats,
        refetchPresence: fetchPresenceStats,
        mySocketUserId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
};
