import { db } from '../database/db';
import { hashPassword, comparePassword, hashIp } from '../utils/hash';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { User, Session, Device, UserSettings } from '../types';

export class AuthService {
  static async guestLogin(meta: {
    ip: string;
    userAgent: string;
    country: string;
    language: string;
    timezone: string;
    browser: string;
    os: string;
    deviceType: string;
    nickname?: string;
  }) {
    const userId = 'guest_' + Math.random().toString(36).substring(2, 10);
    const ipHash = hashIp(meta.ip);
    const displayNickname = meta.nickname || `Guest-${userId.substring(6, 10)}`;

    const user: User = {
      id: userId,
      username: null,
      displayName: displayNickname,
      email: null,
      passwordHash: null,
      isGuest: true,
      isVerified: false,
      isPremium: false,
      role: 'GUEST',
      onlineStatus: 'ONLINE',
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nickname: displayNickname,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${userId}`,
      country: meta.country,
      language: meta.language,
      timezone: meta.timezone,
    };

    await db.users.create(user);

    // Initial User Settings
    const settings: UserSettings = {
      id: 'sett_' + userId,
      userId,
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
      theme: 'dark',
      notificationsEnabled: true,
      cameraEnabled: true,
      micEnabled: true,
      preferredLanguage: meta.language,
      preferredGender: 'ANY',
    };
    await db.userSettings.upsert(settings);

    // Track Device
    const device: Device = {
      id: 'dev_' + userId,
      userId,
      deviceType: meta.deviceType,
      browser: meta.browser,
      os: meta.os,
      ipHash,
      country: meta.country,
      language: meta.language,
      timezone: meta.timezone,
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.devices.createOrUpdate(device);

    const tokens = generateTokens({
      userId: user.id,
      isGuest: true,
      role: user.role,
    });

    // Create Session
    const session: Session = {
      id: 'sess_' + Math.random().toString(36).substring(2, 10),
      userId: user.id,
      token: tokens.refreshToken,
      refreshToken: tokens.refreshToken,
      ipAddress: meta.ip || null,
      ipHash,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.sessions.create(session);

    return { user, tokens, settings };
  }

  static async register(
    data: { email: string; password: string; nickname?: string },
    meta: {
      ip: string;
      userAgent: string;
      country: string;
      language: string;
      timezone: string;
      browser: string;
      os: string;
      deviceType: string;
    }
  ) {
    const existing = await db.users.findByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 10);
    const passwordHash = await hashPassword(data.password);
    const ipHash = hashIp(meta.ip);
    const nickname = data.nickname || data.email.split('@')[0];

    const user: User = {
      id: userId,
      username: nickname.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      displayName: nickname,
      email: data.email,
      passwordHash,
      isGuest: false,
      isVerified: false,
      isPremium: false,
      role: 'USER',
      onlineStatus: 'ONLINE',
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nickname,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
      country: meta.country,
      language: meta.language,
      timezone: meta.timezone,
    };

    await db.users.create(user);

    const settings: UserSettings = {
      id: 'sett_' + userId,
      userId,
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
      theme: 'dark',
      notificationsEnabled: true,
      cameraEnabled: true,
      micEnabled: true,
      preferredLanguage: meta.language,
      preferredGender: 'ANY',
    };
    await db.userSettings.upsert(settings);

    const device: Device = {
      id: 'dev_' + userId,
      userId,
      deviceType: meta.deviceType,
      browser: meta.browser,
      os: meta.os,
      ipHash,
      country: meta.country,
      language: meta.language,
      timezone: meta.timezone,
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.devices.createOrUpdate(device);

    const tokens = generateTokens({
      userId: user.id,
      isGuest: false,
      role: user.role,
    });

    const session: Session = {
      id: 'sess_' + Math.random().toString(36).substring(2, 10),
      userId: user.id,
      token: tokens.refreshToken,
      refreshToken: tokens.refreshToken,
      ipAddress: meta.ip || null,
      ipHash,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.sessions.create(session);

    return { user, tokens, settings };
  }

  static async login(
    data: { email: string; password: string },
    meta: {
      ip: string;
      userAgent: string;
      country: string;
      language: string;
      timezone: string;
      browser: string;
      os: string;
      deviceType: string;
    }
  ) {
    const user = await db.users.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password credentials.');
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password credentials.');
    }

    const ipHash = hashIp(meta.ip);
    const tokens = generateTokens({
      userId: user.id,
      isGuest: user.isGuest,
      role: user.role,
    });

    const session: Session = {
      id: 'sess_' + Math.random().toString(36).substring(2, 10),
      userId: user.id,
      token: tokens.refreshToken,
      refreshToken: tokens.refreshToken,
      ipAddress: meta.ip || null,
      ipHash,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.sessions.create(session);

    const device: Device = {
      id: 'dev_' + user.id,
      userId: user.id,
      deviceType: meta.deviceType,
      browser: meta.browser,
      os: meta.os,
      ipHash,
      country: meta.country,
      language: meta.language,
      timezone: meta.timezone,
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await db.devices.createOrUpdate(device);

    const settings = await db.userSettings.findByUserId(user.id);

    return { user, tokens, settings };
  }

  static async googleLoginPrepared(
    googleToken: string,
    meta: {
      ip: string;
      userAgent: string;
      country: string;
      language: string;
      timezone: string;
      browser: string;
      os: string;
      deviceType: string;
    }
  ) {
    if (!googleToken) {
      throw new Error('Google OAuth token required');
    }
    return { message: 'Google Login OAuth flow architecture prepared.', meta };
  }

  static async logout(refreshToken: string) {
    if (refreshToken) {
      await db.sessions.deleteByToken(refreshToken);
    }
    return true;
  }

  static async refreshTokens(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid or expired refresh token');
    }

    const session = await db.sessions.findByRefreshToken(refreshToken);
    if (!session) {
      throw new Error('Session revoked or not found');
    }

    const user = await db.users.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newTokens = generateTokens({
      userId: user.id,
      isGuest: user.isGuest,
      role: user.role,
    });

    session.token = newTokens.refreshToken;
    session.refreshToken = newTokens.refreshToken;
    await db.sessions.create(session);

    return newTokens;
  }
}
