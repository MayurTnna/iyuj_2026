import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TARGET_DATE, TARGET_TITLE, QUEEN_NAME } from '../../config/gateConfig';
import { RoyalAudioEngine } from './RoyalAudioEngine';
import { RoyalUniverseCanvas, type RoyalUniverseHandle } from './RoyalUniverseCanvas';
import { CharacterWishlistModal } from './CharacterWishlistModal';
import { EasterEggModal } from './EasterEggModal';
import { JiyuConstellationConnectModal } from './JiyuConstellationConnectModal';
import { QueenPatienceModal } from './QueenPatienceModal';
import { BirthdayFireworks } from './BirthdayFireworks';
import { CelebrationSongBanner } from './CelebrationSongBanner';
import './Level0Gate.css';

interface Level0GateProps {
    onEnterUniverse?: () => void;
}

export const Level0Gate: React.FC<Level0GateProps> = ({ onEnterUniverse }) => {
    // Audio engine instance
    const [audioEngine] = useState(() => new RoyalAudioEngine());
    const universeRef = useRef<RoyalUniverseHandle | null>(null);

    // Loader state
    const [loaderProgress, setLoaderProgress] = useState(0);
    const [showEnterBtn, setShowEnterBtn] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);

    // Audio state
    const [audioPlaying, setAudioPlaying] = useState(false);

    // Modals state
    const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
    const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
    const [isConstellationModalOpen, setIsConstellationModalOpen] = useState(false);
    const [isPatienceModalOpen, setIsPatienceModalOpen] = useState(false);
    const [isTimerEnded, setIsTimerEnded] = useState(false);
    const [devUnlocked, setDevUnlocked] = useState(false);
    const [isTransitioningToUniverse, setIsTransitioningToUniverse] = useState(false);

    // Secret interactions
    const crownClicksRef = useRef(0);
    const typedKeysRef = useRef('');

    // Countdown state
    const [timeRemaining, setTimeRemaining] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });
    const [statusMessage, setStatusMessage] = useState(
        'The celestial gates are aligning for your grand celebration...'
    );

    // Track digit updates for CSS animation pulse
    const prevTimeRef = useRef({ days: '', hours: '', minutes: '', seconds: '' });
    const [digitUpdate, setDigitUpdate] = useState({
        days: false,
        hours: false,
        minutes: false,
        seconds: false
    });

    // Custom cursor state
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const timerArtifactRef = useRef<HTMLDivElement | null>(null);

    // 1. Initial Loader Progress
    useEffect(() => {
        const interval = setInterval(() => {
            setLoaderProgress((prev) => {
                const next = prev + Math.floor(Math.random() * 15) + 8;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setShowEnterBtn(true), 300);
                    return 100;
                }
                return next;
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    // 2. Launch Experience Handler
    const handleEnterRealm = () => {
        audioEngine.startAmbience();
        setAudioPlaying(true);
        setHasEntered(true);

        const tl = gsap.timeline({ delay: 0.6 });
        tl.to('#heroHeaderBox', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        })
            .to(
                '#timerArtifact',
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.4,
                    ease: 'back.out(1.2)'
                },
                '-=0.8'
            )
            .to(
                '#heroCtaWrapper',
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: 'power3.out'
                },
                '-=0.6'
            );
    };

    // 3. Audio Toggle
    const toggleAudio = () => {
        if (audioPlaying) {
            audioEngine.stopAmbience();
            setAudioPlaying(false);
        } else {
            audioEngine.startAmbience();
            setAudioPlaying(true);
        }
    };

    // 4. Open Character Modal with Hyperspeed Warp
    const handleOpenCharacterModal = useCallback(() => {
        gsap.to(['#heroHeaderBox', '#timerArtifact', '#heroCtaWrapper'], {
            opacity: 0,
            scale: 0.88,
            duration: 0.6,
            ease: 'power2.in'
        });

        audioEngine.playWarpSound();

        const reveal = () => {
            setIsCharacterModalOpen(true);
            audioEngine.playChime();
        };

        if (universeRef.current) {
            universeRef.current.triggerHyperspeedWarp(reveal);
        } else {
            setTimeout(reveal, 1500);
        }
    }, [audioEngine]);

    // 5. Close Character Modal
    const handleCloseCharacterModal = () => {
        setIsCharacterModalOpen(false);
        gsap.to(['#heroHeaderBox', '#timerArtifact', '#heroCtaWrapper'], {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out'
        });
    };

    // 6. Crown Emblem Click
    const handleCrownClick = () => {
        crownClicksRef.current++;
        audioEngine.playChime();
        if (crownClicksRef.current >= 3) {
            setDevUnlocked(true);
        }
        if (crownClicksRef.current >= 5) {
            crownClicksRef.current = 0;
            setIsEasterEggOpen(true);
        }
    };

    // 7. Keyboard easter egg listener ("JIYU")
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            typedKeysRef.current += e.key.toUpperCase();
            if (typedKeysRef.current.length > 10) {
                typedKeysRef.current = typedKeysRef.current.slice(-10);
            }
            if (typedKeysRef.current.includes('JIYU')) {
                typedKeysRef.current = '';
                setIsEasterEggOpen(true);
                audioEngine.playChime();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [audioEngine]);

    // 8. Countdown Timer Loop
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const target = new Date(TARGET_DATE).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setIsTimerEnded(true);
                audioEngine.stopAmbience();
                setAudioPlaying(false);
                setTimeRemaining({ days: '00', hours: '00', minutes: '00', seconds: '00' });
                setStatusMessage(`The moment has arrived! Queen Jiyu's constellation is aligned...`);
                // Smoothly fade out timer artifact box so fireworks celebration takes center stage
                gsap.to('#timerArtifact', {
                    opacity: 0,
                    scale: 0.88,
                    duration: 1.2,
                    ease: 'power2.inOut',
                    delay: 0.9,
                    onComplete: () => {
                        const el = document.getElementById('timerArtifact');
                        if (el) el.style.display = 'none';
                    }
                });
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            const daysStr = String(d).padStart(2, '0');
            const hoursStr = String(h).padStart(2, '0');
            const minutesStr = String(m).padStart(2, '0');
            const secondsStr = String(s).padStart(2, '0');

            const prev = prevTimeRef.current;
            const newUpdate = {
                days: prev.days !== daysStr,
                hours: prev.hours !== hoursStr,
                minutes: prev.minutes !== minutesStr,
                seconds: prev.seconds !== secondsStr
            };

            if (prev.seconds !== secondsStr && prev.seconds !== '') {
                audioEngine.playSecondTickle();
            }

            prevTimeRef.current = {
                days: daysStr,
                hours: hoursStr,
                minutes: minutesStr,
                seconds: secondsStr
            };

            setDigitUpdate(newUpdate);
            setTimeRemaining({
                days: daysStr,
                hours: hoursStr,
                minutes: minutesStr,
                seconds: secondsStr
            });

            // Status message
            if (d > 30) {
                setStatusMessage(`The royal universe aligns... preparing for ${QUEEN_NAME}'s grand birthday.`);
            } else if (d > 7) {
                setStatusMessage(`The celestial gates glow brighter as ${QUEEN_NAME}'s birthday draws near.`);
            } else if (d > 1) {
                setStatusMessage('The final days approach... royalty and magic fill the air.');
            } else {
                setStatusMessage("The final hours are ticking... The Queen's story is about to begin.");
            }
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [audioEngine, handleOpenCharacterModal]);

    // 9. Custom Cursor & 3D Tilt
    useEffect(() => {
        const cursor = cursorRef.current;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (cursor) {
                currentX += (e.clientX - currentX) * 0.4;
                currentY += (e.clientY - currentY) * 0.4;
                cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }

            const timerArtifact = timerArtifactRef.current;
            if (timerArtifact && !isCharacterModalOpen) {
                const rect = timerArtifact.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateX = (-y / rect.height) * 8;
                const rotateY = (x / rect.width) * 8;
                timerArtifact.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            }
        };

        const timerArtifact = timerArtifactRef.current;
        const handleMouseLeave = () => {
            if (timerArtifact) {
                timerArtifact.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        if (timerArtifact) {
            timerArtifact.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (timerArtifact) {
                timerArtifact.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [isCharacterModalOpen]);

    // 10. Clean up audio on unmount
    useEffect(() => {
        return () => {
            audioEngine.destroy();
        };
    }, [audioEngine]);

    const handleCloseConstellationModal = () => {
        setIsConstellationModalOpen(false);
        setIsTransitioningToUniverse(false);
        gsap.to(['#heroHeaderBox', '#timerArtifact', '#heroCtaWrapper'], {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out'
        });
    };

    const handleEnterUniverseClick = () => {
        if (isTimerEnded || devUnlocked) {
            // 1. Immediately fade out celebration song (A Sky Full of Stars)
            setIsTransitioningToUniverse(true);

            // 2. Play cinematic universe formation sound (sub-bass swell, harmonic rise, stardust swoosh)
            audioEngine.playWarpSound();

            gsap.to(['#heroHeaderBox', '#timerArtifact', '#heroCtaWrapper'], {
                opacity: 0,
                scale: 0.88,
                duration: 0.6,
                ease: 'power2.in'
            });

            const reveal = () => {
                setIsConstellationModalOpen(true);
                audioEngine.playChime();
            };

            if (universeRef.current) {
                universeRef.current.triggerHyperspeedWarp(reveal);
            } else {
                setTimeout(reveal, 1400);
            }
        } else {
            audioEngine.playChime();
            setIsPatienceModalOpen(true);
        }
    };

    return (
        <>
            {/* Fullscreen Loading Overlay */}
            <div id="loader" className={`loader-overlay ${hasEntered ? 'fade-out' : ''}`}>
                <div className="loader-content">
                    <div className="royal-emblem-loader">
                        <svg
                            className="loader-crown-svg"
                            viewBox="0 0 100 80"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 65L20 25L40 45L50 15L60 45L80 25L90 65H10Z"
                                stroke="url(#loaderGold)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="20" cy="21" r="3.5" fill="#F3E5AB" />
                            <circle cx="50" cy="11" r="4.5" fill="#FFD700" />
                            <circle cx="80" cy="21" r="3.5" fill="#F3E5AB" />
                            <path
                                d="M15 72H85"
                                stroke="url(#loaderGold)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient
                                    id="loaderGold"
                                    x1="0"
                                    y1="0"
                                    x2="100"
                                    y2="80"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0%" stopColor="#996515" />
                                    <stop offset="50%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#D4AF37" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <p className="loader-subtitle">Sculpting Queen Jiyu's Universe</p>
                    <div className="loader-bar-container">
                        <div
                            className="loader-bar-fill"
                            id="loaderFill"
                            style={{ width: `${loaderProgress}%` }}
                        />
                    </div>
                    <button
                        id="enterRealmBtn"
                        className={`enter-realm-btn ${showEnterBtn ? '' : 'hidden'}`}
                        onClick={handleEnterRealm}
                    >
                        <span className="enter-btn-shine" />
                        <span className="enter-btn-text">Enter Queen Jiyu's Realm</span>
                        <Sparkles className="btn-sparkle-icon" />
                    </button>
                </div>
            </div>

            {/* WebGL Canvas for 3D Sky & Stardust Universe */}
            <RoyalUniverseCanvas ref={universeRef} />

            {/* Custom Cursor Ring */}
            <div id="custom-cursor" className="custom-cursor" ref={cursorRef}>
                <div className="cursor-dot" />
                <div className="cursor-ring" />
            </div>

            {/* Top Royal Navigation & Sound Control */}
            <header className="top-nav">
                <div
                    className="royal-header-brand"
                    id="crownEmblemTrigger"
                    title="Click to pay homage to the Queen"
                    onClick={handleCrownClick}
                >
                    <svg
                        className="header-crown-icon"
                        viewBox="0 0 100 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 65L20 25L40 45L50 15L60 45L80 25L90 65H10Z"
                            stroke="url(#headerGold)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="20" cy="21" r="3" fill="#FFD700" />
                        <circle cx="50" cy="11" r="4" fill="#FFF8DC" />
                        <circle cx="80" cy="21" r="3" fill="#FFD700" />
                        <path d="M15 72H85" stroke="url(#headerGold)" strokeWidth="2" />
                        <defs>
                            <linearGradient
                                id="headerGold"
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
                    <span className="header-title">Queen Jiyu</span>
                </div>

                <div className="audio-control-wrapper" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <button
                        id="audioToggleBtn"
                        className={`audio-toggle-btn ${audioPlaying ? 'playing' : ''}`}
                        aria-label="Toggle Background Music"
                        onClick={toggleAudio}
                    >
                        <div className="audio-waves-icon">
                            <span className="wave-bar bar-1" />
                            <span className="wave-bar bar-2" />
                            <span className="wave-bar bar-3" />
                            <span className="wave-bar bar-4" />
                        </div>
                        <span id="audioStatusText" className="audio-status-label">
                            {audioPlaying ? 'Ambience On' : 'Ambience Off'}
                        </span>
                    </button>
                </div>
            </header>

            {/* Birthday Fireworks Celebration upon Timer Completion */}
            {isTimerEnded && <BirthdayFireworks />}

            {/* Main Container */}
            <main className="main-wrapper">
                <section className="hero-gatekeeper" id="heroGatekeeperSection">
                    {/* Heart-Touching Hero Header */}
                    <div className="hero-header-box" id="heroHeaderBox">
                        {isTimerEnded ? (
                            <div className="birthday-celebration-hero">
                                <div className="celebration-crown-icon">👑</div>
                                <h1 className="royal-hero-title celebration-title">
                                    Queen Jiyu's Birthday Has Begun!
                                </h1>
                                <p className="royal-hero-subtitle celebration-subtitle">
                                    ✨ The Celestial Universe Has Awakened In Your Honor ✨
                                </p>
                                <CelebrationSongBanner fadeOut={isTransitioningToUniverse} />
                            </div>
                        ) : (
                            <>
                                <div className="monogram-badge">
                                    <span className="monogram-icon">👑</span>
                                    <span className="monogram-text">The Royal Prelude</span>
                                </div>
                                <h1 className="royal-hero-title">Until The Universe Celebrates You</h1>
                                <p className="royal-hero-subtitle">
                                    Every second that ticks is a star falling in your honor, counting down to Queen Jiyu's special day.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Sacred Royal Artifact Countdown Timer Container */}
                    <div className="timer-artifact-wrapper" id="timerArtifact" ref={timerArtifactRef}>
                        {/* Dual Golden Filigree Borders & Sheen Overlay */}
                        <div className="artifact-border-outer" />
                        <div className="artifact-border-inner" />
                        <div className="artifact-sheen" />

                        {/* Timer Top Banner */}
                        <div className="artifact-header">
                            <span className="crest-star">✨</span>
                            <h2 className="artifact-target-title" id="targetTitleDisplay">
                                Countdown To {TARGET_TITLE}
                            </h2>
                            <span className="crest-star">✨</span>
                        </div>

                        {/* Main Countdown Grid */}
                        <div className="countdown-grid">
                            {/* Days */}
                            <div className="time-card" id="card-days">
                                <div className="card-glass-body">
                                    <span
                                        className={`time-value ${digitUpdate.days ? 'value-update' : ''}`}
                                        id="daysValue"
                                    >
                                        {timeRemaining.days}
                                    </span>
                                </div>
                                <span className="time-label">Days</span>
                            </div>

                            <div className="time-colon">:</div>

                            {/* Hours */}
                            <div className="time-card" id="card-hours">
                                <div className="card-glass-body">
                                    <span
                                        className={`time-value ${digitUpdate.hours ? 'value-update' : ''}`}
                                        id="hoursValue"
                                    >
                                        {timeRemaining.hours}
                                    </span>
                                </div>
                                <span className="time-label">Hours</span>
                            </div>

                            <div className="time-colon">:</div>

                            {/* Minutes */}
                            <div className="time-card" id="card-minutes">
                                <div className="card-glass-body">
                                    <span
                                        className={`time-value ${digitUpdate.minutes ? 'value-update' : ''}`}
                                        id="minutesValue"
                                    >
                                        {timeRemaining.minutes}
                                    </span>
                                </div>
                                <span className="time-label">Minutes</span>
                            </div>

                            <div className="time-colon">:</div>

                            {/* Seconds */}
                            <div className="time-card" id="card-seconds">
                                <div className="card-glass-body">
                                    <span
                                        className={`time-value ${digitUpdate.seconds ? 'value-update' : ''}`}
                                        id="secondsValue"
                                    >
                                        {timeRemaining.seconds}
                                    </span>
                                </div>
                                <span className="time-label">Seconds</span>
                            </div>
                        </div>

                        {/* Status Subtext Ticker */}
                        <div className="artifact-footer">
                            <div className="status-indicator">
                                <span className="status-dot" />
                                <span className="status-text" id="statusMessage">
                                    {statusMessage}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button Section: Only enterUniverseBtn is the entry point into the Universe */}
                    <div className="hero-cta-wrapper" id="heroCtaWrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button
                            id="enterUniverseBtn"
                            className={`royal-cta-btn ${isTimerEnded || devUnlocked ? 'unlocked' : ''}`}
                            onClick={handleEnterUniverseClick}
                        >
                            <span className="cta-glow-bg" />
                            <span className="cta-border-glow" />
                            <span className="cta-content">
                                <Sparkles className="cta-icon" />
                                <span className="cta-text" id="ctaText">
                                    {isTimerEnded || devUnlocked
                                        ? 'Align JIYU Stars & Enter The Universe 🌌'
                                        : 'Enter Queen Jiyu\'s Universe 🌌'}
                                </span>
                                <ArrowRight className="cta-arrow" />
                            </span>
                        </button>

                        <button
                            id="wishlistTriggerBtn"
                            className="royal-cta-btn secondary-cta-btn"
                            style={{
                                marginTop: '0.85rem',
                                background: 'rgba(10, 17, 40, 0.65)',
                                border: '1px solid rgba(212, 175, 55, 0.35)',
                                padding: '0.65rem 1.4rem',
                                borderRadius: '30px',
                                color: '#F3E5AB',
                                fontFamily: 'Cinzel, serif',
                                fontSize: '0.78rem',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backdropFilter: 'blur(12px)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={handleOpenCharacterModal}
                        >
                            <span>👑</span>
                            <span>Write Birthday Wishes To Queen Jiyu</span>
                        </button>

                        <p className="cta-footnote">
                            {isTimerEnded || devUnlocked
                                ? 'The royal countdown has completed • Connect Queen Jiyu’s constellation'
                                : 'Countdown active • The universe unlocks when the clock strikes zero on 23 September'}
                        </p>
                    </div>
                </section>
            </main>

            {/* Universe Character Arrival & Wishlist Modal */}
            <CharacterWishlistModal
                isOpen={isCharacterModalOpen}
                onClose={handleCloseCharacterModal}
                audioEngine={audioEngine}
                onEnterUniverse={onEnterUniverse}
                onOpenConstellation={() => {
                    setIsTransitioningToUniverse(true);
                    audioEngine.playWarpSound();
                    setIsConstellationModalOpen(true);
                }}
                isTimerEnded={isTimerEnded}
                devUnlocked={devUnlocked}
                timeRemaining={timeRemaining}
                onTriggerPatience={() => setIsPatienceModalOpen(true)}
            />

            {/* Queen Jiyu Patience Modal (If clicked before timer ends) */}
            <QueenPatienceModal
                isOpen={isPatienceModalOpen}
                onClose={() => setIsPatienceModalOpen(false)}
                timeRemaining={timeRemaining}
                onOpenWishlist={() => {
                    setIsPatienceModalOpen(false);
                    handleOpenCharacterModal();
                }}
                onDevUnlock={() => {
                    setDevUnlocked(true);
                    audioEngine.playChime();
                    setIsPatienceModalOpen(false);
                    setIsConstellationModalOpen(true);
                }}
            />

            {/* Interactive JIYU Constellation Connection Mini-Game */}
            <JiyuConstellationConnectModal
                isOpen={isConstellationModalOpen}
                onClose={handleCloseConstellationModal}
                onSuccess={() => {
                    setIsConstellationModalOpen(false);
                    audioEngine.stopAmbience();
                    if (onEnterUniverse) {
                        onEnterUniverse();
                    }
                }}
            />

            {/* Royal Easter Egg Secret Modal */}
            <EasterEggModal
                isOpen={isEasterEggOpen}
                onClose={() => setIsEasterEggOpen(false)}
            />
        </>
    );
};
