import React from 'react';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_ASSESSMENTS } from '../data/mockAssessments';
import type { NavTab } from '../components/layout/Sidebar';
import { History as HistoryIcon, ArrowUpRight, Filter } from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B0D10] border border-[#202630] rounded-md p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider">
            <HistoryIcon size={16} />
            <span>ASSESSMENT TIMELINE & LOGS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide mt-1">
            ASSESSMENT HISTORY
          </h1>
          <p className="text-xs text-[#8D949F] mt-1 max-w-xl">
            Historical log of all multimodal assessments conducted. Click any entry to inspect full subscale breakdowns or launch comparison mode.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('compare')}
            className="px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-[#F4F1EA] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Compare Assessments</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[#202630] flex items-center justify-between">
          <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
            COMPLETED EVALUATIONS ({MOCK_ASSESSMENTS.length} RECORDS)
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 bg-[#0B0D10] border border-[#202630] text-xs text-[#8D949F] hover:text-[#F4F1EA] rounded flex items-center gap-1 cursor-pointer">
              <Filter size={12} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D10] text-[#8D949F] font-mono text-[11px] uppercase border-b border-[#202630]">
              <tr>
                <th className="p-3.5">DATE / TIME</th>
                <th className="p-3.5">ASSESSMENT ID</th>
                <th className="p-3.5">OVERALL STATUS</th>
                <th className="p-3.5 text-right">STRESS</th>
                <th className="p-3.5 text-right">ANXIETY</th>
                <th className="p-3.5 text-right">DEPRESSION</th>
                <th className="p-3.5 text-right">CONFIDENCE</th>
                <th className="p-3.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202630]/60 text-[#F4F1EA]">
              {MOCK_ASSESSMENTS.map((item) => (
                <tr key={item.id} className="hover:bg-[#161B22] transition-colors">
                  <td className="p-3.5 font-mono text-[#8D949F]">{item.timestamp}</td>
                  <td className="p-3.5 font-mono font-medium text-[#60A5FA]">{item.id}</td>
                  <td className="p-3.5">
                    <StatusBadge status="complete" label={item.overallStatus} />
                  </td>
                  <td className="p-3.5 font-mono text-right font-medium">
                    {item.stressScore} <span className="text-[#8D949F] text-[10px]">/ {item.stressMax}</span>
                  </td>
                  <td className="p-3.5 font-mono text-right font-medium">
                    {item.anxietyScore} <span className="text-[#8D949F] text-[10px]">/ {item.anxietyMax}</span>
                  </td>
                  <td className="p-3.5 font-mono text-right font-medium">
                    {item.depressionScore} <span className="text-[#8D949F] text-[10px]">/ {item.depressionMax}</span>
                  </td>
                  <td className="p-3.5 font-mono text-right text-emerald-400 font-semibold">
                    {item.confidence}%
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onNavigate('results')}
                      className="px-2.5 py-1 bg-[#101318] hover:bg-[#202630] border border-[#202630] text-[11px] text-[#3B82F6] hover:text-[#60A5FA] rounded transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
