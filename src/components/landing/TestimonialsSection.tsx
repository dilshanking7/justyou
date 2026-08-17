import React from 'react';
import { TESTIMONIALS } from '../../constants/testimonials';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../common/EmptyState';
import { MessageSquareQuote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950/80 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gradient">Global Feedback</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Community Experiences
          </h2>
          <p className="text-sm text-slate-400">
            Real user feedback recorded across active sessions.
          </p>
        </div>

        {TESTIMONIALS.length === 0 ? (
          <EmptyState
            icon={<MessageSquareQuote className="w-6 h-6 text-indigo-400" />}
            title="No testimonials yet."
            message="User feedback and reviews will appear here once submitted."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((item) => (
              <Card key={item.id} variant="glass" padding="md" className="space-y-4 flex flex-col justify-between">
                <p className="text-xs text-slate-300 italic">&quot;{item.content}&quot;</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
