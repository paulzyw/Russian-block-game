/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Tetromino } from '../../game/constants';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface HUDProps {
  type: 'stats' | 'next' | 'hold';
}

export function HUD({ type }: HUDProps) {
  const { score, lines, level, nextPiece, holdPiece, playerLevel, xp } = useGameStore();

  const xpProgress = (xp / (playerLevel * 1000)) * 100;

  if (type === 'stats') {
    return (
      <div className="flex flex-col gap-4 w-full">
        {/* XP Bar Overlay */}
        <div className="bg-dark-surface border border-white/10 p-3 rounded-xl">
           <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="text-[9px] font-black text-neon-cyan uppercase italic tracking-widest">Level {playerLevel}</span>
              <span className="text-[9px] text-gray-500 font-mono italic">{Math.round(xpProgress)}% SYNC</span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.4)] transition-all duration-700 ease-out" style={{ width: `${xpProgress}%` }}></div>
           </div>
        </div>

        <div className="bg-dark-surface border border-white/10 p-5 rounded-xl space-y-4 w-full">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-label text-gray-500">Total Yield</div>
              <div className="text-3xl font-black italic tracking-tighter text-white">
                {score.toString().padStart(6, '0')}
              </div>
            </div>
            <div className="text-neon-cyan text-[10px] font-black italic animate-pulse tracking-widest uppercase">
              Stable
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-label text-gray-500">Gravity</div>
              <div className="text-xl font-bold font-mono text-neon-cyan">Lv.{level}</div>
            </div>
            <div>
              <div className="text-label text-gray-500">Defrag</div>
              <div className="text-xl font-bold font-mono text-white">{lines}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const piece = type === 'next' ? nextPiece : holdPiece;
  const label = type === 'next' ? 'Next Cycle' : 'Hold Buffer';
  const accentColor = type === 'next' ? 'text-neon-cyan' : 'text-neon-magenta';

  return (
    <div className="bg-dark-surface border border-white/10 p-4 rounded-xl flex-1 relative overflow-hidden flex flex-col min-h-0">
      <h3 className="text-label text-gray-400 mb-6">{label}</h3>
      <div className="flex-1 flex items-center justify-center min-h-[100px]">
        {piece ? (
          <div className="scale-150">
            <PiecePreview piece={piece} />
          </div>
        ) : (
          <div className="w-12 h-12 border-2 border-dashed border-white/10 rounded-md" />
        )}
      </div>
      <p className={clsx("text-center mt-4 text-[10px] font-mono", accentColor)}>
        {type === 'next' ? '// QUEUED' : '[SHIFT] TO SWAP'}
      </p>
    </div>
  );
}

function PiecePreview({ piece }: { piece: Tetromino }) {
  const size = 12;
  return (
    <div 
      className="grid gap-1" 
      style={{ 
        gridTemplateColumns: `repeat(${piece.shape[0].length}, ${size}px)`,
        gridTemplateRows: `repeat(${piece.shape.length}, ${size}px)`
      }}
    >
      {piece.shape.map((row, y) => (
        row.map((cell, x) => (
          <div 
            key={`${x}-${y}`} 
            className={clsx(
              "rounded-[1px]",
              cell ? (piece.type === 'I' || piece.type === 'T' || piece.type === 'J' ? "bg-neon-cyan shadow-[0_0_10px_#00f3ff]" : "bg-neon-magenta shadow-[0_0_10px_#ff00ff]") : "bg-transparent"
            )}
            style={{ 
              width: size, 
              height: size,
            }} 
          />
        ))
      ))}
    </div>
  );
}
