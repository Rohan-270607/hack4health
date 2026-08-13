import type { ModelMetrics, ConfusionMatrixCell } from '../types';

export const MODEL_METRICS_LIST: ModelMetrics[] = [
  {
    name: 'Facial Emotion CNN-ViT',
    modality: 'Facial (Vision)',
    version: 'v2.1.0',
    accuracy: 89.4,
    macroF1: 0.88,
    inferenceTimeMs: 42,
    totalSamples: 28709
  },
  {
    name: 'Audio Spectral Wav2Vec2',
    modality: 'Audio (Speech)',
    version: 'v1.8.4',
    accuracy: 86.2,
    macroF1: 0.84,
    inferenceTimeMs: 110,
    totalSamples: 2880
  },
  {
    name: 'Biophys TabTransformer',
    modality: 'Numerical / Physiological',
    version: 'v3.0.2',
    accuracy: 91.8,
    macroF1: 0.90,
    r2Score: 0.86,
    mae: 0.14,
    inferenceTimeMs: 12,
    totalSamples: 4000
  },
  {
    name: 'Cross-Attention Multimodal Fusion',
    modality: 'Late-Fusion Architecture',
    version: 'v2.4.1',
    accuracy: 94.1,
    macroF1: 0.93,
    r2Score: 0.89,
    mae: 0.09,
    inferenceTimeMs: 68,
    totalSamples: 35589
  }
];

export const CONFUSION_MATRIX: ConfusionMatrixCell[] = [
  { actual: 'Sad', predicted: 'Sad', value: 412 },
  { actual: 'Sad', predicted: 'Neutral', value: 38 },
  { actual: 'Sad', predicted: 'Fear', value: 24 },
  { actual: 'Sad', predicted: 'Angry', value: 8 },
  { actual: 'Neutral', predicted: 'Sad', value: 32 },
  { actual: 'Neutral', predicted: 'Neutral', value: 520 },
  { actual: 'Neutral', predicted: 'Happy', value: 28 },
  { actual: 'Neutral', predicted: 'Fear', value: 12 },
  { actual: 'Fear', predicted: 'Sad', value: 20 },
  { actual: 'Fear', predicted: 'Fear', value: 380 },
  { actual: 'Fear', predicted: 'Neutral', value: 18 },
  { actual: 'Fear', predicted: 'Angry', value: 14 },
  { actual: 'Happy', predicted: 'Neutral', value: 22 },
  { actual: 'Happy', predicted: 'Happy', value: 610 },
  { actual: 'Happy', predicted: 'Surprise', value: 15 },
  { actual: 'Happy', predicted: 'Sad', value: 5 }
];

export const MODALITY_LATENT_WEIGHTS = [
  { name: 'Facial Subnet (Vision)', weight: 35, color: '#3B82F6' },
  { name: 'Audio Subnet (Acoustic)', weight: 28, color: '#60A5FA' },
  { name: 'Bio-Numerical Subnet', weight: 22, color: '#93C5FD' },
  { name: 'Cross-Modality Latent Attention', weight: 15, color: '#2563EB' }
];

export const INFERENCE_BENCHMARKS = [
  { batchSize: '1 Sample', facial: 42, audio: 110, numerical: 12, fusion: 68 },
  { batchSize: '4 Samples', facial: 95, audio: 240, numerical: 22, fusion: 115 },
  { batchSize: '16 Samples', facial: 260, audio: 680, numerical: 45, fusion: 290 },
  { batchSize: '32 Samples', facial: 480, audio: 1250, numerical: 78, fusion: 510 }
];
