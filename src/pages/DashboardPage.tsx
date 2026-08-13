import React from 'react';
import { Card } from '../components/common/Card';
import { ModalityCard } from '../components/dashboard/ModalityCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SYSTEM_CONFIG } from '../data/mockConfig';
import { MOCK_ASSESSMENTS } from '../data/mockAssessments';
import { MODEL_METRICS_LIST } from '../data/mockModels';
import type { NavTab } from '../components/layout/Sidebar';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

const activityData = [
  { time: '00:00', inferences: 120, confidence: 91 },
  { time: '03:00', inferences: 85, confidence: 93 },
  { time: '06:00', inferences: 210, confidence: 89 },
  { time: '09:00', inferences: 450, confidence: 94 },
  { time: '12:00', inferences: 680, confidence: 92 },
  { time: '15:00', inferences: 540, confidence: 90 },
  { time: '18:00', inferences: 390, confidence: 93 },
  { time: '21:00', inferences: 230, confidence: 95 }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const latestAssessment = MOCK_ASSESSMENTS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">
              {SYSTEM_CONFIG.allOperational ? '● All systems operational' : 'System Degraded'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide mt-1">
            MINDPULSE AI RESEARCH PLATFORM
          </h1>
          <p className="text-xs text-[#8D949F] mt-1 max-w-2xl">
            Multimodal AI-assisted mental health assessment system fusing facial expression vision, acoustic voice markers, and biophysical numerical time-series.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('new-assessment')}
            className="px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-medium rounded flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Play size={14} className="fill-current" />
            <span>New Assessment</span>
          </button>
          <button
            onClick={() => onNavigate('live-analysis')}
            className="px-4 py-2.5 bg-[#101318] hover:bg-[#161B22] border border-[#202630] hover:border-[#3B82F6] text-[#F4F1EA] text-xs font-medium rounded flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Live Analysis</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModalityCard
          type="facial"
          title="FACIAL"
          status="READY"
          sampleCount={SYSTEM_CONFIG.facialSamplesProcessed}
          sampleUnit="processed samples"
          onClickNew={() => onNavigate('new-assessment')}
        />
        <ModalityCard
          type="audio"
          title="AUDIO"
          status="PROCESSING / READY"
          sampleCount={SYSTEM_CONFIG.audioSamplesProcessed}
          sampleUnit="audio samples"
          onClickNew={() => onNavigate('new-assessment')}
        />
        <ModalityCard
          type="numerical"
          title="NUMERICAL"
          status="READY"
          sampleCount={SYSTEM_CONFIG.numericalRecordsProcessed}
          sampleUnit="records"
          onClickNew={() => onNavigate('new-assessment')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202630] pb-3">
            <div>
              <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
                Recent Assessment
              </h2>
              <p className="text-sm font-semibold text-[#F4F1EA] mt-0.5">
                ID: {latestAssessment.id} • {latestAssessment.timestamp}
              </p>
            </div>
            <StatusBadge status="complete" label={latestAssessment.overallStatus} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="bg-[#0B0D10] p-3 rounded border border-[#202630]">
              <span className="text-[11px] text-[#8D949F] font-mono">DEPRESSION SCORE</span>
              <div className="text-lg font-mono font-semibold text-[#F4F1EA] mt-1">
                {latestAssessment.depressionScore} <span className="text-xs text-[#8D949F]">/ {latestAssessment.depressionMax}</span>
              </div>
              <div className="w-full bg-[#161B22] h-1 rounded mt-2 overflow-hidden">
                <div className="bg-[#3B82F6] h-full" style={{ width: `${(latestAssessment.depressionScore / latestAssessment.depressionMax) * 100}%` }} />
              </div>
            </div>

            <div className="bg-[#0B0D10] p-3 rounded border border-[#202630]">
              <span className="text-[11px] text-[#8D949F] font-mono">ANXIETY SCORE</span>
              <div className="text-lg font-mono font-semibold text-[#F4F1EA] mt-1">
                {latestAssessment.anxietyScore} <span className="text-xs text-[#8D949F]">/ {latestAssessment.anxietyMax}</span>
              </div>
              <div className="w-full bg-[#161B22] h-1 rounded mt-2 overflow-hidden">
                <div className="bg-[#60A5FA] h-full" style={{ width: `${(latestAssessment.anxietyScore / latestAssessment.anxietyMax) * 100}%` }} />
              </div>
            </div>

            <div className="bg-[#0B0D10] p-3 rounded border border-[#202630]">
              <span className="text-[11px] text-[#8D949F] font-mono">STRESS SCORE</span>
              <div className="text-lg font-mono font-semibold text-[#F4F1EA] mt-1">
                {latestAssessment.stressScore} <span className="text-xs text-[#8D949F]">/ {latestAssessment.stressMax}</span>
              </div>
              <div className="w-full bg-[#161B22] h-1 rounded mt-2 overflow-hidden">
                <div className="bg-blue-400 h-full" style={{ width: `${(latestAssessment.stressScore / latestAssessment.stressMax) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#202630]">
            <div className="flex items-center gap-2 text-xs text-[#8D949F]">
              <ShieldCheck size={14} className="text-[#3B82F6]" />
              <span>Fusion Confidence: <strong className="text-[#F4F1EA] font-mono">{latestAssessment.confidence}%</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('explainability')}
                className="text-xs text-[#8D949F] hover:text-[#F4F1EA] transition-colors cursor-pointer"
              >
                Why this result?
              </button>
              <button
                onClick={() => onNavigate('results')}
                className="text-xs bg-[#161B22] hover:bg-[#202630] border border-[#202630] text-[#F4F1EA] px-3 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>View Results</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#202630] pb-3">
            <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
              Model Performance
            </h2>
            <button
              onClick={() => onNavigate('model-observatory')}
              className="text-xs text-[#3B82F6] hover:underline cursor-pointer"
            >
              Observatory →
            </button>
          </div>

          <div className="space-y-3">
            {MODEL_METRICS_LIST.map((model) => (
              <div key={model.name} className="flex items-center justify-between p-2.5 rounded bg-[#0B0D10] border border-[#202630]/70 text-xs">
                <div>
                  <p className="text-[#F4F1EA] font-medium">{model.name}</p>
                  <p className="text-[10px] text-[#8D949F] font-mono mt-0.5">{model.modality}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[#60A5FA] font-semibold">{model.accuracy}%</span>
                  <span className="text-[10px] text-[#8D949F] block">F1: {model.macroF1}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202630] pb-3">
          <div>
            <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
              System Activity & Inference Throughput
            </h2>
            <p className="text-xs text-[#F4F1EA] font-medium mt-0.5">
              Live batch execution metric timeline (Last 24 Hours)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8D949F]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              Inferences / min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
              Confidence %
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInferences" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#8D949F" fontSize={11} tickLine={false} axisLine={{ stroke: '#202630' }} />
              <YAxis stroke="#8D949F" fontSize={11} tickLine={false} axisLine={{ stroke: '#202630' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#101318', borderColor: '#202630', borderRadius: '4px', fontSize: '12px', color: '#F4F1EA' }}
              />
              <Area type="monotone" dataKey="inferences" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorInferences)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
