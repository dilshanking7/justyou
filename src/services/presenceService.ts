import { apiClient } from '../lib/apiClient';

export interface PresenceStatsResponse {
  activeUsersOnline: number;
  totalRegisteredUsers: number;
  countryBreakdown: Record<string, number>;
  lastUpdated: string;
  statusMessage: string;
}

export const presenceApiService = {
  getPresence: async (): Promise<PresenceStatsResponse> => {
    return apiClient<PresenceStatsResponse>('/presence', { method: 'GET' });
  },
};
