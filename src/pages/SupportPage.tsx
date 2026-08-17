import React from 'react';
import { HelpCircle, Search, BookOpen, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigationStore } from '../lib/navigationStore';

export const SupportPage: React.FC = () => {
  const { setCurrentPage } = useNavigationStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-indigo-400" /> Help & Knowledge Base
        </h1>
        <p className="text-xs text-slate-400">Search guides, WebRTC troubleshooting, and account policies.</p>
        <div className="max-w-md mx-auto pt-2">
          <Input placeholder="Search support articles..." leftIcon={<Search className="w-4 h-4 text-slate-400" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" padding="lg" className="space-y-3">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <h3 className="text-base font-bold text-white">WebRTC Troubleshooting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fixing camera permissions, microphone echo, and firewall NAT traversal issues.
          </p>
        </Card>
        <Card variant="glass" padding="lg" className="space-y-3">
          <MessageCircle className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Contact Direct Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submit a support ticket directly to our engineering team.
          </p>
          <Button variant="primary" size="sm" onClick={() => setCurrentPage('contact')}>Submit Ticket</Button>
        </Card>
      </div>
    </div>
  );
};
