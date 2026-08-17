import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

export const ContactPage: React.FC = () => {
  const toast = useToast();
  const [topic, setTopic] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Ticket Submitted', 'Our support engineering team will reply within 24 hours.');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="gradient" icon={<Mail className="w-3.5 h-3.5" />}>
          Get In Touch
        </Badge>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Contact Support & Feedback
        </h1>
        <p className="text-xs text-slate-400">
          Have questions regarding WebRTC latency, Pro subscriptions, or safety? We are here to help.
        </p>
      </div>

      <Card variant="glass" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Your Name" placeholder="Alex Rivera" required />
          <Input label="Email Address" type="email" placeholder="alex@domain.com" required />
          <Select
            label="Inquiry Topic"
            options={[
              { value: 'general', label: 'General Inquiry' },
              { value: 'technical', label: 'WebRTC / Network Issue' },
              { value: 'billing', label: 'Pro Subscription' },
              { value: 'safety', label: 'Safety / Abuse Report' },
            ]}
            value={topic}
            onChange={setTopic}
          />
          <Textarea label="Message Details" placeholder="Describe how we can assist you..." required />
          <Button
            type="submit"
            variant="gradient"
            isLoading={isLoading}
            leftIcon={<Send className="w-4 h-4" />}
            fullWidth
          >
            Submit Ticket
          </Button>
        </form>
      </Card>
    </div>
  );
};
