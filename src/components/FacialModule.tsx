import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { analyzeFacial, type AnalysisResponse } from '../services/api';
import { AnalysisResult } from './AnalysisResult';

export const FacialModule = () => {
  const {
    isCameraOpen,
    stream,
    capturedBlob,
    previewUrl,
    error: cameraError,
    videoRef,
    openCamera,
    closeCamera,
    captureFrame,
    clearCapture,
    setDirectBlob,
  } = useCamera();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Attach stream to video element when camera opens
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream, videoRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDirectBlob(file);
      setAnalysisResult(null);
      setApiError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedBlob) return;

    setIsLoading(true);
    setApiError(null);
    setAnalysisResult(null);

    try {
      const data = await analyzeFacial(capturedBlob);
      setAnalysisResult(data);
    } catch (err: any) {
      setApiError(err.message || 'Facial analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearCapture();
    setAnalysisResult(null);
    setApiError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col justify-between border border-[#D9D4CC] bg-[#FCFAF6] p-6 shadow-xs sm:p-8">
      <div>
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-[#D9D4CC] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#111111] text-[#F5F2EC]">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-[#111111]">
                FACIAL EXPRESSION
              </h3>
              <p className="font-mono-tech text-[11px] uppercase tracking-wider text-[#5F5B55]">
                VISUAL MODALITY 01
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 font-body text-xs leading-relaxed text-[#5F5B55]">
          Capture a real-time snapshot via device camera or upload a clear facial image for neural expression classification.
        </p>

        {/* Camera Permission Error Display */}
        {cameraError && (
          <div className="mt-4 border border-amber-300 bg-amber-50/50 p-3 font-mono-tech text-xs text-amber-900">
            {cameraError}
          </div>
        )}

        {/* Input & Display Area */}
        <div className="mt-6">
          {/* Active Camera Stream View */}
          {isCameraOpen ? (
            <div className="relative overflow-hidden border border-[#111111] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-64 w-full object-cover sm:h-72"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={captureFrame}
                  className="flex flex-1 items-center justify-center gap-2 border border-[#111111] bg-[#111111] px-4 py-2 font-mono-tech text-xs font-medium uppercase tracking-wider text-[#F5F2EC] transition-colors hover:bg-black"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Capture Frame</span>
                </button>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="flex items-center justify-center border border-[#D9D4CC] bg-[#FCFAF6] px-3 py-2 font-mono-tech text-xs uppercase text-[#111111] hover:bg-[#F5F2EC]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : previewUrl ? (
            /* Captured / Uploaded Image Preview */
            <div className="relative border border-[#D9D4CC] bg-[#F5F2EC] p-2">
              <img
                src={previewUrl}
                alt="Selected facial preview"
                className="h-64 w-full object-contain sm:h-72"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center border border-[#D9D4CC] bg-[#FCFAF6] text-[#111111] shadow-xs hover:bg-[#F5F2EC]"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Default Idle State - Actions */
            <div className="flex h-64 flex-col items-center justify-center border border-dashed border-[#D9D4CC] bg-[#F5F2EC] p-6 text-center sm:h-72">
              <ImageIcon className="h-8 w-8 text-[#5F5B55]" />
              <span className="mt-3 font-mono-tech text-xs uppercase text-[#5F5B55]">
                No facial image selected
              </span>
              <p className="mt-1 font-body text-xs text-[#5F5B55]">
                Open your device camera or upload a file below
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex items-center gap-2 border border-[#111111] bg-[#111111] px-4 py-2 font-mono-tech text-xs uppercase tracking-wider text-[#F5F2EC] transition-colors hover:bg-[#333333]"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Open Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border border-[#D9D4CC] bg-[#FCFAF6] px-4 py-2 font-mono-tech text-xs uppercase tracking-wider text-[#111111] transition-colors hover:bg-[#F5F2EC]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Image</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Controls when image is loaded */}
        {previewUrl && !isCameraOpen && (
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
              <span>{isLoading ? 'Analyzing...' : 'Analyze Expression'}</span>
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
