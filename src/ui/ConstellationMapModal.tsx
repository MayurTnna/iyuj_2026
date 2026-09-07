// ==========================================================================
// QUEEN JIYU'S UNIVERSE - CONSTELLATION MAP MODAL
// ==========================================================================

import React from 'react';
import { useUniverseStore } from '../store/universeStore';
import { REALMS, REALM_IDS } from '../data/realms';
import { SoundtrackManager } from '../audio/SoundtrackManager';
import type { RealmId } from '../types/universe.types';
import './ConstellationMapModal.css';

interface ConstellationMapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConstellationMapModal: React.FC<ConstellationMapModalProps> = ({ isOpen, onClose }) => {
    const { activeRealmId, realmStatuses, storyProgress, navigateToRealm } = useUniverseStore();
    const audioManager = SoundtrackManager.getInstance();

    if (!isOpen) return null;

    const handleSelectRealm = (id: RealmId) => {
        audioManager.playCelestialChime();
        navigateToRealm(id);
        onClose();
    };

    return (
        <div
            className="map-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="map-modal-card">
                <button
                    className="map-close-btn"
                    onClick={onClose}
                    aria-label="Close Map"
                >
                    &times;
                </button>

                <div className="map-modal-header">
                    <h2 className="map-title">Celestial Atlas // The 10 Realms</h2>
                    <p className="map-subtitle">
                        Crown Alignment: {storyProgress}% — Every discovered realm completes the constellation.
                    </p>
                </div>

                <div className="map-grid">
                    {REALM_IDS.map((id) => {
                        const realm = REALMS[id];
                        const status = realmStatuses[id];
                        const isActive = activeRealmId === id;

                        return (
                            <div
                                key={`map-${id}`}
                                className={`map-node-card ${isActive ? 'active' : ''}`}
                                onClick={() => handleSelectRealm(id)}
                            >
                                <span className="map-node-icon">{realm.icon}</span>
                                <span className="map-node-title">{realm.title}</span>
                                <span className={`map-node-status ${status}`}>
                                    {status === 'completed' ? '✓ Aligned' : status}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <button
                    className="btn-map-return"
                    style={{ margin: '0 auto' }}
                    onClick={onClose}
                >
                    <span>Return To Starlight</span>
                </button>
            </div>
        </div>
    );
};
