import React, { useEffect, useState } from 'react';
import { X, Camera, Mic, MicOff, Radio, Volume2, VolumeX, AlertCircle, Activity, ShieldCheck, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '../../contexts/AuthContext';
import { DriverMediaRequest, DriverMediaStream, MediaRequestKind } from '../../types';
import { requestDriverMedia, subscribeToDriverMediaRequest, subscribeToDriverMediaStream, closeDriverMediaRequest, simulateDriverResponse } from '../../services/driverMediaService';
import { subscribeToWebRtcStream, WebRtcCallStats } from '../../services/webrtcAdminService';
import { DriverSafetyVideoViewport } from './DriverSafetyVideoViewport';

interface DriverSafetyMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverUid: string;
  driverName: string;
  driverEmail?: string;
  lineId?: string;
  companyId?: string;
  cameraMonitored?: boolean;
  micMonitored?: boolean;
  latitude?: number;
  longitude?: number;
}

export const DriverSafetyMediaModal: React.FC<DriverSafetyMediaModalProps> = ({
  isOpen,
  onClose,
  driverUid: initialDriverUid,
  driverName: initialDriverName,
  driverEmail: initialDriverEmail,
  lineId,
  cameraMonitored = false,
  micMonitored = false,
  latitude,
  longitude,
}) => {
  const { adminSession } = useAdminAuth();
  const [activeDriverUid, setActiveDriverUid] = useState(initialDriverUid);
  const [activeDriverName, setActiveDriverName] = useState(initialDriverName);
  const [mediaRequest, setMediaRequest] = useState<DriverMediaRequest | null>(null);
  const [streamData, setStreamData] = useState<DriverMediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [webrtcStats, setWebRtcStats] = useState<WebRtcCallStats | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  // Sync initial props
  useEffect(() => {
    setActiveDriverUid(initialDriverUid);
    setActiveDriverName(initialDriverName);
  }, [initialDriverUid, initialDriverName]);

  // Subscribe to real-time driver consent response
  useEffect(() => {
    if (!isOpen || !activeDriverUid) return;
    const unsubscribe = subscribeToDriverMediaRequest(activeDriverUid, (req) => {
      setMediaRequest(req);
    });
    return () => unsubscribe();
  }, [isOpen, activeDriverUid]);

  // Subscribe to live frame stream
  useEffect(() => {
    if (!isOpen || !activeDriverUid) return;
    const unsubscribe = subscribeToDriverMediaStream(activeDriverUid, (data) => {
      setStreamData(data);
    });
    return () => unsubscribe();
  }, [isOpen, activeDriverUid]);

  // Subscribe to WebRTC P2P 30 FPS Stream upon driver acceptance
  useEffect(() => {
    if (!isOpen || !activeDriverUid || mediaRequest?.status !== 'accepted') {
      setRemoteStream(null);
      setWebRtcStats(null);
      return;
    }
    const unsubscribe = subscribeToWebRtcStream(
      activeDriverUid,
      (stream) => setRemoteStream(stream),
      (stats) => setWebRtcStats(stats)
    );
    return () => {
      unsubscribe();
      setRemoteStream(null);
      setWebRtcStats(null);
    };
  }, [isOpen, activeDriverUid, mediaRequest?.status]);

  // Session duration timer for active accepted streams
  useEffect(() => {
    if (mediaRequest?.status !== 'accepted') {
      setElapsedSecs(0);
      return;
    }
    const interval = setInterval(() => setElapsedSecs((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [mediaRequest?.status]);

  if (!isOpen) return null;

  const handleSendRequest = async (kind: MediaRequestKind) => {
    setSubmitting(true);
    try {
      const requester = adminSession?.email || 'masteradmin@wasalt.eg';
      await requestDriverMedia(activeDriverUid, kind, requester);
      toast.success(`SafeTrip ${kind.toUpperCase()} access request dispatched to driver handset.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch media check request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    try {
      await closeDriverMediaRequest(activeDriverUid);
      setStreamData(null);
      setRemoteStream(null);
      setWebRtcStats(null);
      toast.info('Safety check stream ended.');
    } catch {
      // ignore
    }
  };

  const handleSimulateConsent = async (approved: boolean) => {
    try {
      await simulateDriverResponse(activeDriverUid, approved);
      toast.info(`Simulated driver response: ${approved ? 'Accepted' : 'Declined'}`);
    } catch (err: any) {
      toast.error(err.message || 'Simulation error');
    }
  };

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const isStreaming = mediaRequest?.status === 'accepted';
  const showVideo = isStreaming && (mediaRequest?.kind === 'video' || mediaRequest?.kind === 'both');
  const showAudio = isStreaming && (mediaRequest?.kind === 'audio' || mediaRequest?.kind === 'both');

  const switchToActiveDriver = () => {
    setActiveDriverUid('K3oE4lcub6gjAmbWxSc2mWhTNR73');
    setActiveDriverName('Kareem Diyaa (Active Driver)');
    toast.success('Target switched to active driver handset (kareemdiyaaa200@gmail.com)');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{activeDriverName}</h3>
                {lineId && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    Line {lineId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs">{initialDriverEmail || activeDriverUid}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sensor Hardware Availability Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-slate-400">
                <Camera className={`w-3 h-3 ${cameraMonitored ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={cameraMonitored ? 'text-emerald-300' : 'text-slate-500'}>CAM</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Mic className={`w-3 h-3 ${micMonitored ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={micMonitored ? 'text-emerald-300' : 'text-slate-500'}>MIC</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Target Driver Switcher Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <span className="text-[10px] font-mono uppercase text-slate-500">Target UID:</span>
            <span className="font-mono text-slate-300 truncate max-w-[200px]">{activeDriverUid}</span>
          </div>
          {activeDriverUid !== 'K3oE4lcub6gjAmbWxSc2mWhTNR73' && (
            <button
              type="button"
              onClick={switchToActiveDriver}
              className="px-2 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Target Active Driver (Kareem Diyaa)
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Stream Status Banner */}
          {mediaRequest && mediaRequest.status === 'pending' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Radio className="w-4 h-4 animate-spin" />
                  Awaiting Driver Consent
                </div>
                <span className="text-[11px] text-amber-300/80 font-mono">
                  Requested {new Date(mediaRequest.requestedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                A SafeTrip prompt was delivered to the driver's phone cockpit. Streams never activate without driver authorization.
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleEndSession}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel Request
                </button>
                <button
                  onClick={() => handleSimulateConsent(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
                  title="Simulate driver tapping 'Accept' in the mobile app for testing"
                >
                  Simulate Accept (Test)
                </button>
              </div>
            </div>
          )}

          {mediaRequest && mediaRequest.status === 'declined' && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Safety Check Declined</h4>
                <p className="text-xs text-slate-300">
                  The driver declined the requested audio/video inspection at{' '}
                  {mediaRequest.respondedAt ? new Date(mediaRequest.respondedAt).toLocaleTimeString() : 'just now'}.
                </p>
              </div>
            </div>
          )}

          {/* Active Live Streaming Viewports */}
          {isStreaming ? (
            <div className="space-y-4">
              {/* Connected Header */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  SafeTrip Stream Active · {mediaRequest.kind.toUpperCase()}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-emerald-300">
                  <span>REC {formatTimer(elapsedSecs)}</span>
                  <button
                    onClick={handleEndSession}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-sans font-bold text-xs transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Video Viewport HUD (P2P 30 FPS WebRTC) */}
              {showVideo && (
                <DriverSafetyVideoViewport
                  streamData={streamData}
                  remoteStream={remoteStream}
                  webrtcStats={webrtcStats}
                  isMuted={isMuted}
                  driverName={activeDriverName}
                  lineId={lineId}
                  latitude={latitude}
                  longitude={longitude}
                />
              )}

              {/* Audio Monitor & Waveform */}
              {showAudio && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                      {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        Live Audio Monitor
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {isMuted ? 'MUTED' : remoteStream ? 'P2P OPUS LIVE' : '-18 dB RMS'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Cabin interior microphone telemetry stream</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-1 h-6 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                      {[40, 75, 55, 90, 60, 80, 45].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-emerald-500 rounded-full transition-all duration-150 animate-pulse"
                          style={{ height: isMuted ? '4px' : `${h}%` }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Request Trigger Controls */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Activity className="w-4 h-4 text-brand-400" />
                  Remote Cabin Inspection Protocol (WebRTC P2P)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Initiate a real-time 30 FPS audio or video safety check. By SafeTrip regulatory standards, the driver must grant permission on their handset before peer-to-peer feeds activate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { kind: 'video' as const, title: 'Video Only', desc: 'Cabin front & rear camera feed (30 FPS)', icon: Camera },
                  { kind: 'audio' as const, title: 'Audio Only', desc: 'Cabin microphone listening (Opus audio)', icon: Mic },
                  { kind: 'both' as const, title: 'Full SafeTrip AV', desc: 'Simultaneous 30 FPS video & audio', icon: ShieldCheck, highlight: true },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.kind}
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSendRequest(opt.kind)}
                      className={`p-4 rounded-2xl border text-left transition-all group disabled:opacity-50 ${
                        opt.highlight
                          ? 'bg-gradient-to-b from-brand-500/10 to-transparent hover:from-brand-500/20 border-brand-500/30'
                          : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-brand-500/40'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{opt.title}</h4>
                      <p className={`text-[11px] leading-tight ${opt.highlight ? 'text-brand-300/80' : 'text-slate-400'}`}>
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
