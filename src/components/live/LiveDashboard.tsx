import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Camera, Mic, Activity, RefreshCw, Heart, Zap, Sparkles } from 'lucide-react';
import { useMediaDevices } from '../../hooks/useMediaDevices';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

interface LiveDashboardProps {
  facialRateFps?: number; // 2 to 5 facial predictions per sec
  audioIntervalSec?: number; // 1 to 2 seconds
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  facialRateFps = 3,
  audioIntervalSec = 1.5
}) => {
  const { videoRef, startCamera, stopCamera } = useMediaDevices();
  const { waveformData, startRecording, stopRecording } = useAudioRecorder();

  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(false);

  const [facialEmotion, setFacialEmotion] = useState<string>('HAPPY');
  const [facialConfidence, setFacialConfidence] = useState<number>(84);

  const [voiceEmotion, setVoiceEmotion] = useState<string>('CALM');
  const [voiceConfidence, setVoiceConfidence] = useState<number>(72);

  const [heartRate, setHeartRate] = useState<number>(72);
  const [hrvIndex, setHrvIndex] = useState<number>(55.4);
  const [gsrLevel, setGsrLevel] = useState<number>(2.51);
  const [skinTemp, setSkinTemp] = useState<number>(36.7);

  const facialTimerRef = useRef<number | null>(null);
  const audioTimerRef = useRef<number | null>(null);
  const numericalTimerRef = useRef<number | null>(null);

  const handleStartLiveSession = async () => {
    setIsLiveStreamActive(true);
    await startCamera();
    await startRecording();
  };

  const handleStopLiveSession = () => {
    setIsLiveStreamActive(false);
    stopCamera();
    stopRecording();
  };

  useEffect(() => {
    if (isLiveStreamActive) {
      const facialIntervalMs = Math.round(1000 / facialRateFps);
      facialTimerRef.current = window.setInterval(() => {
        const facialEmotions = ['HAPPY', 'NEUTRAL', 'CALM', 'FOCUSED', 'SURPRISED'];
        const randomEm = facialEmotions[Math.floor(Math.random() * facialEmotions.length)];
        setFacialEmotion(randomEm);
        setFacialConfidence(Math.floor(Math.random() * 15) + 78);
      }, facialIntervalMs);

      audioTimerRef.current = window.setInterval(() => {
        const voiceEmotions = ['CALM', 'NEUTRAL', 'CONFIDENT', 'MILD STRESS', 'EXPRESSIVE'];
        const randomVoice = voiceEmotions[Math.floor(Math.random() * voiceEmotions.length)];
        setVoiceEmotion(randomVoice);
        setVoiceConfidence(Math.floor(Math.random() * 18) + 70);
      }, audioIntervalSec * 1000);

      numericalTimerRef.current = window.setInterval(() => {
        setHeartRate((prev) => Math.min(95, Math.max(65, prev + (Math.random() > 0.5 ? 1 : -1))));
        setHrvIndex((prev) => Math.round((prev + (Math.random() * 1.2 - 0.6)) * 10) / 10);
        setGsrLevel((prev) => Math.round((prev + (Math.random() * 0.1 - 0.05)) * 100) / 100);
        setSkinTemp((prev) => Math.round((prev + (Math.random() * 0.04 - 0.02)) * 10) / 10);
      }, 2500);
    } else {
      if (facialTimerRef.current) clearInterval(facialTimerRef.current);
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (numericalTimerRef.current) clearInterval(numericalTimerRef.current);
    }

    return () => {
      if (facialTimerRef.current) clearInterval(facialTimerRef.current);
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (numericalTimerRef.current) clearInterval(numericalTimerRef.current);
    };
  }, [isLiveStreamActive, facialRateFps, audioIntervalSec]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLiveStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
          <div>
            <h2 className="text-xs font-mono font-semibold text-[#F4F1EA] uppercase tracking-wider">
              {isLiveStreamActive ? 'LIVE MULTIMODAL STREAM ACTIVE' : 'STREAM STANDBY'}
            </h2>
            <p className="text-[11px] text-[#8D949F]">
              Configured Throttle: {facialRateFps} FPS Facial • {audioIntervalSec}s Audio Sampling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLiveStreamActive ? (
            <button
              onClick={handleStopLiveSession}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-[#F4F1EA] text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              Stop Live Session
            </button>
          ) : (
            <button
              onClick={handleStartLiveSession}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Initialize Live Stream</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#202630] pb-2">
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-[#3B82F6]" />
              <span className="text-xs font-mono text-[#F4F1EA] font-semibold">FACIAL CAMERA FEED</span>
            </div>
            <StatusBadge status={isLiveStreamActive ? 'processing' : 'ready'} label={isLiveStreamActive ? 'LIVE FEED' : 'READY'} />
          </div>

          <div className="relative bg-[#050608] border border-[#202630] rounded-md h-64 sm:h-72 overflow-hidden flex items-center justify-center">
            {isLiveStreamActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 border border-[#3B82F6]/50 pointer-events-none rounded flex items-center justify-center">
                  <div className="w-48 h-56 border-2 border-dashed border-[#60A5FA]/80 rounded-xl relative flex items-center justify-center">
                    <div className="absolute top-2 left-2 text-[10px] font-mono text-[#60A5FA] bg-black/60 px-1.5 py-0.5 rounded">
                      FACE MESH #01
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 space-y-2">
                <Camera size={36} className="text-[#8D949F] mx-auto opacity-50" />
                <p className="text-xs text-[#8D949F]">Click "Initialize Live Stream" to activate camera feed</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#202630]">
            <div className="bg-[#0B0D10] p-2.5 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">DETECTED EMOTION</span>
              <span className="text-lg font-mono font-semibold text-[#60A5FA] transition-all duration-300">
                {facialEmotion}
              </span>
            </div>
            <div className="bg-[#0B0D10] p-2.5 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">CONFIDENCE</span>
              <span className="text-lg font-mono font-semibold text-[#F4F1EA] transition-all duration-300">
                {facialConfidence}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#202630] pb-2">
            <div className="flex items-center gap-2">
              <Mic size={16} className="text-[#60A5FA]" />
              <span className="text-xs font-mono text-[#F4F1EA] font-semibold">VOICE ACOUSTIC STREAM</span>
            </div>
            <StatusBadge status={isLiveStreamActive ? 'processing' : 'ready'} label={isLiveStreamActive ? 'SAMPLING' : 'READY'} />
          </div>

          <div className="bg-[#050608] border border-[#202630] rounded-md h-64 sm:h-72 p-5 flex flex-col justify-between items-center text-center">
            <div className="w-full flex items-center justify-between text-xs font-mono text-[#8D949F]">
              <span>FFT WAVEFORM</span>
              <span className="text-[#60A5FA]">16.0 kHz</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 h-32 w-full py-2">
              {waveformData.map((val, idx) => (
                <div
                  key={idx}
                  className="w-2 bg-[#60A5FA] rounded-full transition-all duration-150 ease-out"
                  style={{ height: isLiveStreamActive ? `${val}%` : '20%' }}
                />
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#8D949F]">
              {isLiveStreamActive ? 'Acoustic spectral feature extraction active' : 'Microphone standby'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#202630]">
            <div className="bg-[#0B0D10] p-2.5 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">DETECTED VOICE EMOTION</span>
              <span className="text-lg font-mono font-semibold text-[#60A5FA] transition-all duration-300">
                {voiceEmotion}
              </span>
            </div>
            <div className="bg-[#0B0D10] p-2.5 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">CONFIDENCE</span>
              <span className="text-lg font-mono font-semibold text-[#F4F1EA] transition-all duration-300">
                {voiceConfidence}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#202630] pb-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-xs font-mono text-[#F4F1EA] font-semibold">LIVE PHYSIOLOGICAL SIGNALS</span>
          </div>
          <span className="text-[11px] font-mono text-[#8D949F]">Smooth value transitions enabled</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0B0D10] p-4 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span>HEART RATE</span>
              <Heart size={14} className="text-rose-400 animate-pulse" />
            </div>
            <div className="text-2xl font-mono font-semibold text-[#F4F1EA] transition-all duration-500">
              {heartRate} <span className="text-xs text-[#8D949F] font-sans">BPM</span>
            </div>
          </div>

          <div className="bg-[#0B0D10] p-4 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span>HRV INDEX</span>
              <Zap size={14} className="text-[#3B82F6]" />
            </div>
            <div className="text-2xl font-mono font-semibold text-[#60A5FA] transition-all duration-500">
              {hrvIndex} <span className="text-xs text-[#8D949F] font-sans">ms</span>
            </div>
          </div>

          <div className="bg-[#0B0D10] p-4 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span>GSR LEVEL</span>
              <Sparkles size={14} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-semibold text-[#F4F1EA] transition-all duration-500">
              {gsrLevel} <span className="text-xs text-[#8D949F] font-sans">µS</span>
            </div>
          </div>

          <div className="bg-[#0B0D10] p-4 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span>SKIN TEMP</span>
              <Activity size={14} className="text-amber-400" />
            </div>
            <div className="text-2xl font-mono font-semibold text-[#F4F1EA] transition-all duration-500">
              {skinTemp} <span className="text-xs text-[#8D949F] font-sans">°C</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
