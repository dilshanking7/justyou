import React from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, Activity, Database } from 'lucide-react';
import { Card } from '../ui/Card';
import { useSocket } from '../../providers/SocketProvider';

export const StatisticsSection: React.FC = () => {
  const { presenceStats } = useSocket();

  const activeOnline = presenceStats?.activeUsersOnline ?? 0;
  const totalRegistered = presenceStats?.totalRegisteredUsers ?? 0;

  const stats = [
    {
      label: 'Active Users Online',
      value: activeOnline.toString(),
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      subtext: activeOnline === 0 ? 'No users are online yet.' : 'Real connected WebSocket clients',
    },
    {
      label: 'Registered Accounts',
      value: totalRegistered.toString(),
      icon: <Database className="w-5 h-5 text-amber-400" />,
      subtext: 'Database persistent users',
    },
    {
      label: 'Data Logged On Disconnect',
      value: '0 Bytes',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      subtext: 'Zero persistent session logs',
    },
    {
      label: 'Real Presence Engine',
      value: presenceStats ? 'Active' : 'Connecting...',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      subtext: 'Socket.IO presence heartbeat',
    },
  ];

  return (
    <section className="py-16 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card variant="glass" padding="md" className="space-y-2 text-center">
                <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit mx-auto mb-1">
                  {st.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {st.value}
                </h3>
                <span className="text-xs font-semibold text-slate-300 block">{st.label}</span>
                <span className="text-[10px] text-slate-500 block">{st.subtext}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
