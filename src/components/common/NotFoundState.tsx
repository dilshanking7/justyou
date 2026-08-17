import React from 'react';
import { Compass, Home, Sparkles } from 'lucide-react';
import { useNavigationStore } from '../../lib/navigationStore';
import { Button } from '../ui/Button';

export const NotFoundState: React.FC = () => {
  const { setCurrentPage } = useNavigationStore();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <Compass className="w-12 h-12 text-indigo-400 animate-spin-slow" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-2.5 py-1 text-xs font-mono font-bold bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-full">
          404 Error
        </span>
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
        Page Lost in Cyberspace
      </h1>
      <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
        The path or module you requested could not be located on the justyou network.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Button
          variant="primary"
          onClick={() => setCurrentPage('landing')}
          leftIcon={<Home className="w-4 h-4" />}
        >
          Return Home
        </Button>
        <Button
          variant="glass"
          onClick={() => setCurrentPage('design-system')}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Explore UI Studio
        </Button>
      </div>
    </div>
  );
};
