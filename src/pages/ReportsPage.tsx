import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_ASSESSMENTS } from '../data/mockAssessments';
import { MOCK_FEATURE_CONTRIBUTIONS } from '../data/mockExplainability';
import { MODEL_METRICS_LIST } from '../data/mockModels';
import { FileSpreadsheet, Download, CheckCircle2, Printer } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const assessment = MOCK_ASSESSMENTS[0];
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ assessment, featureContributions: MOCK_FEATURE_CONTRIBUTIONS, modelMetrics: MODEL_METRICS_LIST }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `MindPulse_Assessment_${assessment.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess('JSON Report downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider">
            <FileSpreadsheet size={16} />
            <span>REPORT GENERATOR & CLINICAL EXPORTS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide mt-1">
            MULTIMODAL ASSESSMENT REPORT
          </h1>
          <p className="text-xs text-[#8D949F] mt-1 max-w-xl">
            Generate standardized clinical research summaries and export raw JSON payloads or formatted print PDF documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-[#101318] hover:bg-[#161B22] border border-[#202630] text-[#F4F1EA] text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Printer size={14} />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 p-3 rounded text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 size={16} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      <Card className="bg-[#0B0D10] border border-[#202630] p-8 space-y-6 max-w-4xl mx-auto shadow-xl">
        <div className="border-b border-[#202630] pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-[#3B82F6] font-bold tracking-widest">MINDPULSE</span>
              <span className="text-xs text-[#8D949F]">/ CLINICAL AI REPORT</span>
            </div>
            <h2 className="text-xl font-bold text-[#F4F1EA] mt-1">MULTIMODAL HEALTH ASSESSMENT SUMMARY</h2>
            <p className="text-xs font-mono text-[#8D949F] mt-1">Report ID: {assessment.id} • Generated: {assessment.timestamp}</p>
          </div>
          <StatusBadge status="complete" label={assessment.overallStatus} />
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono text-[#3B82F6] uppercase font-semibold">1. ASSESSMENT SUMMARY</h3>
          <div className="bg-[#101318] p-4 rounded border border-[#202630] text-xs text-[#F4F1EA] leading-relaxed">
            The multimodal AI assessment combining facial vision, acoustic speech, and physiological signals indicates an overall status of <strong>{assessment.overallStatus}</strong> with a model confidence of <strong>{assessment.confidence}%</strong>.
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono text-[#3B82F6] uppercase font-semibold">2. EVALUATED PSYCHOLOGICAL SCALES</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#101318] p-3 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">DEPRESSION SCORE</span>
              <span className="text-base font-mono font-semibold text-[#F4F1EA]">{assessment.depressionScore} / {assessment.depressionMax}</span>
            </div>
            <div className="bg-[#101318] p-3 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">ANXIETY SCORE</span>
              <span className="text-base font-mono font-semibold text-[#60A5FA]">{assessment.anxietyScore} / {assessment.anxietyMax}</span>
            </div>
            <div className="bg-[#101318] p-3 rounded border border-[#202630]">
              <span className="text-[10px] text-[#8D949F] font-mono block">STRESS SCORE</span>
              <span className="text-base font-mono font-semibold text-[#F4F1EA]">{assessment.stressScore} / {assessment.stressMax}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono text-[#3B82F6] uppercase font-semibold">3. SUBNETWORK WEIGHT ALLOCATION</h3>
          <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-[#101318] p-3 rounded border border-[#202630]">
            <div>Facial: <strong className="text-[#60A5FA]">{assessment.modalityContributions.facial}%</strong></div>
            <div>Audio: <strong className="text-[#60A5FA]">{assessment.modalityContributions.audio}%</strong></div>
            <div>Numerical: <strong className="text-[#60A5FA]">{assessment.modalityContributions.numerical}%</strong></div>
            <div>Fusion: <strong className="text-[#60A5FA]">{assessment.modalityContributions.fusion}%</strong></div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono text-[#3B82F6] uppercase font-semibold">4. PRIMARY FEATURE ATTRITION</h3>
          <div className="space-y-1.5">
            {MOCK_FEATURE_CONTRIBUTIONS.slice(0, 4).map((f) => (
              <div key={f.key} className="flex justify-between items-center bg-[#101318] px-3 py-2 rounded border border-[#202630] text-xs">
                <span className="text-[#F4F1EA] font-medium">{f.feature}</span>
                <span className="text-[#8D949F] font-mono">{f.currentValue} ({f.modelContribution})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#202630] pt-4 text-[11px] text-[#8D949F] space-y-1">
          <p className="font-semibold text-[#F4F1EA]">RESPONSIBLE AI CLINICAL NOTICE:</p>
          <p className="leading-relaxed">
            This report provides AI-assisted analysis and does not constitute a clinical medical diagnosis. Model outputs are probabilistic estimates intended solely for research decision support under expert clinical oversight.
          </p>
        </div>
      </Card>
    </div>
  );
};
