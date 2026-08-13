import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Radio,
  FileCheck2,
  Brain,
  History,
  GitCompare,
  Eye,
  FileSpreadsheet,
  ShieldCheck,
  Settings,
  Activity
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'new-assessment'
  | 'live-analysis'
  | 'results'
  | 'explainability'
  | 'history'
  | 'compare'
  | 'model-observatory'
  | 'reports'
  | 'responsible-ai'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const topNavItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'new-assessment', label: 'New Assessment', icon: <PlusCircle size={17} /> },
    { id: 'live-analysis', label: 'Live Analysis', icon: <Radio size={17} /> },
    { id: 'results', label: 'Results', icon: <FileCheck2 size={17} /> },
    { id: 'explainability', label: 'Explainability', icon: <Brain size={17} /> },
    { id: 'history', label: 'History', icon: <History size={17} /> },
    { id: 'compare', label: 'Compare', icon: <GitCompare size={17} /> },
    { id: 'model-observatory', label: 'Model Observatory', icon: <Eye size={17} /> }
  ];

  const bottomNavItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'reports', label: 'Reports', icon: <FileSpreadsheet size={17} /> },
    { id: 'responsible-ai', label: 'Responsible AI', icon: <ShieldCheck size={17} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={17} /> }
  ];

  const renderNavList = (items: typeof topNavItems) => (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onSelectTab(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#3B82F6] text-[#F4F1EA] shadow-sm font-semibold'
                : 'text-[#8D949F] hover:text-[#F4F1EA] hover:bg-[#161B22]'
            }`}
          >
            <span className={isActive ? 'text-[#F4F1EA]' : 'text-[#8D949F]'}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0B0D10] border-r border-[#202630] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#3B82F6] flex items-center justify-center text-[#F4F1EA] shadow-sm">
                <Activity size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-[#F4F1EA] font-semibold text-sm tracking-wider font-sans">
                  MINDPULSE
                </h1>
                <p className="text-[10px] text-[#8D949F] font-mono tracking-tight">
                  AI HEALTH LAB
                </p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#202630] mx-1" />

          {/* Top Main Navigation */}
          {renderNavList(topNavItems)}
        </div>

        {/* Bottom Secondary Navigation */}
        <div className="space-y-4">
          <div className="h-[1px] bg-[#202630] mx-1" />
          {renderNavList(bottomNavItems)}

          <div className="pt-2 px-3 text-[10px] text-[#8D949F] font-mono flex items-center justify-between border-t border-[#202630]/60">
            <span>VERSION 2.4.1</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
