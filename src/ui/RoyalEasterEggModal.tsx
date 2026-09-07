// ==========================================================================
// QUEEN JIYU'S UNIVERSE - ROYAL EASTER EGG MODAL
// Triggered by typing JIYU anywhere or clicking the Crown 5 times
// ==========================================================================

import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';
import { SoundtrackManager } from '../audio/SoundtrackManager';
import { JIYU_PROFILE } from '../data/jiyu';
import './RoyalEasterEggModal.css';

export const RoyalEasterEggModal: React.FC = () => {
    const { isEasterEggOpen, setIsEasterEggOpen } = useUniverseStore();
    const audioManager = SoundtrackManager.getInstance();

    useEffect(() => {
        if (!isEasterEggOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsEasterEggOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEasterEggOpen, setIsEasterEggOpen]);

    if (!isEasterEggOpen) return null;

    const handleClose = () => {
        audioManager.playCelestialChime();
        setIsEasterEggOpen(false);
    };

    return (
        <div
            className="royal-egg-overlay"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div className="royal-egg-card">
                <button
                    className="royal-egg-close-btn"
                    onClick={handleClose}
                    aria-label="Close Royal Easter Egg"
                >
                    &times;
                </button>

                <div className="royal-egg-crest">👑</div>

                <div className="royal-egg-badge">
                    <Sparkles size={13} color="#FFD700" />
                    <span>Secret Royal Frequency // Sovereign Decree</span>
                </div>

                <h2 className="royal-egg-title">A Message For Queen Jiyu</h2>

                <p className="royal-egg-quote">
                    “{JIYU_PROFILE.easterEggs.secretDeclaration}”
                </p>

                <p className="royal-egg-subtext">
                    Some people enter your life. Some become an entire universe.
                    You are the gravity that holds every constellation in perfect harmony.
                </p>

                <div className="royal-egg-meta">
                    <span>23 September</span>
                    <span>•</span>
                    <span>Jiya Radia</span>
                    <span>•</span>
                    <span>Always Loved</span>
                </div>

                <button
                    className="btn-royal-egg-action"
                    onClick={handleClose}
                >
                    Acknowledge Sovereign Grace ✨
                </button>
            </div>
        </div>
    );
};
