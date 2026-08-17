import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Hash, Paperclip, Users, Circle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/common/EmptyState';
import { useSocket } from '../providers/SocketProvider';
import { useAuth } from '../providers/AuthProvider';

export const ChatPage: React.FC = () => {
  const { socket, presenceStats } = useSocket();
  const { user, token } = useAuth();

  const [activePartner, setActivePartner] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  const [activeChannel, setActiveChannel] = useState<string | null>('general-lounge');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch Friends & Recent Chats
  useEffect(() => {
    async function loadChatLists() {
      if (!token) return;
      try {
        const [friendsRes, recentRes] = await Promise.all([
          fetch('/api/friends/friends', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/messages/recent', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const friendsData = await friendsRes.json();
        const recentData = await recentRes.json();

        if (friendsRes.ok && friendsData.success) {
          setFriends(friendsData.friends || []);
        }
        if (recentRes.ok && recentData.success) {
          setRecentChats(recentData.chats || []);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadChatLists();
  }, [token]);

  // Load conversation when partner changes
  useEffect(() => {
    async function loadConversation() {
      if (!token || !activePartner) return;
      try {
        const res = await fetch(`/api/messages/conversation/${activePartner.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (activePartner) {
      loadConversation();
    }
  }, [activePartner, token]);

  // Real-time socket message handler
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg: any) => {
      if (
        activePartner &&
        (newMsg.senderId === activePartner.id || newMsg.receiverId === activePartner.id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleNewMessage);
    };
  }, [socket, activePartner]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !user) return;

    const content = inputVal.trim();
    setInputVal('');

    const targetReceiverId = activePartner ? activePartner.id : undefined;
    const targetChannelId = activeChannel ? activeChannel : undefined;

    // Emit via Socket.IO
    if (socket) {
      socket.emit('send_message', {
        receiverId: targetReceiverId,
        channelId: targetChannelId,
        content,
      });
    }

    // Backup REST call
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: targetReceiverId,
          channelId: targetChannelId,
          content,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && !activePartner) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = presenceStats?.activeUsersOnline ?? 0;

  return (
    <div className="h-[calc(100vh-5rem)] flex gap-4 p-4 overflow-hidden">
      {/* Channels & Friends Sidebar */}
      <Card padding="none" variant="glass" className="w-72 hidden md:flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Messages & Lounge
          </span>
          <Badge variant="glass" size="sm">
            {activeCount === 0 ? '0 Online' : `${activeCount} Online`}
          </Badge>
        </div>

        <div className="p-2 space-y-4 overflow-y-auto flex-1">
          {/* Public Lounges */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lounges</span>
            {['general-lounge', 'language-exchange', 'tech-and-ai'].map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  setActiveChannel(ch);
                  setActivePartner(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeChannel === ch && !activePartner
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{ch}</span>
              </button>
            ))}
          </div>

          {/* Direct Friends */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Friends ({friends.length})</span>
            {friends.length === 0 ? (
              <p className="px-3 text-[11px] text-slate-500 italic">No friends added yet.</p>
            ) : (
              friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => {
                    setActivePartner({ id: friend.id, name: friend.displayName, avatar: friend.avatar });
                    setActiveChannel(null);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    activePartner?.id === friend.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Avatar name={friend.displayName} src={friend.avatar} size="xs" status={friend.onlineStatus === 'ONLINE' ? 'online' : 'offline'} />
                  <span className="truncate flex-1 text-left">{friend.displayName}</span>
                  {friend.onlineStatus === 'ONLINE' && <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />}
                </button>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card padding="none" variant="glass" className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            {activePartner ? (
              <>
                <Avatar name={activePartner.name} src={activePartner.avatar} size="sm" />
                <div>
                  <h3 className="text-sm font-bold text-white">{activePartner.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Direct Message</p>
                </div>
              </>
            ) : (
              <>
                <Hash className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    #{activeChannel}
                  </h3>
                  <p className="text-[11px] text-slate-400">Global text lounge</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="w-6 h-6 text-indigo-400" />}
              title="No messages in this chat."
              message="Send a message below to start real-time messaging."
            />
          ) : (
            messages.map((msg, idx) => {
              const isSelf = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                      isSelf
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-0.5">
                      <span>{isSelf ? 'You' : msg.senderId}</span>
                      <span className="font-mono">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                    <p className="leading-relaxed text-xs">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center gap-2">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              activePartner ? `Message @${activePartner.name}...` : `Type a message in #${activeChannel}...`
            }
            className="flex-1"
          />
          <Button type="submit" variant="gradient" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};
