import { z } from 'zod';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';
export type OnlineStatusType = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' | 'INVISIBLE';
export type PrivacyOptionType = 'EVERYONE' | 'FRIENDS' | 'NOBODY';
export type ReportStatusType = 'PENDING' | 'REVIEWED' | 'DISMISSED';
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'SYSTEM';

export interface Country {
  id: string;
  code: string;
  name: string;
  flag: string | null;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string | null;
}

export interface Interest {
  id: string;
  name: string;
  category: string | null;
}

export interface Profile {
  id: string;
  userId: string;
  photo: string | null;
  bio: string | null;
  age: number | null;
  gender: string | null;
  countryId: string | null;
  country?: Country | null;
  city: string | null;
  languageId: string | null;
  language?: Language | null;
  secondLanguageId: string | null;
  secondLanguage?: Language | null;
  interests: Interest[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string | null;
  displayName: string | null;
  email: string | null;
  passwordHash: string | null;
  isGuest: boolean;
  isVerified: boolean;
  isPremium: boolean;
  role: UserRole;
  onlineStatus: OnlineStatusType;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;

  // Embedded / joined relations for convenient service access
  nickname?: string; // Backwards compatibility helper (displayName || username || 'User')
  avatar?: string;   // Backwards compatibility helper (profile?.photo)
  country?: string;  // Backwards compatibility helper
  language?: string; // Backwards compatibility helper
  timezone?: string; // Backwards compatibility helper
  profile?: Profile | null;
  settings?: UserSettings | null;
}

export interface UserSettings {
  id: string;
  userId: string;
  whoCanMessage: PrivacyOptionType;
  whoCanCall: PrivacyOptionType;
  showOnlineStatus: boolean;
  showAge: boolean;
  showCountry: boolean;
  showLanguage: boolean;
  allowTranslation: boolean;
  autoPlayVoice: boolean;
  autoPlayVideo: boolean;
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  marketingNotifications: boolean;
  createdAt: string;
  updatedAt: string;

  // Backwards compatibility fields
  theme?: 'dark' | 'light';
  notificationsEnabled?: boolean;
  cameraEnabled?: boolean;
  micEnabled?: boolean;
  preferredLanguage?: string;
  preferredGender?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  ipAddress: string | null;
  ipHash: string | null;
  userAgent: string | null;
  expiresAt: string;
  createdAt: string;

  // Backwards compatibility
  refreshToken?: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  revoked: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  ipHash: string | null;
  country: string | null;
  language: string | null;
  timezone: string | null;
  lastSeenAt: string;
  createdAt: string;
}

export interface Presence {
  id: string;
  userId: string;
  socketId: string;
  status: OnlineStatusType;
  deviceId: string | null;
  country: string | null;
  language: string | null;
  timezone: string | null;
  ipHash: string | null;
  connectedAt: string;
  lastPingAt: string;
}

export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedId: string;
  reason: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  status: ReportStatusType;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface FutureChat {
  id: string;
  channelId: string;
  senderId: string;
  recipientId: string | null;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
}

export interface FutureCall {
  id: string;
  callerId: string;
  receiverId: string | null;
  callType: 'VIDEO' | 'VOICE';
  duration: number;
  status: 'COMPLETED' | 'MISSED' | 'REJECTED';
  startedAt: string;
  endedAt: string | null;
}

// Zod Validation Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(2).max(30).optional(),
  displayName: z.string().min(2).max(50).optional(),
  nickname: z.string().min(2).max(30).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const GuestLoginSchema = z.object({
  nickname: z.string().optional(),
  displayName: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  username: z.string().min(2).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
  displayName: z.string().min(1).max(50).optional(),
  nickname: z.string().min(1).max(50).optional(), // Alias for displayName
  photo: z.string().url().or(z.string().length(0)).optional(),
  avatar: z.string().url().or(z.string().length(0)).optional(), // Alias for photo
  bio: z.string().max(300, 'Bio max length is 300 characters').optional(),
  age: z.number().int().min(18, 'Must be at least 18 years old').max(120).nullable().optional(),
  gender: z.string().max(30).nullable().optional(),
  countryId: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  languageId: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  secondLanguageId: z.string().nullable().optional(),
  secondLanguage: z.string().nullable().optional(),
  timezone: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export const UpdateSettingsSchema = z.object({
  whoCanMessage: z.enum(['EVERYONE', 'FRIENDS', 'NOBODY']).optional(),
  whoCanCall: z.enum(['EVERYONE', 'FRIENDS', 'NOBODY']).optional(),
  showOnlineStatus: z.boolean().optional(),
  showAge: z.boolean().optional(),
  showCountry: z.boolean().optional(),
  showLanguage: z.boolean().optional(),
  allowTranslation: z.boolean().optional(),
  autoPlayVoice: z.boolean().optional(),
  autoPlayVideo: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  messageNotifications: z.boolean().optional(),
  marketingNotifications: z.boolean().optional(),

  // Backwards compatibility
  theme: z.enum(['dark', 'light']).optional(),
  notificationsEnabled: z.boolean().optional(),
  cameraEnabled: z.boolean().optional(),
  micEnabled: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
  preferredGender: z.string().optional(),
});

export const GoogleLoginSchema = z.object({
  googleToken: z.string().min(1, 'Google token required'),
});

export const FriendRequestSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID is required'),
});

export const SendMessageSchema = z.object({
  receiverId: z.string().optional(),
  channelId: z.string().optional(),
  content: z.string().min(1, 'Message content cannot be empty'),
  mediaUrl: z.string().optional(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['ONLINE', 'OFFLINE', 'AWAY', 'BUSY', 'INVISIBLE']),
});
