import { Activity } from 'lucide-react';

interface NavbarProps {
  isBackendOnline?: boolean | null;
}

export const Navbar = ({ isBackendOnline = true }: NavbarProps) => {
  return (
    <header className="border-b border-[#D9D4CC] bg-[#FCFAF6] px-6 py-4 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#111111] text-[#F5F2EC]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-[#111111]">
              MINDPULSE
            </h1>
            <p className="font-body text-xs font-medium text-[#5F5B55]">
              Multimodal Mental Health Assessment
            </p>
          </div>
        </div>

        {/* Minimal System Status Pill */}
        <div className="flex items-center gap-2 rounded-full border border-[#D9D4CC] bg-[#F5F2EC] px-3 py-1 font-mono-tech text-[11px] tracking-wider uppercase text-[#111111]">
          <span
            className={`h-2 w-2 rounded-full ${
              isBackendOnline === false
                ? 'bg-amber-600 animate-pulse'
                : 'bg-[#111111]'
            }`}
          />
          <span>{isBackendOnline === false ? 'BACKEND OFFLINE' : 'SYSTEM ONLINE'}</span>
        </div>
      </div>
    </header>
  );
};
