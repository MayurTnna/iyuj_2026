// ==========================================================================
// REALM 1 - THE FIRST RHYTHM (GARBA & DANDIYA MOTION)
// Circular counter-rotating particle rings and rhythmic golden light pulse
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const FirstRhythmScene: React.FC = () => {
    const ring1Ref = useRef<THREE.Points | null>(null);
    const ring2Ref = useRef<THREE.Points | null>(null);
    const lightRef = useRef<THREE.PointLight | null>(null);

    const coords = REALMS['first-rhythm'].coordinates;

    const [ring1Pos, ring2Pos] = useMemo(() => {
        const prng = createPseudoRandom(101);
        const count = 1200;
        const p1 = new Float32Array(count * 3);
        const p2 = new Float32Array(count * 3);

        const r1 = 55;
        const r2 = 85;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const variance = (prng() - 0.5) * 8;

            p1[i * 3] = Math.cos(angle) * (r1 + variance);
            p1[i * 3 + 1] = (prng() - 0.5) * 12;
            p1[i * 3 + 2] = Math.sin(angle) * (r1 + variance);

            p2[i * 3] = Math.cos(angle) * (r2 + variance);
            p2[i * 3 + 1] = (prng() - 0.5) * 16;
            p2[i * 3 + 2] = Math.sin(angle) * (r2 + variance);
        }

        return [p1, p2];
    }, []);

    useFrame((state, delta) => {
        if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.45;
        if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.30;

        if (lightRef.current) {
            // Rhythmic garba pulse
            lightRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 4.0) * 1.5;
        }
    });

    return (
        <group position={coords}>
            {/* Rhythmic Pulsing Core Light */}
            <pointLight ref={lightRef} color="#FFD700" distance={180} />

            {/* Central Garba Mandala Center */}
            <mesh>
                <sphereGeometry args={[7, 32, 32]} />
                <meshStandardMaterial
                    color="#F59E0B"
                    emissive="#B45309"
                    emissiveIntensity={1.2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Inner Counter-Clockwise Garba Ring */}
            <points ref={ring1Ref}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[ring1Pos, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={2.8}
                    color="#FEF08A"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Outer Clockwise Garba Ring */}
            <points ref={ring2Ref}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[ring2Pos, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={3.2}
                    color="#F59E0B"
                    transparent
                    opacity={0.75}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

