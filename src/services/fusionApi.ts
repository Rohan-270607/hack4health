import type {
  FacialAnalysisResult,
  AudioAnalysisResult,
  NumericalAnalysisResult,
  FusionAnalysisResult,
  OverallStatus
} from '../types';
import { apiRequest, delay } from './api';

export interface MultimodalFusionPayload {
  facial?: FacialAnalysisResult;
  audio?: AudioAnalysisResult;
  numerical?: NumericalAnalysisResult;
}

export async function runMultimodalFusion(payload: MultimodalFusionPayload): Promise<FusionAnalysisResult> {
  return apiRequest<FusionAnalysisResult>(
    '/analyze/fusion',
    {
      method: 'POST',
      body: JSON.stringify({
        facialConfidence: payload.facial?.confidence,
        audioConfidence: payload.audio?.confidence,
        numericalRiskIndex: payload.numerical?.riskIndex
      })
    },
    async () => {
      // Latent Cross-Attention Fusion processing delay (1.8s)
      await delay(1800);

      const overallStatus: OverallStatus = 'MODERATE STRESS';

      return {
        id: `MP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        overallStatus,
        confidence: 82,
        depressionScore: 24.6,
        depressionMax: 34,
        anxietyScore: 16.2,
        anxietyMax: 24,
        stressScore: 28.7,
        stressMax: 39,
        modalityContributions: {
          facial: 35,
          audio: 28,
          numerical: 22,
          fusion: 15
        },
        facialResult: payload.facial,
        audioResult: payload.audio,
        numericalResult: payload.numerical
      };
    }
  );
}
