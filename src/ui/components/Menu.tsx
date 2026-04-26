/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameStatus } from '../../game/constants';
import { motion } from 'motion/react';
import { Play, RotateCcw, Pause, Settings, Volume2, VolumeX, Moon, Sun, Palette, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import { soundManager } from '../../engine/SoundManager';

export function Menu({ onShowManual }: { onShowManual?: () => void }) {
  const { status, score, highScore, level, startGame, resumeGame, restartGame, scoreHistory } = useGameStore();

  const isGameOver = status === GameStatus.GAMEOVER;
  const isPaused = status === GameStatus.PAUSED;
  const isIdle = status === GameStatus.IDLE;

  return (
    <div className="text-center p-12 rounded-sm border-2 border-white/20 shadow-2xl bg-dark-bg/95 max-w-sm w-full mx-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-white">
          NEO<span className="text-neon-magenta">BLOK</span>
        </h1>
        <div className="text-[10px] tracking-[0.4em] text-neon-cyan font-bold mb-10 opacity-70">SYSTEM.INIT.SUCCESS</div>
      </motion.div>

      {isGameOver && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 p-6 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Trophy size={40} className="text-neon-yellow" />
          </div>
          
          <div className="text-neon-cyan font-black tracking-widest text-[10px] mb-2 uppercase italic">Mission_Summary</div>
          <div className="text-4xl font-black italic mb-4 text-white">{score.toLocaleString()}</div>
          
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
             <div className="text-left">
                <div className="text-[10px] text-gray-500 uppercase font-bold">XP Gained</div>
                <div className="text-sm font-mono text-neon-cyan">+{Math.floor(score / 10)} XP</div>
             </div>
             <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Credits</div>
                <div className="text-sm font-mono text-neon-yellow">+{Math.floor(score / 200)} CR</div>
             </div>
          </div>
          
          <div className="text-[10px] text-gray-500 font-bold uppercase mt-2">Personal Best: {highScore.toLocaleString()}</div>
        </motion.div>
      )}

      {isPaused && (
        <div className="mb-10">
          <div className="text-xl font-black italic text-white tracking-widest mb-4">PROCESS_HALTED</div>
          <div className="text-xs font-mono text-gray-500">Buffer state preserved // L{level} // S{score}</div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {isIdle ? (
          <MenuButton onClick={startGame} text="BOOT ENGINE" primary />
        ) : isPaused ? (
          <MenuButton onClick={resumeGame} text="RE-SYNC" primary />
        ) : (
          <MenuButton onClick={restartGame} text="RE-INITIALIZE" primary />
        )}
        
        {onShowManual && (
          <button 
            onClick={onShowManual}
            className="text-[10px] font-black italic text-gray-500 hover:text-white uppercase tracking-[0.3em] py-2 transition-colors"
          >
            [ READ_MANUAL ]
          </button>
        )}
      </div>

      {scoreHistory.length > 0 && (
        <div className="mt-10 pt-6 border-t border-white/5 text-left">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-4 uppercase opacity-60">Session Log (Latest to Oldest)</div>
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
            {scoreHistory.map((s, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-1">
                <span className="opacity-30">DATA_SET_{scoreHistory.length - i}</span>
                <span className={clsx("font-bold tracking-tighter", i === 0 ? "text-neon-cyan" : "text-white")}>
                  {s.toLocaleString().padStart(6, '0')}
                </span>
                <span className="text-[9px] opacity-20 uppercase font-bold">{i === 0 ? 'NEW' : 'ARCHIVE'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-2 opacity-30 text-[9px] font-mono font-bold uppercase tracking-widest">
        <div>Quantum Core // Stable Build</div>
        <div className="text-neon-cyan">Wasmer Cloud Protocol Active</div>
      </div>
    </div>
  );
}

function MenuButton({ onClick, text, primary }: { onClick: () => void; text: string; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center py-5 px-8 rounded-sm font-black italic transition-all active:scale-95",
        primary 
          ? "bg-neon-cyan text-black hover:brightness-110 shadow-[0_0_20px_rgba(0,243,255,0.4)]" 
          : "bg-white/5 hover:bg-white/10 text-white"
      )}
    >
      <span className="tracking-[0.2em]">{text}</span>
    </button>
  );
}
