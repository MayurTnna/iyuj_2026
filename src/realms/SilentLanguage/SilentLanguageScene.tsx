// ==========================================================================
// REALM 5 - THE SILENT LANGUAGE (SOUL ENERGIES & SIGNED DIALECT)
// When words could not be spoken aloud, their inner energies and signed
// hand gestures communicated soul-to-soul across the silence.
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const SilentLanguageScene: React.FC = () => {
    const energyHelixRef = useRef<THREE.Points | null>(null);
    const leftHeartRef = useRef<THREE.Mesh | null>(null);
    const rightHeartRef = useRef<THREE.Mesh | null>(null);
    const coords = REALMS['silent-language'].coordinates;

    const particleCount = 220;

    // Generate double-helix energy ribbon particles
    const [particlePositions, particlePhases] = useMemo(() => {
        const prng = createPseudoRandom(777);
        const pos = new Float32Array(particleCount * 3);
        const phases = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            phases[i] = t * Math.PI * 6; // 3 full helical twists
            const x = -30 + t * 60;
            const helixRadius = 3.5;
            const strand = i % 2 === 0 ? 1 : -1;
            const y = 8 + Math.sin(phases[i]) * helixRadius * strand;
            const z = Math.cos(phases[i]) * helixRadius * strand + (prng() - 0.5) * 2;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }

        return [pos, phases];
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Animate flowing energy particles between the two soul silhouettes
        if (energyHelixRef.current) {
            const arr = energyHelixRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                const strand = i % 2 === 0 ? 1 : -1;
                particlePhases[i] += delta * 1.8;
                const progress = (Math.sin(particlePhases[i] * 0.2 + i * 0.05) + 1) / 2;
                arr[i * 3] = -30 + progress * 60;
                arr[i * 3 + 1] = 8 + Math.sin(particlePhases[i]) * 4.0 * strand + Math.sin(time * 2 + i) * 0.5;
                arr[i * 3 + 2] = Math.cos(particlePhases[i]) * 4.0 * strand;
            }
            energyHelixRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Synchronized heartbeat pulse of inner energy chakras
        const pulse = 1.0 + Math.sin(time * 3.0) * 0.22;
        if (leftHeartRef.current) {
            leftHeartRef.current.scale.set(pulse, pulse, pulse);
        }
        if (rightHeartRef.current) {
            rightHeartRef.current.scale.set(pulse, pulse, pulse);
        }
    });

    return (
        <group position={coords}>
            {/* Ambient Soul Glow - Midnight Violet & Ethereal Gold */}
            <pointLight position={[0, 10, 10]} color="#C084FC" intensity={2.2} distance={150} />
            <pointLight position={[0, 8, -15]} color="#FDE047" intensity={1.4} distance={100} />

            {/* Silhouette 1: You (Left Soul Entity) */}
            <group position={[-30, 0, 0]}>
                {/* Ethereal Head */}
                <mesh position={[0, 15, 0]}>
                    <sphereGeometry args={[4.2, 24, 24]} />
                    <meshStandardMaterial
                        color="#7E22CE"
                        emissive="#6B21A8"
                        emissiveIntensity={0.8}
                        roughness={0.4}
                        metalness={0.6}
                    />
                </mesh>

                {/* Energy Torso */}
                <mesh position={[0, 4, 0]}>
                    <capsuleGeometry args={[3.6, 12, 16, 16]} />
                    <meshStandardMaterial
                        color="#581C87"
                        emissive="#3B0764"
                        emissiveIntensity={0.6}
                        roughness={0.5}
                    />
                </mesh>

                {/* Inner Heart Energy Chakra */}
                <mesh ref={leftHeartRef} position={[0, 8, 2]}>
                    <sphereGeometry args={[2.0, 16, 16]} />
                    <meshBasicMaterial
                        color="#FDE047"
                        transparent
                        opacity={0.9}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Left Hand Gesturing in Signed Language */}
                <mesh position={[7, 9, 5]}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial
                        color="#F3E8FF"
                        transparent
                        opacity={0.9}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* Silhouette 2: Queen Jiyu (Right Sovereign Soul Entity) */}
            <group position={[30, 0, 0]}>
                {/* Royal Aura Head */}
                <mesh position={[0, 15, 0]}>
                    <sphereGeometry args={[4.0, 24, 24]} />
                    <meshStandardMaterial
                        color="#A855F7"
                        emissive="#9333EA"
                        emissiveIntensity={0.9}
                        roughness={0.3}
                        metalness={0.7}
                    />
                </mesh>

                {/* Golden Crown Aura above Queen */}
                <mesh position={[0, 21, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[4.2, 5.2, 32]} />
                    <meshBasicMaterial
                        color="#FFD700"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.85}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Sovereign Energy Torso */}
                <mesh position={[0, 4, 0]}>
                    <capsuleGeometry args={[3.2, 11, 16, 16]} />
                    <meshStandardMaterial
                        color="#7E22CE"
                        emissive="#581C87"
                        emissiveIntensity={0.7}
                        roughness={0.5}
                    />
                </mesh>

                {/* Inner Heart Energy Chakra */}
                <mesh ref={rightHeartRef} position={[0, 8, 2]}>
                    <sphereGeometry args={[2.0, 16, 16]} />
                    <meshBasicMaterial
                        color="#FDE047"
                        transparent
                        opacity={0.9}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Right Hand Responding in Signed Dialect */}
                <mesh position={[-7, 9, 5]}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial
                        color="#FEF08A"
                        transparent
                        opacity={0.9}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* Communicating Double-Helix Soul Energy Particles */}
            <points ref={energyHelixRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={3.8}
                    color="#FDE047"
                    transparent
                    opacity={0.95}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};
