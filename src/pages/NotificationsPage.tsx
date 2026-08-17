import React from 'react';
import { Bell, MessageSquare, UserPlus, Sparkles, CheckCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useUser } from '../providers/UserProvider';
import { Card } from '../components/ui/Card';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, clearNotifications } = useUser();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => markAsRead(n.id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
        return <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0" />;
      case 'FRIEND_REQUEST':
        return <UserPlus className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'SYSTEM':
      default:
        return <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" /> Real-time Notifications Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live alerts for messages, friend requests, accepts & welcome notices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleMarkAllRead}
                  leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
                >
                  Mark All Read
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={clearNotifications}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
              >
                Clear All
              </Button>
            </>
          )}
          <Badge variant={unreadCount > 0 ? 'primary' : 'glass'}>
            {unreadCount} Unread
          </Badge>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-indigo-400" />}
          title="No notifications yet."
          message="Important system alerts, message notifications, and friend requests will appear here in real time."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              variant={n.isRead ? 'glass' : 'default'}
              padding="md"
              className={`flex items-start gap-3.5 transition-all cursor-pointer ${
                !n.isRead ? 'border-indigo-500/40 bg-indigo-950/20' : ''
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {n.title}
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {n.isRead && (
                <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 self-center" />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
