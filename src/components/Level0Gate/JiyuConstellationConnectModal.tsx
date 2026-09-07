// ==========================================================================
// QUEEN JIYU - INTERACTIVE CONSTELLATION CONNECTION MODAL
// Connect J -> I -> Y -> U in sequence with celestial chimes to ignite hyperjump
// ==========================================================================

import React, { useState, useRef } from 'react';
import { Sparkles, Crown } from 'lucide-react';
import './JiyuConstellationConnectModal.css';

interface JiyuConstellationConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface StarNode {
    id: 'J' | 'I' | 'Y' | 'U';
    label: string;
    subtext: string;
    x: number; // percentage
    y: number; // percentage
    freq: number; // Hz for chime
}

const STAR_NODES: StarNode[] = [
    { id: 'J', label: 'J', subtext: 'Joy', x: 18, y: 55, freq: 523.25 },
    { id: 'I', label: 'I', subtext: 'Infinite', x: 38, y: 28, freq: 659.25 },
    { id: 'Y', label: 'Y', subtext: 'Yearning', x: 62, y: 32, freq: 783.99 },
    { id: 'U', label: 'U', subtext: 'Universe', x: 82, y: 60, freq: 1046.50 }
];

export const JiyuConstellationConnectModal: React.FC<JiyuConstellationConnectModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [connectedIndex, setConnectedIndex] = useState(0); // 0 none, 1: J, 2: J-I, 3: J-I-Y, 4: J-I-Y-U
    const [isBursting, setIsBursting] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    if (!isOpen) return null;

    const playStarChime = (freq: number) => {
        try {
            if (!audioCtxRef.current) {
                const AudioCtxClass =
                    window.AudioContext ||
                    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                audioCtxRef.current = new AudioCtxClass();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1600, ctx.currentTime);

            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 1.8);
        } catch {
            // Audio context error fallback
        }
    };

    const playSupernovaChord = () => {
        try {
            if (!audioCtxRef.current) return;
            const ctx = audioCtxRef.current;
            const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            chord.forEach((f) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, ctx.currentTime);

                gain.gain.setValueAtTime(0.001, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 2.5);
            });
        } catch {
            // Audio fallback
        }
    };

    const handleNodeClick = (index: number) => {
        if (isBursting) return;

        // Must connect in order: index 0 (J), then 1 (I), 2 (Y), 3 (U)
        if (index === connectedIndex) {
            const node = STAR_NODES[index];
            playStarChime(node.freq);
            const nextCount = connectedIndex + 1;
            setConnectedIndex(nextCount);

            if (nextCount === 4) {
                // Completed J-I-Y-U!
                setIsBursting(true);
                setTimeout(() => {
                    playSupernovaChord();
                }, 200);

                setTimeout(() => {
                    onSuccess();
                }, 1300);
            }
        }
    };

    const getStatusText = () => {
        switch (connectedIndex) {
            case 0:
                return 'Touch Star “J” to begin aligning Queen Jiyu’s constellation';
            case 1:
                return 'Star “J” aligned! Now connect to Star “I”';
            case 2:
                return '“J • I” connected! Touch Star “Y”';
            case 3:
                return 'Almost sovereign! Complete the constellation by touching Star “U”';
            default:
                return 'Constellation Complete! Igniting Cosmic Hyperjump... 🚀✨';
        }
    };

    return (
        <div className="jiyu-constellation-overlay">
            {isBursting && <div className="supernova-burst-active" />}

            <div className="jiyu-constellation-box">
                <div className="constellation-header-badge">
                    <Crown size={14} color="#FFD700" />
                    <span>The Sovereign Monogram</span>
                </div>

                <h2 className="constellation-title">The JIYU Constellation</h2>
                <p className="constellation-instruction">
                    Connect each star in sequence to ignite the bridge to Queen Jiyu’s Universe.
                </p>

                <div className="constellation-interactive-canvas">
                    {/* SVG Connecting Laser Lines */}
                    <svg className="constellation-lines-svg">
                        {connectedIndex >= 2 && (
                            <line
                                x1={`${STAR_NODES[0].x}%`}
                                y1={`${STAR_NODES[0].y}%`}
                                x2={`${STAR_NODES[1].x}%`}
                                y2={`${STAR_NODES[1].y}%`}
                                className="constellation-laser-line"
                            />
                        )}
                        {connectedIndex >= 3 && (
                            <line
                                x1={`${STAR_NODES[1].x}%`}
                                y1={`${STAR_NODES[1].y}%`}
                                x2={`${STAR_NODES[2].x}%`}
                                y2={`${STAR_NODES[2].y}%`}
                                className="constellation-laser-line"
                            />
                        )}
                        {connectedIndex >= 4 && (
                            <line
                                x1={`${STAR_NODES[2].x}%`}
                                y1={`${STAR_NODES[2].y}%`}
                                x2={`${STAR_NODES[3].x}%`}
                                y2={`${STAR_NODES[3].y}%`}
                                className="constellation-laser-line"
                            />
                        )}
                    </svg>

                    {/* 4 Interactive Star Nodes */}
                    {STAR_NODES.map((node, idx) => {
                        const isConnected = idx < connectedIndex;
                        const isNextTarget = idx === connectedIndex;

                        return (
                            <div
                                key={node.id}
                                className={`constellation-node-point ${
                                    isConnected ? 'connected' : ''
                                } ${isNextTarget ? 'next-target' : ''}`}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                onClick={() => handleNodeClick(idx)}
                            >
                                <span className="node-letter">{node.label}</span>
                                <span className="node-subtext">{node.subtext}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="constellation-status-pill">
                    <Sparkles size={13} style={{ display: 'inline', marginRight: 6 }} color="#FFD700" />
                    <span>{getStatusText()}</span>
                </div>

                {!isBursting && (
                    <button className="btn-constellation-close" onClick={onClose}>
                        Cancel & Return To Gate
                    </button>
                )}
            </div>
        </div>
    );
};

