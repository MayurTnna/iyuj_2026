import React, { useEffect, useState } from 'react';
import './UniverseCursiveLoader.css';

interface UniverseCursiveLoaderProps {
    onComplete?: () => void;
    durationMs?: number;
}

export const UniverseCursiveLoader: React.FC<UniverseCursiveLoaderProps> = ({
    onComplete,
    durationMs = 2800
}) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Start fade out slightly before full duration
        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, Math.max(durationMs - 600, 1800));

        const finishTimer = setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
        }, durationMs);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [durationMs, onComplete]);

    if (isFinished) return null;

    return (
        <div className={`universe-cursive-loader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
            {/* Ambient Celestial Glow Nebulae */}
            <div className="cursive-nebula-glow" />

            <div className="cursive-content-wrapper">
                {/* Crown Icon Above Calligraphy */}
                <div className="cursive-crown-icon">👑</div>

                {/* SVG Cursive Handwriting Animation */}
                <div className="cursive-svg-container">
                    <svg
                        className="cursive-calligraphy-svg"
                        viewBox="0 0 520 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="goldCalligraphyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FFF2B2" />
                                <stop offset="35%" stopColor="#F5D77F" />
                                <stop offset="70%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#FFD700" />
                            </linearGradient>

                            <filter id="royalCalligraphyGlow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background subtle guide path */}
                        <text
                            x="260"
                            y="135"
                            textAnchor="middle"
                            className="cursive-text-ghost"
                        >
                            Jiyu
                        </text>

                        {/* Animated stroked text simulating fluent cursive handwriting */}
                        <text
                            x="260"
                            y="135"
                            textAnchor="middle"
                            className="cursive-text-stroke"
                        >
                            Jiyu
                        </text>

                        {/* Flowing solid text that fills in with golden brilliance */}
                        <text
                            x="260"
                            y="135"
                            textAnchor="middle"
                            className="cursive-text-fill"
                        >
                            Jiyu
                        </text>
                    </svg>

                    {/* Starlight Pen Tip Sparkle that dances along the calligraphy */}
                    <div className="cursive-starlight-sparkle" />
                </div>

                {/* Subtitle with pulsing starlight */}
                <div className="cursive-subtitle">
                    <span className="cursive-sub-star">✦</span>
                    <span className="cursive-sub-text">AWAKENING QUEEN JIYU’S COSMOS</span>
                    <span className="cursive-sub-star">✦</span>
                </div>

                {/* Micro loading track */}
                <div className="cursive-progress-track">
                    <div className="cursive-progress-bar" style={{ animationDuration: `${durationMs}ms` }} />
                </div>
            </div>
        </div>
    );
};
