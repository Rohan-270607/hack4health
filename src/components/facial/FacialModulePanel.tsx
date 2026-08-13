import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import {
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  Play,
  Square,
  Image as ImageIcon,
  AlertTriangle,
  ShieldOff,
  Loader2,
  Scan,
  CheckCircle2
} from 'lucide-react';
import type { AnalysisState, FacialAnalysisResult } from '../../types';
import { useMediaDevices } from '../../hooks/useMediaDevices';
import type { CameraState } from '../../hooks/useMediaDevices';
import { getFaceApiBaseUrl } from '../../services/api';

/* ─── Types for Flask response ─── */
interface FaceApiResponse {
  success: boolean;
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
}

/* ─── Props ─── */
interface FacialModulePanelProps {
  state: AnalysisState;
  progress: number;
  result: FacialAnalysisResult | null;
  selectedImage: string | File | null;
  onSelectImage: (img: string | File | null) => void;
  onAnalyze: () => void;
}

/* ─── Camera status label helper ─── */
function cameraStateLabel(s: CameraState): string {
  switch (s) {
    case 'requesting': return 'Requesting Permission…';
    case 'active':     return 'Camera Active';
    case 'denied':     return 'Permission Denied';
    case 'unavailable': return 'Camera Unavailable';
    case 'stopped':
    default:           return 'Camera Stopped';
  }
}

function cameraStateBadgeStatus(s: CameraState): 'idle' | 'processing' | 'error' {
  switch (s) {
    case 'active':     return 'processing';
    case 'denied':
    case 'unavailable': return 'error';
    default:           return 'idle';
  }
}

/* ─── Emotion bar colors ─── */
const EMOTION_COLORS: Record<string, string> = {
  Angry:    '#EF4444',
  Disgust:  '#A855F7',
  Fear:     '#F59E0B',
  Happy:    '#22C55E',
  Sad:      '#3B82F6',
  Surprise: '#EC4899',
  Neutral:  '#8D949F'
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  COMPONENT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const FacialModulePanel: React.FC<FacialModulePanelProps> = ({
  state,
  progress,
  result,
  selectedImage,
  onSelectImage,
  onAnalyze
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ── Camera hook ── */
  const {
    videoRef,
    cameraState,
    cameraError,
    startCamera,
    stopCamera,
    captureFrameAsBlob
  } = useMediaDevices();

  /* ── Local UI state ── */
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResult, setApiResult] = useState<FaceApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  /* ── File upload handlers (kept from original) ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onSelectImage(url);
      setMode('upload');
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      onSelectImage(url);
      setMode('upload');
    }
  };

  /* ── Switch to camera mode ── */
  const handleEnterCameraMode = useCallback(async () => {
    setMode('camera');
    setApiResult(null);
    setApiError(null);
    setShowResult(false);
    await startCamera();
  }, [startCamera]);

  /* ── Stop camera and go back ── */
  const handleStopCameraMode = useCallback(() => {
    stopCamera();
    // stay in camera mode so user sees the "stopped" state with option to restart
  }, [stopCamera]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─────────────────────────────────────────────
   *  ANALYZE: capture frame → JPEG Blob → POST
   * ───────────────────────────────────────────── */
  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setApiError(null);
    setApiResult(null);
    setShowResult(false);

    try {
      const blob = await captureFrameAsBlob();
      if (!blob) {
        setApiError('Failed to capture frame. Make sure the camera is active.');
        setIsAnalyzing(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');

      const response = await fetch(`${getFaceApiBaseUrl()}/api/analyze/face`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data: FaceApiResponse = await response.json();

      if (!data.success) {
        throw new Error('Analysis was unsuccessful. The server returned success=false.');
      }

      setApiResult(data);

      // Trigger entrance animation after a micro‐delay
      requestAnimationFrame(() => setShowResult(true));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis request failed.';
      setApiError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  }, [captureFrameAsBlob]);

  /* ── All 7 sorted emotions for bar rendering ── */
  const sortedProbabilities = apiResult
    ? Object.entries(apiResult.probabilities)
        .sort(([, a], [, b]) => b - a)
    : [];

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   *  RENDER
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <Card className="flex flex-col justify-between space-y-4 relative overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-[#202630] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#0B0D10] border border-[#202630]">
            <Camera size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-[#F4F1EA] uppercase tracking-wider">
              FACIAL EMOTION MODULE
            </h3>
            <p className="text-[11px] text-[#8D949F]">CNN-ViT Facial Landmark Model</p>
          </div>
        </div>
        <StatusBadge status={state} />
      </div>

      {/* ── Main Content Area ── */}
      <div className="space-y-3">
        {mode === 'camera' ? (
          /* ──────── CAMERA MODE ──────── */
          <div className="space-y-3">
            {/* Camera State Banner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  cameraState === 'active' ? 'bg-emerald-400 animate-pulse' :
                  cameraState === 'requesting' ? 'bg-amber-400 animate-pulse' :
                  cameraState === 'denied' || cameraState === 'unavailable' ? 'bg-rose-400' :
                  'bg-gray-500'
                }`} />
                <span className="text-[11px] font-mono text-[#8D949F]">
                  {cameraStateLabel(cameraState)}
                </span>
              </div>
              <StatusBadge
                status={cameraStateBadgeStatus(cameraState)}
                label={cameraState === 'active' ? 'LIVE' : cameraState === 'requesting' ? 'WAITING' : cameraState.toUpperCase()}
              />
            </div>

            {/* Video Feed Container */}
            <div className="relative rounded overflow-hidden border border-[#202630] bg-[#050608] h-52 flex items-center justify-center">
              {cameraState === 'active' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scan overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-rose-400 uppercase">REC</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-40 border border-[#3B82F6]/40 rounded-lg" />
                    </div>
                  </div>
                </>
              ) : cameraState === 'requesting' ? (
                <div className="text-center p-6 space-y-3">
                  <Loader2 size={32} className="text-[#3B82F6] mx-auto animate-spin" />
                  <p className="text-xs text-[#8D949F]">Requesting camera permission…</p>
                  <p className="text-[10px] text-[#8D949F]/70">Please allow access when prompted by your browser</p>
                </div>
              ) : cameraState === 'denied' ? (
                <div className="text-center p-6 space-y-3">
                  <ShieldOff size={32} className="text-rose-400 mx-auto" />
                  <p className="text-xs text-rose-300 font-medium">Camera Permission Denied</p>
                  <p className="text-[10px] text-[#8D949F] max-w-xs mx-auto">
                    {cameraError || 'Allow camera access in your browser settings, then try again.'}
                  </p>
                </div>
              ) : cameraState === 'unavailable' ? (
                <div className="text-center p-6 space-y-3">
                  <AlertTriangle size={32} className="text-amber-400 mx-auto" />
                  <p className="text-xs text-amber-300 font-medium">Camera Unavailable</p>
                  <p className="text-[10px] text-[#8D949F] max-w-xs mx-auto">
                    {cameraError || 'No camera device detected on this device.'}
                  </p>
                </div>
              ) : (
                /* stopped */
                <div className="text-center p-6 space-y-3">
                  <Camera size={32} className="text-[#8D949F] mx-auto opacity-50" />
                  <p className="text-xs text-[#8D949F]">Camera stopped</p>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex items-center gap-2">
              {cameraState === 'active' ? (
                <button
                  onClick={handleStopCameraMode}
                  className="flex-1 px-3 py-2 bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/60 text-xs text-rose-300 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Square size={12} className="fill-current" />
                  <span>Stop Camera</span>
                </button>
              ) : (
                <button
                  onClick={handleEnterCameraMode}
                  disabled={cameraState === 'requesting'}
                  className="flex-1 px-3 py-2 bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-xs text-[#60A5FA] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Camera size={13} />
                  <span>{cameraState === 'stopped' ? 'Start Camera' : 'Retry Camera'}</span>
                </button>
              )}
              <button
                onClick={() => { stopCamera(); setMode('upload'); setApiResult(null); setApiError(null); setShowResult(false); }}
                className="px-3 py-2 bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-xs text-[#8D949F] rounded flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload size={12} />
                <span>Upload</span>
              </button>
            </div>
          </div>
        ) : (
          /* ──────── UPLOAD MODE (original) ──────── */
          <>
            {selectedImage ? (
              <div className="relative rounded overflow-hidden border border-[#202630] bg-[#0B0D10] h-48 flex items-center justify-center group">
                <img
                  src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
                  alt="Facial input preview"
                  className="max-h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-[#161B22] border border-[#202630] hover:border-[#3B82F6] rounded text-xs text-[#F4F1EA] flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={13} />
                    <span>Replace</span>
                  </button>
                  <button
                    onClick={() => onSelectImage(null)}
                    className="p-2 bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900 text-xs text-rose-300 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#202630] hover:border-[#3B82F6] rounded p-6 text-center bg-[#0B0D10] transition-colors flex flex-col items-center justify-center min-h-[190px]"
              >
                <ImageIcon size={28} className="text-[#8D949F] mb-2" />
                <p className="text-xs text-[#F4F1EA] font-medium">Drag & drop facial image here</p>
                <p className="text-[11px] text-[#8D949F] mt-0.5">Supports PNG, JPG, WEBP (Max 10MB)</p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-xs text-[#F4F1EA] rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>Upload Image</span>
                  </button>
                  <button
                    onClick={handleEnterCameraMode}
                    className="px-3 py-1.5 bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-xs text-[#60A5FA] rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera size={13} />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </>
        )}
      </div>

      {/* ── Processing progress (for pipeline mock flow) ── */}
      {state === 'processing' && (
        <div className="py-2">
          <ProgressBar value={progress} label="FACIAL LANDMARK EXTRACTION..." showPercentage color="blue" />
        </div>
      )}

      {/* ── API Error ── */}
      {apiError && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded p-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-rose-300">{apiError}</p>
        </div>
      )}

      {/* ── Analysis Result from Flask API ── */}
      {apiResult && (
        <div
          className={`bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-3 transition-all duration-500 ease-out ${
            showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Top detected emotion + confidence */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-xs text-[#8D949F]">Detected Emotion:</span>
            </div>
            <span className="text-sm font-mono font-semibold text-[#60A5FA]">
              {apiResult.emotion}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8D949F]">Confidence:</span>
            <span className="text-sm font-mono font-semibold text-[#F4F1EA]">
              {(apiResult.confidence * 100).toFixed(1)}%
            </span>
          </div>

          {/* All 7 emotion probability bars */}
          <div className="pt-2 border-t border-[#202630]/60 space-y-2">
            <p className="text-[10px] text-[#8D949F] font-mono uppercase tracking-wider">
              Probability Distribution
            </p>
            {sortedProbabilities.map(([emotion, prob], idx) => (
              <div key={emotion} className="space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8D949F] w-18">{emotion}</span>
                  <span className="text-[#F4F1EA] font-mono text-[10px]">{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#161B22] h-1.5 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-700 ease-out"
                    style={{
                      width: showResult ? `${prob * 100}%` : '0%',
                      backgroundColor: EMOTION_COLORS[emotion] || '#3B82F6',
                      transitionDelay: `${idx * 80}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mock pipeline result display (kept for compatibility) ── */}
      {state === 'complete' && result && !apiResult && (
        <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8D949F]">Detected Emotion:</span>
            <span className="text-[#60A5FA] font-mono font-semibold">{result.detectedEmotion}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8D949F]">Confidence:</span>
            <span className="text-[#F4F1EA] font-mono font-medium">{result.confidence}%</span>
          </div>
          <div className="pt-2 border-t border-[#202630]/60 space-y-1.5">
            <p className="text-[10px] text-[#8D949F] font-mono uppercase">Probability Distribution</p>
            {result.distribution.slice(0, 4).map((item) => (
              <div key={item.emotion} className="flex items-center justify-between text-[11px]">
                <span className="text-[#8D949F] w-16">{item.emotion}</span>
                <div className="flex-1 mx-2 bg-[#161B22] h-1.5 rounded overflow-hidden">
                  <div className="bg-[#3B82F6] h-full" style={{ width: `${item.probability}%` }} />
                </div>
                <span className="text-[#F4F1EA] font-mono text-[10px] w-8 text-right">{item.probability}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer: status + Analyze button ── */}
      <div className="pt-2 border-t border-[#202630] flex items-center justify-between">
        <span className="text-[10px] text-[#8D949F] font-mono">
          {mode === 'camera'
            ? cameraStateLabel(cameraState)
            : selectedImage ? 'Image Loaded' : 'No input source'
          }
        </span>
        {mode === 'camera' ? (
          <button
            onClick={handleAnalyze}
            disabled={cameraState !== 'active' || isAnalyzing}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>ANALYZING…</span>
              </>
            ) : (
              <>
                <Scan size={13} />
                <span>ANALYZE</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onAnalyze}
            disabled={state === 'processing'}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play size={13} className="fill-current" />
            <span>ANALYZE</span>
          </button>
        )}
      </div>
    </Card>
  );
};
