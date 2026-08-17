import { FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How does justyou ensure user privacy and security?',
    answer: 'justyou uses end-to-end encrypted WebRTC peer-to-peer data channels. We maintain a strict zero-data logging policy: call metadata, video streams, and temporary chat messages are processed in-memory and never stored on persistent disks.',
    category: 'Security & Privacy',
  },
  {
    id: '2',
    question: 'Is justyou completely free to use?',
    answer: 'Yes! Core matching for text, voice, and video is 100% free forever with no time limits. Optional Pro tiers offer advanced interest filter priority, custom animated aura badges, and 4K 60FPS stream capabilities.',
    category: 'Billing & Premium',
  },
  {
    id: '3',
    question: 'What hardware or browser requirements are needed?',
    answer: 'justyou is built with standard WebRTC and modern Web API support. Any modern browser (Chrome, Safari, Firefox, Edge, Brave) on Desktop, Tablet, or Mobile works instantly without installing third-party plugins.',
    category: 'Calling & Audio',
  },
  {
    id: '4',
    question: 'How do you handle moderation and inappropriate behavior?',
    answer: 'We employ automated real-time privacy-preserving AI safety moderation coupled with instant peer reporting. Community moderators review flagged behavior within seconds, enforcing immediate temporary bans or permanent device blocks.',
    category: 'General',
  },
  {
    id: '5',
    question: 'Can I choose specific regions or interest tags?',
    answer: 'Yes, in your match preferences you can specify target languages, topics (e.g. Technology, Gaming, Languages, Music, Philosophy), and geographic region preferences.',
    category: 'General',
  },
  {
    id: '6',
    question: 'How does spatial audio work in Voice Lounges?',
    answer: 'Our proprietary spatial WebAudio node adjusts speaker pan and gain relative to avatar positioning on the room canvas, delivering immersive 3D acoustic immersion.',
    category: 'Calling & Audio',
  },
];
