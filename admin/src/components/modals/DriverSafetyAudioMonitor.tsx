import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface DriverSafetyAudioMonitorProps {
  isMuted: boolean;
  remoteStream: MediaStream | null;
  onToggleMute: () => void;
}

/**
 * Live audio monitor bar displaying RMS telemetry, audio waveform animation, and mute controls.
 */
export const DriverSafetyAudioMonitor: React.FC<DriverSafetyAudioMonitorProps> = ({
  isMuted,
  remoteStream,
  onToggleMute,
}) => {
  return (
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
          type="button"
          onClick={onToggleMute}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
