import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import indianBoyImg from '../../assets/images/indian_boy.png';
import { WHATSAPP_NUMBER } from '../../config/gateConfig';
import { RoyalAudioEngine } from './RoyalAudioEngine';

interface CharacterWishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    audioEngine: RoyalAudioEngine;
    onEnterUniverse?: () => void;
    onOpenConstellation?: () => void;
    isTimerEnded: boolean;
    devUnlocked: boolean;
    timeRemaining: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    };
    onTriggerPatience?: () => void;
}

const DEFAULT_SPEECH = `"My Queen... Till our royal day arrives, keep smiling! 😊 Write down whatever your heart desires for your birthday and send it straight to me!"`;

export const CharacterWishlistModal: React.FC<CharacterWishlistModalProps> = ({
    isOpen,
    onClose,
    audioEngine,
    onEnterUniverse,
    onOpenConstellation,
    isTimerEnded,
    devUnlocked,
    timeRemaining,
    onTriggerPatience
}) => {
    const [wishText, setWishText] = useState('');
    const [speechText, setSpeechText] = useState('');
    const [isAlertGlow, setIsAlertGlow] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const typingTimerRef = useRef<number | null>(null);
    const avatarClicksRef = useRef(0);

    useEffect(() => {
        if (!isOpen) {
            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
            }
            return;
        }

        let i = 0;
        typingTimerRef.current = window.setInterval(() => {
            if (i < DEFAULT_SPEECH.length) {
                setSpeechText(DEFAULT_SPEECH.slice(0, i + 1));
                i++;
                if (['.', '!', '?', ','].includes(DEFAULT_SPEECH.charAt(i - 1)) || i % 8 === 0) {
                    audioEngine.playChime();
                }
            } else {
                if (typingTimerRef.current) {
                    clearInterval(typingTimerRef.current);
                }
            }
        }, 55);

        return () => {
            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
            }
        };
    }, [isOpen, audioEngine]);

    const handleClose = () => {
        if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
        }
        setSpeechText('');
        setIsAlertGlow(false);
        onClose();
    };

    const handleSendWhatsapp = () => {
        const trimmed = wishText.trim();
        if (!trimmed) {
            audioEngine.playChime();
            const alertMsg = `"Please write your royal wishes before sending, my Queen! 👑 What does your heart desire?"`;
            
            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
            }
            setSpeechText('');
            let idx = 0;
            typingTimerRef.current = window.setInterval(() => {
                if (idx < alertMsg.length) {
                    setSpeechText(alertMsg.slice(0, idx + 1));
                    idx++;
                } else {
                    if (typingTimerRef.current) {
                        clearInterval(typingTimerRef.current);
                    }
                }
            }, 35);

            setIsAlertGlow(false);
            setTimeout(() => {
                setIsAlertGlow(true);
                textareaRef.current?.focus();
            }, 10);
            return;
        }

        const message = `Hey! Queen Jiyu here 👑\n\n` +
            `Here is what I wish for my Royal Day:\n` +
            `"${trimmed}"\n\n` +
            `Till then, I am smiling! 😊❤️`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        try {
            navigator.clipboard.writeText(message);
        } catch {
            // Ignore clipboard errors if restricted
        }
    };

    const handleAvatarClick = () => {
        avatarClicksRef.current++;
        audioEngine.playChime();
        if (avatarClicksRef.current >= 3) {
            avatarClicksRef.current = 0;
            if (onOpenConstellation) {
                handleClose();
                onOpenConstellation();
            } else if (onEnterUniverse) {
                audioEngine.stopAmbience();
                onEnterUniverse();
            }
        }
    };

    const handleEnterUniverseClickInModal = () => {
        if (isTimerEnded || devUnlocked) {
            if (onOpenConstellation) {
                handleClose();
                onOpenConstellation();
            } else if (onEnterUniverse) {
                audioEngine.stopAmbience();
                onEnterUniverse();
            }
        } else {
            audioEngine.playChime();
            const patienceMsg = `"Patience, Queen Jiyu 👑! Please come back after ${timeRemaining.days} days, ${timeRemaining.hours} hours, and ${timeRemaining.minutes} minutes to your royal birthday! The stars are preparing something unforgettable for you. Till then, keep smiling! 😊❤️"`;

            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
            }
            setSpeechText('');
            let idx = 0;
            typingTimerRef.current = window.setInterval(() => {
                if (idx < patienceMsg.length) {
                    setSpeechText(patienceMsg.slice(0, idx + 1));
                    idx++;
                    if (idx % 6 === 0) audioEngine.playChime();
                } else {
                    if (typingTimerRef.current) {
                        clearInterval(typingTimerRef.current);
                    }
                }
            }, 30);

            if (onTriggerPatience) {
                setTimeout(() => {
                    onTriggerPatience();
                }, 1200);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div id="characterModal" className="character-modal-overlay">
            <div className="character-arrival-container">
                {/* Animated Speaking Passport Portrait */}
                <div
                    className="royal-character-avatar speaking-active"
                    id="royalAvatar"
                    onClick={handleAvatarClick}
                    title="The Royal Emissary"
                    style={{ cursor: 'pointer' }}
                >
                    <div className="avatar-halo"></div>
                    <div className="voice-wave-ring"></div>
                    <img
                        src={indianBoyImg}
                        alt="Handsome Indian Prince Character"
                        className="avatar-img"
                    />
                </div>

                {/* Animated Typewriter Speech Bubble */}
                <div className="character-speech-bubble" id="speechBubble">
                    <div className="speaking-indicator">
                        <span className="speak-dot dot-1"></span>
                        <span className="speak-dot dot-2"></span>
                        <span className="speak-dot dot-3"></span>
                    </div>
                    <p id="speechText">{speechText}</p>
                </div>

                {/* Open Royal Wish Box */}
                <div className="wishlist-card">
                    <div className="wishlist-header">
                        <h3 className="wishlist-title">Write Your Royal Birthday Wishes 👑</h3>
                        <p className="wishlist-subtitle">Write whatever you wish for... it will be sent straight to me!</p>
                    </div>

                    <div className="custom-wish-box">
                        <textarea
                            ref={textareaRef}
                            id="royalWishTextarea"
                            rows={4}
                            placeholder="E.g. Totebag, Chaniya choli, chocolates & roses are mandatory... or anything your heart desires 💕"
                            className={`custom-wish-textarea ${isAlertGlow ? 'textarea-alert-glow' : ''}`}
                            value={wishText}
                            onChange={(e) => setWishText(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="wishlist-actions">
                        {(onOpenConstellation || onEnterUniverse) && (
                            <button
                                id="enterUniverseBtn"
                                className="share-wishlist-btn"
                                style={{
                                    background: isTimerEnded || devUnlocked
                                        ? 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)'
                                        : 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #D4AF37 100%)',
                                    color: isTimerEnded || devUnlocked ? '#020408' : '#FFF',
                                    fontWeight: isTimerEnded || devUnlocked ? 800 : 600,
                                    marginBottom: '0.2rem'
                                }}
                                onClick={handleEnterUniverseClickInModal}
                            >
                                <Sparkles className="btn-icon" />
                                <span>
                                    {isTimerEnded || devUnlocked
                                        ? 'Align JIYU Stars & Enter The Universe 🌌'
                                        : 'Enter Queen Jiyu\'s Universe 🌌'}
                                </span>
                            </button>
                        )}
                        <button
                            id="sendWishlistWhatsappBtn"
                            className="share-wishlist-btn"
                            onClick={handleSendWhatsapp}
                        >
                            <Send className="btn-icon" />
                            <span>Send Wishes Directly To Me 💬</span>
                        </button>
                        <button
                            id="closeCharacterModalBtn"
                            className="close-modal-secondary"
                            onClick={handleClose}
                        >
                            Return To Realm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

