import React, { useState, useEffect, useRef } from 'react';
import { CelestialHUD } from '../ui/CelestialHUD';
import { UniverseCanvas } from './UniverseCanvas';
import { RealmOverlay } from '../realms/RealmOverlay';
import { RoyalEasterEggModal } from '../ui/RoyalEasterEggModal';
import { UniverseCursiveLoader } from './UniverseCursiveLoader';
import { SoundtrackManager } from '../audio/SoundtrackManager';
import { useUniverseStore } from '../store/universeStore';
import './Universe.css';

export const Universe: React.FC = () => {
    const { activeLeitmotifStage, currentMood, setIsEasterEggOpen } = useUniverseStore();
    const [isPageReady, setIsPageReady] = useState(false);
    const keyBufferRef = useRef('');

    useEffect(() => {
        if (!isPageReady) return;
        const audio = SoundtrackManager.getInstance();
        audio.init();
        audio.setMood(currentMood, activeLeitmotifStage);
    }, [isPageReady, currentMood, activeLeitmotifStage]);

    // Global "JIYU" keyboard easter egg listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if active element is an input or textarea
            const target = e.target as HTMLElement | null;
            if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                keyBufferRef.current = (keyBufferRef.current + key).slice(-4);
                if (keyBufferRef.current === 'JIYU') {
                    keyBufferRef.current = '';
                    const audio = SoundtrackManager.getInstance();
                    audio.playCelestialChime();
                    setIsEasterEggOpen(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setIsEasterEggOpen]);

    return (
        <div className="universe-container">
            <UniverseCursiveLoader durationMs={2800} onComplete={() => setIsPageReady(true)} />
            <CelestialHUD />
            <UniverseCanvas />
            <RealmOverlay />
            <RoyalEasterEggModal />
        </div>
    );
};

