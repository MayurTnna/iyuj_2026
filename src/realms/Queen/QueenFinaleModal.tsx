// ==========================================================================
// QUEEN JIYU'S UNIVERSE - GRAND FINALE DECLARATION MODAL
// Step-by-step cinematic reveal with pure silence and full orchestral reprise
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { SoundtrackManager } from '../../audio/SoundtrackManager';
import { useUniverseStore } from '../../store/universeStore';
import './QueenFinaleModal.css';

interface QueenFinaleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FINALE_LINES = [
    'I spent all this time trying to build a universe worthy of you.',
    'And somewhere along the way, I realized something.',
    'You were never meant to fit inside a universe.',
    'The universe was simply the best way I knew to tell you how important you are to me.'
];

export const QueenFinaleModal: React.FC<QueenFinaleModalProps> = ({ isOpen, onClose }) => {
    const [visibleLineCount, setVisibleLineCount] = useState(0);
    const [showTitle, setShowTitle] = useState(false);
    const audioManager = SoundtrackManager.getInstance();
    const completeRealm = useUniverseStore((s) => s.completeRealm);
    const navigateToRealm = useUniverseStore((s) => s.navigateToRealm);

    const timerRef = useRef<number | null>(null);

    const handleClose = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setVisibleLineCount(0);
        setShowTitle(false);
        onClose();
    };

    const handleLoopToRetina = () => {
        handleClose();
        navigateToRealm('retina');
    };

    useEffect(() => {
        if (!isOpen) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        // 1. Initial silence
        audioManager.setMood('silent-language');

        let step = 0;
        timerRef.current = window.setInterval(() => {
            step++;
            if (step <= FINALE_LINES.length) {
                setVisibleLineCount(step);
            } else if (step === FINALE_LINES.length + 1) {
                setShowTitle(true);
                // 2. Play Ed Sheeran's "Perfect" for Queen Jiyu's Grand Celebration
                audioManager.setMood('finale-perfect');
                completeRealm('queen');
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, 2200);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isOpen, audioManager, completeRealm]);

    if (!isOpen) return null;

    return (
        <div className="finale-blackout-overlay" role="dialog" aria-modal="true">
            {/* Celestial Glowing Moon in Background */}
            <div className="finale-moon-container">
                <div className="finale-moon-halo" />
                <div className="finale-moon-sphere">
                    <div className="moon-crater crater-1" />
                    <div className="moon-crater crater-2" />
                    <div className="moon-crater crater-3" />
                </div>
            </div>

            <div className="finale-content-container">
                <div className="finale-royal-crest">👑</div>

                {FINALE_LINES.map((line, idx) => (
                    <p
                        key={`finale-line-${idx}`}
                        className={`finale-line ${idx < visibleLineCount ? 'visible' : ''}`}
                    >
                        “{line}”
                    </p>
                ))}

                <h1 className={`finale-grand-title ${showTitle ? 'visible' : ''}`}>
                    HAPPY BIRTHDAY, QUEEN JIYU 👑
                </h1>

                {showTitle && (
                    <>
                        <div className="finale-birthday-letter">
                            <p className="finale-letter-message">
                                “To the most graceful, inspiring, and beautiful soul in this universe—whose smile brings
                                golden morning light, whose presence creates a sanctuary of calm, and whose sovereign spirit
                                conquers every summit... May your 23rd year unfold with boundless triumph, endless joy,
                                and all the love this cosmos can hold.”
                            </p>
                            <p className="finale-letter-signature">
                                Forever Cherished • Happy Birthday Queen Jiyu ❤️✨
                            </p>
                        </div>

                        <div className="finale-btn-group">
                            <button
                                className="btn-finale-return"
                                onClick={handleClose}
                            >
                                Return To The Cosmos ✨
                            </button>
                            <button
                                className="btn-finale-loop"
                                onClick={handleLoopToRetina}
                            >
                                Loop: The Crown In Her Eyes 👁️
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
