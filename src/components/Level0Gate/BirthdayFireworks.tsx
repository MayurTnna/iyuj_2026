import React, { useEffect, useRef } from 'react';
import './BirthdayFireworks.css';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    size: number;
    decay: number;
}

interface Rocket {
    x: number;
    y: number;
    targetY: number;
    vy: number;
    color: string;
}

const PALETTE = ['#FFD700', '#FFF8DC', '#F43F5E', '#38BDF8', '#A855F7', '#34D399', '#FB923C'];

export const BirthdayFireworks: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const rockets: Rocket[] = [];
        const particles: Particle[] = [];

        const launchRocket = () => {
            const x = Math.random() * width * 0.8 + width * 0.1;
            const targetY = Math.random() * height * 0.4 + height * 0.1;
            const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            rockets.push({
                x,
                y: height,
                targetY,
                vy: -(Math.random() * 4 + 11),
                color
            });
        };

        const explode = (x: number, y: number, color: string) => {
            const count = 45 + Math.floor(Math.random() * 35);
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 1.5;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color,
                    size: Math.random() * 3 + 1.5,
                    decay: Math.random() * 0.015 + 0.012
                });
            }
        };

        // Launch initial burst
        launchRocket();
        launchRocket();

        let lastLaunch = 0;

        const loop = (timestamp: number) => {
            if (timestamp - lastLaunch > 550) {
                launchRocket();
                lastLaunch = timestamp;
            }

            ctx.clearRect(0, 0, width, height);

            // Update & draw rockets
            for (let i = rockets.length - 1; i >= 0; i--) {
                const r = rockets[i];
                r.y += r.vy;

                ctx.save();
                ctx.fillStyle = r.color;
                ctx.shadowColor = r.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                if (r.y <= r.targetY) {
                    explode(r.x, r.y, r.color);
                    rockets.splice(i, 1);
                }
            }

            // Update & draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.06; // gravity
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="fireworks-container">
            <canvas ref={canvasRef} className="fireworks-canvas" />
            <div className="birthday-announcement-banner">
                <div className="announcement-crown">👑</div>
                <h1 className="announcement-main-title">
                    Queen Jiyu's Birthday Has Begun!
                </h1>
                <p className="announcement-subtitle">
                    ✨ The Celestial Universe Has Awakened In Your Honor ✨
                </p>
            </div>
        </div>
    );
};
