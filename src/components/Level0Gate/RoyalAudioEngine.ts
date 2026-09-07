// ==========================================================================
// QUEEN JIYU - PROCEDURAL WEB AUDIO ENGINE
// Synthesis engine generating royal ambient drones, tick chimes,
// hyperspeed warp audio, and celebration tones without external audio files.
// ==========================================================================

export class RoyalAudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private oscillators: OscillatorNode[] = [];
    public isPlaying: boolean = false;

    private init(): void {
        if (this.ctx) return;
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtxClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
    }

    public startAmbience(): void {
        this.init();
        if (!this.ctx || !this.masterGain) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const frequencies = [130.81, 164.81, 196.00, 261.63, 329.63];

        frequencies.forEach((freq, idx) => {
            if (!this.ctx || !this.masterGain) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.detune);
            lfo.start();

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.04 / frequencies.length, this.ctx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            this.oscillators.push(osc);
            this.oscillators.push(lfo);
        });

        this.masterGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 3);
        this.isPlaying = true;
    }

    public stopAmbience(): void {
        if (!this.ctx || !this.isPlaying || !this.masterGain) return;

        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
        setTimeout(() => {
            this.oscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch {
                    // Ignore stop errors if already stopped
                }
            });
            this.oscillators = [];
            this.isPlaying = false;
        }, 1000);
    }

    public playSecondTickle(): void {
        if (!this.ctx || !this.isPlaying || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760.00 + Math.random() * 200, this.ctx.currentTime);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
    }

    public playWarpSound(): void {
        if (!this.ctx || !this.isPlaying || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 1.4);

        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.8);
    }

    public playChime(): void {
        if (!this.ctx || !this.isPlaying || !this.masterGain) return;

        const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.5);
    }

    public destroy(): void {
        this.stopAmbience();
        if (this.ctx && this.ctx.state !== 'closed') {
            try {
                this.ctx.close();
            } catch {
                // Ignore
            }
        }
    }
}

