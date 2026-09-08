// ==========================================================================
// QUEEN JIYU'S UNIVERSE - GRAND FINALE DECLARATION MODAL
// Photorealistic Moon, Falling Snowfall, Khamoshiyan -> Perfect Crossfade, & Sovereign Blessings
// ==========================================================================

import React, { useState, useEffect, useRef } from 'react';
import rawMoonImg from '../../assets/images/raw_moon.jpg';
import { useUniverseStore } from '../../store/universeStore';
import { SoundtrackManager } from '../../audio/SoundtrackManager';
import { getAssetUrl } from '../../utils/assetHelper';
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
    const completeRealm = useUniverseStore((s) => s.completeRealm);
    const navigateToRealm = useUniverseStore((s) => s.navigateToRealm);

    const timerRef = useRef<number | null>(null);
    const snowCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const perfectRef = useRef<HTMLAudioElement | null>(null);

    const stopAllAudio = () => {
        if (perfectRef.current) {
            perfectRef.current.pause();
            perfectRef.current.currentTime = 0;
            perfectRef.current = null;
        }
    };

    const handleClose = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stopAllAudio();
        setVisibleLineCount(0);
        setShowTitle(false);
        onClose();
    };

    const handleLoopToRetina = () => {
        handleClose();
        navigateToRealm('retina');
    };

    // ONLY play Ed Sheeran's "Perfect" for Queen Jiyu's Grand Celebration
    useEffect(() => {
        if (!isOpen) {
            stopAllAudio();
            return;
        }

        // 1. Terminate all previous soundtrack playback (Kya Khoob Lagti Ho, drones, chimes)
        SoundtrackManager.getInstance().stopAll();

        // 2. Play ONLY Ed Sheeran's "Perfect"
        const perfect = new Audio(getAssetUrl('/audio/perfect.mp3'));
        perfect.loop = true;
        perfect.currentTime = 0;
        perfect.volume = 0;
        perfectRef.current = perfect;
        perfect.play().catch((err) => console.warn('Perfect playback waiting for interaction:', err));

        // Smooth fade-in over 1.5 seconds
        let perfVol = 0;
        const perfFadeInterval = window.setInterval(() => {
            perfVol = Math.min(0.85, perfVol + 0.06);
            if (perfect) perfect.volume = perfVol;
            if (perfVol >= 0.85) clearInterval(perfFadeInterval);
        }, 100);

        return () => {
            clearInterval(perfFadeInterval);
            stopAllAudio();
        };
    }, [isOpen]);

    // 2. Snowfall Canvas Particle Animation
    useEffect(() => {
        if (!isOpen) return;
        const canvas = snowCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const flakeCount = 85;
        const flakes = Array.from({ length: flakeCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2.6 + 1.2,
            speedY: Math.random() * 0.8 + 0.45,
            speedX: Math.random() * 0.4 - 0.2,
            phase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.65 + 0.35
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            flakes.forEach((f) => {
                f.y += f.speedY;
                f.phase += 0.02;
                f.x += Math.sin(f.phase) * 0.45 + f.speedX;

                if (f.y > height) {
                    f.y = -10;
                    f.x = Math.random() * width;
                }
                if (f.x > width) f.x = 0;
                if (f.x < 0) f.x = width;

                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 252, 235, ${f.opacity})`;
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 6;
                ctx.fill();
            });
            animId = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
        };
    }, [isOpen]);

    // 3. Step-by-step poetic pacing
    useEffect(() => {
        if (!isOpen) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        let step = 0;
        timerRef.current = window.setInterval(() => {
            step++;
            if (step <= FINALE_LINES.length) {
                setVisibleLineCount(step);
            } else if (step === FINALE_LINES.length + 1) {
                setShowTitle(true);
                completeRealm('queen');
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, 2200);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isOpen, completeRealm]);

    if (!isOpen) return null;

    return (
        <div className="finale-blackout-overlay" role="dialog" aria-modal="true">
            {/* Falling Snowfall Canvas Backdrop */}
            <canvas ref={snowCanvasRef} className="finale-snowfall-canvas" />

            {/* Photorealistic Raw Celestial Moon in Background */}
            <div className="finale-moon-container">
                <div className="finale-moon-halo" />
                <div className="finale-moon-sphere">
                    <img
                        src={rawMoonImg}
                        alt="Photorealistic Raw Celestial Moon"
                        className="finale-raw-moon-img"
                    />
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
                            {/* Divine Birthday Blessings */}
                            <p className="finale-blessings-prayer">
                                “May God bless Queen Jiyu with boundless health, everlasting joy, towering success, and a universe filled with radiant smiles.”
                            </p>

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

