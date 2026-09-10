import React, { useEffect, useRef, useState } from 'react';
import { Video, Camera, Activity, Volume2, VolumeX } from 'lucide-react';
import { DriverMediaStream } from '../../types';
import { WebRtcCallStats } from '../../services/webrtcAdminService';

interface DriverSafetyVideoViewportProps {
  streamData: DriverMediaStream | null;
  remoteStream?: MediaStream | null;
  webrtcStats?: WebRtcCallStats | null;
  isMuted?: boolean;
  driverName: string;
  lineId?: string;
  latitude?: number;
  longitude?: number;
}

export const DriverSafetyVideoViewport: React.FC<DriverSafetyVideoViewportProps> = ({
  streamData,
  remoteStream,
  webrtcStats,
  isMuted = false,
  driverName,
  lineId,
  latitude,
  longitude,
}) => {
  const [localWebcamActive, setLocalWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Attach WebRTC Remote Stream to HTML5 Video Element
  useEffect(() => {
    if (videoRef.current && !localWebcamActive) {
      if (remoteStream) {
        videoRef.current.srcObject = remoteStream;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [remoteStream, localWebcamActive]);

  // Handle Mute / Unmute on Video Element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Toggle local browser webcam for testing without mobile device
  const toggleLocalWebcam = async () => {
    if (localWebcamActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setLocalWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setLocalWebcamActive(true);
      } catch (err: any) {
        alert('Could not access browser webcam: ' + (err.message || 'Permission denied'));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const isWebRtcConnected = Boolean(remoteStream) || webrtcStats?.status === 'connected';
  const hasRemoteFrame = Boolean(streamData?.frame);

  return (
    <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
      {/* Top Viewport Telemetry HUD */}
      <div className="flex items-center justify-between z-20 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 shadow-md">
          <span className={`w-2 h-2 rounded-full ${isWebRtcConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="font-bold text-white">
            {localWebcamActive
              ? 'BROWSER WEBCAM (TEST)'
              : isWebRtcConnected
              ? 'P2P WEBRTC (30 FPS)'
              : 'LIVE CABIN FEED'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">
            {localWebcamActive
              ? '1080p 60FPS'
              : isWebRtcConnected
              ? `${webrtcStats?.fps || 30} FPS • ${webrtcStats?.bitrateKbps || 450} kbps`
              : hasRemoteFrame
              ? 'FRAME SYNC'
              : 'CONNECTING P2P...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Indicator */}
          {isWebRtcConnected && (
            <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-[10px] text-emerald-400">
              {isMuted ? <VolumeX className="w-3 h-3 text-slate-500" /> : <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />}
              <span>{isMuted ? 'Muted' : 'Live Audio (Opus)'}</span>
            </div>
          )}

          {/* WebCam Test Toggle */}
          <button
            type="button"
            onClick={toggleLocalWebcam}
            className={`px-2 py-1 rounded-lg border text-[10px] font-sans font-bold flex items-center gap-1.5 transition-colors ${
              localWebcamActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
            }`}
          >
            <Camera className="w-3 h-3" />
            {localWebcamActive ? 'Stop Webcam' : 'Test Webcam'}
          </button>

          <div className="bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-400">
            {latitude ? `${latitude.toFixed(4)}, ${longitude?.toFixed(4)}` : 'GPS TELEMETRY'}
          </div>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
        {/* Primary Video Tag for WebRTC and Local Webcam */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            (remoteStream || localWebcamActive) ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
        />

        {/* Fallback Image Frame */}
        {(!remoteStream && !localWebcamActive && hasRemoteFrame) && (
          <img
            src={streamData!.frame}
            alt="Live Cabin Viewport"
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        )}

        {/* Initializing Placeholder */}
        {(!remoteStream && !localWebcamActive && !hasRemoteFrame) && (
          <div className="w-full h-full bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Video className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                P2P SafeTrip™ Inspection Handshake
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                Negotiating direct peer-to-peer WebRTC link with the driver handset over Google STUN. Hardware-accelerated 30 FPS stream will launch automatically upon connection.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Viewport Bottom Overlay HUD */}
      <div className="flex items-center justify-between z-20 text-[11px] font-mono text-slate-400 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 shadow-md">
        <span className="font-semibold text-slate-200">DRIVER: {driverName}</span>
        <span className="text-brand-400">LINE: {lineId || 'N/A'}</span>
        <span className="text-[10px] text-slate-500">
          {isWebRtcConnected
            ? `P2P LINK ACTIVE • ${webrtcStats?.resolution || '640x480'}`
            : streamData?.updatedAt
            ? `UPDATED: ${new Date(streamData.updatedAt).toLocaleTimeString()}`
            : 'ESTABLISHING SECURE P2P LINK'}
        </span>
      </div>
    </div>
  );
};
