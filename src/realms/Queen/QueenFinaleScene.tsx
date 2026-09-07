// ==========================================================================
// REALM 8 - THE QUEEN (THE FINALE CROWN)
// Golden converging starlight particles assembling into the 3D Royal Crown
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const QueenFinaleScene: React.FC = () => {
    const crownGroupRef = useRef<THREE.Group | null>(null);
    const auraHaloRef = useRef<THREE.Mesh | null>(null);
    const convergeParticlesRef = useRef<THREE.Points | null>(null);
    const coords = REALMS['queen'].coordinates;

    const [particlePos] = useMemo(() => {
        const prng = createPseudoRandom(999);
        const count = 600;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = 25 + prng() * 65;
            const theta = prng() * Math.PI * 2;
            pos[i * 3] = Math.cos(theta) * r;
            pos[i * 3 + 1] = (prng() - 0.5) * 50;
            pos[i * 3 + 2] = Math.sin(theta) * r;
        }
        return [pos];
    }, []);

    useFrame((state, delta) => {
        if (crownGroupRef.current) {
            crownGroupRef.current.rotation.y += delta * 0.25;
        }
        if (auraHaloRef.current) {
            auraHaloRef.current.rotation.z -= delta * 0.15;
            const scale = 1.0 + Math.sin(state.clock.elapsedTime * 2.0) * 0.08;
            auraHaloRef.current.scale.set(scale, scale, scale);
        }
        if (convergeParticlesRef.current) {
            const arr = convergeParticlesRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < 600; i++) {
                // Inward spiral convergence
                arr[i * 3] *= 0.995;
                arr[i * 3 + 2] *= 0.995;
                if (Math.abs(arr[i * 3]) < 8) {
                    const angle = state.clock.elapsedTime + i;
                    arr[i * 3] = Math.cos(angle) * 75;
                    arr[i * 3 + 2] = Math.sin(angle) * 75;
                }
            }
            convergeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group position={coords}>
            {/* Crown Royal Gold Point Lights */}
            <pointLight position={[0, 25, 10]} color="#FFD700" intensity={3.5} distance={220} />
            <pointLight position={[0, -15, -10]} color="#FFF8DC" intensity={2.0} distance={150} />

            {/* Glowing Golden Aura Halo */}
            <mesh ref={auraHaloRef} position={[0, 10, -5]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[28, 34, 64]} />
                <meshBasicMaterial
                    color="#FFD700"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 3D Royal Crown Mesh Group */}
            <group ref={crownGroupRef} position={[0, 5, 0]}>
                {/* Crown Base Band */}
                <mesh position={[0, -6, 0]}>
                    <cylinderGeometry args={[16, 16, 3, 32, 1, true]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        metalness={0.9}
                        roughness={0.2}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* 5 Crown Peaks (Cones & Jewels) */}
                {[0, 1, 2, 3, 4].map((idx) => {
                    const angle = (idx * Math.PI * 2) / 5;
                    const x = Math.cos(angle) * 15;
                    const z = Math.sin(angle) * 15;
                    const height = idx % 2 === 0 ? 12 : 8;

                    return (
                        <group key={`peak-${idx}`} position={[x, 0, z]}>
                            {/* Golden Peak Spire */}
                            <mesh position={[0, height / 2 - 3, 0]}>
                                <coneGeometry args={[2.5, height, 8]} />
                                <meshStandardMaterial
                                    color="#FFD700"
                                    metalness={0.85}
                                    roughness={0.25}
                                />
                            </mesh>
                            {/* Jewel Sphere on top */}
                            <mesh position={[0, height + 1, 0]}>
                                <sphereGeometry args={[1.5, 16, 16]} />
                                <meshBasicMaterial
                                    color={idx === 0 ? '#FFFFFF' : '#FFF8DC'}
                                />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* Inward Converging Starlight Particles */}
            <points ref={convergeParticlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particlePos, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={3.2}
                    color="#FEF08A"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

