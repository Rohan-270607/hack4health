import { useState, useCallback } from 'react';
import type {
  AnalysisState,
  FacialAnalysisResult,
  AudioAnalysisResult,
  NumericalInputData,
  NumericalAnalysisResult,
  FusionAnalysisResult
} from '../types';
import { DEFAULT_NUMERICAL_INPUT } from '../data/mockConfig';
import { analyzeFacial } from '../services/facialApi';
import { analyzeAudio } from '../services/audioApi';
import { analyzeNumerical } from '../services/numericalApi';
import { runMultimodalFusion } from '../services/fusionApi';

export interface AssessmentFlowState {
  facialState: AnalysisState;
  audioState: AnalysisState;
  numericalState: AnalysisState;
  fusionState: AnalysisState;

  facialProgress: number; // 0-100
  audioProgress: number;
  numericalProgress: number;
  fusionProgress: number;

  facialResult: FacialAnalysisResult | null;
  audioResult: AudioAnalysisResult | null;
  numericalResult: NumericalAnalysisResult | null;
  fusionResult: FusionAnalysisResult | null;

  numericalInput: NumericalInputData;
  selectedImage: string | File | null;
  selectedAudio: File | Blob | null;

  errorMessage: string | null;
}

export function useAssessmentFlow() {
  const [state, setState] = useState<AssessmentFlowState>({
    facialState: 'idle',
    audioState: 'idle',
    numericalState: 'idle',
    fusionState: 'idle',

    facialProgress: 0,
    audioProgress: 0,
    numericalProgress: 0,
    fusionProgress: 0,

    facialResult: null,
    audioResult: null,
    numericalResult: null,
    fusionResult: null,

    numericalInput: { ...DEFAULT_NUMERICAL_INPUT },
    selectedImage: null,
    selectedAudio: null,

    errorMessage: null
  });

  const setSelectedImage = useCallback((image: string | File | null) => {
    setState((prev) => ({
      ...prev,
      selectedImage: image,
      facialState: image ? 'idle' : 'idle',
      facialProgress: 0,
      facialResult: null
    }));
  }, []);

  const setSelectedAudio = useCallback((audio: File | Blob | null) => {
    setState((prev) => ({
      ...prev,
      selectedAudio: audio,
      audioState: audio ? 'idle' : 'idle',
      audioProgress: 0,
      audioResult: null
    }));
  }, []);

  const setNumericalInput = useCallback((input: Partial<NumericalInputData>) => {
    setState((prev) => ({
      ...prev,
      numericalInput: { ...prev.numericalInput, ...input }
    }));
  }, []);

  const runFacialAnalysis = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      facialState: 'processing',
      facialProgress: 15
    }));

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        facialProgress: Math.min(90, prev.facialProgress + 25)
      }));
    }, 250);

    try {
      const res = await analyzeFacial({
        image: state.selectedImage || undefined,
        useSnapshot: !state.selectedImage
      });

      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        facialState: 'complete',
        facialProgress: 100,
        facialResult: res
      }));
      return res;
    } catch {
      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        facialState: 'error',
        facialProgress: 0,
        errorMessage: 'Facial analysis model failed to respond.'
      }));
      return null;
    }
  }, [state.selectedImage]);

  const runAudioAnalysis = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      audioState: 'processing',
      audioProgress: 10
    }));

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        audioProgress: Math.min(90, prev.audioProgress + 20)
      }));
    }, 280);

    try {
      const res = await analyzeAudio({
        audioBlob: state.selectedAudio || undefined
      });

      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        audioState: 'complete',
        audioProgress: 100,
        audioResult: res
      }));
      return res;
    } catch {
      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        audioState: 'error',
        audioProgress: 0,
        errorMessage: 'Audio acoustic analysis failed.'
      }));
      return null;
    }
  }, [state.selectedAudio]);

  const runNumericalAnalysis = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      numericalState: 'processing',
      numericalProgress: 20
    }));

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        numericalProgress: Math.min(90, prev.numericalProgress + 35)
      }));
    }, 180);

    try {
      const res = await analyzeNumerical(state.numericalInput);

      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        numericalState: 'complete',
        numericalProgress: 100,
        numericalResult: res
      }));
      return res;
    } catch {
      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        numericalState: 'error',
        numericalProgress: 0,
        errorMessage: 'Numerical tabular feature extraction failed.'
      }));
      return null;
    }
  }, [state.numericalInput]);

  const runMultimodalPipeline = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      fusionState: 'processing',
      fusionProgress: 15
    }));

    const facialPromise = state.facialState === 'complete' && state.facialResult
      ? Promise.resolve(state.facialResult)
      : runFacialAnalysis();

    const audioPromise = state.audioState === 'complete' && state.audioResult
      ? Promise.resolve(state.audioResult)
      : runAudioAnalysis();

    const numericalPromise = state.numericalState === 'complete' && state.numericalResult
      ? Promise.resolve(state.numericalResult)
      : runNumericalAnalysis();

    const [fRes, aRes, nRes] = await Promise.all([facialPromise, audioPromise, numericalPromise]);

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        fusionProgress: Math.min(95, prev.fusionProgress + 20)
      }));
    }, 200);

    try {
      const fusionRes = await runMultimodalFusion({
        facial: fRes || undefined,
        audio: aRes || undefined,
        numerical: nRes || undefined
      });

      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        fusionState: 'complete',
        fusionProgress: 100,
        fusionResult: fusionRes
      }));
      return fusionRes;
    } catch {
      clearInterval(interval);
      setState((prev) => ({
        ...prev,
        fusionState: 'error',
        fusionProgress: 0
      }));
      return null;
    }
  }, [
    state.facialState,
    state.facialResult,
    state.audioState,
    state.audioResult,
    state.numericalState,
    state.numericalResult,
    runFacialAnalysis,
    runAudioAnalysis,
    runNumericalAnalysis
  ]);

  const resetAll = useCallback(() => {
    setState({
      facialState: 'idle',
      audioState: 'idle',
      numericalState: 'idle',
      fusionState: 'idle',
      facialProgress: 0,
      audioProgress: 0,
      numericalProgress: 0,
      fusionProgress: 0,
      facialResult: null,
      audioResult: null,
      numericalResult: null,
      fusionResult: null,
      numericalInput: { ...DEFAULT_NUMERICAL_INPUT },
      selectedImage: null,
      selectedAudio: null,
      errorMessage: null
    });
  }, []);

  return {
    state,
    setSelectedImage,
    setSelectedAudio,
    setNumericalInput,
    runFacialAnalysis,
    runAudioAnalysis,
    runNumericalAnalysis,
    runMultimodalPipeline,
    resetAll
  };
}
