import type { AnalysisResponse } from '../services/api';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResponse | null;
  error?: string | null;
  isLoading?: boolean;
}

export const AnalysisResult = ({
  result,
  error,
  isLoading,
}: AnalysisResultProps) => {
  if (isLoading) {
    return (
      <div className="mt-6 border border-[#D9D4CC] bg-[#F5F2EC] p-6 text-center">
        <div className="inline-flex items-center gap-3 font-mono-tech text-xs tracking-wider uppercase text-[#111111]">
          <span className="h-2 w-2 animate-ping rounded-full bg-[#111111]" />
          <span>Processing payload via MindPulse backend...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 border border-amber-300 bg-amber-50/50 p-5 text-amber-950">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-amber-900">
              Analysis Error
            </h4>
            <p className="mt-1 font-body text-xs leading-relaxed text-amber-800">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Extract emotion string
  const emotion = result.emotion || (typeof result.detected_emotion === 'string' ? result.detected_emotion : null);

  // Format confidence
  let confidencePct: string | null = null;
  if (typeof result.confidence === 'number') {
    confidencePct = result.confidence <= 1 ? (result.confidence * 100).toFixed(1) + '%' : result.confidence.toFixed(1) + '%';
  } else if (typeof result.score === 'number') {
    confidencePct = result.score <= 1 ? (result.score * 100).toFixed(1) + '%' : result.score.toFixed(1) + '%';
  }

  // Process probabilities dictionary or array
  let probList: Array<{ label: string; percent: number }> = [];

  const rawProbs = result.probabilities || result.probabilities_percent || result.probs;

  if (rawProbs && typeof rawProbs === 'object') {
    if (Array.isArray(rawProbs)) {
      probList = rawProbs.map((item: any) => {
        const label = item.emotion || item.label || item.name || 'Unknown';
        const val = item.score ?? item.probability ?? item.value ?? 0;
        const percent = val <= 1 ? val * 100 : val;
        return { label, percent };
      });
    } else {
      probList = Object.entries(rawProbs).map(([key, val]) => {
        const numVal = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
        const percent = numVal <= 1 ? numVal * 100 : numVal;
        return { label: key, percent };
      });
    }
    // Sort descending by percentage
    probList.sort((a, b) => b.percent - a.percent);
  }

  return (
    <div className="mt-6 border border-[#D9D4CC] bg-[#F5F2EC] p-6">
      <div className="flex items-center justify-between border-b border-[#D9D4CC] pb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#111111]" />
          <span className="font-mono-tech text-xs tracking-widest uppercase text-[#5F5B55]">
            ANALYSIS RESULT
          </span>
        </div>
        <span className="font-mono-tech text-[10px] uppercase text-[#5F5B55]">
          REAL BACKEND PAYLOAD
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Primary Emotion */}
        {emotion && (
          <div>
            <span className="font-mono-tech text-[11px] uppercase text-[#5F5B55]">
              Detected Emotion
            </span>
            <p className="mt-1 font-heading text-2xl font-bold uppercase tracking-wider text-[#111111]">
              {emotion}
            </p>
          </div>
        )}

        {/* Confidence level */}
        {confidencePct && (
          <div>
            <span className="font-mono-tech text-[11px] uppercase text-[#5F5B55]">
              Confidence Score
            </span>
            <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-[#111111]">
              {confidencePct}
            </p>
          </div>
        )}
      </div>

      {/* Probabilities Breakdown Chart */}
      {probList.length > 0 && (
        <div className="mt-6 border-t border-[#D9D4CC] pt-5">
          <span className="mb-4 block font-mono-tech text-[11px] uppercase text-[#5F5B55]">
            Emotion Probabilities
          </span>

          <div className="space-y-3">
            {probList.map((item, idx) => {
              const clampedPercent = Math.max(0, Math.min(100, item.percent));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono-tech text-xs">
                    <span className="capitalize text-[#111111] font-medium">{item.label}</span>
                    <span className="text-[#5F5B55]">{clampedPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#D9D4CC]">
                    <div
                      className="h-1.5 bg-[#111111] transition-all duration-500 ease-out"
                      style={{ width: `${clampedPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fallback raw JSON display if non-standard backend payload */}
      {!emotion && !confidencePct && probList.length === 0 && (
        <div className="mt-4">
          <span className="font-mono-tech text-[11px] uppercase text-[#5F5B55]">
            Raw Payload Response
          </span>
          <pre className="mt-2 overflow-x-auto border border-[#D9D4CC] bg-[#FCFAF6] p-3 font-mono-tech text-xs text-[#111111]">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
