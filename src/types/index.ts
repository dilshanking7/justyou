export type ThemeMode = 'dark' | 'light' | 'glass';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt' | 'ar';

export type PageKey = 
  | 'landing'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'safety'
  | 'contact'
  | 'not-found'
  | 'maintenance'
  | 'design-system'
  // Future module placeholders
  | 'chat'
  | 'video'
  | 'voice'
  | 'profile'
  | 'settings'
  | 'friends'
  | 'notifications'
  | 'dashboard'
  | 'premium'
  | 'admin'
  | 'reports'
  | 'support';

export interface RouteItem {
  key: PageKey;
  label: string;
  icon?: string;
  description?: string;
  badge?: string;
  category?: 'public' | 'app' | 'account' | 'system';
  isExternal?: boolean;
}

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  bio: string;
  badge?: string;
  tier: 'free' | 'pro' | 'ultra';
  reputationScore: number;
  joinedDate: string;
  verified: boolean;
  interests: string[];
}

export interface SystemStats {
  activeUsersOnline: number;
  totalMatchesToday: number;
  averageLatencyMs: number;
  encryptedConnections: number;
  serverStatus: 'operational' | 'degraded' | 'maintenance';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Security & Privacy' | 'Calling & Audio' | 'Billing & Premium';
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  verified: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  gradient: string;
  tag?: string;
}
