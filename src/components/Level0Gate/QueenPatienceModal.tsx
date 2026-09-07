import React, { useRef } from 'react';
import { Sparkles, Heart, MessageSquare } from 'lucide-react';
import './QueenPatienceModal.css';

interface QueenPatienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    timeRemaining: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    };
    onOpenWishlist: () => void;
    onDevUnlock?: () => void;
}

export const QueenPatienceModal: React.FC<QueenPatienceModalProps> = ({
    isOpen,
    onClose,
    timeRemaining,
    onOpenWishlist,
    onDevUnlock
}) => {
    const crownClicksRef = useRef(0);

    if (!isOpen) return null;

    const handleCrownClick = () => {
        crownClicksRef.current++;
        if (crownClicksRef.current >= 3 && onDevUnlock) {
            crownClicksRef.current = 0;
            onDevUnlock();
        }
    };

    return (
        <div
            className="patience-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="patience-modal-card">
                <button
                    className="patience-close-btn"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Animated Crown Icon Halo */}
                <div
                    className="patience-crown-halo"
                    onClick={handleCrownClick}
                    title="The Royal Sovereign Crown"
                    style={{ cursor: 'pointer' }}
                >
                    <svg
                        className="patience-crown-svg"
                        viewBox="0 0 100 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 65L20 25L40 45L50 15L60 45L80 25L90 65H10Z"
                            stroke="url(#patienceCrownGold)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="20" cy="21" r="3.5" fill="#FFD700" />
                        <circle cx="50" cy="11" r="4.5" fill="#FFF8DC" />
                        <circle cx="80" cy="21" r="3.5" fill="#FFD700" />
                        <path d="M15 72H85" stroke="url(#patienceCrownGold)" strokeWidth="2.5" />
                        <defs>
                            <linearGradient
                                id="patienceCrownGold"
                                x1="0"
                                y1="0"
                                x2="100"
                                y2="80"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="#D4AF37" />
                                <stop offset="50%" stopColor="#FFF8DC" />
                                <stop offset="100%" stopColor="#B38728" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="patience-badge">
                    <Sparkles size={12} color="#FFD700" />
                    <span>The Celestial Gate Notice</span>
                </div>

                <h2 className="patience-title">Patience, Queen Jiyu 👑</h2>

                {/* Live Real-time Countdown Banner */}
                <div className="patience-time-banner">
                    <p className="patience-time-label">Please Come Back In</p>
                    <div className="patience-time-digits">
                        <div className="patience-unit-box">
                            <span className="patience-unit-val">{timeRemaining.days}</span>
                            <span className="patience-unit-tag">Days</span>
                        </div>
                        <span className="patience-colon">:</span>
                        <div className="patience-unit-box">
                            <span className="patience-unit-val">{timeRemaining.hours}</span>
                            <span className="patience-unit-tag">Hours</span>
                        </div>
                        <span className="patience-colon">:</span>
                        <div className="patience-unit-box">
                            <span className="patience-unit-val">{timeRemaining.minutes}</span>
                            <span className="patience-unit-tag">Mins</span>
                        </div>
                        <span className="patience-colon">:</span>
                        <div className="patience-unit-box">
                            <span className="patience-unit-val">{timeRemaining.seconds}</span>
                            <span className="patience-unit-tag">Secs</span>
                        </div>
                    </div>
                </div>

                <p className="patience-message">
                    “Queen Jiyu, please come back after the time remaining to your royal birthday! The stars are quietly sculpting 10 secret realms, arranging constellations, and composing melodies exclusively in your honor. When the clock strikes zero on 23 September, the gates will unlock for your grand celebration! Until then, keep that radiant smile shining bright 😊❤️”
                </p>

                <div className="patience-actions">
                    <button
                        className="patience-btn-primary"
                        onClick={() => {
                            onClose();
                            onOpenWishlist();
                        }}
                    >
                        <MessageSquare size={14} />
                        <span>Write Birthday Wishes 👑</span>
                    </button>

                    <button
                        className="patience-btn-secondary"
                        onClick={onClose}
                    >
                        <Heart size={14} color="#FFD700" />
                        <span>I Promise To Smile 😊</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

