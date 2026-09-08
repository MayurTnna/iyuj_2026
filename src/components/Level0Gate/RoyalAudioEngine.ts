// ==========================================================================
// QUEEN JIYU - PROCEDURAL WEB AUDIO ENGINE
// Synthesis engine generating royal ambient drones, tick chimes,
// hyperspeed warp audio, and celebration tones without external audio files.
// ==========================================================================

export class RoyalAudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;
    private oscillators: OscillatorNode[] = [];
    public isPlaying: boolean = false;

    private init(): void {
        if (this.ctx) return;
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtxClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
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
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }

        const now = this.ctx.currentTime;

        // 1. Deep Sub-bass swell for universe formation
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(65, now);
        subOsc.frequency.exponentialRampToValueAtTime(320, now + 1.6);

        subGain.gain.setValueAtTime(0.001, now);
        subGain.gain.linearRampToValueAtTime(0.28, now + 0.6);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        subOsc.connect(subGain);
        subGain.connect(this.sfxGain);
        subOsc.start(now);
        subOsc.stop(now + 2.0);

        // 2. Rising celestial harmonic sweep
        const sweepOsc = this.ctx.createOscillator();
        const sweepGain = this.ctx.createGain();
        sweepOsc.type = 'triangle';
        sweepOsc.frequency.setValueAtTime(220, now);
        sweepOsc.frequency.exponentialRampToValueAtTime(1760, now + 1.6);

        sweepGain.gain.setValueAtTime(0.001, now);
        sweepGain.gain.linearRampToValueAtTime(0.18, now + 0.8);
        sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        sweepOsc.connect(sweepGain);
        sweepGain.connect(this.sfxGain);
        sweepOsc.start(now);
        sweepOsc.stop(now + 2.0);

        // 3. Shimmering cosmic stardust whoosh
        try {
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(300, now);
            filter.frequency.exponentialRampToValueAtTime(2800, now + 1.5);
            filter.Q.setValueAtTime(3.0, now);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.001, now);
            noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.7);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.sfxGain);

            whiteNoise.start(now);
            whiteNoise.stop(now + 2.0);
        } catch {
            // Buffer fallback
        }
    }

    public playChime(): void {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }

        const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

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

