import { ShieldCheck } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-8 md:px-12 md:pt-16 md:pb-12">
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 border border-[#D9D4CC] bg-[#FCFAF6] px-3 py-1 font-mono-tech text-xs tracking-widest uppercase text-[#5F5B55]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#111111]" />
          <span>RESEARCH & ASSESSMENT PLATFORM</span>
        </div>

        <h2 className="font-heading text-4xl font-light tracking-tight text-[#111111] sm:text-5xl md:text-6xl leading-[1.1]">
          Understand the signals behind human expression.
        </h2>

        <p className="mt-6 font-body text-base leading-relaxed text-[#5F5B55] sm:text-lg">
          MindPulse combines real-time facial expression analysis and auditory acoustic features to generate an objective, AI-assisted evaluation. Designed for research exploration without automated medical diagnostic claims.
        </p>
      </div>
    </section>
  );
};
