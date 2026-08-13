import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { getApiConfig, setUseMockApi, setBaseUrl, getFaceApiBaseUrl, setFaceApiBaseUrl } from '../services/api';
import { Sliders, Cpu, Database, Camera, Mic, CheckCircle2, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [useMock, setUseMock] = useState<boolean>(getApiConfig().useMockApi);
  const [apiUrl, setApiUrl] = useState<string>(getApiConfig().baseUrl);
  const [faceApiUrl, setFaceApiUrl] = useState<string>(getFaceApiBaseUrl());
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleToggleMock = (val: boolean) => {
    setUseMock(val);
    setUseMockApi(val);
  };

  const handleSaveSettings = () => {
    setBaseUrl(apiUrl);
    setFaceApiBaseUrl(faceApiUrl);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#0B0D10] border border-[#202630] rounded-md p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider">
          <Sliders size={16} />
          <span>SYSTEM CONFIGURATION & API PREFERENCES</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide">
          SYSTEM SETTINGS
        </h1>
        <p className="text-xs text-[#8D949F] max-w-2xl">
          Configure API service layer endpoints, backend integration modes, stream sample rates, and hardware device preferences.
        </p>
      </div>

      {savedNotice && (
        <div className="bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 p-3 rounded text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 size={16} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Backend API Service Layer Settings */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#202630] pb-3">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[#3B82F6]" />
            <h2 className="text-xs font-mono text-[#F4F1EA] font-semibold uppercase">
              API SERVICE LAYER CONFIGURATION
            </h2>
          </div>
          <StatusBadge status={useMock ? 'ready' : 'processing'} label={useMock ? 'MOCK LAYER' : 'LIVE API'} />
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-[#0B0D10] rounded border border-[#202630]">
            <div>
              <p className="font-semibold text-[#F4F1EA]">Use Realistic Mock API Layer</p>
              <p className="text-[#8D949F] text-[11px] mt-0.5">
                Simulates asynchronous network predictions locally. Disable to route requests to production REST endpoints.
              </p>
            </div>

            <button
              onClick={() => handleToggleMock(!useMock)}
              className={`px-4 py-1.5 rounded text-xs font-mono font-semibold cursor-pointer transition-colors ${
                useMock ? 'bg-[#3B82F6] text-[#F4F1EA]' : 'bg-[#161B22] text-[#8D949F] border border-[#202630]'
              }`}
            >
              {useMock ? 'ENABLED (MOCK)' : 'DISABLED (REST)'}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#8D949F] uppercase block">
              PRODUCTION REST BACKEND BASE URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
              className="w-full bg-[#0B0D10] border border-[#202630] rounded px-3 py-2 text-xs text-[#F4F1EA] font-mono outline-none focus:border-[#3B82F6]"
            />
            <p className="text-[10px] text-[#8D949F] pt-0.5">
              Target endpoints: /api/analyze/facial, /api/analyze/audio, /api/analyze/numerical, /api/analyze/fusion
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#8D949F] uppercase block">
              FACE ANALYSIS FLASK BACKEND URL
            </label>
            <input
              type="text"
              value={faceApiUrl}
              onChange={(e) => setFaceApiUrl(e.target.value)}
              placeholder="http://localhost:5000"
              className="w-full bg-[#0B0D10] border border-[#202630] rounded px-3 py-2 text-xs text-[#F4F1EA] font-mono outline-none focus:border-[#3B82F6]"
            />
            <p className="text-[10px] text-[#8D949F] pt-0.5">
              Camera analysis posts to: {faceApiUrl}/api/analyze/face
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#202630] flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Save Configuration</span>
          </button>
        </div>
      </Card>

      {/* Hardware Devices & Stream Throttling */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#202630] pb-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#60A5FA]" />
            <h2 className="text-xs font-mono text-[#F4F1EA] font-semibold uppercase">
              HARDWARE STREAM THROTTLING
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#0B0D10] p-4 rounded border border-[#202630] space-y-2">
            <div className="flex items-center gap-2 text-[#3B82F6]">
              <Camera size={16} />
              <span className="font-mono font-semibold">FACIAL STREAM RATE</span>
            </div>
            <p className="text-[11px] text-[#8D949F]">Target frame prediction rate for webcam feed analysis.</p>
            <div className="font-mono text-sm text-[#F4F1EA] font-semibold pt-1">3 FPS (333ms sampling interval)</div>
          </div>

          <div className="bg-[#0B0D10] p-4 rounded border border-[#202630] space-y-2">
            <div className="flex items-center gap-2 text-[#60A5FA]">
              <Mic size={16} />
              <span className="font-mono font-semibold">AUDIO SAMPLING RATE</span>
            </div>
            <p className="text-[11px] text-[#8D949F]">FFT acoustic window interval for speech feature extraction.</p>
            <div className="font-mono text-sm text-[#F4F1EA] font-semibold pt-1">1.5 Seconds (Wav2Vec2 Window)</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
