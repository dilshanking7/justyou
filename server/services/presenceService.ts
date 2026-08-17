import { db } from '../database/db';

export class PresenceService {
  static async getPresenceStats() {
    const activePresences = await db.presences.findActive();
    const onlineCount = activePresences.length;
    const allUsers = await db.users.findMany();

    // Group active users by country
    const countryBreakdown: Record<string, number> = {};
    activePresences.forEach((p) => {
      const code = p.country || 'UNKNOWN';
      countryBreakdown[code] = (countryBreakdown[code] || 0) + 1;
    });

    return {
      activeUsersOnline: onlineCount,
      totalRegisteredUsers: allUsers.length,
      countryBreakdown,
      lastUpdated: new Date().toISOString(),
      statusMessage:
        onlineCount === 0
          ? 'No users are online yet.'
          : `${onlineCount} user${onlineCount === 1 ? '' : 's'} online right now.`,
    };
  }

  static async registerPresence(presence: {
    userId: string;
    socketId: string;
    deviceId?: string;
    country?: string;
    language?: string;
    timezone?: string;
    ipHash?: string;
    status?: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' | 'INVISIBLE';
  }) {
    return await db.presences.setPresence({
      id: 'pres_' + presence.socketId,
      userId: presence.userId,
      socketId: presence.socketId,
      status: presence.status || 'ONLINE',
      deviceId: presence.deviceId || null,
      country: presence.country || null,
      language: presence.language || null,
      timezone: presence.timezone || null,
      ipHash: presence.ipHash || null,
      connectedAt: new Date().toISOString(),
      lastPingAt: new Date().toISOString(),
    });
  }

  static async removePresence(socketId: string) {
    return await db.presences.removeBySocketId(socketId);
  }
}
