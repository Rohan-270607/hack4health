import type { SystemStatusConfig } from '../types';

export const SYSTEM_CONFIG: SystemStatusConfig = {
  allOperational: true,
  facialSamplesProcessed: 28709,
  audioSamplesProcessed: 2880,
  numericalRecordsProcessed: 4000,
  lastUpdated: '2026-08-13 13:45:00 UTC',
  activeModelVersion: 'v2.4.1-multimodal-fusion'
};

export const DEFAULT_NUMERICAL_INPUT = {
  sleepQuality: 4.5,
  socialEngagement: 3.2,
  dailyAppUsage: 6.8,
  typingSpeed: 42,
  sessionFrequency: 18,
  idleTime: 25,
  facialEmotionVariance: 2.1,
  eyeBlinkRate: 26,
  smileIntensity: 12,
  headMotionIndex: 3.4,
  mfccMean: -18.4,
  mfccVariance: 4.8,
  pitchMean: 165,
  speechRate: 2.8,
  heartRate: 88,
  hrvIndex: 32.4,
  skinTemperature: 36.8,
  gsrLevel: 4.85,
};
