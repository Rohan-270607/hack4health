import type { NumericalInputData, NumericalAnalysisResult } from '../types';
import { apiRequest, delay } from './api';

export async function analyzeNumerical(data: NumericalInputData): Promise<NumericalAnalysisResult> {
  return apiRequest<NumericalAnalysisResult>(
    '/analyze/numerical',
    {
      method: 'POST',
      body: JSON.stringify(data)
    },
    async () => {
      // Fast numerical tabular processing (800ms)
      await delay(800);

      const riskIndex = Math.min(
        100,
        Math.max(
          10,
          Math.round(
            (10 - data.sleepQuality) * 5 +
              (data.heartRate > 80 ? (data.heartRate - 80) * 1.2 : 0) +
              (50 - data.hrvIndex) * 0.8 +
              data.gsrLevel * 6
          )
        )
      );

      return {
        metrics: { ...data },
        calculatedScore: Math.round(riskIndex * 1.15 * 10) / 10,
        riskIndex,
        confidence: 86,
        timestamp: new Date().toISOString()
      };
    }
  );
}
