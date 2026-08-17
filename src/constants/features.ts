import { FeatureItem } from '../types';

export const FEATURES: FeatureItem[] = [
  {
    id: '1',
    title: 'Sub-20ms Sub-Second Matching',
    description: 'Powered by globally distributed edge routing algorithms that pair you with optimal peers in milliseconds.',
    iconName: 'Zap',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    tag: 'P2P Edge Mesh',
  },
  {
    id: '2',
    title: 'End-to-End E2EE Protection',
    description: 'Direct WebRTC DTLS-SRTP encryption ensures no third party—not even our servers—can listen or view.',
    iconName: 'Lock',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    tag: 'Zero Storage',
  },
  {
    id: '3',
    title: 'Apple & Discord Visual Fluidity',
    description: 'Designed with soft glassmorphic layering, 120Hz smooth physics-based Framer Motion springs, and dark themes.',
    iconName: 'Palette',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    tag: 'Design System',
  },
  {
    id: '4',
    title: 'High-Fidelity 4K 60FPS Video',
    description: 'Adaptive bitrate video pipelines that gracefully adjust resolution and frame rate to match network conditions.',
    iconName: 'Video',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    tag: 'Ultra Quality',
  },
  {
    id: '5',
    title: 'Spatial Audio Lounges',
    description: 'Immersive acoustic positioning where voice volume scales smoothly based on proximity inside virtual rooms.',
    iconName: 'Volume2',
    gradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
    tag: '3D Acoustics',
  },
  {
    id: '6',
    title: 'Zero-Friction Anonymity',
    description: 'Connect instantly without revealing phone numbers, real names, or social handles unless you choose to share.',
    iconName: 'Shield',
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    tag: 'Privacy Guarantee',
  },
];
