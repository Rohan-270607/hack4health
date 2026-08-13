import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { MOCK_ASSESSMENTS } from '../data/mockAssessments';
import type { NavTab } from '../components/layout/Sidebar';
import type { FusionAnalysisResult, EmotionType } from '../types';
import { HelpCircle, Camera, Mic, Activity, Layers, Info, ArrowRight } from 'lucide-react';

interface ResultsPageProps {
  onNavigate: (tab: NavTab) => void;
  assessmentResult?: FusionAnalysisResult;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  onNavigate,
  assessmentResult = MOCK_ASSESSMENTS[0]
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>('Sad');

  const emotionDescriptions: Record<EmotionType, string> = {
    Sad: 'Primary facial cue identified. Represents lowered brow position and reduced cheek elevation, consistent with depressive affect.',
    Neutral: 'Baseline facial expression with relaxed facial musculature.',
    Fear: 'Elevated upper eyelids and subtle lip stretch observed during stress tasks.',
    Angry: 'Corrugator supercilii contraction detected in 8% of frame samples.',
    Happy: 'Zygomaticus major activation blunted at 3% probability.',
    Surprise: 'Transient eyebrow elevation noted during dynamic transitions.',
    Disgust: 'Minimal upper lip elevation detected (<1% probability).'
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0B0D10] border border-[#202630] rounded-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202630] pb-4">
          <div>
            <span className="text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider block">
              AI-ASSISTED ASSESSMENT REPORT
            </span>
            <h1 className="text-2xl font-semibold text-[#F4F1EA] tracking-wide mt-1">
              {assessmentResult.overallStatus}
            </h1>
            <p className="text-xs text-[#8D949F] font-mono mt-0.5">
              Assessment ID: {assessmentResult.id} • Evaluated on {assessmentResult.timestamp}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#101318] px-4 py-2 rounded border border-[#202630] text-center">
              <span className="text-[10px] text-[#8D949F] font-mono block">FUSION CONFIDENCE</span>
              <span className="text-lg font-mono font-semibold text-[#60A5FA]">
                {assessmentResult.confidence}%
              </span>
            </div>
            <button
              onClick={() => onNavigate('explainability')}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Why this result?</span>
              <HelpCircle size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="bg-[#101318] p-4 rounded border border-[#202630] space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-mono text-[#8D949F]">DEPRESSION INDEX</span>
              <span className="font-mono font-semibold text-[#F4F1EA] text-sm">
                {assessmentResult.depressionScore} <span className="text-xs text-[#8D949F]">/ {assessmentResult.depressionMax}</span>
              </span>
            </div>
            <ProgressBar value={assessmentResult.depressionScore} max={assessmentResult.depressionMax} color="blue" height="h-2" />
          </div>

          <div className="bg-[#101318] p-4 rounded border border-[#202630] space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-mono text-[#8D949F]">ANXIETY INDEX</span>
              <span className="font-mono font-semibold text-[#60A5FA] text-sm">
                {assessmentResult.anxietyScore} <span className="text-xs text-[#8D949F]">/ {assessmentResult.anxietyMax}</span>
              </span>
            </div>
            <ProgressBar value={assessmentResult.anxietyScore} max={assessmentResult.anxietyMax} color="brightblue" height="h-2" />
          </div>

          <div className="bg-[#101318] p-4 rounded border border-[#202630] space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-mono text-[#8D949F]">STRESS INDEX</span>
              <span className="font-mono font-semibold text-[#F4F1EA] text-sm">
                {assessmentResult.stressScore} <span className="text-xs text-[#8D949F]">/ {assessmentResult.stressMax}</span>
              </span>
            </div>
            <ProgressBar value={assessmentResult.stressScore} max={assessmentResult.stressMax} color="blue" height="h-2" />
          </div>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#202630] pb-3">
          <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
            MODALITY SIGNAL CONTRIBUTIONS
          </h2>
          <span className="text-[11px] font-mono text-[#60A5FA]">Late-Fusion Weighting</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span className="flex items-center gap-1.5"><Camera size={13} className="text-[#3B82F6]" /> FACIAL</span>
              <span className="font-mono font-semibold text-[#F4F1EA]">{assessmentResult.modalityContributions.facial}%</span>
            </div>
            <ProgressBar value={assessmentResult.modalityContributions.facial} color="blue" height="h-1.5" />
          </div>

          <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span className="flex items-center gap-1.5"><Mic size={13} className="text-[#60A5FA]" /> AUDIO</span>
              <span className="font-mono font-semibold text-[#F4F1EA]">{assessmentResult.modalityContributions.audio}%</span>
            </div>
            <ProgressBar value={assessmentResult.modalityContributions.audio} color="brightblue" height="h-1.5" />
          </div>

          <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span className="flex items-center gap-1.5"><Activity size={13} className="text-emerald-400" /> NUMERICAL</span>
              <span className="font-mono font-semibold text-[#F4F1EA]">{assessmentResult.modalityContributions.numerical}%</span>
            </div>
            <ProgressBar value={assessmentResult.modalityContributions.numerical} color="emerald" height="h-1.5" />
          </div>

          <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8D949F]">
              <span className="flex items-center gap-1.5"><Layers size={13} className="text-[#3B82F6]" /> FUSION LATENT</span>
              <span className="font-mono font-semibold text-[#F4F1EA]">{assessmentResult.modalityContributions.fusion}%</span>
            </div>
            <ProgressBar value={assessmentResult.modalityContributions.fusion} color="blue" height="h-1.5" />
          </div>
        </div>
      </Card>

      {assessmentResult.facialResult && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#202630] pb-3">
            <div>
              <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
                FACIAL EMOTION PROBABILITY DISTRIBUTION
              </h2>
              <p className="text-xs text-[#F4F1EA] font-medium mt-0.5">
                Click any emotion bar to inspect landmark cue breakdown
              </p>
            </div>
            <span className="text-xs font-mono text-[#8D949F]">
              Confidence: {assessmentResult.facialResult.confidence}%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2.5">
              {assessmentResult.facialResult.distribution.map((item) => {
                const isSelected = selectedEmotion === item.emotion;
                return (
                  <div
                    key={item.emotion}
                    onClick={() => setSelectedEmotion(item.emotion)}
                    className={`p-2.5 rounded border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#161B22] border-[#3B82F6]'
                        : 'bg-[#0B0D10] border-[#202630] hover:border-[#2C3545]'
                    }`}
                  >
                    <span className="text-xs font-mono font-medium text-[#F4F1EA] w-20">
                      {item.emotion}
                    </span>

                    <div className="flex-1 bg-[#101318] h-3 rounded-full overflow-hidden border border-[#202630]">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isSelected ? 'bg-[#60A5FA]' : 'bg-[#3B82F6]'
                        }`}
                        style={{ width: `${item.probability}%` }}
                      />
                    </div>

                    <span className="text-xs font-mono font-semibold text-[#60A5FA] w-12 text-right">
                      {item.probability}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#0B0D10] p-5 rounded border border-[#202630] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 border-b border-[#202630] pb-2">
                  <Info size={16} className="text-[#3B82F6]" />
                  <h3 className="text-sm font-semibold text-[#F4F1EA]">
                    {selectedEmotion || 'Emotion Detail'}
                  </h3>
                </div>

                <p className="text-xs text-[#8D949F] mt-3 leading-relaxed">
                  {selectedEmotion ? emotionDescriptions[selectedEmotion] : 'Select an emotion from the distribution to inspect.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#202630] text-[11px] font-mono text-[#8D949F]">
                <span>Landmarks Evaluated: 68 points</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => onNavigate('history')}
          className="text-xs text-[#8D949F] hover:text-[#F4F1EA] transition-colors cursor-pointer"
        >
          ← Back to Assessment History
        </button>

        <button
          onClick={() => onNavigate('explainability')}
          className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>View Model Explainability (XAI)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
