import { useState, useRef } from 'react';
import { Mic, Square, Upload, RefreshCw, X, Volume2, Sparkles } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { analyzeAudio, type AnalysisResponse } from '../services/api';
import { AnalysisResult } from './AnalysisResult';

export const AudioModule = () => {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    recordingTime,
    error: micError,
    waveformValues,
    startRecording,
    stopRecording,
    clearAudio,
    setDirectAudioBlob,
  } = useAudioRecorder();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDirectAudioBlob(file);
      setAnalysisResult(null);
      setApiError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;

    setIsLoading(true);
    setApiError(null);
    setAnalysisResult(null);

    try {
      const data = await analyzeAudio(audioBlob);
      setAnalysisResult(data);
    } catch (err: any) {
      setApiError(err.message || 'Audio analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearAudio();
    setAnalysisResult(null);
    setApiError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col justify-between border border-[#D9D4CC] bg-[#FCFAF6] p-6 shadow-xs sm:p-8">
      <div>
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-[#D9D4CC] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#111111] text-[#F5F2EC]">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-[#111111]">
                VOICE & AUDIO
              </h3>
              <p className="font-mono-tech text-[11px] uppercase tracking-wider text-[#5F5B55]">
                ACOUSTIC MODALITY 02
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 font-body text-xs leading-relaxed text-[#5F5B55]">
          Record acoustic speech features directly from your microphone or upload an audio file for vocal emotion analysis.
        </p>

        {/* Microphone Error Display */}
        {micError && (
          <div className="mt-4 border border-amber-300 bg-amber-50/50 p-3 font-mono-tech text-xs text-amber-900">
            {micError}
          </div>
        )}

        {/* Recording & Input Container */}
        <div className="mt-6">
          {isRecording ? (
            /* Active Live Recording View with Waveform */
            <div className="flex h-64 flex-col items-center justify-center border border-[#111111] bg-[#F5F2EC] p-6 sm:h-72">
              <div className="flex items-center gap-2 font-mono-tech text-xs font-semibold uppercase tracking-widest text-[#111111]">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-red-600" />
                <span>RECORDING IN PROGRESS</span>
              </div>

              {/* Timer */}
              <div className="mt-2 font-mono-tech text-3xl font-light text-[#111111]">
                {formatTime(recordingTime)}
              </div>

              {/* Live Dynamic Waveform Visualizer */}
              <div className="mt-6 flex h-16 items-center justify-center gap-1.5 px-4">
                {waveformValues.map((heightPct, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-[#111111] transition-all duration-75 ease-out"
                    style={{ height: `${heightPct}%` }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={stopRecording}
                className="mt-6 flex items-center gap-2 border border-[#111111] bg-[#111111] px-5 py-2 font-mono-tech text-xs uppercase tracking-wider text-[#F5F2EC] transition-colors hover:bg-[#333333]"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop Recording</span>
              </button>
            </div>
          ) : audioUrl ? (
            /* Recorded / Uploaded Audio Preview Player */
            <div className="flex h-64 flex-col items-center justify-center border border-[#D9D4CC] bg-[#F5F2EC] p-6 sm:h-72">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF6] border border-[#D9D4CC]">
                <Volume2 className="h-6 w-6 text-[#111111]" />
              </div>
              <span className="mt-3 font-mono-tech text-xs uppercase text-[#111111]">
                Audio Sample Ready
              </span>

              {/* HTML5 Audio Player */}
              <audio
                controls
                src={audioUrl}
                className="mt-4 w-full max-w-sm"
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 font-mono-tech text-xs uppercase text-[#5F5B55] hover:text-[#111111]"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear & Re-record</span>
                </button>
              </div>
            </div>
          ) : (
            /* Default Idle State - Actions */
            <div className="flex h-64 flex-col items-center justify-center border border-dashed border-[#D9D4CC] bg-[#F5F2EC] p-6 text-center sm:h-72">
              <Mic className="h-8 w-8 text-[#5F5B55]" />
              <span className="mt-3 font-mono-tech text-xs uppercase text-[#5F5B55]">
                No audio recording selected
              </span>
              <p className="mt-1 font-body text-xs text-[#5F5B55]">
                Record speech via microphone or upload an audio file
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 border border-[#111111] bg-[#111111] px-4 py-2 font-mono-tech text-xs uppercase tracking-wider text-[#F5F2EC] transition-colors hover:bg-[#333333]"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Record Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border border-[#D9D4CC] bg-[#FCFAF6] px-4 py-2 font-mono-tech text-xs uppercase tracking-wider text-[#111111] transition-colors hover:bg-[#F5F2EC]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Audio</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls when audio is ready */}
        {audioUrl && !isRecording && (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 border border-[#111111] bg-[#111111] px-5 py-2.5 font-mono-tech text-xs uppercase tracking-widest text-[#F5F2EC] transition-colors hover:bg-[#333333] disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{isLoading ? 'Analyzing Voice...' : 'Analyze Voice'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="border border-[#D9D4CC] bg-[#FCFAF6] px-4 py-2.5 font-mono-tech text-xs uppercase text-[#111111] hover:bg-[#F5F2EC]"
            >
              Reset
            </button>
          </div>
        )}

        {/* Real Backend Analysis Result Panel */}
        <AnalysisResult
          result={analysisResult}
          error={apiError}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
