import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import type { AnalysisState } from '../../types';
import { Camera, Mic, Activity, Layers, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';

interface PipelineVisualizerProps {
  facialState: AnalysisState;
  audioState: AnalysisState;
  numericalState: AnalysisState;
  fusionState: AnalysisState;

  facialProgress: number;
  audioProgress: number;
  numericalProgress: number;
  fusionProgress: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  facialState,
  audioState,
  numericalState,
  fusionState,
  facialProgress,
  audioProgress,
  numericalProgress,
  fusionProgress
}) => {
  const getStateBadge = (state: AnalysisState) => {
    switch (state) {
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-medium">
            <CheckCircle2 size={13} />
            <span>✓ Complete</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#60A5FA] font-medium">
            <Loader2 size={13} className="animate-spin" />
            <span>Processing...</span>
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 font-medium">
            <AlertCircle size={13} />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8D949F]">
            <Clock size={13} />
            <span>Waiting...</span>
          </span>
        );
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#202630] pb-3">
        <div>
          <h3 className="text-xs font-mono font-semibold text-[#F4F1EA] uppercase tracking-wider">
            PARALLEL INFERENCE PIPELINE
          </h3>
          <p className="text-[11px] text-[#8D949F]">Independent async subnetwork processing execution graph</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#3B82F6] font-mono font-medium bg-[#0B0D10] px-2.5 py-1 rounded border border-[#202630]">
          <Layers size={13} />
          <span>CROSS-ATTENTION FUSION</span>
        </div>
      </div>

      <div className="space-y-4 py-1">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-[#3B82F6]" />
              <span className="font-mono text-[#F4F1EA] font-medium">FACIAL SUBNET</span>
            </div>
            {getStateBadge(facialState)}
          </div>
          <ProgressBar value={facialProgress} color="blue" height="h-2" showPercentage />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Mic size={14} className="text-[#60A5FA]" />
              <span className="font-mono text-[#F4F1EA] font-medium">AUDIO ACOUSTIC SUBNET</span>
            </div>
            {getStateBadge(audioState)}
          </div>
          <ProgressBar value={audioProgress} color="brightblue" height="h-2" showPercentage />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              <span className="font-mono text-[#F4F1EA] font-medium">NUMERICAL / BIOPHYSICAL SUBNET</span>
            </div>
            {getStateBadge(numericalState)}
          </div>
          <ProgressBar value={numericalProgress} color="emerald" height="h-2" showPercentage />
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#202630]/70">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-[#3B82F6]" />
              <span className="font-mono text-[#60A5FA] font-semibold">MULTIMODAL FUSION LAYER</span>
            </div>
            {getStateBadge(fusionState)}
          </div>
          <ProgressBar value={fusionProgress} color="blue" height="h-2.5" showPercentage />
        </div>
      </div>
    </Card>
  );
};
