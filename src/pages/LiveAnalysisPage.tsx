import React, { useState } from 'react';
import { LiveDashboard } from '../components/live/LiveDashboard';
import { Sliders } from 'lucide-react';

export const LiveAnalysisPage: React.FC = () => {
  const [facialFps, setFacialFps] = useState<number>(3);
  const [audioInterval, setAudioInterval] = useState<number>(1.5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide">
            LIVE MULTIMODAL ANALYSIS WORKSTATION
          </h1>
          <p className="text-xs text-[#8D949F] mt-1 max-w-2xl">
            Real-time streaming integration for facial expression video feed, microphone acoustic FFT audio analysis, and live biophysical signal monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#101318] p-2 rounded border border-[#202630] text-xs">
          <div className="flex items-center gap-1.5 text-[#8D949F]">
            <Sliders size={14} className="text-[#3B82F6]" />
            <span className="font-mono">THROTTLE:</span>
          </div>

          <select
            value={facialFps}
            onChange={(e) => setFacialFps(parseInt(e.target.value))}
            className="bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono outline-none cursor-pointer"
          >
            <option value={2}>2 FPS Facial</option>
            <option value={3}>3 FPS Facial</option>
            <option value={5}>5 FPS Facial</option>
          </select>

          <select
            value={audioInterval}
            onChange={(e) => setAudioInterval(parseFloat(e.target.value))}
            className="bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono outline-none cursor-pointer"
          >
            <option value={1.0}>1.0s Audio</option>
            <option value={1.5}>1.5s Audio</option>
            <option value={2.0}>2.0s Audio</option>
          </select>
        </div>
      </div>

      <LiveDashboard facialRateFps={facialFps} audioIntervalSec={audioInterval} />
    </div>
  );
};
