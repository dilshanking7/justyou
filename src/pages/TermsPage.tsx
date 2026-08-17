import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <Badge variant="glass" icon={<FileText className="w-3.5 h-3.5" />}>
          Legal Terms
        </Badge>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-500">Effective Date: July 2026</p>
      </div>

      <Card variant="glass" padding="lg" className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white">1. Acceptance of Terms</h3>
          <p>
            By accessing or using justyou, you agree to comply with these Terms of Service and all applicable local, national, and international laws.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white">2. Code of Conduct</h3>
          <p>
            Users must be at least 18 years of age or possess legal parental consent. Harassment, hate speech, explicit illegal material, and spam are strictly prohibited and result in permanent device bans.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white">3. Service Availability</h3>
          <p>
            justyou provides WebRTC matching on an &quot;as-is&quot; basis. While we strive for 99.99% uptime, we do not warrant uninterrupted connectivity under extreme global network congestion.
          </p>
        </section>
      </Card>
    </div>
  );
};
