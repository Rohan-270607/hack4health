import React, { useRef } from 'react';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Mic, Upload, Square, Volume2, Music, Play } from 'lucide-react';
import type { AnalysisState, AudioAnalysisResult } from '../../types';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

interface AudioModulePanelProps {
  state: AnalysisState;
  progress: number;
  result: AudioAnalysisResult | null;
  selectedAudio: File | Blob | null;
  onSelectAudio: (audio: File | Blob | null) => void;
  onAnalyze: () => void;
}

export const AudioModulePanel: React.FC<AudioModulePanelProps> = ({
  state,
  progress,
  result,
  selectedAudio,
  onSelectAudio,
  onAnalyze
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    waveformData,
    startRecording,
    stopRecording,
    clearAudio
  } = useAudioRecorder();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onSelectAudio(file);
    }
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      stopRecording();
      if (audioBlob) onSelectAudio(audioBlob);
    } else {
      await startRecording();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="flex flex-col justify-between space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#202630] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#0B0D10] border border-[#202630]">
            <Mic size={16} className="text-[#60A5FA]" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-[#F4F1EA] uppercase tracking-wider">
              AUDIO ACOUSTIC MODULE
            </h3>
            <p className="text-[11px] text-[#8D949F]">Wav2Vec2 Spectral Pitch & Energy</p>
          </div>
        </div>
        <StatusBadge status={state} />
      </div>

      <div className="space-y-3">
        {isRecording ? (
          <div className="bg-[#0B0D10] border border-blue-900/50 rounded p-5 text-center min-h-[190px] flex flex-col justify-between items-center">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>LIVE RECORDING</span>
              <span className="font-semibold text-[#F4F1EA] ml-2">{formatTimer(recordingTime)}</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 h-16 w-full py-2">
              {waveformData.map((val, idx) => (
                <div
                  key={idx}
                  className="w-1.5 bg-[#3B82F6] rounded-full transition-all duration-100"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>

            <button
              onClick={handleToggleRecord}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-[#F4F1EA] rounded flex items-center gap-1.5 cursor-pointer"
            >
              <Square size={14} className="fill-current" />
              <span>Stop Recording</span>
            </button>
          </div>
        ) : selectedAudio || audioUrl ? (
          <div className="bg-[#0B0D10] border border-[#202630] rounded p-4 space-y-3 min-h-[190px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-[#60A5FA]" />
                <div>
                  <p className="text-xs text-[#F4F1EA] font-medium font-mono">Audio Stream Ready</p>
                  <p className="text-[10px] text-[#8D949F]">Recorded / Uploaded WAV file</p>
                </div>
              </div>
              <button
                onClick={() => {
                  clearAudio();
                  onSelectAudio(null);
                }}
                className="text-xs text-[#8D949F] hover:text-rose-400 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 h-12 bg-[#101318] px-3 rounded border border-[#202630]/60">
              {[20, 45, 60, 85, 40, 30, 70, 90, 65, 35, 50, 80, 40, 20, 60, 85, 30, 45].map((h, i) => (
                <div key={i} className="w-1 bg-[#60A5FA] rounded-full" style={{ height: `${h}%` }} />
              ))}
            </div>

            {audioUrl && audioUrl !== 'mock-audio-stream' && (
              <audio controls src={audioUrl} className="w-full h-8 max-w-full" />
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#202630] hover:border-[#60A5FA] rounded p-6 text-center bg-[#0B0D10] transition-colors flex flex-col items-center justify-center min-h-[190px]">
            <Volume2 size={28} className="text-[#8D949F] mb-2" />
            <p className="text-xs text-[#F4F1EA] font-medium">Upload audio file or record microphone</p>
            <p className="text-[11px] text-[#8D949F] mt-0.5">Supports WAV, MP3, M4A, OGG</p>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-xs text-[#F4F1EA] rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={13} />
                <span>Upload Audio</span>
              </button>

              <button
                onClick={handleToggleRecord}
                className="px-3 py-1.5 bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-xs text-[#60A5FA] rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Mic size={13} />
                <span>Record Voice</span>
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
        />
      </div>

      {state === 'processing' && (
        <div className="py-2">
          <ProgressBar value={progress} label="EXTRACTING SPECTRAL MFCC FEATURES..." showPercentage color="brightblue" />
        </div>
      )}

      {state === 'complete' && result && (
        <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[#8D949F] block text-[10px]">DETECTED EMOTION</span>
              <span className="text-[#60A5FA] font-mono font-semibold">{result.detectedEmotion}</span>
            </div>
            <div>
              <span className="text-[#8D949F] block text-[10px]">CONFIDENCE</span>
              <span className="text-[#F4F1EA] font-mono">{result.confidence}%</span>
            </div>
            <div>
              <span className="text-[#8D949F] block text-[10px]">PITCH MEAN</span>
              <span className="text-[#F4F1EA] font-mono">{result.pitch} Hz</span>
            </div>
            <div>
              <span className="text-[#8D949F] block text-[10px]">SPEECH ENERGY</span>
              <span className="text-[#F4F1EA] font-mono">{result.speechEnergy} dB</span>
            </div>
            <div>
              <span className="text-[#8D949F] block text-[10px]">AUDIO QUALITY</span>
              <span className="text-emerald-400 font-mono">{result.audioQuality}</span>
            </div>
            <div>
              <span className="text-[#8D949F] block text-[10px]">DURATION</span>
              <span className="text-[#F4F1EA] font-mono">{result.duration}s</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-[#202630] flex items-center justify-between">
        <span className="text-[10px] text-[#8D949F] font-mono">
          {selectedAudio || audioBlob ? 'Audio Stream Ready' : 'No audio source'}
        </span>
        <button
          onClick={onAnalyze}
          disabled={state === 'processing' || isRecording}
          className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Play size={13} className="fill-current" />
          <span>ANALYZE</span>
        </button>
      </div>
    </Card>
  );
};
