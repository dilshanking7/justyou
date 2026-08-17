import { RouteItem } from '../types';

export const PUBLIC_NAV_ROUTES: RouteItem[] = [
  { key: 'landing', label: 'Home', icon: 'Home' },
  { key: 'about', label: 'About', icon: 'Info' },
  { key: 'safety', label: 'Safety', icon: 'ShieldCheck' },
  { key: 'contact', label: 'Contact', icon: 'Mail' },
  { key: 'design-system', label: 'UI Studio', icon: 'Sparkles', badge: 'Interactive' },
];

export const MODULE_ROUTES: RouteItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', description: 'Matching hub & activity feed', category: 'app' },
  { key: 'chat', label: 'Text Chat', icon: 'MessageSquare', description: 'Real-time text channels & direct messages', category: 'app' },
  { key: 'video', label: 'Video Call', icon: 'Video', description: 'Ultra low latency 4K video matching', category: 'app', badge: 'WebRTC' },
  { key: 'voice', label: 'Voice Lounge', icon: 'Mic', description: 'Spatial audio voice chat rooms', category: 'app' },
  { key: 'friends', label: 'Friends', icon: 'Users', description: 'Direct connections & status feed', category: 'account', badge: '12 Online' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell', description: 'Alerts, requests & mentions', category: 'account', badge: '3' },
  { key: 'profile', label: 'Profile', icon: 'User', description: 'Personal identity, stats & badges', category: 'account' },
  { key: 'settings', label: 'Settings', icon: 'Settings', description: 'Audio, video, privacy & keybindings', category: 'account' },
  { key: 'premium', label: 'Pro Tier', icon: 'Zap', description: 'Unlock filters, HD stream & custom aura', category: 'account', badge: 'PRO' },
  { key: 'reports', label: 'Reports & Cases', icon: 'AlertTriangle', description: 'Submitted safety tickets & status', category: 'system' },
  { key: 'admin', label: 'Admin Command', icon: 'ShieldAlert', description: 'System health, moderation queue', category: 'system', badge: 'Staff' },
  { key: 'support', label: 'Help & FAQ', icon: 'HelpCircle', description: 'Knowledge base & contact tickets', category: 'system' },
];

export const FOOTER_POLICY_ROUTES: RouteItem[] = [
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms of Service' },
  { key: 'safety', label: 'Safety Guidelines' },
  { key: 'maintenance', label: 'System Status' },
];
