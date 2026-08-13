import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseCameraReturn {
  isCameraOpen: boolean;
  stream: MediaStream | null;
  capturedBlob: Blob | null;
  previewUrl: string | null;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  openCamera: () => Promise<void>;
  closeCamera: () => void;
  captureFrame: () => Promise<Blob | null>;
  clearCapture: () => void;
  setDirectBlob: (blob: Blob | File) => void;
}

export function useCamera(): UseCameraReturn {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopStream = useCallback((mediaStream: MediaStream | null) => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (stream) {
      stopStream(stream);
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream, stopStream]);

  const openCamera = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device found on your system.');
      } else {
        setError(err.message || 'Could not access the camera.');
      }
      setIsCameraOpen(false);
    }
  }, []);

  const captureFrame = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !stream) {
      return null;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          const url = URL.createObjectURL(blob);
          setCapturedBlob(blob);
          setPreviewUrl(url);
          closeCamera();
          resolve(blob);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.92);
    });
  }, [stream, closeCamera, previewUrl]);

  const setDirectBlob = useCallback((blob: Blob | File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(blob);
    setCapturedBlob(blob);
    setPreviewUrl(url);
    if (isCameraOpen) {
      closeCamera();
    }
  }, [previewUrl, isCameraOpen, closeCamera]);

  const clearCapture = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCapturedBlob(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stopStream(stream);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stream, previewUrl, stopStream]);

  return {
    isCameraOpen,
    stream,
    capturedBlob,
    previewUrl,
    error,
    videoRef,
    openCamera,
    closeCamera,
    captureFrame,
    clearCapture,
    setDirectBlob,
  };
}
