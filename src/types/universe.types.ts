// ==========================================================================
// QUEEN JIYU'S UNIVERSE - DOMAIN TYPES
// ==========================================================================

export type RealmId =
    | 'first-rhythm'
    | 'retina'
    | 'river'
    | 'rose'
    | 'silent-language'
    | 'radiance'
    | 'sanctuary'
    | 'missed-days'
    | 'ascent'
    | 'queen';

export type RealmStatus = 'dormant' | 'discovered' | 'orbiting' | 'completed';

export type QualityTier = 'ultra' | 'high' | 'medium' | 'low';

export type AudioMood =
    | 'gate'
    | 'ambient'
    | 'first-rhythm'
    | 'retina'
    | 'river'
    | 'rose'
    | 'silent-language'
    | 'radiance'
    | 'sanctuary'
    | 'missed-days'
    | 'ascent'
    | 'queen'
    | 'finale-perfect';

export interface BollywoodLyric {
    song: string;
    film: string;
    artists: string;
    line: string;
    meaning: string;
}

export interface RealmDefinition {
    id: RealmId;
    order: number;
    title: string;
    subtitle: string;
    tagline: string;
    coordinates: [number, number, number];
    cameraPosition: [number, number, number];
    targetLookAt: [number, number, number];
    color: string;
    emissiveColor: string;
    accentColor: string;
    icon: string;
    audioMood: AudioMood;
    narrativePacing: {
        introDelay: number;
        lines: string[];
    };
    poeticCore: string;
    bollywoodLyric: BollywoodLyric;
}

export interface MemoryFragment {
    id: string;
    realmId: RealmId;
    title: string;
    location: string;
    dateMeta: string;
    quote: string;
    reflection: string;
    unlocked: boolean;
    secret?: boolean;
}

export interface UniverseState {
    // Navigation
    chapter: 0 | 1; // 0 = The Gate, 1 = The Queen's Universe
    activeRealmId: RealmId | null;
    viewMode: 'cosmos' | 'realm' | 'memory-viewer' | 'constellation-map';
    isTransitioning: boolean;

    // Narrative & Realm Progress
    realmStatuses: Record<RealmId, RealmStatus>;
    completedRealmsCount: number;
    memories: MemoryFragment[];
    unlockedMemoriesCount: number;
    storyProgress: number; // 0 - 100%

    // Audio & Ambience
    audioUnlocked: boolean;
    isMuted: boolean;
    volume: number;
    currentMood: AudioMood;
    activeLeitmotifStage: 1 | 2 | 3 | 4 | 5; // Piano -> Strings -> Indian Classical -> Full Orchestra -> Finale

    // Performance & Easter Eggs
    qualityTier: QualityTier;
    isEasterEggOpen: boolean;

    // Actions
    enterUniverse: () => void;
    returnToGate: () => void;
    navigateToRealm: (id: RealmId | null) => void;
    discoverRealm: (id: RealmId) => void;
    completeRealm: (id: RealmId) => void;
    unlockMemory: (id: string) => void;
    setViewMode: (mode: 'cosmos' | 'realm' | 'memory-viewer' | 'constellation-map') => void;
    setAudioMood: (mood: AudioMood) => void;
    setAudioUnlocked: (unlocked: boolean) => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    setQualityTier: (tier: QualityTier) => void;
    setIsEasterEggOpen: (open: boolean) => void;
    setTransitioning: (transitioning: boolean) => void;
}
