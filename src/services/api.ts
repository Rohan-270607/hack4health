import { API_BASE_URL } from '../config';

export interface AnalysisResponse {
  success?: boolean;
  emotion?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  error?: string;
  message?: string;
  [key: string]: any;
}

/**
 * Analyze a facial image using the Flask backend.
 * Backend endpoint:
 * POST /api/analyze/face
 *
 * Field name:
 * image
 */
export async function analyzeFacial(
  imageFile: File | Blob
): Promise<AnalysisResponse> {
  const formData = new FormData();

  if (imageFile instanceof File) {
    formData.append('image', imageFile);
  } else {
    formData.append('image', imageFile, 'capture.jpg');
  }

  console.log('[MindPulse Face] Sending image:', {
    name: imageFile instanceof File ? imageFile.name : 'capture.jpg',
    type: imageFile.type,
    size: imageFile.size,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/analyze/face`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const text = await response.text();

    let data: AnalysisResponse;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        text || `Facial analysis failed with status ${response.status}`
      );
    }

    console.log('[MindPulse Face] Backend response:', data);

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Facial analysis failed with status ${response.status}`
      );
    }

    return data;
  } catch (error: any) {
    console.error('[MindPulse Face] Request failed:', error);

    if (error instanceof TypeError) {
      throw new Error(
        'Could not connect to the MindPulse backend. Make sure Flask is running on port 5000.'
      );
    }

    throw error;
  }
}


/**
 * Analyze an audio file using the Flask backend.
 * Backend endpoint:
 * POST /api/analyze/audio
 *
 * Field name:
 * audio
 */
export async function analyzeAudio(
  audioBlob: Blob | File
): Promise<AnalysisResponse> {
  const formData = new FormData();

  if (audioBlob instanceof File) {
    formData.append('audio', audioBlob);
  } else {
    formData.append('audio', audioBlob, 'recording.wav');
  }

  console.log('[MindPulse Audio] Sending audio:', {
    name: audioBlob instanceof File ? audioBlob.name : 'recording.wav',
    type: audioBlob.type,
    size: audioBlob.size,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/analyze/audio`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const text = await response.text();

    let data: AnalysisResponse;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        text || `Audio analysis failed with status ${response.status}`
      );
    }

    console.log('[MindPulse Audio] Backend response:', data);

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Audio analysis failed with status ${response.status}`
      );
    }

    return data;
  } catch (error: any) {
    console.error('[MindPulse Audio] Request failed:', error);

    if (error instanceof TypeError) {
      throw new Error(
        'Could not connect to the MindPulse backend. Make sure Flask is running on port 5000.'
      );
    }

    throw error;
  }
}


/**
 * Check whether the Flask backend is online.
 *
 * Backend endpoint:
 * GET /api/health
 */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/health`,
      {
        method: 'GET',
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}