import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'brightblue' | 'emerald' | 'amber' | 'rose';
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = false,
  color = 'blue',
  height = 'h-1.5',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorClasses = {
    blue: 'bg-[#3B82F6]',
    brightblue: 'bg-[#60A5FA]',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage || sublabel) && (
        <div className="flex justify-between items-baseline mb-1.5 text-xs">
          <span className="text-[#F4F1EA] font-medium tracking-wide">{label}</span>
          <div className="space-x-2">
            {sublabel && <span className="text-[#8D949F] font-mono">{sublabel}</span>}
            {showPercentage && <span className="text-[#60A5FA] font-mono font-medium">{percentage}%</span>}
          </div>
        </div>
      )}
      <div className={`w-full bg-[#161B22] border border-[#202630] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colorClasses[color]} ${height} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
