/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function GameBoard({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <canvas 
      ref={canvasRef}
      className="block object-contain"
    />
  );
}
