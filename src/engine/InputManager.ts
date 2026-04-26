/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type InputAction = 
  | 'MOVE_LEFT' 
  | 'MOVE_RIGHT' 
  | 'MOVE_DOWN' 
  | 'ROTATE' 
  | 'HARD_DROP' 
  | 'HOLD' 
  | 'PAUSE';

export class InputManager {
  private keyMap: Record<string, InputAction> = {
    'ArrowLeft': 'MOVE_LEFT',
    'a': 'MOVE_LEFT',
    'ArrowRight': 'MOVE_RIGHT',
    'd': 'MOVE_RIGHT',
    'ArrowDown': 'MOVE_DOWN',
    's': 'MOVE_DOWN',
    'ArrowUp': 'ROTATE',
    'w': 'ROTATE',
    ' ': 'HARD_DROP',
    'Shift': 'HOLD',
    'p': 'PAUSE',
    'Escape': 'PAUSE'
  };

  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private swipeThreshold: number = 30;

  constructor(private onAction: (action: InputAction) => void) {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const action = this.keyMap[e.key];
    if (action) {
      // Prevent repeated triggers when holding keys for specific actions
      // BUT allow repeat for MOVE actions to support keyboard DAS/ARR
      if (e.repeat && (action === 'HARD_DROP' || action === 'ROTATE' || action === 'HOLD' || action === 'PAUSE')) {
        return;
      }
      e.preventDefault();
      this.onAction(action);
    }
  };

  private handleTouchStart = (e: TouchEvent) => {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  };

  private handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - this.touchStartX;
    const dy = touchEndY - this.touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > this.swipeThreshold) {
        if (dx > 0) this.onAction('MOVE_RIGHT');
        else this.onAction('MOVE_LEFT');
      }
    } else {
      if (Math.abs(dy) > this.swipeThreshold) {
        if (dy > 0) this.onAction('MOVE_DOWN');
        else this.onAction('ROTATE'); // Swipe up to rotate
      }
    }
  };
}
