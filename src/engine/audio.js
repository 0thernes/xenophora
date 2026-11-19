// Procedural Piezo-Optical Web Audio Synthesizer
// Pure Web Audio API: spectral crystalline glass bells + harmonic abyssal sub-drone
// Coupled to live 4D rotation, regime frequency ratios, and 3D manifold surface touches.

const REGIME_SCALES = [
  [110.0, 164.81, 220.0, 293.66, 392.0, 523.25, 659.25],   // I. Anemone: Lydian Abyss
  [98.0, 146.83, 196.0, 261.63, 329.63, 440.0, 587.33],    // II. KIFS: Glass Cathedral
  [130.81, 196.0, 246.94, 329.63, 392.0, 493.88, 659.25],  // III. Foam: Iridescent Major 9
  [116.54, 174.61, 233.08, 293.66, 349.23, 466.16, 587.33],// IV. Radiolarian: Porcelain Pentatonic
  [73.42, 110.0, 138.59, 164.81, 220.0, 277.18, 329.63],   // V. Seraph: Obsidian Phrygian
  [103.83, 155.56, 207.65, 277.18, 311.13, 415.30, 554.37],// VI. Hybrid: Alien Whole-Fifth
];

export class PiezoAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.regimeId = 0;
    this.master = null;
    this.droneOscs = [];
    this.droneFilter = null;
    this.reverbGain = null;
  }

  toggle() {
    if (this.enabled) {
      this.disable();
      return false;
    }
    this.enable();
    return true;
  }

  enable() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0001;

      // Algorithmic stereo shimmer delay feedback network (crystalline cavern resonance)
      const delayL = this.ctx.createDelay(1.2);
      const delayR = this.ctx.createDelay(1.2);
      delayL.delayTime.value = 0.37;
      delayR.delayTime.value = 0.53;

      const fbL = this.ctx.createGain();
      const fbR = this.ctx.createGain();
      fbL.gain.value = 0.44;
      fbR.gain.value = 0.42;

      const wetFilter = this.ctx.createBiquadFilter();
      wetFilter.type = 'lowpass';
      wetFilter.frequency.value = 3400;

      const merger = this.ctx.createChannelMerger(2);
      this.reverbSend = this.ctx.createGain();
      this.reverbSend.gain.value = 0.55;

      this.reverbSend.connect(delayL);
      this.reverbSend.connect(delayR);
      delayL.connect(fbL);
      fbL.connect(wetFilter);
      wetFilter.connect(delayR);
      delayR.connect(fbR);
      fbR.connect(delayL);

      delayL.connect(merger, 0, 0);
      delayR.connect(merger, 0, 1);
      merger.connect(this.master);
      this.master.connect(this.ctx.destination);

      // Deep evolving sub-harmonic drone triad
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.value = 320;
      this.droneFilter.Q.value = 2.8;

      const droneGain = this.ctx.createGain();
      droneGain.gain.value = 0.16;
      this.droneFilter.connect(droneGain);
      droneGain.connect(this.master);
      droneGain.connect(this.reverbSend);

      const ratios = [0.5, 1.0, 1.5, 2.003];
      for (const r of ratios) {
        const osc = this.ctx.createOscillator();
        osc.type = r === 0.5 ? 'sine' : 'triangle';
        osc.frequency.value = 110 * r;
        const g = this.ctx.createGain();
        g.gain.value = r === 0.5 ? 0.55 : 0.18;
        osc.connect(g);
        g.connect(this.droneFilter);
        osc.start();
        this.droneOscs.push({ osc, ratio: r });
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.enabled = true;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(0.32, now, 0.35);
    this.setRegime(this.regimeId);
  }

  disable() {
    this.enabled = false;
    if (this.ctx && this.master) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(0.0001, now, 0.25);
    }
  }

  setRegime(id) {
    this.regimeId = id;
    if (!this.ctx || !this.enabled) return;
    const scale = REGIME_SCALES[id % REGIME_SCALES.length];
    const root = scale[0];
    const now = this.ctx.currentTime;
    for (const d of this.droneOscs) {
      d.osc.frequency.setTargetAtTime(root * d.ratio, now, 0.65);
    }
    this.pluckPiezo(0.5, 0.5, 0.35);
  }

  updateContinuous(rot4d, chaosC1) {
    if (!this.ctx || !this.enabled || !this.droneFilter) return;
    const now = this.ctx.currentTime;
    const cutoff = 180 + Math.abs(Math.sin(rot4d)) * 340 + Math.abs(chaosC1) * 90;
    this.droneFilter.frequency.setTargetAtTime(cutoff, now, 0.18);
  }

  // Triggered whenever the user clicks a 3D fold on the manifold to inject a chimera vortex!
  pluckPiezo(u, v, intensity = 0.65) {
    if (!this.ctx || !this.enabled) return;
    const scale = REGIME_SCALES[this.regimeId % REGIME_SCALES.length];
    const idx = Math.floor(Math.abs(u * 7 + v * 3) % scale.length);
    const freq = scale[idx] * (v > 0.65 ? 2.0 : 1.0);
    const now = this.ctx.currentTime;

    // Modal piezo glass bell: fundamental + slightly inharmonic glassy overtone (2.756x)
    const partials = [
      { mult: 1.0, gain: 0.26 * intensity, decay: 2.2 },
      { mult: 2.756, gain: 0.11 * intensity, decay: 1.1 },
      { mult: 5.404, gain: 0.045 * intensity, decay: 0.55 },
    ];

    for (const p of partials) {
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.mult, now);
      osc.frequency.exponentialRampToValueAtTime(freq * p.mult * 0.996, now + p.decay);

      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(p.gain, now + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(env);
      env.connect(this.master);
      env.connect(this.reverbSend);
      osc.start(now);
      osc.stop(now + p.decay + 0.05);
    }
  }
}
