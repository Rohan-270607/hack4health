import type { FusionAnalysisResult } from '../types';

export const MOCK_ASSESSMENTS: FusionAnalysisResult[] = [
  {
    id: 'MP-2026-0891',
    timestamp: '2026-08-13 13:30',
    overallStatus: 'MODERATE STRESS',
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
    facialResult: {
      detectedEmotion: 'Sad',
      confidence: 84,
      faceCount: 1,
      landmarkPoints: 68,
      timestamp: '2026-08-13 13:28',
      distribution: [
        { emotion: 'Sad', probability: 48 },
        { emotion: 'Neutral', probability: 24 },
        { emotion: 'Fear', probability: 14 },
        { emotion: 'Angry', probability: 8 },
        { emotion: 'Happy', probability: 3 },
        { emotion: 'Surprise', probability: 2 },
        { emotion: 'Disgust', probability: 1 }
      ]
    },
    audioResult: {
      detectedEmotion: 'Sad',
      confidence: 72,
      pitch: 162,
      speechEnergy: -18.4,
      audioQuality: 'Excellent',
      duration: 4.5,
      waveformData: [12, 28, 45, 68, 82, 54, 30, 65, 88, 92, 40, 20, 15, 35, 50, 70, 45, 20],
      timestamp: '2026-08-13 13:29'
    },
    numericalResult: {
      metrics: {
        sleepQuality: 4.2,
        socialEngagement: 3.0,
        dailyAppUsage: 7.2,
        typingSpeed: 38,
        sessionFrequency: 22,
        idleTime: 28,
        facialEmotionVariance: 1.8,
        eyeBlinkRate: 28,
        smileIntensity: 8,
        headMotionIndex: 2.9,
        mfccMean: -19.2,
        mfccVariance: 5.1,
        pitchMean: 158,
        speechRate: 2.4,
        heartRate: 92,
        hrvIndex: 28.5,
        skinTemperature: 36.9,
        gsrLevel: 5.42
      },
      calculatedScore: 78.4,
      riskIndex: 68,
      confidence: 86,
      timestamp: '2026-08-13 13:29'
    }
  },
  {
    id: 'MP-2026-0842',
    timestamp: '2026-08-01 10:15',
    overallStatus: 'LOW RISK',
    confidence: 89,
    depressionScore: 12.2,
    depressionMax: 34,
    anxietyScore: 9.1,
    anxietyMax: 24,
    stressScore: 14.2,
    stressMax: 39,
    modalityContributions: {
      facial: 30,
      audio: 30,
      numerical: 25,
      fusion: 15
    },
    facialResult: {
      detectedEmotion: 'Neutral',
      confidence: 88,
      faceCount: 1,
      landmarkPoints: 68,
      timestamp: '2026-08-01 10:12',
      distribution: [
        { emotion: 'Neutral', probability: 62 },
        { emotion: 'Happy', probability: 22 },
        { emotion: 'Sad', probability: 8 },
        { emotion: 'Surprise', probability: 4 },
        { emotion: 'Fear', probability: 2 },
        { emotion: 'Angry', probability: 1 },
        { emotion: 'Disgust', probability: 1 }
      ]
    },
    audioResult: {
      detectedEmotion: 'Neutral',
      confidence: 84,
      pitch: 195,
      speechEnergy: -12.1,
      audioQuality: 'Excellent',
      duration: 5.0,
      waveformData: [20, 40, 60, 80, 65, 50, 75, 85, 40, 30, 50, 70, 80, 30, 20],
      timestamp: '2026-08-01 10:14'
    },
    numericalResult: {
      metrics: {
        sleepQuality: 7.8,
        socialEngagement: 7.5,
        dailyAppUsage: 3.5,
        typingSpeed: 58,
        sessionFrequency: 10,
        idleTime: 12,
        facialEmotionVariance: 5.4,
        eyeBlinkRate: 18,
        smileIntensity: 45,
        headMotionIndex: 6.2,
        mfccMean: -14.1,
        mfccVariance: 2.8,
        pitchMean: 192,
        speechRate: 3.6,
        heartRate: 71,
        hrvIndex: 58.2,
        skinTemperature: 36.6,
        gsrLevel: 2.15
      },
      calculatedScore: 32.1,
      riskIndex: 28,
      confidence: 91,
      timestamp: '2026-08-01 10:14'
    }
  },
  {
    id: 'MP-2026-0790',
    timestamp: '2026-07-18 16:45',
    overallStatus: 'ELEVATED ANXIETY',
    confidence: 85,
    depressionScore: 18.4,
    depressionMax: 34,
    anxietyScore: 19.8,
    anxietyMax: 24,
    stressScore: 25.1,
    stressMax: 39,
    modalityContributions: {
      facial: 32,
      audio: 33,
      numerical: 20,
      fusion: 15
    }
  },
  {
    id: 'MP-2026-0711',
    timestamp: '2026-07-02 09:20',
    overallStatus: 'LOW RISK',
    confidence: 92,
    depressionScore: 9.8,
    depressionMax: 34,
    anxietyScore: 7.4,
    anxietyMax: 24,
    stressScore: 11.5,
    stressMax: 39,
    modalityContributions: {
      facial: 31,
      audio: 29,
      numerical: 25,
      fusion: 15
    }
  }
];
