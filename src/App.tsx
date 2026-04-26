/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { GameBoard } from './ui/components/GameBoard';
import { HUD } from './ui/components/HUD';
import { Menu } from './ui/components/Menu';
import { ProgressionPanel } from './ui/components/ProgressionPanel';
import { MobileOverlay } from './ui/components/MobileOverlay';
import { Manual } from './ui/components/Manual';
import { GameStatus } from './game/constants';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Star, Target, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function ModuleTrigger({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <div className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center transition-all border",
      active ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]" 
             : "bg-white/5 border-white/10 text-gray-600 grayscale"
    )}>
      {icon}
    </div>
  );
}

export default function App() {
  const { status, theme } = useGameStore();
  const [showManual, setShowManual] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { render } = useGameLoop(canvasRef);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('game-container');
      const canvas = canvasRef.current;
      if (container && canvas) {
        const height = container.clientHeight;
        const width = (height / 20) * 10;
        canvas.height = height;
        canvas.width = width;
        render();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  return (
    <div className="fixed inset-0 flex flex-col p-6 overflow-hidden select-none">
      {/* Header */}
      <header className="flex justify-between items-end mb-6 border-b-2 border-neon-cyan pb-2 flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan font-bold">System.Architecture.Active</span>
          <h1 className="text-4xl font-black italic tracking-tighter leading-none text-white">
            TETRA<span className="text-neon-magenta">FLOW</span>
          </h1>
        </div>
        <div className="flex gap-4 md:gap-8 text-right items-center">
          <button 
            onClick={() => setShowManual(true)}
            className="flex flex-col items-center justify-center p-2 hover:bg-white/5 rounded-lg transition-colors group"
          >
            <Info size={18} className="text-gray-500 group-hover:text-neon-cyan transition-colors" />
            <span className="text-[8px] uppercase text-gray-600 mt-0.5">Manual</span>
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-500">Record</span>
            <span className="text-xs font-mono uppercase tracking-wider text-neon-cyan">Local STABLE</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-500">Engine</span>
            <span className="text-xs font-mono uppercase tracking-wider">v1.2.0_STABLE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-8 items-stretch min-h-0">
        {/* Left Side: Progression & Missions */}
        <section className="hidden xl:flex col-span-3 flex-col gap-4 min-h-0">
          <ProgressionPanel />
        </section>

        {/* Central Board */}
        <section className="col-span-12 xl:col-span-6 flex justify-center h-full min-h-0 relative">
          <div className="absolute -top-6 left-0 right-0 flex justify-between items-center text-[10px] font-mono text-neon-cyan px-2">
            <div className="animate-pulse flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              [ CORE_TEMP: STABLE ]
            </div>
            <div className="opacity-50">SYNC_ID: #420-TX</div>
          </div>
          
          <div 
            id="game-container" 
            className="relative aspect-[10/20] h-full bg-[#050505] border-4 border-[#1e1e26] rounded-sm p-1 shadow-[0_0_60px_rgba(0,243,255,0.08)] overflow-hidden"
          >
            <GameBoard canvasRef={canvasRef} />
            <MobileOverlay />
            <AnimatePresence>
              {status !== GameStatus.PLAYING && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-dark-bg/90 backdrop-blur-md"
                >
                  <Menu onShowManual={() => setShowManual(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Global Manual Overlay */}
        <AnimatePresence>
          {showManual && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <Manual onClose={() => setShowManual(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Right Side: Pieces & Stats */}
        <section className="hidden xl:flex col-span-3 flex-col gap-4">
          <HUD type="hold" />
          <HUD type="next" />
          <HUD type="stats" />
          <div className="mt-auto border-brutalist p-4 flex flex-col gap-3">
             <div className="text-label">Active Modules</div>
             <div className="flex gap-2">
                <ModuleTrigger icon={<Zap size={14} />} active />
                <ModuleTrigger icon={<Star size={14} />} />
                <ModuleTrigger icon={<Target size={14} />} />
             </div>
          </div>
        </section>

        {/* Mobile Stats (Optimized) */}
        <div className="xl:hidden col-span-12 flex justify-between gap-4 mt-2 h-auto flex-shrink-0">
          <HUD type="stats" />
          <HUD type="next" />
        </div>
      </main>

      <footer className="h-6 mt-4 flex items-center justify-center flex-shrink-0 opacity-10 font-mono text-[8px] uppercase tracking-[0.5em]">
        Status: Engine Hybrid Sync // Mobile Layer Active
      </footer>
    </div>
  );
}
