import type { AudioAnalysisResult, EmotionType } from '../types';
import { apiRequest, delay } from './api';

export interface AudioAnalyzePayload {
  audioBlob?: Blob;
  audioFile?: File;
  duration?: number;
}

export async function analyzeAudio(payload: AudioAnalyzePayload): Promise<AudioAnalysisResult> {
  return apiRequest<AudioAnalysisResult>(
    '/analyze/audio',
    {
      method: 'POST'
    },
    async () => {
      // Realistic processing latency (1.5s)
      await delay(1500);

      const waveformData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 70) + 20);

      return {
        detectedEmotion: 'Sad' as EmotionType,
        confidence: 72,
        pitch: 164,
        speechEnergy: -18.2,
        audioQuality: 'Excellent',
        duration: payload.duration || 4.2,
        waveformData,
        timestamp: new Date().toISOString()
      };
    }
  );
}
