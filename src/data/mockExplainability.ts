import type { FeatureContributionItem } from '../types';

export const MOCK_FEATURE_CONTRIBUTIONS: FeatureContributionItem[] = [
  {
    key: 'hrvIndex',
    feature: 'HRV Index',
    currentValue: '28.5 ms',
    modelContribution: 'High contribution',
    score: 92,
    associatedModality: 'Physiological',
    direction: 'Increases Risk',
    description: 'Significantly reduced Heart Rate Variability (RMSSD < 30ms) is strongly correlated with autonomic nervous system dysregulation and elevated baseline anxiety.'
  },
  {
    key: 'gsrLevel',
    feature: 'GSR Level',
    currentValue: '5.42 µS',
    modelContribution: 'High contribution',
    score: 84,
    associatedModality: 'Physiological',
    direction: 'Increases Risk',
    description: 'Elevated skin conductance response indicates heightened sympathetic nervous system arousal and acute stress reactivity.'
  },
  {
    key: 'smileIntensity',
    feature: 'Smile Intensity',
    currentValue: '8%',
    modelContribution: 'High contribution',
    score: 78,
    associatedModality: 'Facial',
    direction: 'Increases Risk',
    description: 'Markedly depressed zygomaticus major muscle activation during interactive prompting signals blunted positive affect.'
  },
  {
    key: 'mfccVariance',
    feature: 'MFCC Variance',
    currentValue: '5.1 dB',
    modelContribution: 'Moderate contribution',
    score: 68,
    associatedModality: 'Audio',
    direction: 'Increases Risk',
    description: 'High Mel-frequency cepstral coefficient variance indicates irregular spectral envelope shifts consistent with vocal strain.'
  },
  {
    key: 'sleepQuality',
    feature: 'Sleep Quality',
    currentValue: '4.2 / 10',
    modelContribution: 'Moderate contribution',
    score: 62,
    associatedModality: 'Numerical',
    direction: 'Increases Risk',
    description: 'Persistent self-reported sleep disruption acts as a primary vulnerability factor for mood destabilization.'
  },
  {
    key: 'eyeBlinkRate',
    feature: 'Eye Blink Rate',
    currentValue: '28 / min',
    modelContribution: 'Moderate contribution',
    score: 55,
    associatedModality: 'Facial',
    direction: 'Increases Risk',
    description: 'Increased blink frequency above normative baseline (15-20/min) reflects cognitive load and somatic hyperarousal.'
  },
  {
    key: 'speechRate',
    feature: 'Speech Rate',
    currentValue: '2.4 words/sec',
    modelContribution: 'Low contribution',
    score: 42,
    associatedModality: 'Audio',
    direction: 'Increases Risk',
    description: 'Reduced articulation velocity and prolonged pause duration are characteristically observed in depressive psychomotor slowing.'
  },
  {
    key: 'socialEngagement',
    feature: 'Social Engagement',
    currentValue: '3.0 / 10',
    modelContribution: 'Low contribution',
    score: 36,
    associatedModality: 'Numerical',
    direction: 'Increases Risk',
    description: 'Lower behavioral interaction frequency indicates social withdrawal and reduced supportive contact.'
  }
];
