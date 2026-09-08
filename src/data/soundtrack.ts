// ==========================================================================
// QUEEN JIYU'S UNIVERSE - SOUNDTRACK & LEITMOTIF SPECIFICATION
// ==========================================================================

import type { AudioMood } from '../types/universe.types';

// The signature 5-note Jiyu Musical Theme (F4, Ab4, Bb4, C5, Eb5 - Royal F Minor Pentatonic)
export const JIYU_LEITMOTIF_FREQUENCIES = [
    349.23, // F4  - The First Thought
    415.30, // Ab4 - The Soft Glance
    466.16, // Bb4 - The Graceful Stride
    523.25, // C5  - The Unspoken Bond
    622.25  // Eb5 - The Queen's Ascendance
];

export interface SoundtrackTrack {
    id: AudioMood;
    name: string;
    description: string;
    customAudioUrl: string | null; // Developer can drop local MP3/WAV paths here
    startTime?: number; // Optional start offset in seconds for iconic hook / beat drop
    proceduralConfig: {
        baseDroneFreqs: number[];
        leitmotifSpeed: number; // seconds per note
        hasPercussion?: boolean;
        hasWaterLap?: boolean;
        hasRain?: boolean;
        isPureSilence?: boolean;
        filterCutoff: number;
    };
}

export const SOUNDTRACK_MAP: Record<AudioMood, SoundtrackTrack> = {
    'gate': {
        id: 'gate',
        name: 'The Sacred Gateway',
        description: 'Deep cosmic hum with shimmering high chimes and tickle pulses.',
        customAudioUrl: null,
        proceduralConfig: {
            baseDroneFreqs: [130.81, 164.81, 196.00, 261.63],
            leitmotifSpeed: 1.8,
            filterCutoff: 450
        }
    },
    'ambient': {
        id: 'ambient',
        name: 'The Infinite Cosmos — Interstellar (Cornfield Chase)',
        description: 'Hans Zimmer’s legendary Interstellar masterpiece playing across Queen Jiyu’s universe.',
        customAudioUrl: '/audio/ambient.m4a',
        proceduralConfig: {
            baseDroneFreqs: [261.63, 329.63, 392.00, 523.25],
            leitmotifSpeed: 2.5,
            filterCutoff: 420
        }
    },
    'first-rhythm': {
        id: 'first-rhythm',
        name: 'Garba of the Stars — Chandaliyo Ugyo Re',
        description: 'Authentic Gujarati Garba by Aishwarya Majmudar from Naadi Dosh.',
        customAudioUrl: '/audio/first-rhythm.m4a',
        proceduralConfig: {
            baseDroneFreqs: [146.83, 196.00, 220.00],
            leitmotifSpeed: 1.0,
            hasPercussion: true,
            filterCutoff: 380
        }
    },
    'retina': {
        id: 'retina',
        name: 'Optical Refraction — Aankhon Mein Teri',
        description: 'Melodic starlight romance from Om Shanti Om.',
        customAudioUrl: '/audio/retina.m4a',
        proceduralConfig: {
            baseDroneFreqs: [130.81, 164.81, 196.00],
            leitmotifSpeed: 2.5,
            filterCutoff: 350
        }
    },
    'river': {
        id: 'river',
        name: 'Sabarmati Reflections — Iktara',
        description: 'Soulful acoustic starlight from Wake Up Sid.',
        customAudioUrl: '/audio/river.m4a',
        proceduralConfig: {
            baseDroneFreqs: [130.81, 174.61, 220.00],
            leitmotifSpeed: 1.6,
            hasWaterLap: true,
            filterCutoff: 320
        }
    },
    'rose': {
        id: 'rose',
        name: 'Velvet Fortitude — Afreen Afreen',
        description: 'Timeless ode to beauty by Rahat Fateh Ali Khan.',
        customAudioUrl: '/audio/rose.m4a',
        proceduralConfig: {
            baseDroneFreqs: [130.81, 174.61, 220.00],
            leitmotifSpeed: 1.9,
            filterCutoff: 340
        }
    },
    'silent-language': {
        id: 'silent-language',
        name: 'The Silent Language — Isharon Isharon Mein',
        description: 'The golden classic by Asha Bhosle & Mohammed Rafi from Kashmir Ki Kali.',
        customAudioUrl: '/audio/silent-language.mp3',
        startTime: 0,
        proceduralConfig: {
            baseDroneFreqs: [],
            leitmotifSpeed: 3.5,
            isPureSilence: true,
            filterCutoff: 200
        }
    },
    'radiance': {
        id: 'radiance',
        name: 'The Golden Sunbeam — Main Agar Kahoon',
        description: 'Luminous starlight ballad celebrating Queen Jiyu’s aura.',
        customAudioUrl: '/audio/radiance.m4a',
        proceduralConfig: {
            baseDroneFreqs: [146.83, 220.00, 293.66],
            leitmotifSpeed: 1.6,
            filterCutoff: 380
        }
    },
    'sanctuary': {
        id: 'sanctuary',
        name: 'The Harbor of Peace — Tum Se Hi',
        description: 'Tranquil peaceful rhythm by Mohit Chauhan & Pritam.',
        customAudioUrl: '/audio/sanctuary.m4a',
        proceduralConfig: {
            baseDroneFreqs: [130.81, 196.00, 261.63],
            leitmotifSpeed: 2.2,
            filterCutoff: 320
        }
    },
    'missed-days': {
        id: 'missed-days',
        name: 'Rain on the Platform — Agar Tum Saath Ho',
        description: 'Deep emotional resonance from Tamasha.',
        customAudioUrl: '/audio/missed-days.m4a',
        proceduralConfig: {
            baseDroneFreqs: [123.47, 185.00, 246.94],
            leitmotifSpeed: 2.4,
            hasRain: true,
            filterCutoff: 300
        }
    },
    'ascent': {
        id: 'ascent',
        name: 'The Sovereign Summit — Yeh Ishq Ishq',
        description: 'High-energy explosive anthem from Dhurandhar for Queen Jiyu’s ascent.',
        customAudioUrl: '/audio/ascent.mp3',
        startTime: 8,
        proceduralConfig: {
            baseDroneFreqs: [146.83, 196.00, 293.66],
            leitmotifSpeed: 1.2,
            filterCutoff: 380
        }
    },
    'queen': {
        id: 'queen',
        name: 'The Queen — Kya Khoob Lagti Ho',
        description: 'Classic Bollywood tribute to Queen Jiyu’s timeless elegance.',
        customAudioUrl: '/audio/queen.m4a',
        proceduralConfig: {
            baseDroneFreqs: [130.81, 196.00, 261.63],
            leitmotifSpeed: 0.9,
            filterCutoff: 400
        }
    },
    'finale-perfect': {
        id: 'finale-perfect',
        name: 'The Coronation — Perfect (Ed Sheeran)',
        description: 'Ed Sheeran’s "Perfect" playing for Queen Jiyu’s Grand Coronation Birthday Celebration.',
        customAudioUrl: '/audio/finale-perfect.m4a',
        proceduralConfig: {
            baseDroneFreqs: [130.81, 164.81, 196.00],
            leitmotifSpeed: 1.5,
            filterCutoff: 400
        }
    }
};

