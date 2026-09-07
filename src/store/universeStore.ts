// ==========================================================================
// QUEEN JIYU'S UNIVERSE - GLOBAL ZUSTAND STORE
// Manages narrative progression, active realms, discovered memories,
// audio mood state, and quality tiers across the entire application.
// ==========================================================================

import { create } from 'zustand';
import type { UniverseState, RealmId, RealmStatus, AudioMood, QualityTier } from '../types/universe.types';
import { REALM_IDS, REALMS } from '../data/realms';
import { INITIAL_MEMORIES } from '../data/memories';
import { SoundtrackManager } from '../audio/SoundtrackManager';

const initialStatuses = REALM_IDS.reduce((acc, id, idx) => {
    acc[id] = idx === 0 ? 'discovered' : 'dormant';
    return acc;
}, {} as Record<RealmId, RealmStatus>);

export const useUniverseStore = create<UniverseState>((set, get) => ({
    // Navigation
    chapter: 0,
    activeRealmId: null,
    viewMode: 'cosmos',
    isTransitioning: false,

    // Narrative & Progress
    realmStatuses: initialStatuses,
    completedRealmsCount: 0,
    memories: INITIAL_MEMORIES,
    unlockedMemoriesCount: 0,
    storyProgress: 0,

    // Audio State
    audioUnlocked: false,
    isMuted: false,
    volume: 0.85,
    currentMood: 'gate',
    activeLeitmotifStage: 1,

    // Performance & Easter Eggs
    qualityTier: 'high',
    isEasterEggOpen: false,

    // Actions
    enterUniverse: () => {
        set({
            chapter: 1,
            viewMode: 'cosmos',
            activeRealmId: null,
            currentMood: 'ambient',
            audioUnlocked: true,
            isTransitioning: false,
            isMuted: false
        });
        SoundtrackManager.getInstance().setMuted(false);
    },

    returnToGate: () => {
        SoundtrackManager.getInstance().stopAll();
        SoundtrackManager.getInstance().setMuted(true);
        set({
            chapter: 0,
            activeRealmId: null,
            viewMode: 'cosmos',
            currentMood: 'gate',
            isTransitioning: false
        });
    },

    navigateToRealm: (id: RealmId | null) => {
        if (!id) {
            set({
                activeRealmId: null,
                viewMode: 'cosmos',
                currentMood: 'ambient',
                isTransitioning: false
            });
            return;
        }

        const realmDef = REALMS[id];
        const currentStatuses = get().realmStatuses;

        // Advance dormant realm to discovered upon entry
        const nextStatuses = { ...currentStatuses };
        if (nextStatuses[id] === 'dormant') {
            nextStatuses[id] = 'discovered';
        }

        set({
            activeRealmId: id,
            viewMode: 'realm',
            currentMood: realmDef.audioMood,
            realmStatuses: nextStatuses,
            isTransitioning: false
        });
    },

    discoverRealm: (id: RealmId) => {
        const statuses = { ...get().realmStatuses };
        if (statuses[id] === 'dormant') {
            statuses[id] = 'discovered';
            set({ realmStatuses: statuses });
        }
    },

    completeRealm: (id: RealmId) => {
        const statuses = { ...get().realmStatuses };
        if (statuses[id] !== 'completed') {
            statuses[id] = 'completed';
            const completedCount = Object.values(statuses).filter(s => s === 'completed').length;
            const progress = Math.min(100, Math.round((completedCount / REALM_IDS.length) * 100));

            // Stage evolves: 1 -> 5 based on realms completed
            const leitmotifStage = Math.min(5, Math.max(1, Math.ceil((completedCount / REALM_IDS.length) * 5))) as 1 | 2 | 3 | 4 | 5;

            // Also auto-unlock the corresponding memory for this realm
            const updatedMemories = get().memories.map(m =>
                m.realmId === id ? { ...m, unlocked: true } : m
            );
            const unlockedCount = updatedMemories.filter(m => m.unlocked).length;

            set({
                realmStatuses: statuses,
                completedRealmsCount: completedCount,
                storyProgress: progress,
                activeLeitmotifStage: leitmotifStage,
                memories: updatedMemories,
                unlockedMemoriesCount: unlockedCount
            });
        }
    },

    unlockMemory: (id: string) => {
        const updated = get().memories.map(m =>
            m.id === id ? { ...m, unlocked: true } : m
        );
        const count = updated.filter(m => m.unlocked).length;
        set({
            memories: updated,
            unlockedMemoriesCount: count
        });
    },

    setViewMode: (mode) => set({ viewMode: mode }),

    setAudioMood: (mood: AudioMood) => set({ currentMood: mood }),

    setAudioUnlocked: (unlocked: boolean) => set({ audioUnlocked: unlocked }),

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    setVolume: (volume: number) => set({ volume: Math.max(0, Math.min(1, volume)) }),

    setQualityTier: (tier: QualityTier) => set({ qualityTier: tier }),

    setIsEasterEggOpen: (open: boolean) => set({ isEasterEggOpen: open }),

    setTransitioning: (transitioning: boolean) => set({ isTransitioning: transitioning })
}));
