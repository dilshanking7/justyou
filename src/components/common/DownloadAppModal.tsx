import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, Monitor, Apple, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install JustYou App:\n\n1. Click "Add to Home Screen" or the Install icon in your browser address bar.\n2. Tap "Install" to create native app shortcut.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  Download JustYou App
                  <Badge variant="success" size="sm">
                    Cross-Platform
                  </Badge>
                </h3>
                <p className="text-xs text-slate-400">Install on Android, iOS, Windows & macOS</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Tabs */}
          <div className="grid grid-cols-3 p-3 bg-slate-950 border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('android')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'android'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Android App
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'ios'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4" /> iOS / iPhone
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" /> PC / Mac
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            {activeTab === 'android' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Android PWA Direct Install</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Install JustYou as an ultra-fast native app on Android without downloading heavy APKs. Supports full camera, mic & background notifications.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Instant high-definition 1-on-1 video calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Push notifications for incoming messages & friend requests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Zero storage waste & auto-updating app</span>
                  </div>
                </div>

                <Button
                  onClick={handleInstallPWA}
                  size="lg"
                  variant="gradient"
                  className="w-full"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  {isInstalled ? 'App Installed Already' : 'Install Android App Now'}
                </Button>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Apple className="w-4 h-4 text-indigo-400" /> iPhone & iPad Installation Guide
                  </h4>
                  <ol className="text-xs text-slate-300 mt-3 space-y-2 list-decimal list-inside">
                    <li>Open <strong>JustYou</strong> in Safari Browser on iOS.</li>
                    <li>Tap the <strong>Share Button</strong> (square with arrow pointing up at bottom bar).</li>
                    <li>Scroll down and select <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong> in top right corner to create App icon.</li>
                  </ol>
                </div>

                <Button
                  onClick={() => alert('Safari Share Menu -> Add to Home Screen')}
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Open iOS Safari Shortcut Guide
                </Button>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-indigo-400" /> Windows & Mac Desktop App
                  </h4>
                  <p className="text-xs text-slate-400 mt-2">
                    Install as a standalone desktop application with full screen OmeTV mode, hardware accelerated video rendering, and keyboard shortcuts.
                  </p>
                </div>

                <Button
                  onClick={handleInstallPWA}
                  size="lg"
                  variant="gradient"
                  className="w-full"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Install Windows / Mac Desktop App
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
            <span>JustYou PWA Version 2.4.0</span>
            <button onClick={onClose} className="hover:text-white transition-colors">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
