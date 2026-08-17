import { db } from '../database/db';
import { UserSettings, Profile, OnlineStatusType } from '../types';
import { storageService } from './storageService';

export class UserService {
  static async getProfile(userId: string) {
    const user = await db.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const profile = await db.profiles.findByUserId(userId);
    const settings = await db.userSettings.findByUserId(userId);
    const devices = await db.devices.findByUserId(userId);
    const notifications = await db.notifications.findByUserId(userId);

    // Omit sensitive password hash
    const { passwordHash, ...safeUser } = user;

    return {
      user: {
        ...safeUser,
        profile: profile || {
          id: `prof-${userId}`,
          userId,
          photo: user.avatar || null,
          bio: null,
          age: null,
          gender: null,
          countryId: null,
          city: null,
          languageId: null,
          secondLanguageId: null,
          interests: [],
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      profile,
      settings,
      devices,
      notifications,
    };
  }

  static async updateProfile(userId: string, updates: any) {
    const user = await db.users.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check username uniqueness if changing
    if (updates.username && updates.username !== user.username) {
      const existingUser = await db.users.findByUsername(updates.username);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username is already taken by another account.');
      }
    }

    const displayName = updates.displayName || updates.nickname || user.displayName || user.nickname;
    const photo = updates.photo || updates.avatar || user.avatar || null;

    // Update User record
    const updatedUser = await db.users.update(userId, {
      username: updates.username !== undefined ? updates.username : user.username,
      displayName,
      nickname: displayName, // Backwards compatibility
      avatar: photo || undefined, // Backwards compatibility
      country: updates.country !== undefined ? updates.country : user.country,
      language: updates.language !== undefined ? updates.language : user.language,
      timezone: updates.timezone !== undefined ? updates.timezone : user.timezone,
      onlineStatus: updates.onlineStatus || user.onlineStatus,
    });

    if (!updatedUser) {
      throw new Error('Failed to update user profile.');
    }

    // Update Profile record
    const existingProfile = await db.profiles.findByUserId(userId);
    const updatedProfile: Profile = {
      id: existingProfile?.id || `prof-${userId}`,
      userId,
      photo: photo || existingProfile?.photo || null,
      bio: updates.bio !== undefined ? updates.bio : existingProfile?.bio || null,
      age: updates.age !== undefined ? updates.age : existingProfile?.age || null,
      gender: updates.gender !== undefined ? updates.gender : existingProfile?.gender || null,
      countryId: updates.countryId !== undefined ? updates.countryId : existingProfile?.countryId || null,
      city: updates.city !== undefined ? updates.city : existingProfile?.city || null,
      languageId: updates.languageId !== undefined ? updates.languageId : existingProfile?.languageId || null,
      secondLanguageId: updates.secondLanguageId !== undefined ? updates.secondLanguageId : existingProfile?.secondLanguageId || null,
      interests: updates.interests !== undefined
        ? updates.interests.map((name: string) => ({ id: `i-${name.toLowerCase().replace(/\s+/g, '-')}`, name, category: 'General' }))
        : existingProfile?.interests || [],
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.profiles.upsert(updatedProfile);

    const { passwordHash, ...safeUser } = updatedUser;
    return {
      user: safeUser,
      profile: updatedProfile,
    };
  }

  static async getSettings(userId: string) {
    let settings = await db.userSettings.findByUserId(userId);
    if (!settings) {
      settings = await db.userSettings.upsert({
        id: `set-${userId}`,
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
      });
    }
    return settings;
  }

  static async updateSettings(userId: string, settingsUpdates: Partial<UserSettings>) {
    const existingSettings = await this.getSettings(userId);
    const updated = await db.userSettings.upsert({
      ...existingSettings,
      ...settingsUpdates,
      userId,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  }

  static async getNotifications(userId: string) {
    return await db.notifications.findByUserId(userId);
  }

  static async uploadAvatar(userId: string, file: Express.Multer.File) {
    const result = await storageService.saveAvatar(file);
    await this.updateProfile(userId, { photo: result.url, avatar: result.url });
    return result;
  }

  static async updateOnlineStatus(userId: string, status: OnlineStatusType) {
    return await db.presences.updateUserOnlineStatus(userId, status);
  }

  static async getMetadata() {
    const [countries, languages, interests] = await Promise.all([
      db.countries.findMany(),
      db.languages.findMany(),
      db.interests.findMany(),
    ]);
    return { countries, languages, interests };
  }
}
