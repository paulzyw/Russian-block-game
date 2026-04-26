/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.ctx && !enabled) {
      this.ctx.suspend();
    } else if (this.ctx && enabled) {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.masterGain || !this.enabled) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playMove() {
    this.playTone(200, 0.05, 'square');
  }

  playRotate() {
    this.playTone(400, 0.1, 'triangle');
  }

  playDrop() {
    this.playTone(150, 0.2, 'sawtooth');
  }

  playClear() {
    this.playTone(523.25, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.1), 50); // E5
    setTimeout(() => this.playTone(783.99, 0.2), 100); // G5
  }

  playGameOver() {
    this.playTone(300, 0.5, 'sawtooth');
    setTimeout(() => this.playTone(200, 0.5, 'sawtooth'), 200);
    setTimeout(() => this.playTone(100, 0.8, 'sawtooth'), 400);
  }
}

export const soundManager = new SoundManager();
