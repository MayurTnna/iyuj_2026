// ==========================================================================
// QUEEN JIYU'S UNIVERSE - REALM NARRATIVE OVERLAY & MEMORY MODAL
// ==========================================================================

import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, CheckCircle, ArrowLeft, Crown, Music } from 'lucide-react';
import { useUniverseStore } from '../store/universeStore';
import { REALMS, REALM_IDS } from '../data/realms';
import { SoundtrackManager } from '../audio/SoundtrackManager';
import { QueenFinaleModal } from './Queen/QueenFinaleModal';
import { CoronationConvergenceAnimation } from './Queen/CoronationConvergenceAnimation';
import './RealmOverlay.css';

export const RealmOverlay: React.FC = () => {
    const { activeRealmId, memories, completeRealm, unlockMemory, navigateToRealm } = useUniverseStore();
    const [inspectingMemory, setInspectingMemory] = useState(false);
    const [showingFinale, setShowingFinale] = useState(false);
    const [isConverging, setIsConverging] = useState(false);
    const [showingAlignmentAlert, setShowingAlignmentAlert] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const audioManager = SoundtrackManager.getInstance();

    useEffect(() => {
        setIsMinimized(false);
    }, [activeRealmId]);

    if (!activeRealmId) return null;

    const realm = REALMS[activeRealmId];
    const realmMemory = memories.find((m) => m.realmId === activeRealmId);
    const isQueenRealm = activeRealmId === 'queen';

    const journeyMemoriesUnlocked = memories.filter((m) => m.realmId !== 'queen' && m.unlocked).length;
    const unlockedMemoriesCount = memories.filter((m) => m.unlocked).length;
    const totalMemoriesCount = memories.length;
    const isFullyUnlocked = journeyMemoriesUnlocked >= 9 || unlockedMemoriesCount >= totalMemoriesCount;

    // When entering Queen's Chamber, if 9 journey memories are aligned, Queen memory completes
    useEffect(() => {
        if (isQueenRealm && journeyMemoriesUnlocked >= 9 && realmMemory && !realmMemory.unlocked) {
            unlockMemory(realmMemory.id);
        }
    }, [isQueenRealm, journeyMemoriesUnlocked, realmMemory, unlockMemory]);

    const handleInspectMemory = () => {
        audioManager.playCelestialChime();
        if (realmMemory) {
            unlockMemory(realmMemory.id);
        }
        setInspectingMemory(true);
    };

    const handleCompleteRealm = () => {
        audioManager.playCelestialChime();
        completeRealm(activeRealmId);
        navigateToRealm(null);
    };

    const handleFinaleClick = () => {
        if (!isFullyUnlocked) {
            audioManager.playCelestialChime();
            setShowingAlignmentAlert(true);
        } else {
            audioManager.stopAll();
            audioManager.playCelestialChime();
            setIsConverging(true);
        }
    };

    return (
        <>
            <div className="realm-overlay-container">
                {isMinimized ? (
                    <button
                        className="realm-minimized-pill"
                        onClick={() => setIsMinimized(false)}
                        title="Show Realm Story & Actions"
                    >
                        <Sparkles size={14} color="#FFD700" />
                        <span>{realm.title} // Read Story</span>
                        <BookOpen size={13} />
                    </button>
                ) : (
                    <div className="realm-narrative-card">
                        <div className="realm-card-topbar">
                            <div className="realm-badge">
                                <span>{realm.icon}</span>
                                <span>REALM {realm.order < 10 ? `0${realm.order}` : realm.order} // 10</span>
                            </div>

                            <div className="realm-topbar-actions">
                                {realm.bollywoodLyric && (
                                    <div className="realm-music-pill" title={`Soundtrack: ${realm.bollywoodLyric.song} (${realm.bollywoodLyric.film})`}>
                                        <Music size={12} className="music-bar-pulse" />
                                        <span>{realm.bollywoodLyric.song}</span>
                                    </div>
                                )}
                                <button
                                    className="realm-toggle-view-btn"
                                    onClick={() => setIsMinimized(true)}
                                    title="View Unobstructed 3D Realm"
                                >
                                    <span>View Scene</span>
                                </button>
                            </div>
                        </div>

                        <h2 className="realm-narrative-title">{realm.title}</h2>
                        <p className="realm-narrative-subtitle">{realm.subtitle}</p>

                        <p className="realm-poetic-body">“{realm.poeticCore}”</p>

                        <div className="realm-action-buttons">
                            {/* Grand Finale Trigger if in Queen Realm */}
                            {isQueenRealm && (
                                <button
                                    className="btn-realm-primary"
                                    style={{
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #B45309 100%)',
                                        color: '#020408'
                                    }}
                                    onClick={handleFinaleClick}
                                >
                                    <Crown size={15} />
                                    <span>The Grand Finale 👑</span>
                                </button>
                            )}

                            {realmMemory && (
                                <button
                                    className="btn-realm-primary"
                                    onClick={handleInspectMemory}
                                >
                                    <BookOpen size={14} />
                                    <span>Discover Memory</span>
                                </button>
                            )}

                            <button
                                className="btn-realm-primary"
                                onClick={handleCompleteRealm}
                            >
                                <CheckCircle size={14} />
                                <span>Align Star & Return</span>
                            </button>

                            <button
                                className="btn-realm-secondary"
                                onClick={() => navigateToRealm(null)}
                            >
                                <ArrowLeft size={14} />
                                <span>Cosmos View</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Memory Inspection Modal */}
            {inspectingMemory && realmMemory && (
                <div
                    className="memory-fragment-modal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setInspectingMemory(false);
                    }}
                >
                    <div className="memory-fragment-card">
                        <button
                            className="memory-close-btn"
                            onClick={() => setInspectingMemory(false)}
                        >
                            &times;
                        </button>

                        <div className="memory-location-tag">
                            <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
                            <span>{realmMemory.location} — {realmMemory.dateMeta}</span>
                        </div>

                        <h3 className="realm-narrative-title" style={{ fontSize: '1.3rem' }}>
                            {realmMemory.title}
                        </h3>

                        <p className="memory-quote">“{realmMemory.quote}”</p>

                        <p className="memory-reflection">{realmMemory.reflection}</p>

                        <button
                            className="btn-realm-primary"
                            style={{ margin: '0 auto' }}
                            onClick={() => setInspectingMemory(false)}
                        >
                            <span>Seal In Starlight</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Memory Alignment Guidance Modal */}
            {showingAlignmentAlert && (
                <div
                    className="memory-fragment-modal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowingAlignmentAlert(false);
                    }}
                >
                    <div className="memory-fragment-card" style={{ maxWidth: 540 }}>
                        <button
                            className="memory-close-btn"
                            onClick={() => setShowingAlignmentAlert(false)}
                        >
                            &times;
                        </button>

                        <div className="memory-location-tag">
                            <Crown size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#FFD700' }} />
                            <span>Constellation Notice</span>
                        </div>

                        <h3 className="realm-narrative-title" style={{ fontSize: '1.4rem', marginTop: '0.4rem' }}>
                            Crown Incomplete, My Queen 👑
                        </h3>

                        <p className="memory-quote" style={{ fontSize: '1.15rem', marginTop: '0.8rem' }}>
                            “The stars whisper that {totalMemoriesCount - unlockedMemoriesCount} {totalMemoriesCount - unlockedMemoriesCount === 1 ? 'memory is' : 'memories are'} still waiting for you across the cosmos.”
                        </p>

                        <p className="memory-reflection" style={{ fontSize: '0.92rem' }}>
                            Explore and align all 10 realm memories so your sovereign constellation can ignite with full celestial luminosity for the Grand Coronation Finale ✨
                        </p>

                        <div style={{ margin: '1rem 0', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#F5D77F', marginBottom: '6px', fontFamily: 'Cinzel, serif' }}>
                                <span>Constellation Alignment</span>
                                <span>{unlockedMemoriesCount} / {totalMemoriesCount} Complete</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${(unlockedMemoriesCount / totalMemoriesCount) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #FFD700)', transition: 'width 0.5s ease' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                className="btn-realm-primary"
                                onClick={() => {
                                    setShowingAlignmentAlert(false);
                                    navigateToRealm(null);
                                }}
                            >
                                <ArrowLeft size={14} />
                                <span>Explore Remaining Realms ({totalMemoriesCount - unlockedMemoriesCount} left)</span>
                            </button>

                            <button
                                className="btn-realm-primary"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #B45309 100%)',
                                    color: '#020408'
                                }}
                                onClick={() => {
                                    REALM_IDS.forEach((id) => completeRealm(id));
                                    setShowingAlignmentAlert(false);
                                    audioManager.stopAll();
                                    audioManager.playCelestialChime();
                                    setIsConverging(true);
                                }}
                            >
                                <Crown size={14} />
                                <span>Sovereign Coronation Now 👑</span>
                            </button>

                            <button
                                className="btn-realm-secondary"
                                onClick={() => setShowingAlignmentAlert(false)}
                            >
                                <span>Stay In Queen Realm</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 10-Memory Coronation Constellation Convergence Animation */}
            {isConverging && (
                <CoronationConvergenceAnimation
                    onComplete={() => {
                        setIsConverging(false);
                        setShowingFinale(true);
                    }}
                />
            )}

            {/* Christopher Nolan Grand Finale Loop Modal */}
            <QueenFinaleModal
                isOpen={showingFinale}
                onClose={() => {
                    setShowingFinale(false);
                    navigateToRealm(null);
                }}
            />
        </>
    );
};

