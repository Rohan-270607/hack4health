import type { FacialAnalysisResult, EmotionType } from '../types';
import { apiRequest, delay } from './api';

export interface FacialAnalyzePayload {
  image?: File | Blob | string; // File, Blob or Base64 preview
  useSnapshot?: boolean;
}

export async function analyzeFacial(payload: FacialAnalyzePayload): Promise<FacialAnalysisResult> {
  return apiRequest<FacialAnalysisResult>(
    '/analyze/facial',
    {
      method: 'POST',
      body: typeof payload.image === 'string' ? JSON.stringify({ imageBase64: payload.image }) : undefined
    },
    async () => {
      // Realistic simulation delay (1.2 seconds)
      await delay(1200);

      const emotions: EmotionType[] = ['Sad', 'Neutral', 'Fear', 'Angry', 'Happy', 'Surprise', 'Disgust'];
      const primaryEmotion: EmotionType = payload.useSnapshot ? 'Neutral' : 'Sad';

      const distribution = emotions.map((emotion) => {
        if (emotion === primaryEmotion) {
          return { emotion, probability: 48 };
        }
        if (emotion === 'Neutral' && primaryEmotion !== 'Neutral') {
          return { emotion, probability: 26 };
        }
        if (emotion === 'Fear') return { emotion, probability: 12 };
        if (emotion === 'Angry') return { emotion, probability: 7 };
        if (emotion === 'Happy') return { emotion, probability: 4 };
        if (emotion === 'Surprise') return { emotion, probability: 2 };
        return { emotion, probability: 1 };
      });

      return {
        detectedEmotion: primaryEmotion,
        confidence: primaryEmotion === 'Sad' ? 84 : 88,
        distribution,
        faceCount: 1,
        landmarkPoints: 68,
        timestamp: new Date().toISOString(),
        previewUrl: typeof payload.image === 'string' ? payload.image : undefined
      };
    }
  );
}
