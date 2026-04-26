/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COLS, ROWS, Tetromino, TETROMINOS, PieceType } from './constants';

export class TetrisEngine {
  static createEmptyGrid(): (string | null)[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  static getRandomTetromino(): Tetromino {
    const types: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return TETROMINOS[randomType];
  }

  static checkCollision(
    pos: { x: number; y: number },
    piece: Tetromino,
    grid: (string | null)[][]
  ): boolean {
    const { shape } = piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = pos.x + x;
          const boardY = pos.y + y;

          // Check boundaries
          if (
            boardX < 0 ||
            boardX >= COLS ||
            boardY >= ROWS
          ) {
            return true;
          }

          // Check if cell is occupied
          if (boardY >= 0 && grid[boardY][boardX] !== null) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static rotate(shape: number[][]): number[][] {
    const size = shape.length;
    const newShape = Array.from({ length: size }, () => Array(size).fill(0));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        newShape[x][size - 1 - y] = shape[y][x];
      }
    }
    return newShape;
  }

  static getGhostPosition(
    pos: { x: number; y: number },
    piece: Tetromino,
    grid: (string | null)[][]
  ): { x: number; y: number } {
    let ghostY = pos.y;
    while (!this.checkCollision({ ...pos, y: ghostY + 1 }, piece, grid)) {
      ghostY++;
    }
    return { x: pos.x, y: ghostY };
  }

  static clearLines(grid: (string | null)[][]): {
    newGrid: (string | null)[][];
    linesCleared: number;
  } {
    let linesCleared = 0;
    const newGrid = grid.reduce((acc, row) => {
      if (row.every((cell) => cell !== null)) {
        linesCleared++;
        acc.unshift(Array(COLS).fill(null));
      } else {
        acc.push(row);
      }
      return acc;
    }, [] as (string | null)[][]);

    return { newGrid, linesCleared };
  }
}
