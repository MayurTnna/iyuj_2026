import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Music, Volume2, VolumeX } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';
import './CelebrationSongBanner.css';

interface LyricVerse {
    line: string;
    sub: string;
}

const LYRICS_DATA: LyricVerse[] = [
    {
        line: "“'Cause you're a sky, 'cause you're a sky full of stars...”",
        sub: "I'm gonna give you my heart ✨"
    },
    {
        line: "“'Cause you're a sky, 'cause you're a sky full of stars...”",
        sub: "'Cause you light up the darkest night 🌌"
    },
    {
        line: "“I don't care, go on and tear me apart... I don't care if you do...”",
        sub: "'Cause in a sky full of stars, I think I saw you 💫"
    },
    {
        line: "“'Cause you're a sky, you're a sky full of stars...”",
        sub: "Such a heavenly view... Happy Birthday Queen Jiyu! 👑"
    }
];

interface CelebrationSongBannerProps {
    fadeOut?: boolean;
}

export const CelebrationSongBanner: React.FC<CelebrationSongBannerProps> = ({ fadeOut = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Fade out audio immediately when transition to universe begins
    useEffect(() => {
        if (!fadeOut) return;
        const audio = audioRef.current;
        if (!audio) return;

        let currentVol = audio.volume;
        const fadeInterval = window.setInterval(() => {
            currentVol = Math.max(0, currentVol - 0.08);
            if (audioRef.current) {
                audioRef.current.volume = currentVol;
            }
            if (currentVol <= 0) {
                clearInterval(fadeInterval);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
                setIsPlaying(false);
            }
        }, 50);

        return () => clearInterval(fadeInterval);
    }, [fadeOut]);

    // Audio setup and auto fade-in
    useEffect(() => {
        if (fadeOut) return;
        const audio = new Audio(getAssetUrl('/audio/sky-full-of-stars.m4a'));
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;

        let fadeInterval: number | null = null;

        const startPlayback = () => {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    let vol = 0;
                    if (fadeInterval) clearInterval(fadeInterval);
                    fadeInterval = window.setInterval(() => {
                        vol = Math.min(0.70, vol + 0.05);
                        if (audioRef.current && !isMuted) {
                            audioRef.current.volume = vol;
                        }
                        if (vol >= 0.70 && fadeInterval) {
                            clearInterval(fadeInterval);
                        }
                    }, 100);
                })
                .catch((err) => {
                    console.log('Celebration audio autoplay deferred until user gesture:', err);
                    setIsPlaying(false);
                });
        };

        startPlayback();

        const handleUserGesture = () => {
            if (audioRef.current && audioRef.current.paused) {
                startPlayback();
            }
        };

        window.addEventListener('click', handleUserGesture, { once: true });
        window.addEventListener('touchstart', handleUserGesture, { once: true });
        window.addEventListener('keydown', handleUserGesture, { once: true });

        return () => {
            if (fadeInterval) clearInterval(fadeInterval);
            window.removeEventListener('click', handleUserGesture);
            window.removeEventListener('touchstart', handleUserGesture);
            window.removeEventListener('keydown', handleUserGesture);
            audio.pause();
            audio.currentTime = 0;
            audioRef.current = null;
        };
    }, []);

    // Rotate lyrics every 4.8s
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % LYRICS_DATA.length);
        }, 4800);
        return () => clearInterval(timer);
    }, []);

    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
                audio.volume = 0.70;
            }).catch(() => {});
        } else {
            if (!isMuted) {
                audio.muted = true;
                setIsMuted(true);
            } else {
                audio.muted = false;
                setIsMuted(false);
                audio.volume = 0.70;
            }
        }
    };

    const currentVerse = LYRICS_DATA[currentIndex];

    return (
        <div className={`celebration-song-banner ${fadeOut ? 'fading-out' : ''}`}>
            <div className="song-banner-halo" />

            {/* Top metadata bar */}
            <div className="song-banner-header">
                <div className="song-track-info">
                    <span className="celebration-music-icon-pulse">
                        <Music className="icon-music" />
                    </span>
                    <div className="song-title-group">
                        <span className="song-track-badge">CELEBRATION ANTHEM</span>
                        <span className="song-track-name">Coldplay — A Sky Full of Stars</span>
                    </div>
                </div>

                {/* Animated sound wave bars & mute button */}
                <button
                    className={`celebration-audio-btn ${isPlaying && !isMuted ? 'active' : 'muted'}`}
                    onClick={toggleAudio}
                    title={isMuted ? "Unmute anthem" : "Mute anthem"}
                    aria-label="Toggle celebration anthem"
                >
                    <div className="audio-equalizer-bars">
                        <span className="eq-bar bar-1" />
                        <span className="eq-bar bar-2" />
                        <span className="eq-bar bar-3" />
                        <span className="eq-bar bar-4" />
                    </div>
                    {isMuted ? <VolumeX className="eq-vol-icon" /> : <Volume2 className="eq-vol-icon" />}
                    <span className="eq-label">{isMuted ? 'Muted' : 'Playing'}</span>
                </button>
            </div>

            {/* Lyrical Showcase with smooth keyframe transition */}
            <div className="celebration-lyric-stage" key={currentIndex}>
                <p className="celebration-lyric-main">
                    <Sparkles className="lyric-sparkle-icon" />
                    <span>{currentVerse.line}</span>
                    <Sparkles className="lyric-sparkle-icon" />
                </p>
                <p className="celebration-lyric-sub">{currentVerse.sub}</p>
            </div>

            {/* Dot Navigation */}
            <div className="celebration-dots-indicator">
                {LYRICS_DATA.map((_, idx) => (
                    <button
                        key={idx}
                        className={`celebration-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                        }}
                        aria-label={`Go to lyric line ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

