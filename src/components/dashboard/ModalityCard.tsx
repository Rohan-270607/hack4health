import React from 'react';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Camera, Mic, Activity } from 'lucide-react';
import type { ModalityType } from '../../types';

interface ModalityCardProps {
  type: ModalityType;
  title: string;
  status: string;
  sampleCount: number;
  sampleUnit: string;
  onClickNew?: () => void;
}

export const ModalityCard: React.FC<ModalityCardProps> = ({
  type,
  title,
  status,
  sampleCount,
  sampleUnit,
  onClickNew
}) => {
  const getIcon = () => {
    switch (type) {
      case 'facial': return <Camera size={18} className="text-[#3B82F6]" />;
      case 'audio': return <Mic size={18} className="text-[#60A5FA]" />;
      case 'numerical': return <Activity size={18} className="text-emerald-400" />;
    }
  };

  return (
    <Card hoverable className="flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-[#0B0D10] border border-[#202630]">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-xs font-mono tracking-wider text-[#8D949F] uppercase">{title}</h3>
            <p className="text-sm text-[#F4F1EA] font-medium font-sans mt-0.5">
              {type === 'facial' ? 'Facial Emotion Subnet' : type === 'audio' ? 'Vocal Acoustic Analysis' : 'Biophysical & Behavioral'}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="border-t border-[#202630]/70 pt-3 flex items-baseline justify-between">
        <div>
          <span className="text-xl font-mono font-semibold text-[#F4F1EA]">
            {sampleCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#8D949F] font-sans ml-1.5">{sampleUnit}</span>
        </div>

        {onClickNew && (
          <button
            onClick={onClickNew}
            className="text-xs text-[#3B82F6] hover:text-[#60A5FA] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            Launch →
          </button>
        )}
      </div>
    </Card>
  );
};
