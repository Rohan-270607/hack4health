export type ModalityType = 'facial' | 'audio' | 'numerical';

export type AnalysisState = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export type EmotionType = 'Angry' | 'Disgust' | 'Fear' | 'Happy' | 'Sad' | 'Surprise' | 'Neutral';

export interface EmotionProbability {
  emotion: EmotionType;
  probability: number; // 0 - 100
}

export interface FacialAnalysisResult {
  detectedEmotion: EmotionType;
  confidence: number; // e.g. 84
  distribution: EmotionProbability[];
  faceCount: number;
  landmarkPoints: number;
  timestamp: string;
  previewUrl?: string;
}

export interface AudioAnalysisResult {
  detectedEmotion: EmotionType;
  confidence: number; // e.g. 72
  pitch: number; // Hz, e.g. 184
  speechEnergy: number; // dB, e.g. -14.2
  audioQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  duration: number; // seconds, e.g. 4.2
  waveformData: number[]; // Array of normalized amplitude values
  timestamp: string;
  audioUrl?: string;
}

export interface NumericalInputData {
  // Behavioral
  sleepQuality: number; // 1-10 scale
  socialEngagement: number; // 1-10 scale
  dailyAppUsage: number; // hrs/day
  typingSpeed: number; // WPM
  sessionFrequency: number; // per day
  idleTime: number; // mins/hr

  // Facial / Behavioral Signals
  facialEmotionVariance: number; // 0-10
  eyeBlinkRate: number; // blinks/min
  smileIntensity: number; // 0-100%
  headMotionIndex: number; // 0-10 scale

  // Speech Signals
  mfccMean: number; // dB
  mfccVariance: number;
  pitchMean: number; // Hz
  speechRate: number; // words/sec

  // Physiological
  heartRate: number; // BPM
  hrvIndex: number; // ms (RMSSD)
  skinTemperature: number; // °C
  gsrLevel: number; // µS (Galvanic Skin Response)
}

export interface NumericalAnalysisResult {
  metrics: NumericalInputData;
  calculatedScore: number;
  riskIndex: number; // 0-100
  confidence: number;
  timestamp: string;
}

export type OverallStatus = 
  | 'LOW RISK'
  | 'MODERATE STRESS'
  | 'ELEVATED ANXIETY'
  | 'SEVERE DISTRESS'
  | 'NORMAL / STABLE';

export interface ModalityContribution {
  facial: number; // % e.g. 32
  audio: number; // % e.g. 28
  numerical: number; // % e.g. 25
  fusion: number; // % e.g. 15
}

export interface FusionAnalysisResult {
  id: string;
  timestamp: string;
  overallStatus: OverallStatus;
  confidence: number; // e.g. 82%
  depressionScore: number; // e.g. 24.6
  depressionMax: number; // e.g. 34
  anxietyScore: number; // e.g. 16.2
  anxietyMax: number; // e.g. 24
  stressScore: number; // e.g. 28.7
  stressMax: number; // e.g. 39
  modalityContributions: ModalityContribution;
  facialResult?: FacialAnalysisResult;
  audioResult?: AudioAnalysisResult;
  numericalResult?: NumericalAnalysisResult;
}

export interface FeatureContributionItem {
  key: string;
  feature: string;
  currentValue: string | number;
  modelContribution: 'High contribution' | 'Moderate contribution' | 'Low contribution';
  score: number; // 0-100 scale for relative weight bar
  associatedModality: 'Facial' | 'Audio' | 'Numerical' | 'Physiological';
  description: string;
  direction: 'Increases Risk' | 'Decreases Risk' | 'Neutral Impact';
}

export interface ModelMetrics {
  name: string;
  modality: string;
  version: string;
  accuracy: number;
  macroF1: number;
  r2Score?: number;
  mae?: number;
  inferenceTimeMs: number;
  totalSamples: number;
}

export interface ConfusionMatrixCell {
  actual: string;
  predicted: string;
  value: number;
}

export interface SystemStatusConfig {
  allOperational: boolean;
  facialSamplesProcessed: number;
  audioSamplesProcessed: number;
  numericalRecordsProcessed: number;
  lastUpdated: string;
  activeModelVersion: string;
}
