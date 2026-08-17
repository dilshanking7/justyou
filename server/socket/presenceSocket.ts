import { Server as SocketServer, Socket } from 'socket.io';
import { PresenceService } from '../services/presenceService';
import { hashIp } from '../utils/hash';
import { db } from '../database/db';

interface QueueUser {
  userId: string;
  socketId: string;
  country: string;
  gender: string;
  name: string;
  socket: Socket;
}

// Global server-authoritative matchmaking queue
const waitingQueue: QueueUser[] = [];

export function setupPresenceSocket(io: SocketServer) {
  io.on('connection', async (socket: Socket) => {
    const query = socket.handshake.query;
    const clientIp =
      (socket.handshake.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      socket.handshake.address ||
      '127.0.0.1';

    const userId = (query.userId as string) || `guest_sock_${socket.id.substring(0, 6)}`;
    const deviceId = (query.deviceId as string) || `dev_${socket.id.substring(0, 6)}`;
    const country = (query.country as string) || (socket.handshake.headers['x-country-code'] as string) || 'US';
    const language = (query.language as string) || 'en';
    const timezone = (query.timezone as string) || 'UTC';
    const ipHash = hashIp(clientIp);

    // Join personal user room for direct signaling, messaging, and real-time notifications
    socket.join(userId);

    // Register presence in database
    await PresenceService.registerPresence({
      userId,
      socketId: socket.id,
      deviceId,
      country,
      language,
      timezone,
      ipHash,
      status: 'ONLINE',
    });

    // Broadcast updated presence metrics
    const stats = await PresenceService.getPresenceStats();
    io.emit('presence:update', stats);

    // Welcome Notification on connection
    try {
      const welcomeNotif = await db.notifications.create({
        id: 'notif_welcome_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId,
        title: 'Welcome to JustYou! 👋',
        message: 'Connected to live global video chat network. Start matching & custom theme studio!',
        type: 'SYSTEM',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
      socket.emit('notification:new', welcomeNotif);
    } catch {
      // Ignore
    }

    // Heartbeat ping handler
    socket.on('presence:ping', async () => {
      await PresenceService.registerPresence({
        userId,
        socketId: socket.id,
        deviceId,
        country,
        language,
        timezone,
        ipHash,
        status: 'ONLINE',
      });
    });

    // Helper to leave current match room
    const leaveCurrentMatch = () => {
      // Remove from waiting queue
      const qIdx = waitingQueue.findIndex((u) => u.socketId === socket.id);
      if (qIdx !== -1) {
        waitingQueue.splice(qIdx, 1);
      }

      // If in a room, notify partner and leave room
      const currentRoom = socket.data.roomId;
      if (currentRoom) {
        socket.to(currentRoom).emit('match:partner_left', { leaverId: userId });
        socket.leave(currentRoom);
        socket.data.roomId = null;
      }
    };

    // ===============================================
    // REAL-TIME OMETV MATCHMAKING & WEBRTC SIGNALING
    // ===============================================

    socket.on('match:search', (data: { country?: string; gender?: string; name?: string }) => {
      leaveCurrentMatch();

      const userName = data.name || userId;
      const userCountry = data.country || country || 'US';
      const userGender = data.gender || 'Any';

      // Check if another real user is waiting in queue
      const partnerIdx = waitingQueue.findIndex((u) => u.socketId !== socket.id);

      if (partnerIdx !== -1) {
        // Matched with real active online user!
        const partner = waitingQueue.splice(partnerIdx, 1)[0];
        const roomId = 'room_match_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

        socket.join(roomId);
        partner.socket.join(roomId);

        socket.data.roomId = roomId;
        partner.socket.data.roomId = roomId;

        // Emit match found to both peers
        socket.emit('match:found', {
          roomId,
          partnerId: partner.userId,
          partnerName: partner.name,
          partnerCountry: partner.country,
          partnerGender: partner.gender,
          isInitiator: true, // socket will create WebRTC offer
        });

        partner.socket.emit('match:found', {
          roomId,
          partnerId: userId,
          partnerName: userName,
          partnerCountry: userCountry,
          partnerGender: userGender,
          isInitiator: false, // partner will answer WebRTC offer
        });
      } else {
        // Queue this user
        waitingQueue.push({
          userId,
          socketId: socket.id,
          country: userCountry,
          gender: userGender,
          name: userName,
          socket,
        });

        socket.emit('match:waiting', {
          message: 'Searching for online users...',
          queueCount: waitingQueue.length,
        });
      }
    });

    socket.on('match:next', () => {
      leaveCurrentMatch();
    });

    socket.on('match:leave', () => {
      leaveCurrentMatch();
    });

    // Real-Time In-Call Text Chat
    socket.on('match:chat_message', (data: { roomId: string; text: string; senderName?: string }) => {
      if (!data.roomId || !data.text) return;
      const payload = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        senderId: userId,
        senderName: data.senderName || userId,
        text: data.text,
        timestamp: new Date().toISOString(),
      };
      io.to(data.roomId).emit('match:chat_message', payload);
    });

    // WebRTC Peer-to-Peer Video Signaling Relays
    socket.on('match:signal_offer', (data: { roomId: string; offer: any }) => {
      socket.to(data.roomId).emit('match:signal_offer', {
        offer: data.offer,
        senderId: userId,
      });
    });

    socket.on('match:signal_answer', (data: { roomId: string; answer: any }) => {
      socket.to(data.roomId).emit('match:signal_answer', {
        answer: data.answer,
        senderId: userId,
      });
    });

    socket.on('match:signal_ice', (data: { roomId: string; candidate: any }) => {
      socket.to(data.roomId).emit('match:signal_ice', {
        candidate: data.candidate,
        senderId: userId,
      });
    });

    // Real-time direct messaging with instant receiver notification
    socket.on('send_message', async (data: { receiverId?: string; channelId?: string; content: string; mediaUrl?: string }) => {
      if (!data.content) return;
      const msg = await db.messages.create({
        senderId: userId,
        receiverId: data.receiverId,
        channelId: data.channelId,
        content: data.content,
        mediaUrl: data.mediaUrl,
      });

      if (data.receiverId) {
        const senderUser = await db.users.findById(userId);
        const senderName = senderUser?.displayName || senderUser?.nickname || 'A user';

        const msgNotif = await db.notifications.create({
          id: 'notif_msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          userId: data.receiverId,
          title: `New message from ${senderName} 💬`,
          message: data.content.length > 70 ? data.content.substring(0, 70) + '...' : data.content,
          type: 'MESSAGE',
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        io.to(data.receiverId).emit('new_message', msg);
        io.to(data.receiverId).emit('notification:new', msgNotif);
      }
      socket.emit('message_sent', msg);
    });

    // Real-time friend request with instant notification
    socket.on('send_friend_request', async (data: { targetUserId: string }) => {
      try {
        const req = await db.friendRequests.send(userId, data.targetUserId);
        const senderUser = await db.users.findById(userId);
        const senderName = senderUser?.displayName || senderUser?.nickname || 'Someone';

        const frNotif = await db.notifications.create({
          id: 'notif_fr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          userId: data.targetUserId,
          title: `New Friend Request 👋`,
          message: `${senderName} sent you a friend request!`,
          type: 'FRIEND_REQUEST',
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        io.to(data.targetUserId).emit('new_friend_request', { senderId: userId, request: req });
        io.to(data.targetUserId).emit('notification:new', frNotif);
        socket.emit('friend_request_sent', { success: true, targetUserId: data.targetUserId });
      } catch (err: any) {
        socket.emit('friend_request_error', { error: err.message });
      }
    });

    // Accept friend request with instant notification back to requester
    socket.on('accept_friend_request', async (data: { requestId: string; targetUserId: string }) => {
      try {
        await db.friendRequests.accept(data.requestId, userId);
        const acceptingUser = await db.users.findById(userId);
        const acceptName = acceptingUser?.displayName || acceptingUser?.nickname || 'A user';

        const acceptNotif = await db.notifications.create({
          id: 'notif_fa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          userId: data.targetUserId,
          title: `Friend Request Accepted! 🎉`,
          message: `${acceptName} accepted your friend request. You are now friends!`,
          type: 'FRIEND_REQUEST',
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        io.to(data.targetUserId).emit('notification:new', acceptNotif);
        io.to(data.targetUserId).emit('friend_request_accepted', { userId, requestId: data.requestId });
        socket.emit('friend_request_accepted_success', { success: true });
      } catch (err: any) {
        socket.emit('friend_request_error', { error: err.message });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      leaveCurrentMatch();
      await PresenceService.removePresence(socket.id);
      const updatedStats = await PresenceService.getPresenceStats();
      io.emit('presence:update', updatedStats);
    });
  });
}
