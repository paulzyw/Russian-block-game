/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Smartphone, X, MousePointer2, Keyboard, Move, RotateCw, ArrowDown, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface ManualProps {
  onClose: () => void;
}

export function Manual({ onClose }: ManualProps) {
  const [mode, setMode] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-dark-surface/95 backdrop-blur-2xl border-2 border-white/20 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar relative z-50"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={20} className="text-gray-400" />
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black italic tracking-tighter text-white mb-2">OPERATIONS_MANUAL</h2>
        <p className="text-[10px] uppercase tracking-[0.4em] text-neon-cyan opacity-70">Tactical Block Deployment Guide</p>
      </div>

      {/* Switcher */}
      <div className="flex gap-4 mb-8 justify-center">
        <button 
          onClick={() => setMode('desktop')}
          className={clsx(
            "flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border",
            mode === 'desktop' ? "bg-neon-cyan text-black border-neon-cyan glow-cyan" : "bg-white/5 text-gray-500 border-white/10"
          )}
        >
          <Monitor size={18} /> DESKTOP
        </button>
        <button 
          onClick={() => setMode('mobile')}
          className={clsx(
            "flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all border",
            mode === 'mobile' ? "bg-neon-magenta text-black border-neon-magenta glow-magenta" : "bg-white/5 text-gray-500 border-white/10"
          )}
        >
          <Smartphone size={18} /> MOBILE
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {mode === 'desktop' ? (
          <>
            <section className="space-y-4">
              <h3 className="text-neon-cyan font-black italic flex items-center gap-2">
                <Keyboard size={16} /> NAVIGATION
              </h3>
              <ul className="space-y-3">
                <ControlRow keys={['←', '→']} action="Move Block Lateral" />
                <ControlRow keys={['↓']} action="Soft Drop (Accelerate)" />
                <ControlRow keys={['SPACE']} action="Hard Drop (Instant)" />
              </ul>
            </section>
            <section className="space-y-4">
              <h3 className="text-neon-cyan font-black italic flex items-center gap-2">
                <Zap size={16} /> ACTIONS
              </h3>
              <ul className="space-y-3">
                <ControlRow keys={['↑', 'W']} action="Rotate Clockwise" />
                <ControlRow keys={['SHIFT']} action="Hold / Swap" />
                <ControlRow keys={['ESC', 'P']} action="Pause System" />
              </ul>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-4">
              <h3 className="text-neon-magenta font-black italic flex items-center gap-2">
                <Smartphone size={16} /> LEFT THUMB
              </h3>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-neon-cyan/50 flex items-center justify-center text-neon-cyan">
                  <RotateCw size={24} />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-white uppercase mb-1">Rotation Hub</span>
                  Tap core to rotate block clockwise for tactical alignment.
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-neon-magenta font-black italic flex items-center gap-2">
                <Move size={16} /> RIGHT THUMB
              </h3>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center text-xs">L</div>
                  <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center text-xs">R</div>
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-white uppercase mb-1">Directional Pad</span>
                  Tap arrows for single steps. Hold buttons for rapid glide movement.
                </div>
              </div>
              <div className="p-4 bg-neon-magenta/10 border border-neon-magenta/30 rounded-xl flex items-center gap-4">
                <div className="w-12 h-8 rounded-lg bg-neon-magenta/40 flex items-center justify-center text-neon-magenta">
                  <ArrowDown size={20} />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-neon-magenta uppercase mb-1">Impact Trigger</span>
                  Instant Hard Drop. Finalize placement immediately.
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <div className="mt-10 p-6 bg-dark-bg border border-white/10 rounded-xl">
        <h4 className="text-xs font-black italic text-gray-400 mb-4 tracking-widest uppercase">Scoring Dynamics</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <ScoreTip label="Single" value="100" />
          <ScoreTip label="Double" value="300" />
          <ScoreTip label="Triple" value="500" />
          <ScoreTip label="TETRA" value="800" color="text-neon-cyan" />
        </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-8 w-full py-4 bg-neon-cyan text-black font-black italic tracking-widest hover:brightness-110 active:scale-[0.98] transition-all glow-cyan"
      >
        I_UNDERSTAND_SYNC_NOW
      </button>
    </motion.div>
  );
}

function ControlRow({ keys, action }: { keys: string[]; action: string }) {
  return (
    <li className="flex justify-between items-center py-2 border-b border-white/5">
      <div className="flex gap-2">
        {keys.map(k => (
          <span key={k} className="px-2 py-1 bg-white/10 border border-white/20 rounded font-mono text-[10px] text-white min-w-[32px] text-center">
            {k}
          </span>
        ))}
      </div>
      <span className="text-[11px] font-bold text-gray-500 uppercase">{action}</span>
    </li>
  );
}

function ScoreTip({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div className="text-[8px] font-black text-gray-600 uppercase mb-1">{label}</div>
      <div className={clsx("text-sm font-mono font-bold", color || "text-white")}>{value}</div>
    </div>
  );
}
