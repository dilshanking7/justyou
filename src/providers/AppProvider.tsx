import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { ToastContainer } from '../components/ui/Toast';
import { CommandPalette } from '../components/common/CommandPalette';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { AuthProvider } from './AuthProvider';
import { UserProvider } from './UserProvider';
import { SocketProvider } from './SocketProvider';

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300 relative selection:bg-indigo-500/30 selection:text-indigo-400">
              {children}
              <ToastContainer />
              <CommandPalette />
              <FloatingActionButton />
            </div>
          </SocketProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
