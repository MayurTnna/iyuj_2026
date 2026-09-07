import React, { useRef, useState } from 'react';
import { Sparkles, Compass, Volume2, VolumeX, ArrowLeft, Map } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';
import { REALMS } from '../data/realms';
import { SoundtrackManager } from '../audio/SoundtrackManager';
import type { QualityTier } from '../types/universe.types';
import { ConstellationMapModal } from './ConstellationMapModal';
import './CelestialHUD.css';

export const CelestialHUD: React.FC = () => {
    const {
        activeRealmId,
        memories,
        unlockedMemoriesCount,
        storyProgress,
        isMuted,
        qualityTier,
        toggleMute,
        setQualityTier,
        navigateToRealm,
        returnToGate,
        setIsEasterEggOpen
    } = useUniverseStore();

    const [isMapOpen, setIsMapOpen] = useState(false);
    const crownClicksRef = useRef(0);
    const audioManager = SoundtrackManager.getInstance();

    const currentRealm = activeRealmId ? REALMS[activeRealmId] : null;

    const handleBrandClick = () => {
        crownClicksRef.current++;
        audioManager.playCelestialChime();
        if (crownClicksRef.current >= 5) {
            crownClicksRef.current = 0;
            setIsEasterEggOpen(true);
        }
    };

    const handleToggleAudio = () => {
        toggleMute();
        audioManager.setMuted(!isMuted);
    };

    const handleTierChange = (tier: QualityTier) => {
        setQualityTier(tier);
        audioManager.playCelestialChime();
    };

    return (
        <aside className="celestial-hud" aria-label="Universe Navigation & HUD">
            {/* TOP BAR */}
            <div className="hud-top-bar">
                {/* Brand */}
                <div
                    className="hud-brand"
                    onClick={handleBrandClick}
                    title="Pay Homage to Queen Jiyu"
                >
                    <svg
                        className="hud-crown-icon"
                        viewBox="0 0 100 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 65L20 25L40 45L50 15L60 45L80 25L90 65H10Z"
                            stroke="url(#hudGold)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="20" cy="21" r="3" fill="#FFD700" />
                        <circle cx="50" cy="11" r="4" fill="#FFF8DC" />
                        <circle cx="80" cy="21" r="3" fill="#FFD700" />
                        <path d="M15 72H85" stroke="url(#hudGold)" strokeWidth="2" />
                        <defs>
                            <linearGradient
                                id="hudGold"
                                x1="0"
                                y1="0"
                                x2="100"
                                y2="80"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#FFF8DC" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="hud-brand-title">Queen Jiyu’s Universe</span>
                </div>

                {/* Celestial Compass */}
                <div className="hud-realm-compass">
                    <span className="compass-dot" />
                    <span>JIYU</span>
                    <span className="compass-sep">//</span>
                    <span>{currentRealm ? currentRealm.title : 'PANORAMIC COSMOS'}</span>
                    <span className="compass-sep">//</span>
                    <span>23.09</span>
                </div>

                {/* Top Right Controls */}
                <div className="hud-top-right">
                    {/* Return to Cosmos if in a realm */}
                    {activeRealmId && (
                        <button
                            className="hud-btn"
                            onClick={() => navigateToRealm(null)}
                            title="Return to Cosmos Overview"
                        >
                            <Compass size={14} />
                            <span>Cosmos</span>
                        </button>
                    )}

                    {/* Constellation Atlas / Map */}
                    <button
                        className="hud-btn"
                        onClick={() => {
                            audioManager.playCelestialChime();
                            setIsMapOpen(true);
                        }}
                        title="Open Constellation Atlas"
                    >
                        <Map size={14} />
                        <span>Atlas</span>
                    </button>

                    {/* Audio Controller */}
                    <button
                        className={`hud-btn ${isMuted ? '' : 'playing active'}`}
                        onClick={handleToggleAudio}
                        title={isMuted ? 'Unmute Universe Music' : 'Mute Universe Music'}
                    >
                        <div className="hud-waves">
                            <span className="hud-wave-bar bar-1" />
                            <span className="hud-wave-bar bar-2" />
                            <span className="hud-wave-bar bar-3" />
                            <span className="hud-wave-bar bar-4" />
                        </div>
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>

                    {/* Return to Gate Chapter 0 */}
                    <button
                        className="hud-btn"
                        onClick={returnToGate}
                        title="Return to Chapter 0: The Gate"
                    >
                        <ArrowLeft size={14} />
                        <span>The Gate</span>
                    </button>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="hud-bottom-bar">
                {/* Story & Memory Progress */}
                <div className="hud-progress-block">
                    <div className="hud-progress-labels">
                        <span>Memories: {unlockedMemoriesCount} / {memories.length}</span>
                        <span>{storyProgress}% Aligned</span>
                    </div>
                    <div className="hud-progress-track">
                        <div
                            className="hud-progress-fill"
                            style={{ width: `${Math.max(8, storyProgress)}%` }}
                        />
                    </div>
                </div>

                {/* Quality Tier Selector */}
                <div className="hud-tier-selector">
                    <Sparkles size={12} color="#D4AF37" style={{ marginLeft: 4 }} />
                    {(['ultra', 'high', 'medium', 'low'] as QualityTier[]).map((tier) => (
                        <button
                            key={tier}
                            className={`tier-pill ${qualityTier === tier ? 'active' : ''}`}
                            onClick={() => handleTierChange(tier)}
                        >
                            {tier.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Interactive 8-Realm Celestial Atlas Modal */}
            <ConstellationMapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
            />
        </aside>
    );
};
