import {
  User,
  Profile,
  Session,
  RefreshToken,
  Device,
  UserSettings,
  Presence,
  BlockedUser,
  Report,
  Notification,
  Country,
  Language,
  Interest,
  OnlineStatusType,
} from '../types';
import { prisma } from './prisma';

// Seed initial countries, languages, and default interests if empty
const DEFAULT_COUNTRIES: Country[] = [
  { id: 'c-us', code: 'US', name: 'United States', flag: '🇺🇸' },
  { id: 'c-gb', code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'c-ca', code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { id: 'c-de', code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { id: 'c-fr', code: 'FR', name: 'France', flag: '🇫🇷' },
  { id: 'c-es', code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { id: 'c-jp', code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { id: 'c-br', code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { id: 'c-in', code: 'IN', name: 'India', flag: '🇮🇳' },
  { id: 'c-au', code: 'AU', name: 'Australia', flag: '🇦🇺' },
];

const DEFAULT_LANGUAGES: Language[] = [
  { id: 'l-en', code: 'en', name: 'English', nativeName: 'English' },
  { id: 'l-es', code: 'es', name: 'Spanish', nativeName: 'Español' },
  { id: 'l-fr', code: 'fr', name: 'French', nativeName: 'Français' },
  { id: 'l-de', code: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'l-ja', code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { id: 'l-pt', code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { id: 'l-zh', code: 'zh', name: 'Chinese', nativeName: '中文' },
];

const DEFAULT_INTERESTS: Interest[] = [
  { id: 'i-tech', name: 'Technology & AI', category: 'Tech' },
  { id: 'i-music', name: 'Music & Podcasts', category: 'Arts' },
  { id: 'i-gaming', name: 'Video Games', category: 'Gaming' },
  { id: 'i-travel', name: 'Travel & Culture', category: 'Lifestyle' },
  { id: 'i-lang', name: 'Language Exchange', category: 'Education' },
  { id: 'i-cinema', name: 'Movies & Series', category: 'Arts' },
  { id: 'i-sports', name: 'Fitness & Sports', category: 'Health' },
  { id: 'i-books', name: 'Reading & Writing', category: 'Education' },
];

class DatabaseService {
  private inMemory = {
    users: new Map<string, User>(),
    profiles: new Map<string, Profile>(), // userId -> Profile
    sessions: new Map<string, Session>(),
    refreshTokens: new Map<string, RefreshToken>(),
    devices: new Map<string, Device>(),
    userSettings: new Map<string, UserSettings>(),
    presences: new Map<string, Presence>(), // socketId -> Presence
    blockedUsers: new Map<string, BlockedUser>(),
    reports: new Map<string, Report>(),
    notifications: new Map<string, Notification>(),
    friendRequests: new Map<string, any>(),
    friendships: new Map<string, any>(),
    messages: new Map<string, any>(),
    aiDetections: new Map<string, any>(),
    countries: new Map<string, Country>(DEFAULT_COUNTRIES.map((c) => [c.id, c])),
    languages: new Map<string, Language>(DEFAULT_LANGUAGES.map((l) => [l.id, l])),
    interests: new Map<string, Interest>(DEFAULT_INTERESTS.map((i) => [i.id, i])),
  };

  private isPrismaConnected = false;

  constructor() {
    this.checkPrismaConnection();
  }

  private async checkPrismaConnection() {
    try {
      await prisma.$connect();
      this.isPrismaConnected = true;
      console.log('[Database] Connected to Prisma ORM / PostgreSQL.');
    } catch {
      this.isPrismaConnected = false;
      console.log('[Database] Using high-performance in-memory persistence layer with Prisma compatibility.');
    }
  }

  // --- USER OPERATIONS ---
  get users() {
    return {
      findMany: async (): Promise<User[]> => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.user.findMany({
              include: { profile: { include: { country: true, language: true, secondLanguage: true, interests: true } }, settings: true },
            });
            return raw.map(this.formatUserFromPrisma);
          } catch {
            // Fallback
          }
        }
        return Array.from(this.inMemory.users.values());
      },

      findById: async (id: string): Promise<User | null> => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.user.findUnique({
              where: { id },
              include: { profile: { include: { country: true, language: true, secondLanguage: true, interests: true } }, settings: true },
            });
            if (raw) return this.formatUserFromPrisma(raw);
          } catch {
            // Fallback
          }
        }
        return this.inMemory.users.get(id) || null;
      },

      findByEmail: async (email: string): Promise<User | null> => {
        const lower = email.toLowerCase();
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.user.findFirst({
              where: { email: { equals: lower, mode: 'insensitive' } },
              include: { profile: { include: { country: true, language: true, secondLanguage: true, interests: true } }, settings: true },
            });
            if (raw) return this.formatUserFromPrisma(raw);
          } catch {
            // Fallback
          }
        }
        return Array.from(this.inMemory.users.values()).find((u) => u.email?.toLowerCase() === lower) || null;
      },

      findByUsername: async (username: string): Promise<User | null> => {
        const lower = username.toLowerCase();
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.user.findFirst({
              where: { username: { equals: lower, mode: 'insensitive' } },
              include: { profile: { include: { country: true, language: true, secondLanguage: true, interests: true } }, settings: true },
            });
            if (raw) return this.formatUserFromPrisma(raw);
          } catch {
            // Fallback
          }
        }
        return Array.from(this.inMemory.users.values()).find((u) => u.username?.toLowerCase() === lower) || null;
      },

      create: async (user: User): Promise<User> => {
        this.inMemory.users.set(user.id, user);

        // Ensure default settings and profile exist
        if (!this.inMemory.userSettings.has(user.id)) {
          this.inMemory.userSettings.set(user.id, {
            id: `set-${user.id}`,
            userId: user.id,
            whoCanMessage: 'EVERYONE',
            whoCanCall: 'EVERYONE',
            showOnlineStatus: true,
            showAge: true,
            showCountry: true,
            showLanguage: true,
            allowTranslation: true,
            autoPlayVoice: false,
            autoPlayVideo: false,
            darkMode: true,
            emailNotifications: true,
            pushNotifications: true,
            messageNotifications: true,
            marketingNotifications: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        if (!this.inMemory.profiles.has(user.id)) {
          this.inMemory.profiles.set(user.id, {
            id: `prof-${user.id}`,
            userId: user.id,
            photo: user.avatar || null,
            bio: null,
            age: null,
            gender: null,
            countryId: null,
            city: null,
            languageId: null,
            secondLanguageId: null,
            interests: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        if (this.isPrismaConnected) {
          try {
            await prisma.user.create({
              data: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                passwordHash: user.passwordHash,
                isGuest: user.isGuest,
                isVerified: user.isVerified ?? false,
                isPremium: user.isPremium ?? false,
                role: user.role,
                onlineStatus: (user.onlineStatus as any) || 'OFFLINE',
                profile: {
                  create: {
                    photo: user.avatar || null,
                  },
                },
                settings: {
                  create: {},
                },
              },
            });
          } catch {
            // Fallback
          }
        }
        return user;
      },

      update: async (id: string, updates: Partial<User>): Promise<User | null> => {
        const existing = this.inMemory.users.get(id);
        if (!existing) return null;

        const updated: User = {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        this.inMemory.users.set(id, updated);

        if (this.isPrismaConnected) {
          try {
            await prisma.user.update({
              where: { id },
              data: {
                username: updates.username !== undefined ? updates.username : undefined,
                displayName: updates.displayName !== undefined ? updates.displayName : undefined,
                email: updates.email !== undefined ? updates.email : undefined,
                isGuest: updates.isGuest !== undefined ? updates.isGuest : undefined,
                isVerified: updates.isVerified !== undefined ? updates.isVerified : undefined,
                isPremium: updates.isPremium !== undefined ? updates.isPremium : undefined,
                onlineStatus: updates.onlineStatus ? (updates.onlineStatus as any) : undefined,
                lastSeen: updates.lastSeen ? new Date(updates.lastSeen) : undefined,
              },
            });
          } catch {
            // Fallback
          }
        }
        return updated;
      },

      delete: async (id: string): Promise<void> => {
        this.inMemory.users.delete(id);
        this.inMemory.profiles.delete(id);
        this.inMemory.userSettings.delete(id);

        if (this.isPrismaConnected) {
          try {
            await prisma.user.delete({ where: { id } });
          } catch {
            // Fallback
          }
        }
      },
    };
  }

  // --- PROFILE OPERATIONS ---
  get profiles() {
    return {
      findByUserId: async (userId: string): Promise<Profile | null> => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.profile.findUnique({
              where: { userId },
              include: { country: true, language: true, secondLanguage: true, interests: true },
            });
            if (raw) return this.formatProfileFromPrisma(raw);
          } catch {
            // Fallback
          }
        }
        return this.inMemory.profiles.get(userId) || null;
      },

      upsert: async (profile: Profile): Promise<Profile> => {
        this.inMemory.profiles.set(profile.userId, profile);

        // Also sync User.avatar and User.country if available
        const user = this.inMemory.users.get(profile.userId);
        if (user) {
          user.avatar = profile.photo || user.avatar;
          user.displayName = profile.userId ? (user.displayName || user.nickname) : user.displayName;
          this.inMemory.users.set(profile.userId, user);
        }

        if (this.isPrismaConnected) {
          try {
            await prisma.profile.upsert({
              where: { userId: profile.userId },
              update: {
                photo: profile.photo,
                bio: profile.bio,
                age: profile.age,
                gender: profile.gender,
                countryId: profile.countryId,
                city: profile.city,
                languageId: profile.languageId,
                secondLanguageId: profile.secondLanguageId,
              },
              create: {
                id: profile.id,
                userId: profile.userId,
                photo: profile.photo,
                bio: profile.bio,
                age: profile.age,
                gender: profile.gender,
                countryId: profile.countryId,
                city: profile.city,
                languageId: profile.languageId,
                secondLanguageId: profile.secondLanguageId,
              },
            });
          } catch {
            // Fallback
          }
        }
        return profile;
      },
    };
  }

  // --- SESSIONS & REFRESH TOKENS ---
  get sessions() {
    return {
      create: async (session: Session): Promise<Session> => {
        this.inMemory.sessions.set(session.id, session);
        if (session.refreshToken) {
          this.inMemory.refreshTokens.set(session.id, {
            id: session.id,
            userId: session.userId,
            token: session.refreshToken,
            revoked: false,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
          });
        }
        if (this.isPrismaConnected) {
          try {
            await prisma.session.create({
              data: {
                id: session.id,
                userId: session.userId,
                token: session.token || session.refreshToken || session.id,
                ipAddress: session.ipAddress,
                ipHash: session.ipHash,
                userAgent: session.userAgent,
                expiresAt: new Date(session.expiresAt),
              },
            });
          } catch {
            // Fallback
          }
        }
        return session;
      },

      findByRefreshToken: async (token: string): Promise<Session | null> => {
        for (const sess of this.inMemory.sessions.values()) {
          if (sess.refreshToken === token || sess.token === token) return sess;
        }
        return null;
      },

      deleteByUserId: async (userId: string): Promise<void> => {
        for (const [id, sess] of this.inMemory.sessions.entries()) {
          if (sess.userId === userId) {
            this.inMemory.sessions.delete(id);
          }
        }
      },

      deleteByToken: async (token: string): Promise<void> => {
        for (const [id, sess] of this.inMemory.sessions.entries()) {
          if (sess.refreshToken === token || sess.token === token) {
            this.inMemory.sessions.delete(id);
          }
        }
      },
    };
  }

  // --- DEVICE OPERATIONS ---
  get devices() {
    return {
      createOrUpdate: async (device: Device): Promise<Device> => {
        const key = `${device.userId}-${device.ipHash}`;
        this.inMemory.devices.set(key, device);

        if (this.isPrismaConnected) {
          try {
            await prisma.device.create({
              data: {
                id: device.id,
                userId: device.userId,
                deviceType: device.deviceType,
                browser: device.browser,
                os: device.os,
                ipHash: device.ipHash,
                country: device.country,
                language: device.language,
                timezone: device.timezone,
              },
            });
          } catch {
            // Fallback
          }
        }
        return device;
      },

      findByUserId: async (userId: string): Promise<Device[]> => {
        return Array.from(this.inMemory.devices.values()).filter((d) => d.userId === userId);
      },
    };
  }

  // --- USER SETTINGS OPERATIONS ---
  get userSettings() {
    return {
      findByUserId: async (userId: string): Promise<UserSettings | null> => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.userSettings.findUnique({ where: { userId } });
            if (raw) return this.formatSettingsFromPrisma(raw);
          } catch {
            // Fallback
          }
        }
        return this.inMemory.userSettings.get(userId) || null;
      },

      upsert: async (settings: UserSettings): Promise<UserSettings> => {
        const existing = this.inMemory.userSettings.get(settings.userId);
        const merged: UserSettings = {
          ...existing,
          ...settings,
          updatedAt: new Date().toISOString(),
        };
        this.inMemory.userSettings.set(settings.userId, merged);

        if (this.isPrismaConnected) {
          try {
            await prisma.userSettings.upsert({
              where: { userId: settings.userId },
              update: {
                whoCanMessage: settings.whoCanMessage as any,
                whoCanCall: settings.whoCanCall as any,
                showOnlineStatus: settings.showOnlineStatus,
                showAge: settings.showAge,
                showCountry: settings.showCountry,
                showLanguage: settings.showLanguage,
                allowTranslation: settings.allowTranslation,
                autoPlayVoice: settings.autoPlayVoice,
                autoPlayVideo: settings.autoPlayVideo,
                darkMode: settings.darkMode,
                emailNotifications: settings.emailNotifications,
                pushNotifications: settings.pushNotifications,
                messageNotifications: settings.messageNotifications,
                marketingNotifications: settings.marketingNotifications,
              },
              create: {
                id: settings.id,
                userId: settings.userId,
                whoCanMessage: settings.whoCanMessage as any,
                whoCanCall: settings.whoCanCall as any,
                showOnlineStatus: settings.showOnlineStatus,
                showAge: settings.showAge,
                showCountry: settings.showCountry,
                showLanguage: settings.showLanguage,
                allowTranslation: settings.allowTranslation,
                autoPlayVoice: settings.autoPlayVoice,
                autoPlayVideo: settings.autoPlayVideo,
                darkMode: settings.darkMode,
                emailNotifications: settings.emailNotifications,
                pushNotifications: settings.pushNotifications,
                messageNotifications: settings.messageNotifications,
                marketingNotifications: settings.marketingNotifications,
              },
            });
          } catch {
            // Fallback
          }
        }
        return merged;
      },
    };
  }

  // --- PRESENCE & REAL-TIME STATUS OPERATIONS ---
  get presences() {
    return {
      findMany: async (): Promise<Presence[]> => {
        return Array.from(this.inMemory.presences.values());
      },

      findActive: async (): Promise<Presence[]> => {
        return Array.from(this.inMemory.presences.values()).filter((p) => p.status === 'ONLINE');
      },

      findBySocketId: async (socketId: string): Promise<Presence | null> => {
        return this.inMemory.presences.get(socketId) || null;
      },

      findByUserId: async (userId: string): Promise<Presence[]> => {
        return Array.from(this.inMemory.presences.values()).filter((p) => p.userId === userId);
      },

      setPresence: async (presence: Presence): Promise<Presence> => {
        this.inMemory.presences.set(presence.socketId, presence);

        // Automatically update User.onlineStatus and lastSeen
        const user = this.inMemory.users.get(presence.userId);
        if (user) {
          user.onlineStatus = presence.status;
          user.lastSeen = new Date().toISOString();
          this.inMemory.users.set(user.id, user);
        }

        if (this.isPrismaConnected) {
          try {
            await prisma.presence.upsert({
              where: { socketId: presence.socketId },
              update: {
                status: presence.status,
                lastPingAt: new Date(),
              },
              create: {
                id: presence.id,
                userId: presence.userId,
                socketId: presence.socketId,
                status: presence.status,
                country: presence.country,
                language: presence.language,
                timezone: presence.timezone,
                ipHash: presence.ipHash,
              },
            });

            await prisma.user.update({
              where: { id: presence.userId },
              data: {
                onlineStatus: presence.status as any,
                lastSeen: new Date(),
              },
            });
          } catch {
            // Fallback
          }
        }
        return presence;
      },

      removeBySocketId: async (socketId: string): Promise<Presence | null> => {
        const existing = this.inMemory.presences.get(socketId);
        if (existing) {
          this.inMemory.presences.delete(socketId);

          // Check if user has other active connections
          const remainingUserPresences = Array.from(this.inMemory.presences.values()).filter(
            (p) => p.userId === existing.userId && p.status === 'ONLINE'
          );

          if (remainingUserPresences.length === 0) {
            const user = this.inMemory.users.get(existing.userId);
            if (user) {
              user.onlineStatus = 'OFFLINE';
              user.lastSeen = new Date().toISOString();
              this.inMemory.users.set(user.id, user);
            }
          }
        }

        if (this.isPrismaConnected) {
          try {
            await prisma.presence.delete({ where: { socketId } }).catch(() => {});
          } catch {
            // Fallback
          }
        }
        return existing || null;
      },

      countOnline: async (): Promise<number> => {
        const uniqueUserIds = new Set(
          Array.from(this.inMemory.presences.values())
            .filter((p) => p.status === 'ONLINE')
            .map((p) => p.userId)
        );
        return uniqueUserIds.size;
      },

      updateUserOnlineStatus: async (userId: string, status: OnlineStatusType): Promise<User | null> => {
        const user = this.inMemory.users.get(userId);
        if (!user) return null;

        user.onlineStatus = status;
        user.lastSeen = new Date().toISOString();
        this.inMemory.users.set(userId, user);

        // Update all presence socket records for this user
        for (const p of this.inMemory.presences.values()) {
          if (p.userId === userId) {
            p.status = status;
            p.lastPingAt = new Date().toISOString();
          }
        }

        if (this.isPrismaConnected) {
          try {
            await prisma.user.update({
              where: { id: userId },
              data: {
                onlineStatus: status as any,
                lastSeen: new Date(),
              },
            });
          } catch {
            // Fallback
          }
        }
        return user;
      },
    };
  }

  // --- BLOCKED USERS & REPORTS ---
  get blockedUsers() {
    return {
      create: async (blockerId: string, blockedId: string, reason?: string): Promise<BlockedUser> => {
        const item: BlockedUser = {
          id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          blockerId,
          blockedId,
          reason: reason || null,
          createdAt: new Date().toISOString(),
        };
        this.inMemory.blockedUsers.set(item.id, item);
        return item;
      },

      remove: async (blockerId: string, blockedId: string): Promise<void> => {
        for (const [id, item] of this.inMemory.blockedUsers.entries()) {
          if (item.blockerId === blockerId && item.blockedId === blockedId) {
            this.inMemory.blockedUsers.delete(id);
          }
        }
      },

      findByBlockerId: async (blockerId: string): Promise<BlockedUser[]> => {
        return Array.from(this.inMemory.blockedUsers.values()).filter((b) => b.blockerId === blockerId);
      },

      isBlocked: async (blockerId: string, targetId: string): Promise<boolean> => {
        return Array.from(this.inMemory.blockedUsers.values()).some(
          (b) => (b.blockerId === blockerId && b.blockedId === targetId) || (b.blockerId === targetId && b.blockedId === blockerId)
        );
      },
    };
  }

  get reports() {
    return {
      create: async (reporterId: string, reportedId: string, reason: string): Promise<Report> => {
        const item: Report = {
          id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          reporterId,
          reportedId,
          reason,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        this.inMemory.reports.set(item.id, item);
        return item;
      },

      findMany: async (): Promise<Report[]> => {
        return Array.from(this.inMemory.reports.values());
      },
    };
  }

  // --- NOTIFICATIONS ---
  get notifications() {
    return {
      findByUserId: async (userId: string): Promise<Notification[]> => {
        return Array.from(this.inMemory.notifications.values()).filter((n) => n.userId === userId);
      },

      create: async (notif: Notification): Promise<Notification> => {
        this.inMemory.notifications.set(notif.id, notif);
        return notif;
      },

      markAsRead: async (id: string, userId: string): Promise<void> => {
        const notif = this.inMemory.notifications.get(id);
        if (notif && notif.userId === userId) {
          notif.isRead = true;
          this.inMemory.notifications.set(id, notif);
        }
      },
    };
  }

  // --- REFERENCE METADATA: COUNTRIES, LANGUAGES, INTERESTS ---
  get countries() {
    return {
      findMany: async (): Promise<Country[]> => {
        return Array.from(this.inMemory.countries.values());
      },
    };
  }

  get languages() {
    return {
      findMany: async (): Promise<Language[]> => {
        return Array.from(this.inMemory.languages.values());
      },
    };
  }

  get interests() {
    return {
      findMany: async (): Promise<Interest[]> => {
        return Array.from(this.inMemory.interests.values());
      },
    };
  }

  // --- FRIEND REQUEST OPERATIONS ---
  get friendRequests() {
    return {
      send: async (senderId: string, receiverId: string) => {
        if (senderId === receiverId) throw new Error('Cannot send friend request to yourself');
        if (this.isPrismaConnected) {
          try {
            return await prisma.friendRequest.upsert({
              where: { senderId_receiverId: { senderId, receiverId } },
              update: { status: 'PENDING' },
              create: { senderId, receiverId, status: 'PENDING' },
            });
          } catch (e) {
            // fallback
          }
        }
        const id = `fr_${senderId}_${receiverId}`;
        const request = { id, senderId, receiverId, status: 'PENDING', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        this.inMemory.friendRequests.set(id, request);
        return request;
      },
      accept: async (requestId: string, userId: string) => {
        if (this.isPrismaConnected) {
          try {
            const req = await prisma.friendRequest.findUnique({ where: { id: requestId } });
            if (!req || req.receiverId !== userId) throw new Error('Friend request not found or unauthorized');
            await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } });
            await prisma.friendship.upsert({
              where: { userId_friendId: { userId: req.senderId, friendId: req.receiverId } },
              update: {},
              create: { userId: req.senderId, friendId: req.receiverId },
            });
            await prisma.friendship.upsert({
              where: { userId_friendId: { userId: req.receiverId, friendId: req.senderId } },
              update: {},
              create: { userId: req.receiverId, friendId: req.senderId },
            });
            return { success: true };
          } catch (e) {
            // fallback
          }
        }
        const req = this.inMemory.friendRequests.get(requestId);
        if (!req || req.receiverId !== userId) throw new Error('Friend request not found or unauthorized');
        req.status = 'ACCEPTED';
        const f1Key = `${req.senderId}_${req.receiverId}`;
        const f2Key = `${req.receiverId}_${req.senderId}`;
        this.inMemory.friendships.set(f1Key, { id: f1Key, userId: req.senderId, friendId: req.receiverId, createdAt: new Date().toISOString() });
        this.inMemory.friendships.set(f2Key, { id: f2Key, userId: req.receiverId, friendId: req.senderId, createdAt: new Date().toISOString() });
        return { success: true };
      },
      reject: async (requestId: string, userId: string) => {
        if (this.isPrismaConnected) {
          try {
            await prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
            return { success: true };
          } catch (e) {}
        }
        const req = this.inMemory.friendRequests.get(requestId);
        if (req) req.status = 'REJECTED';
        return { success: true };
      },
      findPendingByUserId: async (userId: string) => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.friendRequest.findMany({
              where: { receiverId: userId, status: 'PENDING' },
              include: { sender: { include: { profile: true } } },
            });
            return raw.map((r) => ({
              id: r.id,
              senderId: r.senderId,
              receiverId: r.receiverId,
              status: r.status,
              createdAt: r.createdAt.toISOString(),
              sender: {
                id: r.sender.id,
                displayName: r.sender.displayName || r.sender.username || 'User',
                username: r.sender.username,
                avatar: r.sender.profile?.photo || `https://api.dicebear.com/7.x/identicon/svg?seed=${r.sender.id}`,
              },
            }));
          } catch (e) {}
        }
        const list = Array.from(this.inMemory.friendRequests.values()).filter(
          (r) => r.receiverId === userId && r.status === 'PENDING'
        );
        return Promise.all(
          list.map(async (r) => {
            const sender = await this.users.findById(r.senderId);
            return {
              ...r,
              sender: {
                id: sender?.id || r.senderId,
                displayName: sender?.displayName || sender?.nickname || 'User',
                username: sender?.username,
                avatar: sender?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${r.senderId}`,
              },
            };
          })
        );
      },
      findStatus: async (userId: string, targetUserId: string) => {
        if (this.isPrismaConnected) {
          try {
            const friendship = await prisma.friendship.findUnique({
              where: { userId_friendId: { userId, friendId: targetUserId } },
            });
            if (friendship) return 'FRIENDS';
            const sent = await prisma.friendRequest.findFirst({
              where: { senderId: userId, receiverId: targetUserId },
            });
            if (sent) return sent.status;
            const received = await prisma.friendRequest.findFirst({
              where: { senderId: targetUserId, receiverId: userId },
            });
            if (received) return received.status === 'PENDING' ? 'PENDING_RECEIVED' : received.status;
            return 'NONE';
          } catch (e) {}
        }
        const fKey = `${userId}_${targetUserId}`;
        if (this.inMemory.friendships.has(fKey)) return 'FRIENDS';
        const req = Array.from(this.inMemory.friendRequests.values()).find(
          (r) => (r.senderId === userId && r.receiverId === targetUserId) || (r.senderId === targetUserId && r.receiverId === userId)
        );
        if (!req) return 'NONE';
        if (req.senderId === userId) return req.status;
        return req.status === 'PENDING' ? 'PENDING_RECEIVED' : req.status;
      },
    };
  }

  // --- FRIENDSHIP OPERATIONS ---
  get friendships() {
    return {
      getUserFriends: async (userId: string) => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.friendship.findMany({
              where: { userId },
              include: { friend: { include: { profile: true } } },
            });
            return raw.map((f) => ({
              id: f.friend.id,
              displayName: f.friend.displayName || f.friend.username || 'User',
              username: f.friend.username,
              avatar: f.friend.profile?.photo || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.friend.id}`,
              onlineStatus: f.friend.onlineStatus,
            }));
          } catch (e) {}
        }
        const list = Array.from(this.inMemory.friendships.values()).filter((f) => f.userId === userId);
        return Promise.all(
          list.map(async (f) => {
            const friend = await this.users.findById(f.friendId);
            return {
              id: friend?.id || f.friendId,
              displayName: friend?.displayName || friend?.nickname || 'User',
              username: friend?.username,
              avatar: friend?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.friendId}`,
              onlineStatus: friend?.onlineStatus || 'OFFLINE',
            };
          })
        );
      },
      removeFriend: async (userId: string, friendId: string) => {
        if (this.isPrismaConnected) {
          try {
            await prisma.friendship.deleteMany({
              where: {
                OR: [
                  { userId, friendId },
                  { userId: friendId, friendId: userId },
                ],
              },
            });
            return { success: true };
          } catch (e) {}
        }
        this.inMemory.friendships.delete(`${userId}_${friendId}`);
        this.inMemory.friendships.delete(`${friendId}_${userId}`);
        return { success: true };
      },
    };
  }

  // --- MESSAGE OPERATIONS ---
  get messages() {
    return {
      create: async (msg: { senderId: string; receiverId?: string; channelId?: string; content: string; mediaUrl?: string }) => {
        if (this.isPrismaConnected) {
          try {
            const created = await prisma.message.create({
              data: {
                senderId: msg.senderId,
                receiverId: msg.receiverId || null,
                channelId: msg.channelId || null,
                content: msg.content,
                mediaUrl: msg.mediaUrl || null,
              },
            });
            return {
              id: created.id,
              senderId: created.senderId,
              receiverId: created.receiverId,
              channelId: created.channelId,
              content: created.content,
              mediaUrl: created.mediaUrl,
              createdAt: created.createdAt.toISOString(),
            };
          } catch (e) {}
        }
        const id = 'msg_' + Math.random().toString(36).substring(2, 10);
        const record = {
          id,
          senderId: msg.senderId,
          receiverId: msg.receiverId || null,
          channelId: msg.channelId || null,
          content: msg.content,
          mediaUrl: msg.mediaUrl || null,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        this.inMemory.messages.set(id, record);
        return record;
      },
      getConversation: async (userId: string, targetUserId: string) => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.message.findMany({
              where: {
                OR: [
                  { senderId: userId, receiverId: targetUserId },
                  { senderId: targetUserId, receiverId: userId },
                ],
              },
              orderBy: { createdAt: 'asc' },
              take: 100,
            });
            return raw.map((m) => ({
              id: m.id,
              senderId: m.senderId,
              receiverId: m.receiverId,
              channelId: m.channelId,
              content: m.content,
              mediaUrl: m.mediaUrl,
              createdAt: m.createdAt.toISOString(),
            }));
          } catch (e) {}
        }
        return Array.from(this.inMemory.messages.values())
          .filter(
            (m) =>
              (m.senderId === userId && m.receiverId === targetUserId) ||
              (m.senderId === targetUserId && m.receiverId === userId)
          )
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },
      getRecentChats: async (userId: string) => {
        const msgs = this.isPrismaConnected
          ? (
              await prisma.message.findMany({
                where: { OR: [{ senderId: userId }, { receiverId: userId }] },
                orderBy: { createdAt: 'desc' },
                take: 100,
              })
            ).map((m) => ({
              id: m.id,
              senderId: m.senderId,
              receiverId: m.receiverId,
              content: m.content,
              createdAt: m.createdAt.toISOString(),
            }))
          : Array.from(this.inMemory.messages.values())
              .filter((m) => m.senderId === userId || m.receiverId === userId)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const partnerMap = new Map<string, any>();
        for (const m of msgs) {
          const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
          if (partnerId && !partnerMap.has(partnerId)) {
            partnerMap.set(partnerId, m);
          }
        }
        const recentList = [];
        for (const [partnerId, lastMsg] of partnerMap.entries()) {
          const partner = await this.users.findById(partnerId);
          recentList.push({
            partnerId,
            displayName: partner?.displayName || partner?.nickname || 'User',
            avatar: partner?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${partnerId}`,
            lastMessage: lastMsg.content,
            updatedAt: lastMsg.createdAt,
          });
        }
        return recentList;
      },
    };
  }

  // --- AI DETECTION LOG OPERATIONS ---
  get aiDetections() {
    return {
      create: async (data: { userId: string; detectionType: string; resultJson: string; imageUrl?: string }) => {
        if (this.isPrismaConnected) {
          try {
            const created = await prisma.aiDetectionLog.create({
              data: {
                userId: data.userId,
                detectionType: data.detectionType,
                resultJson: data.resultJson,
                imageUrl: data.imageUrl || null,
              },
            });
            return {
              id: created.id,
              userId: created.userId,
              detectionType: created.detectionType,
              resultJson: JSON.parse(created.resultJson),
              imageUrl: created.imageUrl,
              createdAt: created.createdAt.toISOString(),
            };
          } catch (e) {}
        }
        const id = 'aid_' + Math.random().toString(36).substring(2, 10);
        const record = {
          id,
          userId: data.userId,
          detectionType: data.detectionType,
          resultJson: JSON.parse(data.resultJson),
          imageUrl: data.imageUrl || null,
          createdAt: new Date().toISOString(),
        };
        this.inMemory.aiDetections.set(id, record);
        return record;
      },
      getByUserId: async (userId: string) => {
        if (this.isPrismaConnected) {
          try {
            const raw = await prisma.aiDetectionLog.findMany({
              where: { userId },
              orderBy: { createdAt: 'desc' },
              take: 20,
            });
            return raw.map((r) => ({
              id: r.id,
              userId: r.userId,
              detectionType: r.detectionType,
              resultJson: JSON.parse(r.resultJson),
              imageUrl: r.imageUrl,
              createdAt: r.createdAt.toISOString(),
            }));
          } catch (e) {}
        }
        return Array.from(this.inMemory.aiDetections.values())
          .filter((d) => d.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
    };
  }

  // --- PRIVATE HELPER FORMATTERS ---
  private formatUserFromPrisma(raw: any): User {
    const profile = raw.profile ? this.formatProfileFromPrisma(raw.profile) : null;
    return {
      id: raw.id,
      username: raw.username,
      displayName: raw.displayName,
      nickname: raw.displayName || raw.username || 'User',
      email: raw.email,
      passwordHash: raw.passwordHash,
      isGuest: raw.isGuest,
      isVerified: raw.isVerified ?? false,
      isPremium: raw.isPremium ?? false,
      role: raw.role,
      onlineStatus: (raw.onlineStatus as OnlineStatusType) || 'OFFLINE',
      lastSeen: raw.lastSeen ? new Date(raw.lastSeen).toISOString() : new Date().toISOString(),
      createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString(),
      avatar: profile?.photo || undefined,
      profile,
      settings: raw.settings ? this.formatSettingsFromPrisma(raw.settings) : null,
    };
  }

  private formatProfileFromPrisma(raw: any): Profile {
    return {
      id: raw.id,
      userId: raw.userId,
      photo: raw.photo,
      bio: raw.bio,
      age: raw.age,
      gender: raw.gender,
      countryId: raw.countryId,
      country: raw.country ? { id: raw.country.id, code: raw.country.code, name: raw.country.name, flag: raw.country.flag } : null,
      city: raw.city,
      languageId: raw.languageId,
      language: raw.language ? { id: raw.language.id, code: raw.language.code, name: raw.language.name, nativeName: raw.language.nativeName } : null,
      secondLanguageId: raw.secondLanguageId,
      secondLanguage: raw.secondLanguage ? { id: raw.secondLanguage.id, code: raw.secondLanguage.code, name: raw.secondLanguage.name, nativeName: raw.secondLanguage.nativeName } : null,
      interests: raw.interests ? raw.interests.map((i: any) => ({ id: i.id, name: i.name, category: i.category })) : [],
      createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  private formatSettingsFromPrisma(raw: any): UserSettings {
    return {
      id: raw.id,
      userId: raw.userId,
      whoCanMessage: raw.whoCanMessage || 'EVERYONE',
      whoCanCall: raw.whoCanCall || 'EVERYONE',
      showOnlineStatus: raw.showOnlineStatus ?? true,
      showAge: raw.showAge ?? true,
      showCountry: raw.showCountry ?? true,
      showLanguage: raw.showLanguage ?? true,
      allowTranslation: raw.allowTranslation ?? true,
      autoPlayVoice: raw.autoPlayVoice ?? false,
      autoPlayVideo: raw.autoPlayVideo ?? false,
      darkMode: raw.darkMode ?? true,
      emailNotifications: raw.emailNotifications ?? true,
      pushNotifications: raw.pushNotifications ?? true,
      messageNotifications: raw.messageNotifications ?? true,
      marketingNotifications: raw.marketingNotifications ?? false,
      createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString(),
    };
  }
}

export const db = new DatabaseService();
