/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class GameLoop {
  private lastTime: number = 0;
  private accumulatedTime: number = 0;
  private frameId: number | null = null;
  private isPaused: boolean = false;

  constructor(
    private update: (dt: number) => void,
    private render: () => void,
    private step: number = 1000 / 60 // Target 60 FPS
  ) {}

  start() {
    this.lastTime = performance.now();
    this.isPaused = false;
    this.loop(this.lastTime);
  }

  stop() {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  private loop = (time: number) => {
    if (this.isPaused) return;

    const dt = time - this.lastTime;
    this.lastTime = time;
    this.accumulatedTime += dt;

    while (this.accumulatedTime >= this.step) {
      this.update(this.step);
      this.accumulatedTime -= this.step;
    }

    this.render();
    this.frameId = requestAnimationFrame(this.loop);
  };
}
