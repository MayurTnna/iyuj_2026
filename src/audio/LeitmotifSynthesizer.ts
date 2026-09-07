// ==========================================================================
// QUEEN JIYU'S UNIVERSE - LEITMOTIF SYNTHESIZER
// Generates the recurring 5-note signature theme across evolving stages:
// Stage 1 (Piano) -> Stage 2 (Strings) -> Stage 3 (Indian) -> Stage 4 (Orchestral) -> Stage 5 (Finale)
// ==========================================================================

import { JIYU_LEITMOTIF_FREQUENCIES } from '../data/soundtrack';

export class LeitmotifSynthesizer {
    private ctx: AudioContext;
    private outputNode: GainNode;

    constructor(ctx: AudioContext, outputNode: GainNode) {
        this.ctx = ctx;
        this.outputNode = outputNode;
    }

    /**
     * Plays the signature 5-note Jiyu melodic motif
     * @param stage Evolving instrumentation tier (1 to 5)
     * @param onComplete Optional callback when motif finishes playing
     */
    public playTheme(stage: 1 | 2 | 3 | 4 | 5 = 1, onComplete?: () => void): void {
        if (!this.ctx || this.ctx.state === 'closed') return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }

        const noteDurations = [0.9, 0.9, 1.0, 1.2, 2.2];
        let currentTime = this.ctx.currentTime + 0.15;

        JIYU_LEITMOTIF_FREQUENCIES.forEach((freq, index) => {
            const dur = noteDurations[index];
            this.triggerNote(freq, currentTime, dur, stage);
            currentTime += dur * 0.9;
        });

        if (onComplete) {
            const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
            setTimeout(onComplete, Math.max(100, totalDuration));
        }
    }

    private triggerNote(freq: number, startTime: number, duration: number, stage: number): void {
        if (!this.ctx) return;

        // Primary celestial bell tone (soft warm sine)
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Lowpass filter to keep all tones warm and silky
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + stage * 100, startTime);

        // Soft music-box bell envelope (gentle attack, graceful exponential decay)
        const peakGain = 0.06 + Math.min(stage * 0.015, 0.06);
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.linearRampToValueAtTime(peakGain, startTime + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.outputNode);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);

        // Subtle soft shimmer overtone (1 octave above at very low volume)
        const shimmerOsc = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.setValueAtTime(freq * 2, startTime);

        shimmerGain.gain.setValueAtTime(0.0001, startTime);
        shimmerGain.gain.linearRampToValueAtTime(peakGain * 0.25, startTime + 0.04);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

        shimmerOsc.connect(filter);
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(this.outputNode);

        shimmerOsc.start(startTime);
        shimmerOsc.stop(startTime + duration * 0.6 + 0.1);
    }
}

