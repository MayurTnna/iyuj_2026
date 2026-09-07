// ==========================================================================
// QUEEN JIYU'S UNIVERSE - SOUNDTRACK MANAGER
// Manages multi-channel procedural audio, ambient atmospheres, environmental
// sound effects, and leitmotif triggers with seamless crossfading.
// ==========================================================================

import type { AudioMood } from '../types/universe.types';
import { SOUNDTRACK_MAP } from '../data/soundtrack';
import { LeitmotifSynthesizer } from './LeitmotifSynthesizer';

export class SoundtrackManager {
    private static instance: SoundtrackManager | null = null;
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private ambienceGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;

    private activeOscillators: OscillatorNode[] = [];
    private leitmotifSynth: LeitmotifSynthesizer | null = null;

    private realmAudio: HTMLAudioElement | null = null;
    private currentAudioUrl: string | null = null;
    private audioFadeInterval: number | null = null;

    private currentMood: AudioMood = 'ambient';
    private isMuted: boolean = false;
    private volume: number = 0.85;

    private leitmotifIntervalId: number | null = null;

    private constructor() {
        // Lazy init on first user gesture
    }

    public static getInstance(): SoundtrackManager {
        if (!SoundtrackManager.instance) {
            SoundtrackManager.instance = new SoundtrackManager();
        }
        return SoundtrackManager.instance;
    }

    public init(): void {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }

        const AudioCtxClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtxClass();

        // Master Output
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Ambience Sub-bus
        this.ambienceGain = this.ctx.createGain();
        this.ambienceGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.ambienceGain.connect(this.masterGain);

        // SFX Sub-bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Leitmotif Synthesizer
        this.leitmotifSynth = new LeitmotifSynthesizer(this.ctx, this.ambienceGain);

        // Start initial mood
        this.applyMood(this.currentMood);
    }

    public setMood(mood: AudioMood, leitmotifStage: 1 | 2 | 3 | 4 | 5 = 1): void {
        this.currentMood = mood;
        if (!this.ctx) return;
        this.applyMood(mood, leitmotifStage);
    }

    private fadeInRealmAudio(url: string): void {
        if (this.currentAudioUrl === url && this.realmAudio && !this.realmAudio.paused) {
            return;
        }

        if (this.realmAudio) {
            const oldAudio = this.realmAudio;
            let oldVol = oldAudio.volume;
            const fadeOld = window.setInterval(() => {
                oldVol = Math.max(0, oldVol - 0.15);
                oldAudio.volume = oldVol;
                if (oldVol <= 0) {
                    clearInterval(fadeOld);
                    oldAudio.pause();
                }
            }, 50);
        }

        if (this.audioFadeInterval) {
            clearInterval(this.audioFadeInterval);
            this.audioFadeInterval = null;
        }

        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0;
        this.realmAudio = audio;
        this.currentAudioUrl = url;

        audio.play().catch((err) => {
            console.warn('Audio playback error (waiting for user gesture):', err);
        });

        // Smooth fade-in directly from the main lyrics / iconic hook over 1.8 seconds
        const targetVol = this.isMuted ? 0 : Math.min(this.volume, 0.85);
        const steps = 36;
        let currentStep = 0;

        this.audioFadeInterval = window.setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            if (audio) {
                audio.volume = Math.min(targetVol, targetVol * progress);
            }
            if (currentStep >= steps) {
                if (this.audioFadeInterval) clearInterval(this.audioFadeInterval);
                this.audioFadeInterval = null;
                if (audio) audio.volume = targetVol;
            }
        }, 50);
    }

    private fadeOutRealmAudio(immediate: boolean = false): void {
        if (!this.realmAudio) return;

        if (this.audioFadeInterval) {
            clearInterval(this.audioFadeInterval);
            this.audioFadeInterval = null;
        }

        const audio = this.realmAudio;
        this.realmAudio = null;
        this.currentAudioUrl = null;

        if (immediate) {
            audio.pause();
            audio.currentTime = 0;
            return;
        }

        let vol = audio.volume;
        const fadeInterval = window.setInterval(() => {
            vol = Math.max(0, vol - 0.1);
            audio.volume = vol;
            if (vol <= 0) {
                clearInterval(fadeInterval);
                audio.pause();
                audio.currentTime = 0;
            }
        }, 60);
    }

    private applyMood(mood: AudioMood, leitmotifStage: 1 | 2 | 3 | 4 | 5 = 1): void {
        if (!this.ctx || !this.ambienceGain) return;

        const trackData = SOUNDTRACK_MAP[mood];
        const config = trackData?.proceduralConfig;
        if (!config) return;

        // 1. Crossfade out current oscillators
        this.activeOscillators.forEach((osc) => {
            try {
                osc.stop(this.ctx!.currentTime + 1.2);
            } catch {
                // Ignore stop errors
            }
        });
        this.activeOscillators = [];

        // 2. Custom Bollywood Audio Hook handling
        if (trackData.customAudioUrl) {
            this.fadeInRealmAudio(trackData.customAudioUrl);
            // Lower ambient background drone so the song is clear and glorious
            this.ambienceGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
            if (this.leitmotifIntervalId) {
                clearInterval(this.leitmotifIntervalId);
                this.leitmotifIntervalId = null;
            }
            return;
        } else {
            // No custom audio (e.g. ambient cosmos overview): fade out realm music
            this.fadeOutRealmAudio();
        }

        // 3. If silence realm, ramp ambience to 0
        if (config.isPureSilence) {
            this.ambienceGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
            if (this.leitmotifIntervalId) {
                clearInterval(this.leitmotifIntervalId);
                this.leitmotifIntervalId = null;
            }
            return;
        }

        // 4. Ramp up ambience gain gently (celestial starlight chords)
        this.ambienceGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2.5);

        // 5. Create new multi-oscillator chord cluster with warm lowpass filtering
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(config.filterCutoff, 420), this.ctx.currentTime);
        filter.connect(this.ambienceGain);

        config.baseDroneFreqs.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Pure warm sine waves
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            // Subtle gentle drift (no harsh wobble)
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.05 + idx * 0.02, this.ctx.currentTime);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.detune);
            lfo.start();

            gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.02 / Math.max(1, config.baseDroneFreqs.length), this.ctx.currentTime + 3.0);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ambienceGain!);

            osc.start();
            this.activeOscillators.push(osc);
            this.activeOscillators.push(lfo);
        });

        // 6. Trigger periodic leitmotif theme gently
        if (this.leitmotifIntervalId) {
            clearInterval(this.leitmotifIntervalId);
        }
        
        // Play gentle theme after ambient pad settles
        setTimeout(() => {
            this.playLeitmotif(leitmotifStage);
        }, 4000);

        // Schedule gentle recurring motif every 45s
        this.leitmotifIntervalId = window.setInterval(() => {
            this.playLeitmotif(leitmotifStage);
        }, 45000);
    }

    public playLeitmotif(stage: 1 | 2 | 3 | 4 | 5 = 1, onComplete?: () => void): void {
        if (!this.leitmotifSynth || this.isMuted) return;
        this.leitmotifSynth.playTheme(stage, onComplete);
    }

    public playWarpSound(): void {
        if (!this.ctx || !this.sfxGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.005, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.4);
    }

    public playCelestialChime(): void {
        if (!this.ctx || !this.sfxGain || this.isMuted) return;

        // Warm harmonious bell pentatonic notes
        const chimeFreqs = [523.25, 659.25, 783.99, 880.00, 1046.50];
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.025, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.8);
    }

    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        if (this.ctx && this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(
                muted ? 0.0001 : this.volume,
                this.ctx.currentTime + 0.3
            );
        }
        if (this.realmAudio) {
            this.realmAudio.volume = muted ? 0 : Math.min(this.volume, 0.85);
        }
    }

    public setVolume(vol: number): void {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.ctx && this.masterGain && !this.isMuted) {
            this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
        }
        if (this.realmAudio && !this.isMuted) {
            this.realmAudio.volume = Math.min(this.volume, 0.85);
        }
    }

    public stopAll(): void {
        this.fadeOutRealmAudio(true);
        if (this.leitmotifIntervalId) {
            clearInterval(this.leitmotifIntervalId);
            this.leitmotifIntervalId = null;
        }
        this.activeOscillators.forEach((osc) => {
            try {
                osc.stop();
            } catch {
                // Ignore
            }
        });
        this.activeOscillators = [];
        if (this.ambienceGain && this.ctx) {
            this.ambienceGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        }
    }

    public destroy(): void {
        this.stopAll();
        if (this.ctx && this.ctx.state !== 'closed') {
            try {
                this.ctx.close();
            } catch {
                // Ignore
            }
        }
    }
}

