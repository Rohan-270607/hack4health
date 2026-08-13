import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { MOCK_FEATURE_CONTRIBUTIONS } from '../data/mockExplainability';
import type { FeatureContributionItem } from '../types';
import { Brain, Info, AlertTriangle, ChevronRight } from 'lucide-react';

export const ExplainabilityPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureContributionItem>(
    MOCK_FEATURE_CONTRIBUTIONS[0]
  );

  const getContributionColor = (level: string) => {
    switch (level) {
      case 'High contribution': return 'text-[#60A5FA] bg-blue-950/40 border-blue-800/40';
      case 'Moderate contribution': return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      default: return 'text-[#8D949F] bg-gray-900/40 border-gray-800/40';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0B0D10] border border-[#202630] rounded-md p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider">
          <Brain size={16} />
          <span>EXPLAINABLE AI (XAI) FRAMEWORK</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide">
          WHY DID THE MODEL MAKE THIS ASSESSMENT?
        </h1>
        <p className="text-xs text-[#8D949F] max-w-3xl leading-relaxed">
          Feature contribution analysis calculated via SHAP (SHapley Additive exPlanations) latent cross-attention feature weights across facial, audio, and biophysical modalities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202630] pb-3">
            <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
              SHAP FEATURE IMPORTANCE WEIGHTS
            </h2>
            <span className="text-xs text-[#8D949F] font-mono">Click feature to inspect</span>
          </div>

          <div className="space-y-3">
            {MOCK_FEATURE_CONTRIBUTIONS.map((item) => {
              const isSelected = selectedFeature.key === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => setSelectedFeature(item)}
                  className={`p-3 rounded border transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-[#161B22] border-[#3B82F6]'
                      : 'bg-[#0B0D10] border-[#202630] hover:border-[#2C3545]'
                  }`}
                >
                  <div className="w-36">
                    <p className="text-xs font-medium text-[#F4F1EA]">{item.feature}</p>
                    <span className="text-[10px] text-[#8D949F] font-mono">{item.associatedModality}</span>
                  </div>

                  <div className="flex-1 bg-[#101318] h-3 rounded-full overflow-hidden border border-[#202630]">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isSelected ? 'bg-[#60A5FA]' : 'bg-[#3B82F6]'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border ${getContributionColor(
                      item.modelContribution
                    )}`}
                  >
                    {item.modelContribution.split(' ')[0]}
                  </span>

                  <ChevronRight size={14} className={isSelected ? 'text-[#3B82F6]' : 'text-[#8D949F]'} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#202630] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[#3B82F6]" />
                <h3 className="text-xs font-mono font-semibold text-[#F4F1EA] uppercase">
                  FEATURE ATTRITION DETAIL
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8D949F]">{selectedFeature.associatedModality}</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-[#8D949F] font-mono uppercase block">FEATURE NAME</span>
                <h4 className="text-lg font-semibold text-[#F4F1EA] mt-0.5">{selectedFeature.feature}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#0B0D10] p-2.5 rounded border border-[#202630]">
                  <span className="text-[10px] text-[#8D949F] font-mono block">CURRENT VALUE</span>
                  <span className="text-sm font-mono font-semibold text-[#60A5FA]">
                    {selectedFeature.currentValue}
                  </span>
                </div>

                <div className="bg-[#0B0D10] p-2.5 rounded border border-[#202630]">
                  <span className="text-[10px] text-[#8D949F] font-mono block">CONTRIBUTION</span>
                  <span className="text-xs font-mono font-semibold text-[#F4F1EA]">
                    {selectedFeature.modelContribution}
                  </span>
                </div>
              </div>

              <div className="bg-[#0B0D10] p-3 rounded border border-[#202630] space-y-1">
                <span className="text-[10px] text-[#8D949F] font-mono block">ASSOCIATED MODALITY</span>
                <span className="text-xs text-[#F4F1EA] font-medium">{selectedFeature.associatedModality} Modality Subnet</span>
              </div>

              <div className="bg-[#0B0D10] p-3.5 rounded border border-[#202630] space-y-1">
                <span className="text-[10px] text-[#8D949F] font-mono block uppercase">FEATURE IMPACT & INTERPRETATION</span>
                <p className="text-xs text-[#F4F1EA] leading-relaxed mt-1">{selectedFeature.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/30 border border-amber-800/40 rounded p-3 text-[11px] text-amber-300 flex items-start gap-2 pt-3">
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-snug">
              <strong>Non-Causal Disclaimer:</strong> SHAP feature weights represent probabilistic association within the latent model space and do not establish clinical causality.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
