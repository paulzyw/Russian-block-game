/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameLoop } from '../engine/GameLoop';
import { TetrisEngine } from '../game/TetrisEngine';
import { InputManager } from '../engine/InputManager';
import { soundManager } from '../engine/SoundManager';
import { GameStatus, INITIAL_SPEED, SPEED_INCREMENT, COLS, ROWS, Tetromino } from '../game/constants';
import confetti from 'canvas-confetti';

export function useGameLoop(canvasRef: { current: HTMLCanvasElement | null }) {
  const store = useGameStore();
  const gameLoopRef = useRef<GameLoop | null>(null);
  const dropCounter = useRef(0);
  const inputManagerRef = useRef<InputManager | null>(null);

  const shakeRef = useRef(0);

  const triggerShake = (amount = 10) => {
    shakeRef.current = amount;
  };

  // Helper to spawn a new piece
  const spawnPiece = useCallback((currentNext: Tetromino) => {
    const next = TetrisEngine.getRandomTetromino();
    const piece = {
      pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
      tetromino: currentNext
    };
    
    if (TetrisEngine.checkCollision(piece.pos, piece.tetromino, store.grid)) {
      store.setGameOver();
      soundManager.playGameOver();
      triggerShake(30);
      return false;
    }
    
    store.setCurrentPiece(piece);
    store.setNextPiece(next);
    store.setCanHold(true);
    return true;
  }, [store]);

  const drop = useCallback(() => {
    if (!store.currentPiece) return;

    const newPos = { ...store.currentPiece.pos, y: store.currentPiece.pos.y + 1 };
    
    if (!TetrisEngine.checkCollision(newPos, store.currentPiece.tetromino, store.grid)) {
      store.setCurrentPiece({ ...store.currentPiece, pos: newPos });
    } else {
      // Lock piece
      const newGrid = [...store.grid.map(row => [...row])];
      const { shape, color } = store.currentPiece.tetromino;
      const { x, y } = store.currentPiece.pos;

      shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell !== 0 && y + dy >= 0) {
            newGrid[y + dy][x + dx] = color;
          }
        });
      });

      const { newGrid: clearedGrid, linesCleared } = TetrisEngine.clearLines(newGrid);
      
      if (linesCleared > 0) {
        store.addScore(linesCleared);
        store.incrementLines(linesCleared);
        soundManager.playClear();
        triggerShake(linesCleared * 15);
        confetti({
          particleCount: 50 * linesCleared,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f3ff', '#ff00ff', '#fbff00']
        });
      } else {
        soundManager.playDrop();
      }

      store.updateGrid(clearedGrid);
      spawnPiece(store.nextPiece);
    }
  }, [store, spawnPiece]);

  const move = useCallback((dir: number) => {
    if (!store.currentPiece) return;
    const newPos = { ...store.currentPiece.pos, x: store.currentPiece.pos.x + dir };
    if (!TetrisEngine.checkCollision(newPos, store.currentPiece.tetromino, store.grid)) {
      store.setCurrentPiece({ ...store.currentPiece, pos: newPos });
      soundManager.playMove();
    }
  }, [store]);

  const rotate = useCallback(() => {
    if (!store.currentPiece) return;
    const rotatedShape = TetrisEngine.rotate(store.currentPiece.tetromino.shape);
    const rotatedPiece = {
      ...store.currentPiece,
      tetromino: { ...store.currentPiece.tetromino, shape: rotatedShape }
    };

    // Simple wall kick
    let offset = 0;
    while (TetrisEngine.checkCollision({ ...rotatedPiece.pos, x: rotatedPiece.pos.x + offset }, rotatedPiece.tetromino, store.grid)) {
      offset += offset >= 0 ? 1 : -1;
      if (Math.abs(offset) > rotatedShape[0].length) {
        return; // Rotation not possible
      }
    }
    
    store.setCurrentPiece({ ...rotatedPiece, pos: { ...rotatedPiece.pos, x: rotatedPiece.pos.x + offset } });
    soundManager.playRotate();
  }, [store]);

  const hardDrop = useCallback(() => {
    if (!store.currentPiece) return;
    const ghostPos = TetrisEngine.getGhostPosition(store.currentPiece.pos, store.currentPiece.tetromino, store.grid);
    store.setCurrentPiece({ ...store.currentPiece, pos: ghostPos });
    drop();
  }, [store, drop]);

  const hold = useCallback(() => {
    if (!store.currentPiece || !store.canHold) return;

    const currentType = store.currentPiece.tetromino;
    if (!store.holdPiece) {
      store.setHoldPiece(currentType);
      spawnPiece(store.nextPiece);
    } else {
      const toHold = currentType;
      const toRelease = store.holdPiece;
      store.setHoldPiece(toHold);
      store.setCurrentPiece({
        pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
        tetromino: toRelease
      });
    }
    store.setCanHold(false);
    soundManager.playRotate();
  }, [store, spawnPiece]);

  // Handle Input
  useEffect(() => {
    inputManagerRef.current = new InputManager((action) => {
      if (store.status !== GameStatus.PLAYING) {
        if (action === 'PAUSE' && store.status === GameStatus.PAUSED) store.resumeGame();
        return;
      }

      switch (action) {
        case 'MOVE_LEFT': move(-1); break;
        case 'MOVE_RIGHT': move(1); break;
        case 'MOVE_DOWN': drop(); break;
        case 'ROTATE': rotate(); break;
        case 'HARD_DROP': hardDrop(); break;
        case 'HOLD': hold(); break;
        case 'PAUSE': store.pauseGame(); break;
      }
    });

    return () => inputManagerRef.current?.destroy();
  }, [store, move, drop, rotate, hardDrop, hold]);

  // RENDERER
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { grid, currentPiece, activeSkin, activeTrail } = store;
    const width = canvas.width;
    const height = canvas.height;
    const blockSize = width / COLS;

    ctx.clearRect(0, 0, width, height);

    // Apply Screen Shake
    if (shakeRef.current > 0) {
      const offsetX = (Math.random() - 0.5) * shakeRef.current;
      const offsetY = (Math.random() - 0.5) * shakeRef.current;
      ctx.translate(offsetX, offsetY);
      shakeRef.current *= 0.9; // Decay
      if (shakeRef.current < 0.5) shakeRef.current = 0;
    }

    // Draw Grid Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * blockSize, 0);
      ctx.lineTo(i * blockSize, height);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * blockSize);
      ctx.lineTo(width, i * blockSize);
      ctx.stroke();
    }

    // Draw Grid Contents
    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          drawBlock(ctx, x, y, color, blockSize, activeSkin);
        }
      });
    });

    // Draw Current Piece & Ghost
    if (currentPiece) {
      const ghostPos = TetrisEngine.getGhostPosition(currentPiece.pos, currentPiece.tetromino, grid);
      
      // Draw Ghost
      currentPiece.tetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            drawBlock(ctx, ghostPos.x + x, ghostPos.y + y, currentPiece.tetromino.color, blockSize, activeSkin, true);
          }
        });
      });

      // Draw Piece
      currentPiece.tetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            drawBlock(ctx, currentPiece.pos.x + x, currentPiece.pos.y + y, currentPiece.tetromino.color, blockSize, activeSkin);
          }
        });
      });
    }
  }, [canvasRef, store]);

  // LOOP
  useEffect(() => {
    gameLoopRef.current = new GameLoop(
      (dt) => {
        if (store.status !== GameStatus.PLAYING) return;
        
        const speed = INITIAL_SPEED * Math.pow(SPEED_INCREMENT, store.level - 1);
        dropCounter.current += dt;
        
        if (dropCounter.current >= speed) {
          drop();
          dropCounter.current = 0;
        }
      },
      render
    );

    gameLoopRef.current.start();
    return () => gameLoopRef.current?.stop();
  }, [store.status, store.level, drop, render]);

  // Initial Spawn
  useEffect(() => {
    if (store.status === GameStatus.PLAYING && !store.currentPiece) {
      spawnPiece(store.nextPiece);
    }
  }, [store.status, store.currentPiece, store.nextPiece, spawnPiece]);

  return { render };
}

function drawBlock(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  color: string, 
  size: number, 
  skin: string, 
  isGhost = false
) {
  ctx.save();
  ctx.translate(x * size, y * size);

  if (isGhost) {
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, size - 4, size - 4);
    ctx.restore();
    return;
  }

  // Handle Skins
  let blockColor = (color === '#00f0f0' || color === '#a000f0' || color === '#0000f0') ? '#00f3ff' : '#ff00ff';
  
  if (skin === 's3') { // Obsidian
    blockColor = '#1a1a1a';
  } else if (skin === 's2') { // Crystal
    ctx.globalAlpha = 0.8;
  }

  ctx.fillStyle = blockColor;
  
  ctx.shadowBlur = skin === 's2' ? 20 : 15;
  ctx.shadowColor = blockColor;

  const p = 1.5;
  
  if (skin === 's2') {
    // Crystal skin with facets
    ctx.beginPath();
    ctx.moveTo(p, p);
    ctx.lineTo(size-p, p);
    ctx.lineTo(size-p, size-p);
    ctx.lineTo(p, size-p);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();
  } else {
    ctx.fillRect(p, p, size - p*2, size - p*2);
  }

  // High contrast highlight line
  ctx.fillStyle = skin === 's3' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(p, p, size - p*2, 2);
  ctx.fillRect(p, p, 2, size - p*2);

  ctx.restore();
}
