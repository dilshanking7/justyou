import React from 'react';
import { Zap, CheckCircle2, Sparkles, Shield, Crown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const PremiumPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4">
        <Badge variant="gradient" icon={<Crown className="w-3.5 h-3.5" />}>
          justyou Pro
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Supercharge Your Global Experience
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Enjoy priority WebRTC edge routing, custom animated glowing aura badges, and 4K 60FPS video pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card variant="glass" padding="lg" className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Free Forever</h3>
            <div className="text-3xl font-extrabold font-mono text-white">$0 <span className="text-xs text-slate-500 font-sans font-normal">/ month</span></div>
            <p className="text-xs text-slate-400">Essential text, voice, and video matching.</p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Text & Video Matching</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Standard 1080p Stream Quality</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> End-to-End E2EE Protection</li>
            </ul>
          </div>
          <Button variant="outline" fullWidth disabled>Current Plan</Button>
        </Card>

        {/* Pro Plan */}
        <Card variant="gradient" padding="lg" className="space-y-6 flex flex-col justify-between relative border-indigo-500/50 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">justyou Pro</h3>
              <Badge variant="gradient">Most Popular</Badge>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">$9 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span></div>
            <p className="text-xs text-slate-300">For creators, polyglots, and power users.</p>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Priority Sub-18ms Edge Routing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 4K 60FPS High-Bitrate Video Pipeline</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Regional & Interest Topic Filtering</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Custom Animated Glowing Aura Avatar Badge</li>
            </ul>
          </div>
          <Button variant="gradient" fullWidth leftIcon={<Zap className="w-4 h-4 fill-current" />}>
            Upgrade to Pro
          </Button>
        </Card>
      </div>
    </div>
  );
};
