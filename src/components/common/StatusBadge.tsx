import React from 'react';

export type StatusVariant = 'ready' | 'processing' | 'complete' | 'idle' | 'error' | 'operational';

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-[#161B22] text-[#8D949F] border-[#202630]';
  let dotColor = 'bg-gray-400';

  if (normalized === 'ready' || normalized === 'operational' || normalized === 'complete') {
    styles = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
    dotColor = 'bg-emerald-400';
  } else if (normalized === 'processing' || normalized === 'uploading') {
    styles = 'bg-blue-950/50 text-blue-400 border-blue-800/50';
    dotColor = 'bg-blue-400 animate-pulse';
  } else if (normalized === 'error') {
    styles = 'bg-rose-950/40 text-rose-400 border-rose-800/40';
    dotColor = 'bg-rose-400';
  }

  const text = label || status.toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider border font-medium ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {text}
    </span>
  );
};
