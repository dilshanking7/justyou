import React from 'react';
import { Sparkles, Heart, Globe, Shield, Terminal, Activity } from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { APP_CONFIG } from '../../constants/appConfig';
import { FOOTER_POLICY_ROUTES } from '../../constants/routes';
import { PageKey } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useNavigationStore();

  const handleRoute = (key: PageKey) => {
    setCurrentPage(key);
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-900">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-4">
          <div
            onClick={() => handleRoute('landing')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold font-mono text-white">
              just<span className="text-indigo-400">you</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {APP_CONFIG.slogan} Engineered with an Apple + Discord + Linear design philosophy for pure human connections across the globe.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>All Global Edge Nodes Operational (18ms)</span>
          </div>
        </div>

        {/* Column 1: Product */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
            Platform Modules
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleRoute('chat')} className="hover:text-white transition-colors">
                Real-Time Text Chat
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('video')} className="hover:text-white transition-colors">
                4K WebRTC Video Call
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('voice')} className="hover:text-white transition-colors">
                Spatial Voice Lounges
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('design-system')} className="hover:text-indigo-400 transition-colors">
                UI Design Studio
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('premium')} className="hover:text-amber-400 transition-colors">
                justyou Pro Tier
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Company & Safety */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
            Safety & Trust
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleRoute('safety')} className="hover:text-white transition-colors">
                Community Guidelines
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('privacy')} className="hover:text-white transition-colors">
                Zero-Logs Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('terms')} className="hover:text-white transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('reports')} className="hover:text-white transition-colors">
                Safety & Report Center
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
            Resources
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleRoute('about')} className="hover:text-white transition-colors">
                About Architecture
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('contact')} className="hover:text-white transition-colors">
                Contact Support
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('maintenance')} className="hover:text-white transition-colors">
                System Status Page
              </button>
            </li>
            <li>
              <button onClick={() => handleRoute('support')} className="hover:text-white transition-colors">
                Help & Knowledge Base
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} {APP_CONFIG.name}. Built for global connection.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>v{APP_CONFIG.version}</span>
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>E2EE Protected</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
