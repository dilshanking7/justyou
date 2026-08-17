import React, { useState } from 'react';
import { Settings, Volume2, Video, Shield, Bell, Key } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Switch } from '../components/ui/Switch';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

export const SettingsPage: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('audio-video');
  const [e2ee, setE2ee] = useState(true);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [autoMute, setAutoMute] = useState(false);

  const handleSave = () => {
    toast.success('Settings Saved', 'Your system preferences have been updated.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" /> Platform Settings
        </h1>
        <p className="text-xs text-slate-400">Configure WebRTC audio/video devices and privacy controls.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'audio-video', label: 'Audio & Video' },
          { id: 'privacy', label: 'Privacy & Security' },
          { id: 'notifications', label: 'Notifications' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'audio-video' && (
        <Card variant="glass" padding="lg" className="space-y-6">
          <Select
            label="Microphone Input"
            options={[
              { value: 'default', label: 'Default - Built-in Microphone' },
              { value: 'studio', label: 'USB Studio Mic (Pro Audio)' },
            ]}
            value="default"
            onChange={() => {}}
          />
          <Select
            label="Camera Input"
            options={[
              { value: 'default', label: 'Built-in FaceTime HD Camera' },
              { value: 'external', label: 'Virtual Camera (4K 60FPS)' },
            ]}
            value="default"
            onChange={() => {}}
          />
          <Switch checked={noiseReduction} onChange={setNoiseReduction} label="AI Noise Cancellation & Echo Suppression" />
          <Switch checked={autoMute} onChange={setAutoMute} label="Mute Microphone Automatically on Match Join" />
          <Button variant="primary" onClick={handleSave}>Save Preferences</Button>
        </Card>
      )}

      {activeTab === 'privacy' && (
        <Card variant="glass" padding="lg" className="space-y-6">
          <Switch checked={e2ee} onChange={setE2ee} label="Force DTLS-SRTP End-to-End Encryption" />
          <Button variant="danger">Clear Local Storage & Session Keys</Button>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card variant="glass" padding="lg" className="space-y-4 text-xs text-slate-300">
          <Switch checked={true} onChange={() => {}} label="Friend Request Alerts" />
          <Switch checked={true} onChange={() => {}} label="System Maintenance Notices" />
        </Card>
      )}
    </div>
  );
};
