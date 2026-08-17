import React from 'react';
import { Video, Mic, MessageSquare, Zap, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigationStore } from '../lib/navigationStore';
import { useAuth } from '../providers/AuthProvider';
import { useSocket } from '../providers/SocketProvider';

export const DashboardPage: React.FC = () => {
  const { setCurrentPage } = useNavigationStore();
  const { user } = useAuth();
  const { presenceStats } = useSocket();

  const activeOnline = presenceStats?.activeUsersOnline ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <Card variant="gradient" padding="lg" className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="glass" icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}>
            {user?.isGuest ? 'Active Guest Session' : 'Registered Account'}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.nickname || 'Guest User'}
          </h1>
          <p className="text-xs text-slate-300 max-w-lg">
            {activeOnline === 0
              ? 'No users are online right now. You can launch communication channels below.'
              : `${activeOnline} user${activeOnline === 1 ? '' : 's'} online right now.`}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="gradient" size="lg" onClick={() => setCurrentPage('video')} leftIcon={<Video className="w-4 h-4" />}>
            Launch Video Mode
          </Button>
        </div>
      </Card>

      {/* Quick Access Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" padding="lg" className="space-y-4 hover:border-indigo-500/50 transition-colors">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit">
            <Video className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-white">WebRTC Video Architecture</h3>
          <p className="text-xs text-slate-400">P2P mesh video matching foundation.</p>
          <Button variant="primary" size="sm" fullWidth onClick={() => setCurrentPage('video')}>Launch Video</Button>
        </Card>

        <Card variant="glass" padding="lg" className="space-y-4 hover:border-indigo-500/50 transition-colors">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl w-fit">
            <MessageSquare className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white">Real-Time Text Chat</h3>
          <p className="text-xs text-slate-400">Text lounges connected to Express and Socket backend.</p>
          <Button variant="primary" size="sm" fullWidth onClick={() => setCurrentPage('chat')}>Launch Chat</Button>
        </Card>

        <Card variant="glass" padding="lg" className="space-y-4 hover:border-indigo-500/50 transition-colors">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit">
            <Mic className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-base font-bold text-white">Spatial Voice Lounges</h3>
          <p className="text-xs text-slate-400">Audio positioning communication channels.</p>
          <Button variant="primary" size="sm" fullWidth onClick={() => setCurrentPage('voice')}>Launch Voice</Button>
        </Card>
      </div>
    </div>
  );
};
