// Synthesizer Web Audio API for Retro Arcade Effects and Chiptune BGM (Korobeiniki)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmEnabled = false;
    this.bgmPlaying = false;
    this.bgmTimeout = null;
    this.bgmGain = null;
    this.currentNoteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.bgmPlaying) {
      this.stopBGM();
    }
    return this.enabled;
  }

  toggleBGM() {
    this.init();
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  // Korobeiniki (Classic Tetris Theme) Melodi Notası ve Süreleri [nota (Hz), vuruş]
  getThemeNotes() {
    const E5 = 659.25, B4 = 493.88, C5 = 523.25, D5 = 587.33, A4 = 440.00, GS4 = 415.30;
    return [
      [E5, 2], [B4, 1], [C5, 1], [D5, 2], [C5, 1], [B4, 1],
      [A4, 2], [A4, 1], [C5, 1], [E5, 2], [D5, 1], [C5, 1],
      [B4, 3], [C5, 1], [D5, 2], [E5, 2],
      [C5, 2], [A4, 2], [A4, 4],
      
      [D5, 3], [F5 = 698.46, 1], [A5 = 880.00, 2], [G5 = 783.99, 1], [F5, 1],
      [E5, 3], [C5, 1], [E5, 2], [D5, 1], [C5, 1],
      [B4, 2], [B4, 1], [C5, 1], [D5, 2], [E5, 2],
      [C5, 2], [A4, 2], [A4, 4]
    ];
  }

  startBGM() {
    if (!this.bgmEnabled || this.bgmPlaying || !this.enabled) return;
    this.init();
    this.bgmPlaying = true;
    this.currentNoteIndex = 0;
    this.playNextBGMNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  playNextBGMNote() {
    if (!this.bgmPlaying || !this.ctx) return;
    const notes = this.getThemeNotes();
    const [freq, durationUnits] = notes[this.currentNoteIndex];
    const beatDuration = 0.13; // tempo
    const duration = durationUnits * beatDuration;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration * 0.85);
    } catch (e) {}

    this.currentNoteIndex = (this.currentNoteIndex + 1) % notes.length;
    this.bgmTimeout = setTimeout(() => {
      this.playNextBGMNote();
    }, duration * 1000);
  }

  playMove() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playRotate() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  playDrop() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playLineClear(linesCount) {
    if (!this.enabled) return;
    this.init();
    try {
      const baseFreq = linesCount >= 4 ? 587.33 : 440;
      const notes = linesCount >= 4 ? [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2] : [baseFreq, baseFreq * 1.25];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = linesCount >= 4 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx + 1) * 0.07 + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + (idx + 1) * 0.07 + 0.05);
      });
    } catch (e) {}
  }

  playTSpin() {
    if (!this.enabled) return;
    this.init();
    try {
      const freqs = [350, 520, 700, 880];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.14, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx + 1) * 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + (idx + 1) * 0.05);
      });
    } catch (e) {}
  }

  playAchievement() {
    if (!this.enabled) return;
    this.init();
    try {
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx + 1) * 0.08 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + (idx + 1) * 0.08 + 0.1);
      });
    } catch (e) {}
  }

  playGameOver() {
    if (!this.enabled) return;
    this.init();
    this.stopBGM();
    try {
      const notes = [293.66, 277.18, 261.63, 246.94, 220];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (idx + 1) * 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + (idx + 1) * 0.1);
      });
    } catch (e) {}
  }
}

window.soundFX = new SoundFX();
