// Web Audio API retro sound effect synthesizer (Phase 1: SE only, no BGM for voice clarity)

export class AudioManager {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freqStart, freqEnd, duration, type = 'square', volume = 0.12, delay = 0) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
    }

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  jump() {
    this.playTone(260, 620, 0.14, 'square', 0.1);
  }

  shoot() {
    this.playTone(760, 240, 0.09, 'square', 0.09);
  }

  chargeReady() {
    this.playTone(440, 880, 0.15, 'triangle', 0.11);
  }

  chargeShot() {
    this.playTone(540, 120, 0.22, 'sawtooth', 0.14);
    this.playTone(820, 260, 0.18, 'square', 0.09, 0.02);
  }

  coin() {
    this.playTone(988, 988, 0.07, 'square', 0.1, 0);
    this.playTone(1319, 1319, 0.16, 'square', 0.1, 0.07);
  }

  hit() {
    this.playTone(220, 110, 0.08, 'triangle', 0.12);
  }

  enemyDefeat() {
    this.playTone(360, 90, 0.18, 'sawtooth', 0.12);
    this.playTone(520, 160, 0.14, 'square', 0.08, 0.04);
  }

  rockBreak() {
    this.playTone(160, 55, 0.22, 'sawtooth', 0.15);
    this.playTone(240, 70, 0.18, 'square', 0.1, 0.03);
  }

  hurt() {
    this.playTone(280, 90, 0.24, 'sawtooth', 0.14);
  }

  gateOpen() {
    this.playTone(330, 330, 0.08, 'triangle', 0.12, 0);
    this.playTone(440, 440, 0.08, 'triangle', 0.12, 0.08);
    this.playTone(660, 660, 0.16, 'triangle', 0.12, 0.16);
  }

  missionSuccess() {
    this.playTone(523, 523, 0.09, 'square', 0.1, 0);
    this.playTone(659, 659, 0.09, 'square', 0.1, 0.09);
    this.playTone(784, 784, 0.18, 'square', 0.11, 0.18);
  }

  missionFail() {
    this.playTone(310, 240, 0.14, 'sawtooth', 0.11, 0);
    this.playTone(220, 140, 0.22, 'sawtooth', 0.11, 0.14);
  }

  stageClear() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
      this.playTone(n, n, i === notes.length - 1 ? 0.3 : 0.11, 'square', 0.11, i * 0.11);
    });
  }
}
