/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { 
  COLS, 
  ROWS, 
  GameStatus, 
  TETROMINOS, 
  PieceType, 
  Tetromino,
  INITIAL_SPEED,
  LINES_PER_LEVEL,
  SPEED_INCREMENT,
  SCORE_SINGLE,
  SCORE_DOUBLE,
  SCORE_TRIPLE,
  SCORE_TETRIS,
  ThemeType
} from '../game/constants';

interface GameState {
  grid: (string | null)[][];
  currentPiece: {
    pos: { x: number; y: number };
    tetromino: Tetromino;
  } | null;
  nextPiece: Tetromino;
  holdPiece: Tetromino | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
  highScore: number;
  scoreHistory: number[];
  theme: ThemeType;
  
  // Progression
  xp: number;
  playerLevel: number;
  currency: number;
  unlockedCosmetics: string[];
  activeSkin: string;
  activeTrail: string;
  missionProgress: Record<string, number>;
  achievements: string[];
  dailyStreak: number;
  lastLogin: string;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  setGameOver: () => void;
  
  updateGrid: (newGrid: (string | null)[][]) => void;
  setCurrentPiece: (piece: { pos: { x: number; y: number }; tetromino: Tetromino } | null) => void;
  setNextPiece: (piece: Tetromino) => void;
  setHoldPiece: (piece: Tetromino | null) => void;
  setCanHold: (can: boolean) => void;
  
  addScore: (linesCleared: number) => void;
  incrementLines: (linesCleared: number) => void;
  addXP: (amount: number) => void;
  addCurrency: (amount: number) => void;
  unlockCosmetic: (id: string) => void;
  setCosmetic: (type: 'skin' | 'trail', id: string) => void;
  updateMission: (type: string, value: number) => void;
  setTheme: (theme: ThemeType) => void;
  resetGame: () => void;
}

const createEmptyGrid = () => 
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const getRandomTetromino = (): Tetromino => {
  const types: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return TETROMINOS[randomType];
};

export const useGameStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  currentPiece: null,
  nextPiece: getRandomTetromino(),
  holdPiece: null,
  canHold: true,
  score: 0,
  lines: 0,
  level: 1,
  status: GameStatus.IDLE,
  highScore: Number(localStorage.getItem('tetraflow-highscore') || 0),
  scoreHistory: JSON.parse(localStorage.getItem('tetraflow-history') || '[]'),
  theme: 'neon',

  // Progression Defaults
  xp: Number(localStorage.getItem('tetraflow-xp') || 0),
  playerLevel: Number(localStorage.getItem('tetraflow-player-level') || 1),
  currency: Number(localStorage.getItem('tetraflow-currency') || 0),
  unlockedCosmetics: JSON.parse(localStorage.getItem('tetraflow-unlocked') || '["s1", "t1"]'),
  activeSkin: localStorage.getItem('tetraflow-skin') || 's1',
  activeTrail: localStorage.getItem('tetraflow-trail') || 't1',
  missionProgress: JSON.parse(localStorage.getItem('tetraflow-missions') || '{}'),
  achievements: JSON.parse(localStorage.getItem('tetraflow-achievements') || '[]'),
  dailyStreak: Number(localStorage.getItem('tetraflow-streak') || 0),
  lastLogin: localStorage.getItem('tetraflow-last-login') || '',

  startGame: () => {
    set({ status: GameStatus.PLAYING });
    get().addXP(50); // Small bonus for starting
  },

  pauseGame: () => {
    if (get().status === GameStatus.PLAYING) {
      set({ status: GameStatus.PAUSED });
    }
  },

  resumeGame: () => {
    if (get().status === GameStatus.PAUSED) {
      set({ status: GameStatus.PLAYING });
    }
  },

  restartGame: () => {
    get().resetGame();
    set({ status: GameStatus.PLAYING });
  },

  setGameOver: () => {
    const { score, highScore, scoreHistory, level, lines } = get();
    if (score > highScore) {
      localStorage.setItem('tetraflow-highscore', score.toString());
      set({ highScore: score });
    }

    // Update history: latest first
    const newHistory = [score, ...scoreHistory].slice(0, 10);
    localStorage.setItem('tetraflow-history', JSON.stringify(newHistory));
    
    // Earn XP based on performance
    const xpEarned = Math.floor(score / 10) + (level * 100);
    const currencyEarned = Math.floor(lines / 2);
    
    get().addXP(xpEarned);
    get().addCurrency(currencyEarned);

    // Update missions
    get().updateMission('clear_lines', lines);
    get().updateMission('score_points', score);
    get().updateMission('reach_level', level);

    set({ 
      status: GameStatus.GAMEOVER, 
      currentPiece: null,
      scoreHistory: newHistory
    });
  },

  updateGrid: (grid) => set({ grid }),
  setCurrentPiece: (currentPiece) => set({ currentPiece }),
  setNextPiece: (nextPiece) => set({ nextPiece }),
  setHoldPiece: (holdPiece) => set({ holdPiece }),
  setCanHold: (canHold) => set({ canHold }),

  addScore: (linesCleared) => {
    const { score, level } = get();
    let points = 0;
    switch (linesCleared) {
      case 1: points = SCORE_SINGLE * level; break;
      case 2: points = SCORE_DOUBLE * level; break;
      case 3: points = SCORE_TRIPLE * level; break;
      case 4: 
        points = SCORE_TETRIS * level; 
        get().updateMission('tetris_count', 1);
        break;
    }
    set({ score: score + points });
  },

  incrementLines: (linesCleared) => {
    const { lines, level } = get();
    const newLines = lines + linesCleared;
    const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
    set({ lines: newLines, level: newLevel });
  },

  addXP: (amount) => {
    const { xp, playerLevel } = get();
    const newXP = xp + amount;
    const xpToNextLevel = playerLevel * 1000;
    
    if (newXP >= xpToNextLevel) {
      const nextLevel = playerLevel + 1;
      set({ playerLevel: nextLevel, xp: newXP - xpToNextLevel });
      localStorage.setItem('tetraflow-player-level', nextLevel.toString());
      localStorage.setItem('tetraflow-xp', (newXP - xpToNextLevel).toString());
      // Logic for level up reward could go here
    } else {
      set({ xp: newXP });
      localStorage.setItem('tetraflow-xp', newXP.toString());
    }
  },

  addCurrency: (amount) => {
    const newCurrency = get().currency + amount;
    set({ currency: newCurrency });
    localStorage.setItem('tetraflow-currency', newCurrency.toString());
  },

  unlockCosmetic: (id) => {
    const { unlockedCosmetics } = get();
    if (!unlockedCosmetics.includes(id)) {
      const newUnlocked = [...unlockedCosmetics, id];
      set({ unlockedCosmetics: newUnlocked });
      localStorage.setItem('tetraflow-unlocked', JSON.stringify(newUnlocked));
    }
  },

  setCosmetic: (type, id) => {
    if (type === 'skin') {
      set({ activeSkin: id });
      localStorage.setItem('tetraflow-skin', id);
    } else {
      set({ activeTrail: id });
      localStorage.setItem('tetraflow-trail', id);
    }
  },

  updateMission: (type, value) => {
    const { missionProgress } = get();
    const current = missionProgress[type] || 0;
    
    // For missions that are "reach X", we take the max. For "total X", we sum.
    let newValue = current;
    if (type === 'score_points' || type === 'reach_level') {
      newValue = Math.max(current, value);
    } else {
      newValue = current + value;
    }

    const newProgress = { ...missionProgress, [type]: newValue };
    set({ missionProgress: newProgress });
    localStorage.setItem('tetraflow-missions', JSON.stringify(newProgress));
  },

  setTheme: (theme) => set({ theme }),

  resetGame: () => {
    set({
      grid: createEmptyGrid(),
      currentPiece: null,
      nextPiece: getRandomTetromino(),
      holdPiece: null,
      canHold: true,
      score: 0,
      lines: 0,
      level: 1,
      status: GameStatus.IDLE
    });
  }
}));
