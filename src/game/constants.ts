/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30; // Base size, will be responsive

export const INITIAL_SPEED = 800; // ms per drop
export const SPEED_INCREMENT = 0.95; // Multiply speed by this every level
export const LINES_PER_LEVEL = 10;

export const SCORE_SINGLE = 100;
export const SCORE_DOUBLE = 300;
export const SCORE_TRIPLE = 500;
export const SCORE_TETRIS = 800;
export const SCORE_SOFT_DROP = 1;
export const SCORE_HARD_DROP = 2;

export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  type: PieceType;
  color: string;
  shape: number[][];
}

export const TETROMINOS: Record<PieceType, Tetromino> = {
  'I': {
    type: 'I',
    color: '#00f0f0',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  'J': {
    type: 'J',
    color: '#0000f0',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  'L': {
    type: 'L',
    color: '#f0a000',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  'O': {
    type: 'O',
    color: '#f0f000',
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  'S': {
    type: 'S',
    color: '#00f000',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  'T': {
    type: 'T',
    color: '#a000f0',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  'Z': {
    type: 'Z',
    color: '#f00000',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  }
};

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER'
}

export type ThemeType = 'classic' | 'neon' | 'minimal' | 'cyberpunk' | 'retro';

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  rewardXP: number;
  rewardCurrency: number;
  type: 'clear_lines' | 'score_points' | 'reach_level' | 'tetris_count';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Cosmetic {
  id: string;
  name: string;
  type: 'skin' | 'trail';
  price: number;
  previewColor?: string;
}

export const MISSIONS: Mission[] = [
  { id: 'm1', title: 'Line Cleaner', description: 'Clear 100 lines total', target: 100, rewardXP: 500, rewardCurrency: 50, type: 'clear_lines' },
  { id: 'm2', title: 'Score Hunter', description: 'Reach 10,000 points in one game', target: 10000, rewardXP: 800, rewardCurrency: 100, type: 'score_points' },
  { id: 'm3', title: 'Tetris King', description: 'Perform 5 Tetris clears (4 lines)', target: 5, rewardXP: 1000, rewardCurrency: 150, type: 'tetris_count' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Drop', description: 'Start your first game', icon: '🚀', unlocked: false },
  { id: 'a2', title: 'Century Clear', description: 'Total lines cleared: 100', icon: '💯', unlocked: false },
  { id: 'a3', title: 'Elite Pulse', description: 'Reach Level 10', icon: '⚡', unlocked: false }
];

export const COSMETICS: Cosmetic[] = [
  { id: 's1', name: 'Original', type: 'skin', price: 0 },
  { id: 's2', name: 'Crystal', type: 'skin', price: 500, previewColor: '#00f3ff' },
  { id: 's3', name: 'Obsidian', type: 'skin', price: 1000, previewColor: '#333' },
  { id: 't1', name: 'No Trail', type: 'trail', price: 0 },
  { id: 't2', name: 'Cyber Stream', type: 'trail', price: 750, previewColor: '#ff00ff' }
];
