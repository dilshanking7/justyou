import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Video,
  Mic,
  MessageSquare,
  Globe,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { DICTIONARY } from '../../constants/i18n';
import { useSocket } from '../../providers/SocketProvider';
import { useAuth } from '../../providers/AuthProvider';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, language } = useNavigationStore();
  const { presenceStats } = useSocket();
  const { user } = useAuth();
  const t = DICTIONARY[language] || DICTIONARY.en;

  const [activeTab, setActiveTab] = useState<'video' | 'voice' | 'chat'>('video');

  const activeOnline = presenceStats?.activeUsersOnline ?? 0;

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Title & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="gradient" icon={<Sparkles className="w-3.5 h-3.5 text-indigo-300" />}>
                Next-Gen Communication Architecture
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.08]"
            >
              Random Human Connections.{' '}
              <span className="italic font-serif font-normal text-slate-300">Pure,</span>{' '}
              <span className="text-gradient-purple">Fast, Encrypted.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Experience instant sub-18ms WebRTC video, spatial audio, and real-time text lounges built on Express, Socket.IO, and JWT authentication.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={() => setCurrentPage('dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Launch Application
              </Button>

              <Button
                variant="glass"
                size="lg"
                onClick={() => setCurrentPage('chat')}
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Text Lounge
              </Button>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block font-mono">
                    {activeOnline}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {activeOnline === 0 ? 'No users online yet' : 'Active Users Online'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Sub-18ms</span>
                  <span className="text-[10px] text-slate-500 font-mono">Socket.IO Heartbeat</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Zero-Logs</span>
                  <span className="text-[10px] text-slate-500">Privacy First</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Stage Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Stage Tab Switcher */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Presence Node
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      activeTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> Video
                  </button>
                  <button
                    onClick={() => setActiveTab('voice')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      activeTab === 'voice' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" /> Voice
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>
              </div>

              {/* Call Frame Canvas */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-purple-950/20 to-slate-950" />

                {/* Center Peer Aura */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <Avatar
                    name={user?.nickname || 'Guest Session'}
                    src={user?.avatar}
                    size="xl"
                    status="online"
                    showGlow
                  />

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1">
                      {user?.nickname || 'Active User'}{' '}
                      <Badge variant={user?.isGuest ? 'glass' : 'primary'} size="sm">
                        {user?.isGuest ? 'GUEST' : 'USER'}
                      </Badge>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {activeOnline === 0 ? 'No users are online yet.' : `${activeOnline} Users Connected`}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs">
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> Socket.IO Connected
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{user?.country || 'US'}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="gradient"
                fullWidth
                onClick={() => setCurrentPage('dashboard')}
                leftIcon={<UserCheck className="w-4 h-4" />}
              >
                Enter App Architecture
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
