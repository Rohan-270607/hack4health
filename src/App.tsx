import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FacialModule } from './components/FacialModule';
import { AudioModule } from './components/AudioModule';
import { checkBackendStatus } from './services/api';

export function App() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const verifyBackend = async () => {
      const status = await checkBackendStatus();
      if (isMounted) {
        setIsBackendOnline(status);
      }
    };

    verifyBackend();

    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EC] text-[#111111] font-body flex flex-col">
      {/* Top minimal navigation */}
      <Navbar isBackendOnline={isBackendOnline} />

      {/* Hero section */}
      <Hero />

      {/* Main Workspace with side-by-side modules */}
      <main className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 flex-1">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Card 1: Facial Expression */}
          <FacialModule />

          {/* Card 2: Voice & Audio */}
          <AudioModule />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#D9D4CC] bg-[#FCFAF6] px-6 py-6 text-center font-mono-tech text-xs text-[#5F5B55]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>MINDPULSE ASSESSMENT SYSTEM — RESEARCH & EVALUATION PROTOCOL</span>
          <span>FLASK BACKEND TARGET: http://127.0.0.1:5000</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
