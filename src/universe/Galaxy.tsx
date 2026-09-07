// ==========================================================================
// QUEEN JIYU'S UNIVERSE - GLSL SPIRAL GALAXY
// 10,000 Shader-driven particles forming the grand celestial spiral galaxy
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GalaxyShader } from '../shaders/galaxyShader';
import { useUniverseStore } from '../store/universeStore';
import { createPseudoRandom } from '../utils/pseudoRandom';

export const Galaxy: React.FC = () => {
    const pointsRef = useRef<THREE.Points | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const qualityTier = useUniverseStore((s) => s.qualityTier);

    const count = useMemo(() => {
        switch (qualityTier) {
            case 'ultra':
                return 15000;
            case 'high':
                return 10000;
            case 'medium':
                return 5000;
            case 'low':
                return 2500;
        }
    }, [qualityTier]);

    const [positions, scales, randomness] = useMemo(() => {
        const prng = createPseudoRandom(999);
        const pos = new Float32Array(count * 3);
        const sca = new Float32Array(count);
        const rand = new Float32Array(count * 3);

        const branches = 3;
        const radius = 550;
        const spin = 1.2;

        for (let i = 0; i < count; i++) {
            // Logarithmic spiral position
            const r = prng() * radius;
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;
            const spinAngle = r * spin * 0.005;

            const randomX = Math.pow(prng(), 3) * (prng() < 0.5 ? 1 : -1) * 0.3 * (r + 10);
            const randomY = Math.pow(prng(), 3) * (prng() < 0.5 ? 1 : -1) * 0.2 * (r + 10);
            const randomZ = Math.pow(prng(), 3) * (prng() < 0.5 ? 1 : -1) * 0.3 * (r + 10);

            pos[i * 3] = Math.cos(branchAngle + spinAngle) * r;
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r;

            rand[i * 3] = randomX;
            rand[i * 3 + 1] = randomY;
            rand[i * 3 + 2] = randomZ;

            sca[i] = prng() * 1.5 + 0.5;
        }

        return [pos, sca, rand];
    }, [count]);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uSize: { value: 3.8 }
        }),
        []
    );

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
    });

    return (
        <points ref={pointsRef} position={[0, -40, -450]} rotation={[0.4, 0, -0.15]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aScale"
                    args={[scales, 1]}
                />
                <bufferAttribute
                    attach="attributes-aRandomness"
                    args={[randomness, 3]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={GalaxyShader.vertexShader}
                fragmentShader={GalaxyShader.fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

