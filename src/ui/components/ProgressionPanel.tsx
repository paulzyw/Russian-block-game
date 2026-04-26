/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { MISSIONS, COSMETICS, Cosmetic, Mission } from '../../game/constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, ShoppingBag, Star, Zap, ChevronRight, Lock } from 'lucide-react';
import { clsx } from 'clsx';

export function ProgressionPanel() {
  const [tab, setTab] = React.useState<'missions' | 'store' | 'achievements'>('missions');
  const { playerLevel, xp, currency, unlockedCosmetics, unlockCosmetic, setCosmetic, activeSkin, activeTrail, missionProgress } = useGameStore();

  const xpProgress = (xp / (playerLevel * 1000)) * 100;

  return (
    <div className="flex flex-col h-full bg-dark-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* XP Header */}
      <div className="p-6 bg-gradient-to-br from-neon-cyan/10 to-transparent border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center font-black text-neon-cyan italic">
              L{playerLevel}
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pilot Level</div>
              <div className="text-sm font-bold text-white">Elite Sentinel</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nanocredits</div>
            <div className="text-xl font-black text-neon-yellow italic">{currency.toLocaleString()}</div>
          </div>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            className="h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] font-mono text-gray-500 uppercase">
          <span>{xp} XP</span>
          <span>{playerLevel * 1000} XP NEXT</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <TabButton active={tab === 'missions'} onClick={() => setTab('missions')} icon={<Target size={14} />} label="Missions" />
        <TabButton active={tab === 'store'} onClick={() => setTab('store')} icon={<ShoppingBag size={14} />} label="Armory" />
        <TabButton active={tab === 'achievements'} onClick={() => setTab('achievements')} icon={<Trophy size={14} />} label="Trophy" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {tab === 'missions' && (
            <motion.div key="missions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {MISSIONS.map(mission => (
                <MissionItem key={mission.id} mission={mission} progress={missionProgress[mission.type] || 0} />
              ))}
            </motion.div>
          )}

          {tab === 'store' && (
            <motion.div key="store" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <StoreSection title="Block Skins" items={COSMETICS.filter(c => c.type === 'skin')} unlocked={unlockedCosmetics} onUnlock={unlockCosmetic} onSet={(id) => setCosmetic('skin', id)} active={activeSkin} currency={currency} />
              <StoreSection title="Pulse Trails" items={COSMETICS.filter(c => c.type === 'trail')} unlocked={unlockedCosmetics} onUnlock={unlockCosmetic} onSet={(id) => setCosmetic('trail', id)} active={activeTrail} currency={currency} />
            </motion.div>
          )}

          {tab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center p-4 text-center grayscale opacity-50">
                  <Lock size={20} className="mb-2" />
                  <div className="text-[10px] font-bold uppercase tracking-tighter">Classified</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => {
  return (
    <button onClick={onClick} className={clsx("flex-1 py-4 flex items-center justify-center gap-2 transition-all border-b-2", active ? "border-neon-cyan text-neon-cyan bg-neon-cyan/5" : "border-transparent text-gray-500 hover:text-white hover:bg-white/5")}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
};

const MissionItem: React.FC<{ mission: Mission; progress: number }> = ({ mission, progress }) => {
  const percent = Math.min((progress / mission.target) * 100, 100);
  const completed = progress >= mission.target;

  return (
    <div className={clsx("p-4 rounded-xl border transition-all", completed ? "bg-neon-green/5 border-neon-green/20" : "bg-white/5 border-white/10")}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className={clsx("text-xs font-bold uppercase tracking-wider", completed ? "text-neon-green" : "text-white")}>{mission.title}</h4>
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{mission.description}</p>
        </div>
        {completed && <Star size={14} className="text-neon-green" />}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
          <div className={clsx("h-full transition-all duration-1000", completed ? "bg-neon-green shadow-[0_0_8px_#00ff41]" : "bg-neon-cyan shadow-[0_0_8px_#00f3ff]")} style={{ width: `${percent}%` }} />
        </div>
        <span className="text-[9px] font-mono text-gray-500 whitespace-nowrap">{progress} / {mission.target}</span>
      </div>
      {!completed && (
        <div className="mt-3 flex gap-4 text-[9px] font-bold text-gray-600 uppercase">
          <span className="flex items-center gap-1"><Zap size={10} /> +{mission.rewardXP} XP</span>
          <span className="flex items-center gap-1"><ShoppingBag size={10} /> +{mission.rewardCurrency} CR</span>
        </div>
      )}
    </div>
  );
};

const StoreSection: React.FC<{ title: string; items: Cosmetic[]; unlocked: string[]; onUnlock: (id: string) => void; onSet: (id: string) => void; active: string; currency: number }> = ({ title, items, unlocked, onUnlock, onSet, active, currency }) => {
  return (
    <div>
      <h3 className="text-label mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => {
          const isUnlocked = unlocked.includes(item.id);
          const isActive = active === item.id;
          const canAfford = currency >= item.price;

          return (
            <button
              key={item.id}
              onClick={() => isUnlocked ? onSet(item.id) : (canAfford && onUnlock(item.id))}
              disabled={!isUnlocked && !canAfford}
              className={clsx(
                "p-3 rounded-xl border flex flex-col items-center gap-2 aspect-[4/5] justify-center transition-all group",
                isActive ? "border-neon-cyan bg-neon-cyan/5" : isUnlocked ? "border-white/10 bg-white/5 hover:border-white/30" : "border-white/5 bg-black/20 opacity-60 hover:opacity-100"
              )}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-dark-bg border border-white/10" style={{ backgroundColor: item.previewColor }}>
                {!isUnlocked && <Lock size={16} className="text-gray-500" />}
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-tighter truncate">{item.name}</div>
                <div className="text-[9px] opacity-50 mt-1">
                  {isActive ? (
                    <span className="text-neon-cyan tracking-widest font-black italic">ACTIVE</span>
                  ) : isUnlocked ? (
                    "UNLOCKED"
                  ) : (
                    <span className={canAfford ? "text-neon-yellow" : "text-gray-600"}>{item.price} CR</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
