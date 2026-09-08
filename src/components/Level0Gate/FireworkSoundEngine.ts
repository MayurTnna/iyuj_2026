// ==========================================================================
// QUEEN JIYU'S UNIVERSE - PROCEDURAL CELESTIAL FIREWORK SOUND ENGINE
// Realistic, soothing, deep acoustic fireworks with gentle sub-bass thuds,
// atmospheric low-pass air displacement, and soft golden starlight crackles.
// ==========================================================================

export class FireworkSoundEngine {
    private static instance: FireworkSoundEngine | null = null;
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private lastPlayTime: number = 0;
    private isMuted: boolean = false;

    private constructor() {}

    public static getInstance(): FireworkSoundEngine {
        if (!FireworkSoundEngine.instance) {
            FireworkSoundEngine.instance = new FireworkSoundEngine();
        }
        return FireworkSoundEngine.instance;
    }

    public init(): void {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
            return;
        }

        const AudioCtxClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtxClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
    }

    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(muted ? 0 : 0.28, this.ctx.currentTime);
        }
    }

    /**
     * Subtle rocket ascent whistle/whoosh with stereo panning
     */
    public playLaunch(xNormalized: number = 0.5): void {
        this.init();
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const panVal = Math.max(-0.8, Math.min(0.8, xNormalized * 2 - 1));

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(720 + Math.random() * 120, now + 0.42);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.022, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

        if (this.ctx.createStereoPanner) {
            const panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(panVal, now);
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(this.masterGain);
        } else {
            osc.connect(gain);
            gain.connect(this.masterGain);
        }

        osc.start(now);
        osc.stop(now + 0.5);
    }

    /**
     * Soothing, deep atmospheric firework burst
     * Combines resonant sub-bass thump, warm lowpass noise, and delicate stardust sparkles
     */
    public playBurst(xNormalized: number = 0.5): void {
        this.init();
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Throttle bursts to prevent overlapping acoustic clutter
        if (Date.now() - this.lastPlayTime < 160) {
            return;
        }
        this.lastPlayTime = Date.now();

        const panVal = Math.max(-0.85, Math.min(0.85, xNormalized * 2 - 1));

        // 1. DEEP WARM SUB-BASS BOOM (Soft, round, soothing to ears)
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const startFreq = 82 + Math.random() * 24;
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(startFreq, now);
        bassOsc.frequency.exponentialRampToValueAtTime(30, now + 0.75);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.12, now + 0.035);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);

        // 2. SOFT FILTERED NOISE BURST (Simulates atmospheric fireworks air displacement)
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.55);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(250 + Math.random() * 70, now);
        noiseFilter.Q.setValueAtTime(2.2, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.085, now + 0.045);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);

        // 3. SOOTHING GOLDEN SPARKLE CRACKLE (Gentle starlight twinkle)
        const sparkleCount = 2 + Math.floor(Math.random() * 3);
        for (let s = 0; s < sparkleCount; s++) {
            const delay = 0.1 + Math.random() * 0.35;
            const popOsc = this.ctx.createOscillator();
            const popGain = this.ctx.createGain();
            popOsc.type = 'triangle';
            popOsc.frequency.setValueAtTime(1100 + Math.random() * 800, now + delay);
            popGain.gain.setValueAtTime(0.0001, now + delay);
            popGain.gain.linearRampToValueAtTime(0.015, now + delay + 0.015);
            popGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.08);

            popOsc.connect(popGain);
            popGain.connect(this.masterGain);
            popOsc.start(now + delay);
            popOsc.stop(now + delay + 0.09);
        }

        // Stereo panning
        if (this.ctx.createStereoPanner) {
            const panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(panVal, now);

            bassOsc.connect(bassGain);
            bassGain.connect(panner);

            noiseGain.connect(panner);
            panner.connect(this.masterGain);
        } else {
            bassOsc.connect(bassGain);
            bassGain.connect(this.masterGain);
            noiseGain.connect(this.masterGain);
        }

        bassOsc.start(now);
        bassOsc.stop(now + 0.85);

        noiseNode.start(now);
        noiseNode.stop(now + 0.65);
    }
}
