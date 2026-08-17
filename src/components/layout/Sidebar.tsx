import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  Video,
  Mic,
  Users,
  Bell,
  User,
  Settings,
  Zap,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { MODULE_ROUTES } from '../../constants/routes';
import { PageKey } from '../../types';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, isSidebarCollapsed, toggleSidebar } = useNavigationStore();

  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    MessageSquare: <MessageSquare className="w-4 h-4 shrink-0" />,
    Video: <Video className="w-4 h-4 shrink-0" />,
    Mic: <Mic className="w-4 h-4 shrink-0" />,
    Users: <Users className="w-4 h-4 shrink-0" />,
    Bell: <Bell className="w-4 h-4 shrink-0" />,
    User: <User className="w-4 h-4 shrink-0" />,
    Settings: <Settings className="w-4 h-4 shrink-0" />,
    Zap: <Zap className="w-4 h-4 shrink-0" />,
    ShieldAlert: <ShieldAlert className="w-4 h-4 shrink-0" />,
    AlertTriangle: <AlertTriangle className="w-4 h-4 shrink-0" />,
    HelpCircle: <HelpCircle className="w-4 h-4 shrink-0" />,
  };

  const handlePageClick = (key: PageKey) => {
    setCurrentPage(key);
  };

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 72 : 250 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 bg-slate-950/80 border-r border-slate-800/80 p-3 select-none shrink-0 z-30"
    >
      {/* Collapse toggle button */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
        {!isSidebarCollapsed && (
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
            Workspace
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-slate-800 transition-colors mx-auto"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar navigation list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none">
        {MODULE_ROUTES.map((route) => {
          const isActive = currentPage === route.key;
          const icon = iconMap[route.icon || 'LayoutDashboard'];

          return (
            <button
              key={route.key}
              onClick={() => handlePageClick(route.key)}
              title={isSidebarCollapsed ? route.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group',
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              )}
            >
              <span className={cn('transition-transform group-hover:scale-110', isActive && 'text-white')}>
                {icon}
              </span>

              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{route.label}</span>
                  {route.badge && (
                    <span
                      className={cn(
                        'px-1.5 py-0.2 text-[10px] rounded-full font-bold ml-1 shrink-0',
                        route.badge === 'PRO'
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      )}
                    >
                      {route.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User profile footer item */}
      <div className="pt-3 mt-2 border-t border-slate-800/80">
        <div
          onClick={() => handlePageClick('profile')}
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer',
            isSidebarCollapsed && 'justify-center p-1.5'
          )}
        >
          <Avatar name="Alex Rivera" status="online" size={isSidebarCollapsed ? 'sm' : 'md'} />
          {!isSidebarCollapsed && (
            <div className="overflow-hidden text-left">
              <span className="text-xs font-semibold text-white truncate block">Alex Rivera</span>
              <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 shrink-0" /> Verified Peer
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
