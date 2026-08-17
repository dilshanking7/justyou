import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Check, X, Search, ShieldCheck, MessageSquare, Trash2, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../providers/AuthProvider';
import { useSocket } from '../providers/SocketProvider';

export const FriendsPage: React.FC = () => {
  const { token, user } = useAuth();
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('online');
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Fetch Friends List & Pending Requests
  const fetchFriendsData = async () => {
    if (!token) return;
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch('/api/friends/friends', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/friends/requests', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const friendsData = await friendsRes.json();
      const requestsData = await requestsRes.json();

      if (friendsRes.ok && friendsData.success) {
        setFriends(friendsData.friends || []);
      }
      if (requestsRes.ok && requestsData.success) {
        setPendingRequests(requestsData.requests || []);
      }
    } catch (err) {
      console.error('[Friends Fetch Error]:', err);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, [token]);

  // Listen to Socket.IO real-time friend request events
  useEffect(() => {
    if (!socket) return;

    socket.on('new_friend_request', () => {
      fetchFriendsData();
      setActionMessage('New friend request received!');
      setTimeout(() => setActionMessage(null), 4000);
    });

    return () => {
      socket.off('new_friend_request');
    };
  }, [socket]);

  // Send Friend Request
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;

    try {
      setSearchLoading(true);
      setActionMessage(null);

      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: targetUserId.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (socket) {
          socket.emit('send_friend_request', { targetUserId: targetUserId.trim() });
        }
        setActionMessage('Friend request sent successfully!');
        setTargetUserId('');
        fetchFriendsData();
      } else {
        setActionMessage(data.error || 'Failed to send friend request');
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Error sending request');
    } finally {
      setSearchLoading(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // Accept Request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/friends/request/${requestId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage('Friend request accepted!');
        fetchFriendsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reject Request
  const handleRejectRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/friends/request/${requestId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchFriendsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remove Friend
  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    try {
      const res = await fetch(`/api/friends/friends/${friendId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchFriendsData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onlineFriends = friends.filter((f) => f.onlineStatus === 'ONLINE');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header & Send Request Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" /> Friends & Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect with friends, manage incoming requests, and start direct conversations.
          </p>
        </div>

        <form onSubmit={handleSendRequest} className="flex items-center gap-2 w-full md:w-auto">
          <Input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="Enter User ID or Username..."
            className="w-full md:w-64"
          />
          <Button
            type="submit"
            variant="gradient"
            size="md"
            isLoading={searchLoading}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Friend
          </Button>
        </form>
      </div>

      {actionMessage && (
        <Card padding="sm" variant="glass" className="border-indigo-500/40 bg-indigo-950/30 text-indigo-200 text-xs">
          {actionMessage}
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'online', label: `Online Friends (${onlineFriends.length})` },
          { id: 'all', label: `All Friends (${friends.length})` },
          { id: 'pending', label: `Pending Requests (${pendingRequests.length})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Pending Requests View */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingRequests.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-6 h-6 text-indigo-400" />}
              title="No Pending Requests"
              message="When someone sends you a friend request, it will appear here."
            />
          ) : (
            pendingRequests.map((req) => (
              <Card key={req.id} padding="md" variant="glass" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={req.sender.displayName} src={req.sender.avatar} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{req.sender.displayName}</h4>
                    <p className="text-xs text-slate-400 font-mono">@{req.sender.username || req.senderId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={() => handleAcceptRequest(req.id)}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectRequest(req.id)}
                    leftIcon={<X className="w-3.5 h-3.5" />}
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Online / All Friends View */}
      {(activeTab === 'online' || activeTab === 'all') && (
        <div className="space-y-3">
          {(activeTab === 'online' ? onlineFriends : friends).length === 0 ? (
            <EmptyState
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title={activeTab === 'online' ? 'No Friends Online Right Now' : 'No Friends Added Yet'}
              message="Use the input above to send a friend request by User ID."
            />
          ) : (
            (activeTab === 'online' ? onlineFriends : friends).map((friend) => (
              <Card key={friend.id} padding="md" variant="glass" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={friend.displayName}
                    src={friend.avatar}
                    size="md"
                    status={friend.onlineStatus === 'ONLINE' ? 'online' : 'offline'}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {friend.displayName}
                      <Badge
                        variant={friend.onlineStatus === 'ONLINE' ? 'success' : 'glass'}
                        size="sm"
                      >
                        {friend.onlineStatus || 'OFFLINE'}
                      </Badge>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">@{friend.username || friend.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (window.location.href = `/chat?user=${friend.id}`)}
                    leftIcon={<MessageSquare className="w-3.5 h-3.5 text-indigo-400" />}
                  >
                    Chat
                  </Button>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
                    title="Remove Friend"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
