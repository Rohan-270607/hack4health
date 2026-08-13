import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Camera lifecycle states:
 *   stopped      – Initial / camera intentionally turned off
 *   requesting   – getUserMedia permission dialog is showing
 *   active       – Camera stream is live and rendering
 *   denied       – User denied camera permission
 *   unavailable  – No camera device found or API not supported
 */
export type CameraState = 'stopped' | 'requesting' | 'active' | 'denied' | 'unavailable';

export interface UseMediaDevicesResult {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraState: CameraState;
  cameraError: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureSnapshot: () => string | null;
  captureFrameAsBlob: () => Promise<Blob | null>;
}

export function useMediaDevices(): UseMediaDevicesResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('stopped');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);

    // Check if the browser supports MediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unavailable');
      setCameraError('Camera API is not supported in this browser.');
      return;
    }

    setCameraState('requesting');

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      setStream(mediaStream);
      setCameraState('active');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraState('denied');
          setCameraError('Camera access was denied. Please allow camera permissions in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraState('unavailable');
          setCameraError('No camera device was found on this device.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraState('unavailable');
          setCameraError('Camera is in use by another application.');
        } else {
          setCameraState('unavailable');
          setCameraError(`Camera error: ${err.message}`);
        }
      } else {
        setCameraState('unavailable');
        setCameraError('An unexpected error occurred while accessing the camera.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('stopped');
    setCameraError(null);
  }, [stream]);

  /**
   * Capture the current video frame as a data URL (base64 JPEG string).
   * Returns null if the camera is not active.
   */
  const captureSnapshot = useCallback((): string | null => {
    if (!videoRef.current || cameraState !== 'active' || !stream) {
      return null;
    }
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.85);
    }
    return null;
  }, [cameraState, stream]);

  /**
   * Capture the current video frame as a JPEG Blob.
   * Used for sending to the analysis backend via FormData.
   * Returns null if the camera is not active.
   */
  const captureFrameAsBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || cameraState !== 'active' || !stream) {
        resolve(null);
        return;
      }
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          0.90
        );
      } else {
        resolve(null);
      }
    });
  }, [cameraState, stream]);

  // Cleanup on unmount: stop all tracks
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    videoRef,
    cameraState,
    cameraError,
    startCamera,
    stopCamera,
    captureSnapshot,
    captureFrameAsBlob
  };
}
