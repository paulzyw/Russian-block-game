/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCw, ChevronLeft, ChevronRight, ArrowDownToLine, ChevronDown } from 'lucide-react';
import { GameStatus } from '../../game/constants';
import { useGameStore } from '../../store/useGameStore';
import { clsx } from 'clsx';

export function MobileOverlay() {
  const { status } = useGameStore();

  if (status !== GameStatus.PLAYING) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none xl:hidden flex justify-between items-end p-4 pb-10 sm:p-6 sm:pb-8">
      {/* Left Side: Rotation & Hold */}
      <div className="pointer-events-auto flex flex-col gap-4">
        <TouchButton 
          action="HOLD" 
          icon={<div className="font-black italic text-xs">HOLD</div>} 
          className="w-14 h-14 bg-neon-magenta/10 border-2 border-neon-magenta/40 text-neon-magenta"
        />
        <TouchButton 
          action="ROTATE" 
          icon={<RotateCw size={32} />} 
          className="w-20 h-20 bg-neon-cyan/10 border-2 border-neon-cyan/40 text-neon-cyan glow-cyan"
        />
      </div>

      {/* Right Side: Directional Cluster */}
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <TouchButton 
            action="MOVE_LEFT" 
            icon={<ChevronLeft size={36} />} 
            className="w-20 h-20 bg-white/5 border-2 border-white/10 text-white"
            autoRepeat
          />
          <TouchButton 
            action="MOVE_RIGHT" 
            icon={<ChevronRight size={36} />} 
            className="w-20 h-20 bg-white/5 border-2 border-white/10 text-white"
            autoRepeat
          />
        </div>
        <div className="flex gap-3 w-full">
          <TouchButton 
            action="MOVE_DOWN" 
            icon={<ChevronDown size={32} />} 
            className="flex-1 h-14 bg-white/5 border-2 border-white/10 text-white rounded-2xl"
            autoRepeat
          />
          <TouchButton 
            action="HARD_DROP" 
            icon={<ArrowDownToLine size={32} />} 
            className="flex-1 h-14 bg-neon-magenta/10 border-2 border-neon-magenta/40 text-neon-magenta glow-magenta rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}

interface TouchButtonProps {
  action: string;
  icon: React.ReactNode;
  className?: string;
  autoRepeat?: boolean;
}

function TouchButton({ action, icon, className, autoRepeat }: TouchButtonProps) {
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const dispatch = () => {
    const key = getKeyCode(action);
    const event = new KeyboardEvent('keydown', { key, repeat: false });
    window.dispatchEvent(event);
  };

  const handleStart = (e: React.PointerEvent) => {
    e.preventDefault();
    dispatch();

    if (autoRepeat) {
      // DAS: Initial delay before repeating
      timerRef.current = window.setTimeout(() => {
        // ARR: Repeating speed
        intervalRef.current = window.setInterval(dispatch, 50);
      }, 200);
    }
  };

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.button
      whileTap={{ scale: 0.9, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onPointerCancel={handleEnd}
      className={clsx(
        "rounded-full flex items-center justify-center backdrop-blur-sm transition-colors touch-none",
        className
      )}
    >
      {icon}
    </motion.button>
  );
}

function getKeyCode(action: string) {
  switch (action) {
    case 'MOVE_LEFT': return 'ArrowLeft';
    case 'MOVE_RIGHT': return 'ArrowRight';
    case 'MOVE_DOWN': return 'ArrowDown';
    case 'ROTATE': return 'ArrowUp';
    case 'HARD_DROP': return ' ';
    case 'HOLD': return 'Shift';
    default: return '';
  }
}
