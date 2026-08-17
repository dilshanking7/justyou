import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Send, Bell, Zap, Play, Shield, Lock, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Modal } from '../ui/Modal';
import { Dialog } from '../ui/Dialog';
import { Select } from '../ui/Select';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Skeleton } from '../ui/Skeleton';
import { Tabs } from '../ui/Tabs';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Switch } from '../ui/Switch';
import { Checkbox } from '../ui/Checkbox';
import { RadioGroup } from '../ui/Radio';
import { Progress } from '../ui/Progress';
import { useToast } from '../../hooks/useToast';
import { DESIGN_SYSTEM_TOKENS } from '../../config/designSystem';

export const DesignSystemShowcase: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('components');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [switchState, setSwitchState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('pro');
  const [selectValue, setSelectValue] = useState('us-east');
  const [progressVal, setProgressVal] = useState(68);

  const selectOptions = [
    { value: 'us-east', label: 'US East (N. Virginia)' },
    { value: 'eu-west', label: 'Europe (Frankfurt)' },
    { value: 'ap-tokyo', label: 'Asia Pacific (Tokyo)' },
    { value: 'sa-east', label: 'South America (São Paulo)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Design System & Token Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          justyou UI Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Inspired by Apple, Discord, Notion, and Linear. Clean glassmorphic surfaces, strict typography scale, accessibility WCAG compliance, and 120Hz physics animations.
        </p>
      </div>

      {/* Showcase Sub-tabs */}
      <Tabs
        tabs={[
          { id: 'components', label: 'Atomic Components' },
          { id: 'tokens', label: 'Design Tokens & Colors' },
          { id: 'typography', label: 'Typography & Scale' },
          { id: 'feedback', label: 'Modals & Toasts' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* TAB 1: ATOMIC COMPONENTS */}
      {activeTab === 'components' && (
        <div className="space-y-10">
          {/* Button Variants Section */}
          <Card padding="lg" variant="glass">
            <h3 className="text-lg font-bold text-white mb-4">Button Variants & Sizes</h3>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="glass">Glassmorphic</Button>
              <Button variant="gradient" leftIcon={<Sparkles className="w-4 h-4" />}>
                Linear Gradient
              </Button>
              <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                Danger
              </Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
              <Button size="sm">Small (sm)</Button>
              <Button size="md">Medium (md)</Button>
              <Button size="lg">Large (lg)</Button>
              <Button size="xl">Extra Large (xl)</Button>
              <Button size="icon" variant="glass" aria-label="Play">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Form Inputs & Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg" variant="glass" className="space-y-4">
              <h3 className="text-lg font-bold text-white">Inputs & Selects</h3>
              <Input label="Email Address" placeholder="alex@justyou.app" leftIcon={<Send className="w-4 h-4" />} />
              <Input label="Search Query" placeholder="Search friends or tags..." hint="Press Cmd+K to trigger search anywhere" />
              <Select label="Preferred Signaling Server" options={selectOptions} value={selectValue} onChange={setSelectValue} />
              <Textarea label="Bio / Interest Summary" placeholder="Tell the world what you love talking about..." />
            </Card>

            <Card padding="lg" variant="glass" className="space-y-6">
              <h3 className="text-lg font-bold text-white">Controls, Radios & Switches</h3>
              <Switch checked={switchState} onChange={setSwitchState} label="Enable End-to-End Encryption (E2EE)" />
              <Checkbox checked={checkboxState} onChange={setCheckboxState} label="I accept community safety rules" />
              <RadioGroup
                label="Subscription Tier"
                options={[
                  { value: 'free', label: 'Free Tier', description: 'Standard WebRTC matching' },
                  { value: 'pro', label: 'justyou Pro', description: '4K video, custom aura & priority' },
                ]}
                value={radioState}
                onChange={setRadioState}
              />
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Progress Bar</span>
                <Progress value={progressVal} showValue />
              </div>
            </Card>
          </div>

          {/* Avatars, Badges & Tooltips */}
          <Card padding="lg" variant="glass" className="space-y-6">
            <h3 className="text-lg font-bold text-white">Avatars, Badges & Indicators</h3>
            <div className="flex flex-wrap items-center gap-6">
              <Avatar name="Elena Rostova" status="online" size="xl" showGlow />
              <Avatar name="Marcus Vance" status="idle" size="lg" />
              <Avatar name="Aria Takahashi" status="dnd" size="md" />
              <Avatar name="David Chen" status="offline" size="sm" />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
              <Badge variant="primary" pulse>
                Live Match
              </Badge>
              <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                Connected
              </Badge>
              <Badge variant="warning">Low Latency</Badge>
              <Badge variant="danger">Blocked</Badge>
              <Badge variant="gradient">PRO Ultra</Badge>
              <Tooltip content="Direct P2P WebRTC Channel Active">
                <Badge variant="glass" icon={<Shield className="w-3 h-3" />}>
                  E2EE Tooltip
                </Badge>
              </Tooltip>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: DESIGN TOKENS & COLOR PALETTE */}
      {activeTab === 'tokens' && (
        <div className="space-y-8">
          <Card padding="lg" variant="glass">
            <h3 className="text-lg font-bold text-white mb-4">Color Tokens</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Object.entries(DESIGN_SYSTEM_TOKENS.colors.primary).map(([key, color]) => (
                <div key={key} className="space-y-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="h-10 rounded-lg shadow" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono text-slate-400 block">indigo-{key}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">{color}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg" variant="glass">
            <h3 className="text-lg font-bold text-white mb-4">Glassmorphism & Surface Elevation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl">
                <h4 className="text-sm font-semibold text-white">glass-panel</h4>
                <p className="text-xs text-slate-400 mt-1">16px blur + 3% white fill</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <h4 className="text-sm font-semibold text-white">glass-card</h4>
                <p className="text-xs text-slate-400 mt-1">Gradient surface + inner glow</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                <h4 className="text-sm font-semibold text-white">Solid Elevated Card</h4>
                <p className="text-xs text-slate-400 mt-1">High contrast surface</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: TYPOGRAPHY */}
      {activeTab === 'typography' && (
        <Card padding="lg" variant="glass" className="space-y-6">
          <h3 className="text-lg font-bold text-white">Typography Hierarchy</h3>
          <div className="space-y-4 font-sans">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono block">6XL - Display Header</span>
              <h1 className="text-5xl font-extrabold text-white tracking-tight">Global Connections</h1>
            </div>
            <div>
              <span className="text-[10px] text-indigo-400 font-mono block">3XL - Section Header</span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Sub-Second Video Relay</h2>
            </div>
            <div>
              <span className="text-[10px] text-indigo-400 font-mono block">BASE - Body Text</span>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Designed to provide crystal clear legibility across high-DPI displays, mobile screens, and dark environments with optimal WCAG contrast.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: FEEDBACK & MODALS */}
      {activeTab === 'feedback' && (
        <div className="space-y-8">
          <Card padding="lg" variant="glass" className="space-y-4">
            <h3 className="text-lg font-bold text-white">Interactive Toast Notifications</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => toast.success('Match Found!', 'Connecting to peer in Frankfurt...')}>
                Success Toast
              </Button>
              <Button variant="danger" onClick={() => toast.error('Connection Failed', 'WebRTC negotiation timeout.')}>
                Error Toast
              </Button>
              <Button variant="secondary" onClick={() => toast.info('System Update', 'New spatial audio feature enabled.')}>
                Info Toast
              </Button>
              <Button variant="outline" onClick={() => toast.warning('High Latency', 'Peer connection jitter detected.')}>
                Warning Toast
              </Button>
            </div>
          </Card>

          <Card padding="lg" variant="glass" className="space-y-4">
            <h3 className="text-lg font-bold text-white">Modals & Dialog Triggers</h3>
            <div className="flex gap-3">
              <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
                Open Glass Modal
              </Button>
              <Button variant="danger" onClick={() => setIsDialogOpen(true)}>
                Open Danger Dialog
              </Button>
            </div>
          </Card>

          <Card padding="lg" variant="glass" className="space-y-4">
            <h3 className="text-lg font-bold text-white">Alert Banners</h3>
            <Alert title="E2EE Active" description="All audio and video channels are protected with DTLS-SRTP encryption." type="info" />
            <Alert title="System Maintenance" description="Server upgrade scheduled at 04:00 UTC." type="warning" />
          </Card>

          <Card padding="lg" variant="glass" className="space-y-4">
            <h3 className="text-lg font-bold text-white">Loading & Skeleton States</h3>
            <div className="flex items-center gap-4">
              <LoadingSpinner size="lg" />
              <LoadingSpinner size="md" variant="white" />
              <LoadingSpinner size="sm" variant="emerald" />
            </div>
            <div className="space-y-2 max-w-md pt-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        </div>
      )}

      {/* Glass Modal Instance */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="justyou Pro Upgrade">
        <p className="text-xs text-slate-300 leading-relaxed">
          Unlock 4K WebRTC streaming, interest filters, priority edge node routing, and custom glowing avatar aura badges.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
            Dismiss
          </Button>
          <Button variant="gradient" size="sm" onClick={() => setIsModalOpen(false)}>
            Upgrade Now
          </Button>
        </div>
      </Modal>

      {/* Dialog Instance */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          toast.success('Account Data Cleared', 'Zero persistent logs retained.');
          setIsDialogOpen(false);
        }}
        type="danger"
        title="Clear Peer History?"
        description="This action will clear all temporary peer history from memory."
        confirmLabel="Clear Now"
      />
    </div>
  );
};
