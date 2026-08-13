import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { MOCK_ASSESSMENTS } from '../data/mockAssessments';
import type { FusionAnalysisResult } from '../types';
import { GitCompare, ArrowRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ComparePage: React.FC = () => {
  const [beforeAssessment, setBeforeAssessment] = useState<FusionAnalysisResult>(
    MOCK_ASSESSMENTS[1]
  );
  const [currentAssessment, setCurrentAssessment] = useState<FusionAnalysisResult>(
    MOCK_ASSESSMENTS[0]
  );

  const trendChartData = [
    { date: 'Jul 02', depression: 9.8, anxiety: 7.4, stress: 11.5 },
    { date: 'Jul 18', depression: 18.4, anxiety: 19.8, stress: 25.1 },
    { date: 'Aug 01', depression: beforeAssessment.depressionScore, anxiety: beforeAssessment.anxietyScore, stress: beforeAssessment.stressScore },
    { date: 'Aug 13', depression: currentAssessment.depressionScore, anxiety: currentAssessment.anxietyScore, stress: currentAssessment.stressScore }
  ];

  const calcDelta = (before: number, current: number) => {
    const diff = Math.round((current - before) * 10) / 10;
    const sign = diff > 0 ? '+' : '';
    return { diff, text: `${sign}${diff}` };
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0B0D10] border border-[#202630] rounded-md p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider">
          <GitCompare size={16} />
          <span>LONGITUDINAL COMPARATIVE ANALYSIS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide">
          BEFORE VS CURRENT ASSESSMENT COMPARISON
        </h1>
        <p className="text-xs text-[#8D949F] max-w-2xl">
          Evaluate temporal trajectory changes across psychological scales and modality signal contributions between baseline and follow-up sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-4">
        <div>
          <label className="text-[11px] font-mono text-[#8D949F] uppercase block mb-1">
            BASELINE ASSESSMENT (BEFORE)
          </label>
          <select
            value={beforeAssessment.id}
            onChange={(e) => {
              const found = MOCK_ASSESSMENTS.find((a) => a.id === e.target.value);
              if (found) setBeforeAssessment(found);
            }}
            className="w-full bg-[#101318] border border-[#202630] rounded px-3 py-2 text-xs text-[#F4F1EA] font-mono outline-none cursor-pointer"
          >
            {MOCK_ASSESSMENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} • {item.timestamp} ({item.overallStatus})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#8D949F] uppercase block mb-1">
            TARGET EVALUATION (CURRENT)
          </label>
          <select
            value={currentAssessment.id}
            onChange={(e) => {
              const found = MOCK_ASSESSMENTS.find((a) => a.id === e.target.value);
              if (found) setCurrentAssessment(found);
            }}
            className="w-full bg-[#101318] border border-[#202630] rounded px-3 py-2 text-xs text-[#F4F1EA] font-mono outline-none cursor-pointer"
          >
            {MOCK_ASSESSMENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} • {item.timestamp} ({item.overallStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#202630] pb-2">
            <span className="text-xs font-mono text-[#8D949F]">DEPRESSION INDEX</span>
            <span className="text-xs font-mono text-rose-400 font-medium">
              {calcDelta(beforeAssessment.depressionScore, currentAssessment.depressionScore).text}
            </span>
          </div>

          <div className="flex items-center justify-between font-mono pt-1">
            <div>
              <span className="text-[10px] text-[#8D949F] block">BEFORE</span>
              <span className="text-lg text-[#F4F1EA]">{beforeAssessment.depressionScore}</span>
            </div>
            <ArrowRight size={18} className="text-[#3B82F6]" />
            <div className="text-right">
              <span className="text-[10px] text-[#8D949F] block">CURRENT</span>
              <span className="text-xl font-semibold text-[#60A5FA]">{currentAssessment.depressionScore}</span>
            </div>
          </div>
          <ProgressBar value={currentAssessment.depressionScore} max={currentAssessment.depressionMax} color="blue" />
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#202630] pb-2">
            <span className="text-xs font-mono text-[#8D949F]">ANXIETY INDEX</span>
            <span className="text-xs font-mono text-amber-400 font-medium">
              {calcDelta(beforeAssessment.anxietyScore, currentAssessment.anxietyScore).text}
            </span>
          </div>

          <div className="flex items-center justify-between font-mono pt-1">
            <div>
              <span className="text-[10px] text-[#8D949F] block">BEFORE</span>
              <span className="text-lg text-[#F4F1EA]">{beforeAssessment.anxietyScore}</span>
            </div>
            <ArrowRight size={18} className="text-[#3B82F6]" />
            <div className="text-right">
              <span className="text-[10px] text-[#8D949F] block">CURRENT</span>
              <span className="text-xl font-semibold text-[#60A5FA]">{currentAssessment.anxietyScore}</span>
            </div>
          </div>
          <ProgressBar value={currentAssessment.anxietyScore} max={currentAssessment.anxietyMax} color="brightblue" />
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#202630] pb-2">
            <span className="text-xs font-mono text-[#8D949F]">STRESS INDEX</span>
            <span className="text-xs font-mono text-rose-400 font-medium">
              {calcDelta(beforeAssessment.stressScore, currentAssessment.stressScore).text}
            </span>
          </div>

          <div className="flex items-center justify-between font-mono pt-1">
            <div>
              <span className="text-[10px] text-[#8D949F] block">BEFORE</span>
              <span className="text-lg text-[#F4F1EA]">{beforeAssessment.stressScore}</span>
            </div>
            <ArrowRight size={18} className="text-[#3B82F6]" />
            <div className="text-right">
              <span className="text-[10px] text-[#8D949F] block">CURRENT</span>
              <span className="text-xl font-semibold text-[#60A5FA]">{currentAssessment.stressScore}</span>
            </div>
          </div>
          <ProgressBar value={currentAssessment.stressScore} max={currentAssessment.stressMax} color="blue" />
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#202630] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#3B82F6]" />
            <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
              TEMPORAL SCORE TRAJECTORY TREND
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8D949F]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Depression</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#60A5FA]" /> Anxiety</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> Stress</span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#8D949F" fontSize={11} tickLine={false} axisLine={{ stroke: '#202630' }} />
              <YAxis stroke="#8D949F" fontSize={11} tickLine={false} axisLine={{ stroke: '#202630' }} />
              <Tooltip contentStyle={{ backgroundColor: '#101318', borderColor: '#202630', borderRadius: '4px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="depression" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="anxiety" stroke="#60A5FA" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="stress" stroke="#93C5FD" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
