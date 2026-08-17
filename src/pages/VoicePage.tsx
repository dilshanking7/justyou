import React from 'react';
import { Mic, Radio } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { useSocket } from '../providers/SocketProvider';

export const VoicePage: React.FC = () => {
  const { presenceStats } = useSocket();
  const activeOnline = presenceStats?.activeUsersOnline ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Mic className="w-6 h-6 text-amber-400" /> Spatial Voice Lounges
        </h1>
        <Badge variant="glass">
          {activeOnline === 0 ? 'No active users' : `${activeOnline} Online`}
        </Badge>
      </div>

      <Card variant="glass" padding="lg">
        <EmptyState
          icon={<Radio className="w-8 h-8 text-amber-400" />}
          title="Waiting for voice members..."
          message={
            activeOnline === 0
              ? 'No users are in voice lounges yet. Voice architecture is ready for connections.'
              : `${activeOnline} user${activeOnline === 1 ? '' : 's'} online. Waiting for voice room initialization.`
          }
        />
      </Card>
    </div>
  );
};
