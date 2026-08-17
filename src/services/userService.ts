import { apiClient } from '../lib/apiClient';

export interface UserProfileResponse {
  user: {
    id: string;
    email: string | null;
    isGuest: boolean;
    nickname: string;
    avatar: string;
    role: string;
    country: string;
    language: string;
    timezone: string;
    createdAt: string;
  };
  settings: any;
  devices: any[];
  notifications: any[];
}

export const userApiService = {
  getMe: async (): Promise<UserProfileResponse> => {
    return apiClient<UserProfileResponse>('/me', { method: 'GET' });
  },

  updateMe: async (updates: {
    nickname?: string;
    avatar?: string;
    country?: string;
    language?: string;
    timezone?: string;
  }): Promise<{ user: any }> => {
    return apiClient('/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  updateSettings: async (settings: any): Promise<{ settings: any }> => {
    return apiClient('/me/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};
