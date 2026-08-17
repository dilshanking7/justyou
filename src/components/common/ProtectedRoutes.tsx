import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { LoadingState } from './LoadingState';
import { Button } from '../ui/Button';
import { UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRegisteredOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRegisteredOnly = false,
}) => {
  const { isAuthenticated, isGuest, isLoading, guestLogin } = useAuth();

  if (isLoading) {
    return <LoadingState message="Verifying session..." fullScreen />;
  }

  // Allow guest users if registered-only is false
  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Session Required</h3>
        <p className="text-xs text-slate-400">Initialize a guest or registered session to access this view.</p>
        <Button
          variant="gradient"
          onClick={() => guestLogin()}
          leftIcon={<UserCheck className="w-4 h-4" />}
        >
          Continue as Guest
        </Button>
      </div>
    );
  }

  if (requireRegisteredOnly && isGuest) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-3xl border border-indigo-500/20 bg-indigo-500/5">
        <h3 className="text-base font-bold text-white">Account Upgrade Required</h3>
        <p className="text-xs text-slate-400 max-w-md">
          This feature requires a verified account. Upgrade your guest session with an email & password to access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
