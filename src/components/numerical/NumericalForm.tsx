import React from 'react';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Activity, Play, Heart, User, Sparkles } from 'lucide-react';
import type { AnalysisState, NumericalInputData, NumericalAnalysisResult } from '../../types';

interface NumericalFormProps {
  state: AnalysisState;
  progress: number;
  result: NumericalAnalysisResult | null;
  values: NumericalInputData;
  onChange: (input: Partial<NumericalInputData>) => void;
  onAnalyze: () => void;
}

export const NumericalForm: React.FC<NumericalFormProps> = ({
  state,
  progress,
  result,
  values,
  onChange,
  onAnalyze
}) => {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between border-b border-[#202630] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#0B0D10] border border-[#202630]">
            <Activity size={16} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-[#F4F1EA] uppercase tracking-wider">
              NUMERICAL & BIOPHYSICAL MODULE
            </h3>
            <p className="text-[11px] text-[#8D949F]">TabTransformer Biophysical Encoder</p>
          </div>
        </div>
        <StatusBadge status={state} />
      </div>

      {/* Grid of Sections */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {/* BEHAVIORAL SECTION */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#3B82F6] font-mono font-semibold border-b border-[#202630]/60 pb-1">
            <User size={13} />
            <span>BEHAVIORAL METRICS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#8D949F]">Sleep Quality</span>
                <span className="text-[#F4F1EA] font-mono">{values.sleepQuality} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={values.sleepQuality}
                onChange={(e) => onChange({ sleepQuality: parseFloat(e.target.value) })}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#8D949F]">Social Engagement</span>
                <span className="text-[#F4F1EA] font-mono">{values.socialEngagement} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={values.socialEngagement}
                onChange={(e) => onChange({ socialEngagement: parseFloat(e.target.value) })}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">App Usage (hrs/day)</span>
              <input
                type="number"
                step="0.1"
                value={values.dailyAppUsage}
                onChange={(e) => onChange({ dailyAppUsage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">Typing Speed (WPM)</span>
              <input
                type="number"
                value={values.typingSpeed}
                onChange={(e) => onChange({ typingSpeed: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>
        </div>

        {/* FACIAL / BEHAVIORAL SIGNALS */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#60A5FA] font-mono font-semibold border-b border-[#202630]/60 pb-1">
            <Sparkles size={13} />
            <span>FACIAL / BEHAVIORAL SIGNALS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">Blink Rate (blinks/min)</span>
              <input
                type="number"
                value={values.eyeBlinkRate}
                onChange={(e) => onChange({ eyeBlinkRate: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#8D949F]">Smile Intensity</span>
                <span className="text-[#F4F1EA] font-mono">{values.smileIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={values.smileIntensity}
                onChange={(e) => onChange({ smileIntensity: parseInt(e.target.value) || 0 })}
                className="w-full accent-[#60A5FA] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* PHYSIOLOGICAL SIGNALS */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold border-b border-[#202630]/60 pb-1">
            <Heart size={13} />
            <span>PHYSIOLOGICAL SIGNALS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">Heart Rate (BPM)</span>
              <input
                type="number"
                value={values.heartRate}
                onChange={(e) => onChange({ heartRate: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">HRV Index (ms)</span>
              <input
                type="number"
                step="0.1"
                value={values.hrvIndex}
                onChange={(e) => onChange({ hrvIndex: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">GSR Level (µS)</span>
              <input
                type="number"
                step="0.01"
                value={values.gsrLevel}
                onChange={(e) => onChange({ gsrLevel: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#8D949F] block mb-0.5">Skin Temp (°C)</span>
              <input
                type="number"
                step="0.1"
                value={values.skinTemperature}
                onChange={(e) => onChange({ skinTemperature: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0D10] border border-[#202630] rounded px-2 py-1 text-xs text-[#F4F1EA] font-mono focus:border-[#3B82F6] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Processing State */}
      {state === 'processing' && (
        <div className="py-2">
          <ProgressBar value={progress} label="ENCODING BIOPHYSICAL EMBEDDINGS..." showPercentage color="emerald" />
        </div>
      )}

      {/* Completed Results Overview */}
      {state === 'complete' && result && (
        <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] flex items-center justify-between text-xs font-mono">
          <span className="text-[#8D949F]">BIOPHYSICAL RISK INDEX:</span>
          <span className="text-[#60A5FA] font-semibold text-sm">{result.riskIndex} / 100</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-[#202630] flex items-center justify-between">
        <span className="text-[10px] text-[#8D949F] font-mono">
          16 Features Configured
        </span>
        <button
          onClick={onAnalyze}
          disabled={state === 'processing'}
          className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Play size={13} className="fill-current" />
          <span>ANALYZE</span>
        </button>
      </div>
    </Card>
  );
};
