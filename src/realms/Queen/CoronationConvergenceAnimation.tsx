import React, { useEffect, useState } from 'react';
import { REALMS, REALM_IDS } from '../../data/realms';
import './CoronationConvergenceAnimation.css';

interface CoronationConvergenceAnimationProps {
    onComplete: () => void;
}

export const CoronationConvergenceAnimation: React.FC<CoronationConvergenceAnimationProps> = ({
    onComplete
}) => {
    const [phase, setPhase] = useState<'igniting' | 'connected' | 'converging'>('igniting');

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setPhase('connected');
        }, 1100);

        const timer2 = setTimeout(() => {
            setPhase('converging');
        }, 2100);

        const timer3 = setTimeout(() => {
            onComplete();
        }, 2800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    // Compute coordinates for 10 realm nodes in a circle
    const radius = 170;
    const center = 220;
    const nodePositions = REALM_IDS.map((id, index) => {
        const angle = (index * (360 / REALM_IDS.length) - 90) * (Math.PI / 180);
        return {
            id,
            icon: REALMS[id].icon,
            title: REALMS[id].title,
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle)
        };
    });

    return (
        <div className={`coronation-overlay ${phase}`}>
            {/* Ambient Cosmic Starlight Glow */}
            <div className="coronation-nebula-pulse" />

            <div className="coronation-stage">
                {/* SVG Connecting Constellation Lines */}
                <svg
                    className="coronation-lines-svg"
                    viewBox="0 0 440 440"
                >
                    <defs>
                        <linearGradient id="goldLaserLine" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFF2B2" />
                            <stop offset="50%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="#D4AF37" />
                        </linearGradient>
                        <filter id="coronationGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Laser lines connecting all 10 nodes */}
                    {nodePositions.map((pos, idx) => {
                        const nextPos = nodePositions[(idx + 1) % nodePositions.length];
                        return (
                            <line
                                key={`line-${pos.id}`}
                                x1={pos.x}
                                y1={pos.y}
                                x2={nextPos.x}
                                y2={nextPos.y}
                                className="coronation-laser-line"
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            />
                        );
                    })}

                    {/* Radial starburst spokes to center */}
                    {nodePositions.map((pos, idx) => (
                        <line
                            key={`spoke-${pos.id}`}
                            x1={center}
                            y1={center}
                            x2={pos.x}
                            y2={pos.y}
                            className="coronation-spoke-line"
                            style={{ animationDelay: `${0.6 + idx * 0.06}s` }}
                        />
                    ))}
                </svg>

                {/* Central Royal Crown Core */}
                <div className="coronation-crown-core">
                    <div className="crown-core-halo" />
                    <span className="crown-core-icon">👑</span>
                </div>

                {/* 10 Luminous Star Nodes */}
                {nodePositions.map((pos, idx) => (
                    <div
                        key={`node-${pos.id}`}
                        className="coronation-star-node"
                        style={{
                            left: `${(pos.x / 440) * 100}%`,
                            top: `${(pos.y / 440) * 100}%`,
                            animationDelay: `${idx * 0.1}s`
                        }}
                    >
                        <span className="coronation-node-icon">{pos.icon}</span>
                        <div className="coronation-node-glow" />
                    </div>
                ))}
            </div>

            {/* Coronation Proclamation Banner */}
            <div className="coronation-banner">
                <div className="coronation-badge">
                    <span className="badge-star">✦</span>
                    <span>10 OF 10 MEMORIES ALIGNED</span>
                    <span className="badge-star">✦</span>
                </div>
                <h2 className="coronation-title">THE SOVEREIGN CONSTELLATION AWAKENS</h2>
                <p className="coronation-subtitle">
                    All paths have converged into the Royal Crown. The Grand Coronation begins now...
                </p>
            </div>
        </div>
    );
};
