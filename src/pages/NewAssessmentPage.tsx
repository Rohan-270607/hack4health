import React from 'react';
import { FacialModulePanel } from '../components/facial/FacialModulePanel';
import { AudioModulePanel } from '../components/audio/AudioModulePanel';
import { NumericalForm } from '../components/numerical/NumericalForm';
import { PipelineVisualizer } from '../components/processing/PipelineVisualizer';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import type { NavTab } from '../components/layout/Sidebar';
import { RotateCcw, ArrowRight, Layers, AlertCircle } from 'lucide-react';

interface NewAssessmentPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const NewAssessmentPage: React.FC<NewAssessmentPageProps> = ({ onNavigate }) => {
  const {
    state,
    setSelectedImage,
    setSelectedAudio,
    setNumericalInput,
    runFacialAnalysis,
    runAudioAnalysis,
    runNumericalAnalysis,
    runMultimodalPipeline,
    resetAll
  } = useAssessmentFlow();

  const handleRunAll = async () => {
    await runMultimodalPipeline();
  };

  const isAnyProcessing =
    state.facialState === 'processing' ||
    state.audioState === 'processing' ||
    state.numericalState === 'processing' ||
    state.fusionState === 'processing';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide">
            NEW MULTIMODAL ASSESSMENT
          </h1>
          <p className="text-xs text-[#8D949F] mt-1 max-w-2xl">
            Configure independent inputs for Facial Expression, Audio Speech Acoustics, and Biophysical Time-Series. Run modules individually or execute parallel multimodal fusion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAll}
            className="px-3.5 py-2.5 bg-[#101318] hover:bg-[#161B22] border border-[#202630] text-[#8D949F] hover:text-[#F4F1EA] text-xs font-medium rounded flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Inputs</span>
          </button>

          <button
            onClick={handleRunAll}
            disabled={isAnyProcessing}
            className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Layers size={15} />
            <span>RUN MULTIMODAL ANALYSIS</span>
          </button>
        </div>
      </div>

      {state.errorMessage && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded p-3 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{state.errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FacialModulePanel
          state={state.facialState}
          progress={state.facialProgress}
          result={state.facialResult}
          selectedImage={state.selectedImage}
          onSelectImage={setSelectedImage}
          onAnalyze={runFacialAnalysis}
        />

        <AudioModulePanel
          state={state.audioState}
          progress={state.audioProgress}
          result={state.audioResult}
          selectedAudio={state.selectedAudio}
          onSelectAudio={setSelectedAudio}
          onAnalyze={runAudioAnalysis}
        />

        <NumericalForm
          state={state.numericalState}
          progress={state.numericalProgress}
          result={state.numericalResult}
          values={state.numericalInput}
          onChange={setNumericalInput}
          onAnalyze={runNumericalAnalysis}
        />
      </div>

      <PipelineVisualizer
        facialState={state.facialState}
        audioState={state.audioState}
        numericalState={state.numericalState}
        fusionState={state.fusionState}
        facialProgress={state.facialProgress}
        audioProgress={state.audioProgress}
        numericalProgress={state.numericalProgress}
        fusionProgress={state.fusionProgress}
      />

      {state.fusionState === 'complete' && state.fusionResult && (
        <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-mono font-semibold text-emerald-400">
                MULTIMODAL FUSION COMPLETE ({state.fusionResult.confidence}% CONFIDENCE)
              </p>
              <p className="text-sm font-semibold text-[#F4F1EA] mt-0.5">
                Overall Status: {state.fusionResult.overallStatus}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('results')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-[#F4F1EA] rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>View Full Diagnosis & Results</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
