// ==========================================================================
// QUEEN JIYU'S UNIVERSE - STARFIELD
// 10,000 Instanced twinkling stars with adaptive density based on quality tier
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../store/universeStore';
import { createPseudoRandom } from '../utils/pseudoRandom';

export const StarField: React.FC = () => {
    const pointsRef = useRef<THREE.Points | null>(null);
    const qualityTier = useUniverseStore((s) => s.qualityTier);

    const starCount = useMemo(() => {
        switch (qualityTier) {
            case 'ultra':
                return 12000;
            case 'high':
                return 8000;
            case 'medium':
                return 4500;
            case 'low':
                return 2000;
        }
    }, [qualityTier]);

    const [positions, colors, scales] = useMemo(() => {
        const prng = createPseudoRandom(42);
        const pos = new Float32Array(starCount * 3);
        const col = new Float32Array(starCount * 3);
        const sca = new Float32Array(starCount);

        const palette = [
            new THREE.Color('#FFFFFF'), // Pure Diamond White
            new THREE.Color('#FFF8DC'), // Cornsilk Warm
            new THREE.Color('#F3E5AB'), // Champagne Gold
            new THREE.Color('#93C5FD'), // Moonlight Cyan
            new THREE.Color('#C4B5FD')  // Soft Lavender
        ];

        for (let i = 0; i < starCount; i++) {
            // Spherical distribution around universe center
            const radius = 250 + prng() * 1200;
            const theta = prng() * Math.PI * 2;
            const phi = Math.acos(prng() * 2 - 1);

            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);

            const pickedColor = palette[Math.floor(prng() * palette.length)];
            col[i * 3] = pickedColor.r;
            col[i * 3 + 1] = pickedColor.g;
            col[i * 3 + 2] = pickedColor.b;

            sca[i] = prng() * 2.5 + 0.8;
        }

        return [pos, col, sca];
    }, [starCount]);

    const starTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.25, 'rgba(255, 248, 220, 0.85)');
            grad.addColorStop(0.6, 'rgba(212, 175, 55, 0.35)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 32, 32);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.008;
            pointsRef.current.rotation.x += delta * 0.002;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-aScale"
                    args={[scales, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={3.2}
                vertexColors
                map={starTexture}
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

