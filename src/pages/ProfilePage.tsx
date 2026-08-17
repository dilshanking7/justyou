import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Edit3, Lock, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../providers/AuthProvider';
import { useUser } from '../providers/UserProvider';
import { useToast } from '../hooks/useToast';

export const ProfilePage: React.FC = () => {
  const { user, isGuest, register, login, logout } = useAuth();
  const { updateProfile } = useUser();
  const toast = useToast();

  const [nicknameInput, setNicknameInput] = useState(user?.nickname || '');
  const [isEditing, setIsEditing] = useState(false);

  // Auth form states for guest account upgrade
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    try {
      await updateProfile({ nickname: nicknameInput });
      setIsEditing(false);
      toast.success('Profile updated', 'Nickname updated successfully.');
    } catch {
      toast.error('Update failed', 'Could not update nickname.');
    }
  };

  const handleAccountAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        await register(email, password, nicknameInput || undefined);
        toast.success('Account created', 'Registered email account successfully.');
      } else {
        await login(email, password);
        toast.success('Logged in', 'Authenticated successfully.');
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      toast.error('Authentication Error', err.message || 'Operation failed');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Banner Header */}
      <Card variant="gradient" padding="lg" className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={user?.nickname || 'Guest'} src={user?.avatar} size="xl" status="online" showGlow />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.nickname || 'Guest User'}</h1>
              <Badge variant={isGuest ? 'glass' : 'primary'} size="sm">
                {isGuest ? 'Guest Session' : 'Registered User'}
              </Badge>
              <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                Active Session
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              {isGuest
                ? 'Temporary guest session with automatic presence tracking.'
                : `Verified email: ${user?.email}`}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono text-slate-400">
              <span>Country: {user?.country || 'Detected'}</span>
              <span>•</span>
              <span>Language: {user?.language || 'en'}</span>
              <span>•</span>
              <span>Timezone: {user?.timezone || 'UTC'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              {isEditing ? 'Cancel' : 'Edit Name'}
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => logout()}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Nickname Form */}
      {isEditing && (
        <Card variant="glass" padding="md" className="space-y-4">
          <h3 className="text-sm font-bold text-white">Update Nickname</h3>
          <form onSubmit={handleSaveNickname} className="flex gap-3">
            <Input
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="Enter new nickname..."
              className="flex-1"
            />
            <Button type="submit" variant="gradient" size="sm">
              Save
            </Button>
          </form>
        </Card>
      )}

      {/* Guest Upgrade / Authentication Section */}
      {isGuest && (
        <Card variant="glass" padding="lg" className="space-y-4 border-indigo-500/30 bg-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {authMode === 'register' ? 'Upgrade to Registered Account' : 'Sign In to Existing Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'register'
                  ? 'Convert your guest session to a permanent account with email & password.'
                  : 'Already registered? Sign in to restore your profile credentials.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleAccountAuth} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              type="email"
              placeholder="Email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="sm:col-span-2 flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                {authMode === 'register'
                  ? 'Already have an account? Login instead'
                  : 'Need a new account? Register here'}
              </button>

              <Button
                type="submit"
                variant="gradient"
                size="sm"
                isLoading={authLoading}
                leftIcon={<UserCheck className="w-4 h-4" />}
              >
                {authMode === 'register' ? 'Register Account' : 'Sign In'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
