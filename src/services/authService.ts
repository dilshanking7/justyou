import { apiClient } from '../lib/apiClient';

export interface AuthResponse {
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
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  settings?: any;
}

export const authApiService = {
  guestLogin: async (nickname?: string): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  },

  register: async (data: { email: string; password: string; nickname?: string }): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  googleLogin: async (googleToken: string): Promise<any> => {
    return apiClient('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ googleToken }),
    });
  },

  logout: async (refreshToken?: string): Promise<void> => {
    try {
      await apiClient('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('justyou_access_token');
      localStorage.removeItem('justyou_refresh_token');
    }
  },
};
