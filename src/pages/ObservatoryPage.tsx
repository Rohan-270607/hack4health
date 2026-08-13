import React from 'react';
import { Card } from '../components/common/Card';
import { MODEL_METRICS_LIST, CONFUSION_MATRIX, INFERENCE_BENCHMARKS } from '../data/mockModels';
import { Eye, Binary, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ObservatoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#0B0D10] border border-[#202630] rounded-md p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold uppercase tracking-wider">
          <Eye size={16} />
          <span>MODEL OBSERVATORY & TECHNICAL BENCHMARKS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F1EA] tracking-wide">
          MULTIMODAL AI ARCHITECTURE AUDIT
        </h1>
        <p className="text-xs text-[#8D949F] max-w-3xl leading-relaxed">
          Comprehensive evaluation metrics for hackathon validation. Audited classification performance across individual vision, acoustic, and tabular biophysical subnets alongside late-fusion cross-attention benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODEL_METRICS_LIST.map((model) => (
          <Card key={model.name} hoverable className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#202630] pb-2">
                <span className="text-[10px] font-mono text-[#8D949F]">{model.modality}</span>
                <span className="text-[10px] font-mono text-[#3B82F6]">{model.version}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#F4F1EA] mt-2">{model.name}</h3>
            </div>

            <div className="space-y-2 font-mono text-xs pt-1 border-t border-[#202630]/60">
              <div className="flex justify-between">
                <span className="text-[#8D949F]">ACCURACY:</span>
                <span className="text-[#60A5FA] font-semibold">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8D949F]">MACRO F1:</span>
                <span className="text-[#F4F1EA]">{model.macroF1}</span>
              </div>
              {model.r2Score !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[#8D949F]">R² SCORE:</span>
                  <span className="text-emerald-400">{model.r2Score}</span>
                </div>
              )}
              {model.mae !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[#8D949F]">MAE:</span>
                  <span className="text-[#F4F1EA]">{model.mae}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-[#202630]/40 text-[11px]">
                <span className="text-[#8D949F]">INFERENCE:</span>
                <span className="text-[#8D949F]">{model.inferenceTimeMs} ms</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#202630] pb-3">
            <div>
              <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
                MULTIMODAL FUSION CONFUSION MATRIX
              </h2>
              <p className="text-xs text-[#F4F1EA] font-medium mt-0.5">
                Evaluation set (N = 2,500 validation samples)
              </p>
            </div>
            <Binary size={16} className="text-[#3B82F6]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="text-[#8D949F] font-mono text-[10px]">
                  <th className="p-2 border border-[#202630] text-left">ACTUAL \ PREDICTED</th>
                  <th className="p-2 border border-[#202630]">Sad</th>
                  <th className="p-2 border border-[#202630]">Neutral</th>
                  <th className="p-2 border border-[#202630]">Fear</th>
                  <th className="p-2 border border-[#202630]">Happy</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {['Sad', 'Neutral', 'Fear', 'Happy'].map((actual) => (
                  <tr key={actual}>
                    <td className="p-2 border border-[#202630] font-semibold text-[#8D949F] text-left">
                      {actual}
                    </td>
                    {['Sad', 'Neutral', 'Fear', 'Happy'].map((predicted) => {
                      const cell = CONFUSION_MATRIX.find(
                        (c) => c.actual === actual && c.predicted === predicted
                      );
                      const val = cell ? cell.value : 0;
                      const isDiagonal = actual === predicted;
                      return (
                        <td
                          key={predicted}
                          className={`p-2.5 border border-[#202630] ${
                            isDiagonal
                              ? 'bg-blue-950/60 text-[#60A5FA] font-bold'
                              : 'bg-[#0B0D10] text-[#8D949F]'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#202630] pb-3">
            <div>
              <h2 className="text-xs font-mono text-[#8D949F] uppercase tracking-wider">
                INFERENCE LATENCY BENCHMARKS (MS)
              </h2>
              <p className="text-xs text-[#F4F1EA] font-medium mt-0.5">
                Batch processing latency scaling
              </p>
            </div>
            <Clock size={16} className="text-[#60A5FA]" />
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INFERENCE_BENCHMARKS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="batchSize" stroke="#8D949F" fontSize={11} tickLine={false} axisLine={{ stroke: '#202630' }} />
                <YAxis stroke="#8D949F" fontSize={11} tickLine={false} axisLine={{ stroke: '#202630' }} />
                <Tooltip contentStyle={{ backgroundColor: '#101318', borderColor: '#202630', borderRadius: '4px', fontSize: '12px' }} />
                <Bar dataKey="facial" fill="#3B82F6" name="Facial Subnet" />
                <Bar dataKey="audio" fill="#60A5FA" name="Audio Subnet" />
                <Bar dataKey="numerical" fill="#10B981" name="Numerical Subnet" />
                <Bar dataKey="fusion" fill="#2563EB" name="Multimodal Fusion" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
