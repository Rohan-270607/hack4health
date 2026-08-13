import React from 'react';
import { Menu, Cpu } from 'lucide-react';
import { SYSTEM_CONFIG } from '../../data/mockConfig';

interface HeaderProps {
  currentTab: string;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenMobileMenu }) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'new-assessment': return 'New Assessment Workstation';
      case 'live-analysis': return 'Live Multimodal Analysis';
      case 'results': return 'Assessment Results & Diagnosis';
      case 'explainability': return 'Model Explainability (XAI)';
      case 'history': return 'Assessment History Log';
      case 'compare': return 'Comparative Longitudinal Analysis';
      case 'model-observatory': return 'Model Observatory & Metrics';
      case 'reports': return 'Report Generator & Exports';
      case 'responsible-ai': return 'Responsible AI & Ethics';
      case 'settings': return 'System Settings & Config';
      default: return 'MindPulse AI Platform';
    }
  };

  return (
    <header className="bg-[#050608]/90 backdrop-blur-xs border-b border-[#202630] px-4 lg:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded text-[#8D949F] hover:text-[#F4F1EA] hover:bg-[#161B22] lg:hidden cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#3B82F6] uppercase tracking-wider font-semibold">
              MINDPULSE
            </span>
            <span className="text-xs text-[#8D949F]">/</span>
            <h2 className="text-[#F4F1EA] text-sm lg:text-base font-medium tracking-wide">
              {getTabTitle(currentTab)}
            </h2>
          </div>
          <p className="text-[11px] text-[#8D949F] mt-0.5 hidden sm:block">
            Multimodal AI-assisted mental health assessment
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0B0D10] border border-[#202630] rounded text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#F4F1EA] text-[11px] font-mono font-medium hidden sm:inline">
            {SYSTEM_CONFIG.allOperational ? 'All systems operational' : 'System degraded'}
          </span>
          <span className="text-[#F4F1EA] text-[11px] font-mono font-medium sm:hidden">
            OPERATIONAL
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#101318] border border-[#202630] rounded text-[11px] font-mono text-[#8D949F]">
          <Cpu size={13} className="text-[#60A5FA]" />
          <span>FUSION v2.4.1</span>
        </div>
      </div>
    </header>
  );
};
