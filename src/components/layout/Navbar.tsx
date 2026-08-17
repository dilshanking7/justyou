import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Zap,
  Bell,
  Palette,
  Download,
  Users,
} from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { useThemeStore } from '../../lib/themeStore';
import { useUser } from '../../providers/UserProvider';
import { useSocket } from '../../providers/SocketProvider';
import { Button } from '../ui/Button';
import { PUBLIC_NAV_ROUTES } from '../../constants/routes';
import { APP_CONFIG } from '../../constants/appConfig';
import { DICTIONARY } from '../../constants/i18n';
import { LanguageCode, PageKey } from '../../types';
import { UiStudioModal } from '../common/UiStudioModal';
import { DownloadAppModal } from '../common/DownloadAppModal';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    language,
    setLanguage,
    setCommandPaletteOpen,
    isMobileMenuOpen,
    setMobileMenuOpen,
  } = useNavigationStore();

  const { mode, toggleTheme } = useThemeStore();
  const { notifications } = useUser();
  const { presenceStats } = useSocket();

  const [isUiStudioOpen, setIsUiStudioOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const t = DICTIONARY[language] || DICTIONARY.en;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const onlineCount = presenceStats?.activeUsersOnline || 1;

  const handleRouteClick = (key: PageKey) => {
    setCurrentPage(key);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => handleRouteClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white font-mono flex items-center gap-1">
                just<span className="text-indigo-400">you</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase flex items-center gap-1">
                <Users className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">{onlineCount}</span> Online
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
            {PUBLIC_NAV_ROUTES.map((route) => {
              const isActive = currentPage === route.key;
              return (
                <button
                  key={route.key}
                  onClick={() => handleRouteClick(route.key)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-indigo-600/90 rounded-xl shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>{route.label}</span>
                  {route.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-indigo-400/20 text-indigo-300 rounded-full border border-indigo-400/30">
                      {route.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Controls & Utilities */}
          <div className="flex items-center gap-1.5">
            {/* UI Customization Studio Trigger */}
            <button
              onClick={() => setIsUiStudioOpen(true)}
              className="px-2.5 py-1.5 text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all flex items-center gap-1.5"
              title="Open UI Customization Studio"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">UI Studio</span>
            </button>

            {/* App Downloader Trigger */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all flex items-center gap-1.5"
              title="Download & Install App"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => handleRouteClick('notifications')}
              className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Quick Search trigger (Cmd+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="px-1 py-0.5 text-[9px] bg-slate-800 border border-slate-700 text-slate-400 rounded-md font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Language Selector Selector */}
            <div className="relative group hidden sm:block">
              <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors flex items-center gap-1 cursor-pointer">
                <Globe className="w-4 h-4" />
                <span className="text-xs uppercase font-mono">{language}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 w-36 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-1">
                {APP_CONFIG.languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-colors cursor-pointer ${
                      language === lang.code
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
              title={`Current mode: ${mode}. Click to switch.`}
            >
              {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Module App Link */}
            <Button
              variant="gradient"
              size="sm"
              onClick={() => handleRouteClick('video')}
              leftIcon={<Zap className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex"
            >
              Start Video
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2 overflow-hidden"
            >
              {PUBLIC_NAV_ROUTES.map((route) => (
                <button
                  key={route.key}
                  onClick={() => handleRouteClick(route.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === route.key
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>{route.label}</span>
                  {route.badge && (
                    <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                      {route.badge}
                    </span>
                  )}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <Button
                  variant="gradient"
                  fullWidth
                  onClick={() => handleRouteClick('video')}
                >
                  Start OmeTV Video Chat
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modals */}
      <UiStudioModal isOpen={isUiStudioOpen} onClose={() => setIsUiStudioOpen(false)} />
      <DownloadAppModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </>
  );
};
