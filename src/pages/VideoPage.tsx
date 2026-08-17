import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Sparkles,
  Users,
  Camera,
  MessageSquare,
  UserPlus,
  SkipForward,
  X,
  Send,
  Sliders,
  Tv,
  Check,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { useSocket } from '../providers/SocketProvider';
import { useAuth } from '../providers/AuthProvider';
import { useThemeStore } from '../lib/themeStore';

// Camera Visual CSS Filter options
const CAMERA_FILTERS = [
  { id: 'none', label: 'Normal', css: 'none' },
  { id: 'glow', label: 'Face Glow ✨', css: 'brightness(1.15) contrast(1.05) saturate(1.1)' },
  { id: 'vintage', label: 'Vintage 📷', css: 'sepia(0.4) contrast(1.1) brightness(0.95)' },
  { id: 'cyberpunk', label: 'Cyberpunk 🌆', css: 'hue-rotate(190deg) saturate(1.8) contrast(1.2)' },
  { id: 'sunset', label: 'Warm Sunset 🌅', css: 'sepia(0.3) saturate(1.4) hue-rotate(-15deg)' },
  { id: 'noir', label: 'B&W Noir 🖤', css: 'grayscale(1) contrast(1.3)' },
];

// AR Emoji Masks
const EMOJI_MASKS = [
  { id: 'none', label: 'Off', emoji: '' },
  { id: 'crown', label: 'Crown 👑', emoji: '👑' },
  { id: 'shades', label: 'Shades 😎', emoji: '😎' },
  { id: 'sparkles', label: 'Halo ✨', emoji: '✨' },
  { id: 'party', label: 'Party 🥳', emoji: '🥳' },
  { id: 'fire', label: 'Fire 🔥', emoji: '🔥' },
];

// Target Languages for Chat Translation
const LANGUAGES = [
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
];

// Country Filter Options
const COUNTRIES = [
  { code: 'GLOBAL', name: 'Global 🌐' },
  { code: 'IN', name: 'India 🇮🇳' },
  { code: 'US', name: 'USA 🇺🇸' },
  { code: 'JP', name: 'Japan 🇯🇵' },
  { code: 'AE', name: 'UAE 🇦🇪' },
  { code: 'GB', name: 'UK 🇬🇧' },
];

// Demo / Practice Partners (Optional single-player testing)
const DEMO_MATCH_POOL = [
  {
    id: 'usr_priya99',
    name: 'Priya Sharma',
    country: 'India 🇮🇳',
    countryCode: 'IN',
    age: 22,
    gender: 'Female 👧',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-a-video-call-with-a-smartphone-43521-large.mp4',
    greeting: 'Namaste! Hi there, glad to connect on live video chat!',
    isRealPeer: false,
  },
  {
    id: 'usr_alex_ny',
    name: 'Alex Rivera',
    country: 'USA 🇺🇸',
    countryCode: 'US',
    age: 25,
    gender: 'Male 👦',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-waving-in-a-video-call-43518-large.mp4',
    greeting: 'Hey! Greetings from New York! How are you doing today?',
    isRealPeer: false,
  },
];

export const VideoPage: React.FC = () => {
  const { socket, presenceStats, mySocketUserId } = useSocket();
  const { user, token } = useAuth();

  // Media State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Filters & Masks
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedMask, setSelectedMask] = useState('none');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // OmeTV Preferences
  const [selectedCountry, setSelectedCountry] = useState('GLOBAL');
  const [userGender, setUserGender] = useState('Male 👦');

  // Match State
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any | null>(null);
  const [friendStatus, setFriendStatus] = useState<string>('NONE');

  // Chat & Translation
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);

  // Floating Reactions
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);

  // AI Detection State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // WebRTC & Media Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Local Webcam Stream
  useEffect(() => {
    async function startCamera() {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        });

        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error('[Webcam Access Error]:', err);
        setCameraError('Camera / Mic permission denied. Please allow camera access in browser.');
      }
    }

    startCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  // WebRTC PeerConnection Creation Helper
  const createPeerConnection = (roomId: string) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ],
    });

    // Add local tracks to WebRTC PeerConnection
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, mediaStreamRef.current!);
      });
    }

    // Handle remote stream video track arrival
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Relay local ICE Candidates to socket partner
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('match:signal_ice', {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Real-Time Socket Matchmaking & WebRTC Event Listeners
  useEffect(() => {
    if (!socket) return;

    // 1. Searching / Waiting in Queue
    const handleWaiting = () => {
      setIsSearching(true);
      setCurrentMatch(null);
    };

    // 2. Real Match Found with another live browser tab/user
    const handleMatchFound = async (data: {
      roomId: string;
      partnerId: string;
      partnerName: string;
      partnerCountry: string;
      partnerGender: string;
      isInitiator: boolean;
    }) => {
      setIsSearching(false);
      currentRoomIdRef.current = data.roomId;
      setFriendStatus('NONE');

      const matchObj = {
        id: data.partnerId,
        name: data.partnerName,
        country: data.partnerCountry,
        gender: data.partnerGender,
        isRealPeer: true,
      };
      setCurrentMatch(matchObj);

      const pc = createPeerConnection(data.roomId);

      if (data.isInitiator) {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('match:signal_offer', { roomId: data.roomId, offer });
        } catch (err) {
          console.error('[WebRTC Offer Error]:', err);
        }
      }
    };

    // 3. WebRTC Signal Offer Received from peer
    const handleSignalOffer = async (data: { offer: any; senderId: string }) => {
      if (!peerConnectionRef.current || !currentRoomIdRef.current) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('match:signal_answer', {
          roomId: currentRoomIdRef.current,
          answer,
        });
      } catch (err) {
        console.error('[WebRTC Answer Error]:', err);
      }
    };

    // 4. WebRTC Signal Answer Received from peer
    const handleSignalAnswer = async (data: { answer: any; senderId: string }) => {
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error('[WebRTC Remote Answer Error]:', err);
      }
    };

    // 5. WebRTC ICE Candidate Received from peer
    const handleSignalIce = async (data: { candidate: any; senderId: string }) => {
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error('[WebRTC ICE Error]:', err);
      }
    };

    // 6. Real-Time Chat Message Received from peer
    const handleChatMessage = (msg: { id: string; senderId: string; senderName: string; text: string; timestamp: string }) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          sender: msg.senderName,
          text: msg.text,
          time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isPartner: msg.senderId !== mySocketUserId,
        },
      ]);
    };

    // 7. Match Partner Skipped / Disconnected
    const handlePartnerLeft = () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setCurrentMatch(null);
      currentRoomIdRef.current = null;
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'sys_' + Date.now(),
          sender: 'System',
          text: 'Partner skipped or disconnected.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isPartner: true,
        },
      ]);
    };

    socket.on('match:waiting', handleWaiting);
    socket.on('match:found', handleMatchFound);
    socket.on('match:signal_offer', handleSignalOffer);
    socket.on('match:signal_answer', handleSignalAnswer);
    socket.on('match:signal_ice', handleSignalIce);
    socket.on('match:chat_message', handleChatMessage);
    socket.on('match:partner_left', handlePartnerLeft);

    return () => {
      socket.off('match:waiting', handleWaiting);
      socket.off('match:found', handleMatchFound);
      socket.off('match:signal_offer', handleSignalOffer);
      socket.off('match:signal_answer', handleSignalAnswer);
      socket.off('match:signal_ice', handleSignalIce);
      socket.off('match:chat_message', handleChatMessage);
      socket.off('match:partner_left', handlePartnerLeft);
    };
  }, [socket, mySocketUserId]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  // Main Action: Real Match Search across active browser windows/tabs
  const handleSearchMatch = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsSearching(true);
    setCurrentMatch(null);
    setChatMessages([]);
    setFriendStatus('NONE');

    if (socket) {
      socket.emit('match:search', {
        country: selectedCountry,
        gender: userGender,
        name: user?.nickname || user?.displayName || mySocketUserId,
      });
    }
  };

  // Single-player Demo Practice Match if testing alone without 2nd tab
  const handleDemoPracticeMatch = () => {
    setIsSearching(true);
    setCurrentMatch(null);
    setChatMessages([]);
    setFriendStatus('NONE');

    setTimeout(() => {
      const randomMatch = DEMO_MATCH_POOL[Math.floor(Math.random() * DEMO_MATCH_POOL.length)];
      setCurrentMatch(randomMatch);
      setIsSearching(false);

      setChatMessages([
        {
          id: 'init_1',
          sender: randomMatch.name,
          text: randomMatch.greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isPartner: true,
        },
      ]);
    }, 1200);
  };

  const handleStopCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (socket) {
      socket.emit('match:leave');
    }
    setCurrentMatch(null);
    setIsSearching(false);
    setChatMessages([]);
  };

  const handleAddFriend = async () => {
    if (!currentMatch) return;
    try {
      setFriendStatus('PENDING');
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: currentMatch.id }),
      });

      const data = await res.json();
      if (res.ok && data.success && socket) {
        socket.emit('send_friend_request', { targetUserId: currentMatch.id });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // In-Call Chat Sender (Broadcasts to real peer in matched room)
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const rawText = chatInput.trim();
    setChatInput('');
    const senderName = user?.nickname || user?.displayName || mySocketUserId;

    // Send via socket to partner in current match room
    if (currentMatch?.isRealPeer && currentRoomIdRef.current && socket) {
      socket.emit('match:chat_message', {
        roomId: currentRoomIdRef.current,
        text: rawText,
        senderName,
      });
    } else {
      // Local addition for demo mode
      const myMsg = {
        id: 'msg_' + Date.now(),
        sender: senderName,
        text: rawText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPartner: false,
      };

      setChatMessages((prev) => [...prev, myMsg]);

      if (currentMatch && !currentMatch.isRealPeer) {
        setTimeout(async () => {
          try {
            setIsTranslating(true);
            const partnerReply = `Awesome! I agree with you about ${rawText.substring(0, 15)}...`;

            const res = await fetch('/api/ai/translate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                text: partnerReply,
                targetLanguage: targetLang,
              }),
            });

            const data = await res.json();
            const translatedMsg = data.success ? data.translatedText : partnerReply;

            setChatMessages((prev) => [
              ...prev,
              {
                id: 'reply_' + Date.now(),
                sender: currentMatch.name,
                text: translatedMsg,
                originalText: partnerReply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isPartner: true,
              },
            ]);
          } catch (err) {
            console.error(err);
          } finally {
            setIsTranslating(false);
          }
        }, 1200);
      }
    }
  };

  const sendReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) + 20;
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2200);
  };

  const handleAiDetection = async () => {
    if (!localVideoRef.current || !isVideoOn) {
      alert('Please turn on camera first.');
      return;
    }

    try {
      setAiAnalyzing(true);
      const videoEl = localVideoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoEl.videoWidth || 640;
      canvas.height = videoEl.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

      const res = await fetch('/api/ai/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageBase64, detectionType: 'FACE_EXPRESSION_GENDER' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiResult(data.detection);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const selectedCssFilter = CAMERA_FILTERS.find((f) => f.id === selectedFilter)?.css || 'none';
  const activeEmojiMask = EMOJI_MASKS.find((m) => m.id === selectedMask)?.emoji || '';
  const onlineCount = presenceStats?.activeUsersOnline || 1;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-black text-white overflow-hidden relative">
      <canvas ref={canvasRef} className="hidden" />

      {/* Floating Reaction Animations */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-20 text-5xl animate-bounce transition-all duration-1000 ease-out drop-shadow-lg"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Main 2-Split Full-Screen Big Camera Viewports */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 h-full w-full relative overflow-hidden">
        {/* TOP / LEFT SCREEN: Remote Partner Video Feed */}
        <div className="relative w-full h-full bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800/80 flex items-center justify-center overflow-hidden">
          {currentMatch ? (
            <div className="relative w-full h-full">
              {currentMatch.isRealPeer ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={currentMatch.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Partner Profile Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 shadow-xl">
                <Avatar name={currentMatch.name} src={currentMatch.avatar} size="md" status="online" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {currentMatch.name}
                    <span className="text-xs">{currentMatch.country}</span>
                    {currentMatch.isRealPeer && (
                      <Badge variant="success" size="sm">
                        LIVE Peer
                      </Badge>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    {currentMatch.gender} {currentMatch.age ? `• Age ${currentMatch.age}` : ''}
                  </p>
                </div>
              </div>

              {/* Add Friend Button */}
              <div className="absolute top-4 right-4 z-20">
                {friendStatus === 'NONE' ? (
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={handleAddFriend}
                    leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  >
                    Add Friend
                  </Button>
                ) : friendStatus === 'PENDING' ? (
                  <Badge variant="warning" size="md">
                    Sent
                  </Badge>
                ) : (
                  <Badge variant="success" size="md">
                    Friends ❤️
                  </Badge>
                )}
              </div>
            </div>
          ) : isSearching ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-6 bg-slate-950/90 w-full h-full">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                <Tv className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-white tracking-wide">Searching for live online partners...</p>
              <p className="text-xs text-indigo-300/80 max-w-sm">
                Open a second browser tab at <strong>localhost:3000</strong> to test 1-on-1 WebRTC video call & live text chat!
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDemoPracticeMatch}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Or Test Demo Bot Match
              </Button>
            </div>
          ) : (
            /* OmeTV Style Logo & Search Screen */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 space-y-4">
              <div className="relative">
                <div className="w-24 h-20 bg-amber-800/60 border-2 border-amber-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative">
                  <div className="absolute -top-4 w-12 h-4 border-t-2 border-l-2 border-amber-500 rotate-45" />
                  <Tv className="w-8 h-8 text-amber-300" />
                  <span className="text-xs font-black tracking-widest text-white uppercase font-mono mt-0.5">
                    JustYou
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800 text-xs font-medium text-emerald-400 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{onlineCount.toLocaleString()} online users</span>
              </div>

              {/* OmeTV Style Country & Gender Selection Controls */}
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3 py-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">COUNTRY:</span>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3 py-2 flex items-center gap-2 text-xs"
                  style={{ color: '#a1c7b9' }}
                >
                  <span className="font-bold uppercase text-[10px]" style={{ color: '#a1c7b9' }}>MY GENDER:</span>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="bg-transparent font-bold focus:outline-none cursor-pointer"
                    style={{ color: '#a1c7b9' }}
                  >
                    <option value="Male 👦" className="bg-slate-900">Male 👦</option>
                    <option value="Female 👧" className="bg-slate-900">Female 👧</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM / RIGHT SCREEN: Self Local Webcam Feed */}
        <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="text-center p-6 space-y-2 text-rose-300">
              <Camera className="w-8 h-8 mx-auto text-rose-400" />
              <p className="text-xs">{cameraError}</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{ filter: selectedCssFilter }}
                className={`w-full h-full object-cover transform -scale-x-100 ${!isVideoOn ? 'hidden' : 'block'}`}
              />

              {/* AR Mask Overlay */}
              {activeEmojiMask && isVideoOn && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl pointer-events-none drop-shadow-xl z-30 animate-pulse">
                  {activeEmojiMask}
                </div>
              )}

              {!isVideoOn && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 text-sm">
                  <VideoOff className="w-10 h-10 mb-2 text-slate-600" />
                  Camera Paused
                </div>
              )}

              {/* Self Label Badge */}
              <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono text-slate-200 border border-slate-800">
                You ({user?.nickname || mySocketUserId})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Filter Selection Modal */}
      {showFilterModal && (
        <div className="absolute bottom-20 left-4 z-50 bg-slate-950/95 border border-slate-700 p-4 rounded-3xl shadow-2xl max-w-xs w-full space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Camera Filters & AR
            </span>
            <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Visual Effects</span>
            <div className="grid grid-cols-2 gap-1.5">
              {CAMERA_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-2 py-1.5 rounded-xl text-xs text-left cursor-pointer ${
                    selectedFilter === f.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 border-t border-slate-800 pt-2">
            <span className="text-[10px] text-slate-400 font-mono">AR Emoji Masks</span>
            <div className="grid grid-cols-3 gap-1.5">
              {EMOJI_MASKS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMask(m.id)}
                  className={`p-1.5 rounded-xl text-xs text-center cursor-pointer ${
                    selectedMask === m.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide-over / Drawer Chat Overlay Panel */}
      {showChatOverlay && (
        <div className="absolute top-0 right-0 bottom-16 w-80 max-w-full z-40 bg-slate-950/95 border-l border-slate-800 flex flex-col shadow-2xl backdrop-blur-xl">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" /> In-Call Live Chat
            </span>
            <div className="flex items-center gap-2">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-900 text-xs text-indigo-300 border border-slate-700 rounded-lg px-2 py-0.5 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
              <button onClick={() => setShowChatOverlay(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
            {chatMessages.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-10">Type a message below to chat with your live video partner!</p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isPartner ? 'items-start' : 'items-end'}`}>
                  <span className="text-[10px] text-slate-400 font-mono mb-0.5">{msg.sender}</span>
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${
                      msg.isPartner ? 'bg-slate-900 text-slate-200 border border-slate-800' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.originalText && (
                      <p className="text-[9px] text-indigo-300 pt-1 border-t border-indigo-500/20 italic">
                        Orig: "{msg.originalText}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isTranslating && <p className="text-[10px] text-indigo-400 italic animate-pulse">Translating...</p>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendChatMessage} className="p-2.5 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* AI Analysis Floating Pill if active */}
      {aiResult && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-indigo-500/40 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white">{aiResult.primaryEmotion}</span>
          <span className="text-slate-400 italic truncate max-w-xs font-mono">"{aiResult.suggestedIcebreaker}"</span>
          <button onClick={() => setAiResult(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Bottom Video Call Controls Overlay */}
      <div className="w-full bg-slate-950/90 border-t border-slate-800/80 p-2.5 px-4 flex items-center justify-between gap-2 z-30 backdrop-blur-md">
        {/* Left Side: Mic, Video, Filter, Reactions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isMicOn ? 'bg-slate-900 border-slate-700 text-white' : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
            }`}
            title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isVideoOn ? 'bg-slate-900 border-slate-700 text-white' : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
            }`}
            title={isVideoOn ? 'Pause Video' : 'Resume Video'}
          >
            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 hover:text-white cursor-pointer"
            title="Filters & Masks"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['❤️', '🔥', '😂', '👍'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="hover:scale-125 transition-transform text-sm p-1 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Search / Next / Stop Call Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="gradient"
            size="md"
            isLoading={isSearching}
            onClick={handleSearchMatch}
            leftIcon={<SkipForward className="w-4 h-4" />}
          >
            {currentMatch ? 'Next Match' : 'Start Match'}
          </Button>

          {currentMatch && (
            <button
              onClick={handleStopCall}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <PhoneOff className="w-4 h-4" /> Stop
            </button>
          )}
        </div>

        {/* Right Side: AI Expression & Chat Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAiDetection}
            disabled={aiAnalyzing}
            className="p-2.5 bg-indigo-950 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold cursor-pointer hidden md:flex items-center gap-1"
            title="AI Camera Analysis"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" /> AI Detect
          </button>

          <button
            onClick={() => setShowChatOverlay(!showChatOverlay)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              showChatOverlay ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
            title="Toggle In-Call Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
