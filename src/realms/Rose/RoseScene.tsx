// ==========================================================================
// REALM 4 - THE ROYAL ROSE (VELVET & RESILIENCE)
// Procedural layered rose petals, golden aura, and gentle falling petal particles
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const RoseScene: React.FC = () => {
    const roseGroupRef = useRef<THREE.Group | null>(null);
    const petalsRef = useRef<THREE.Points | null>(null);
    const coords = REALMS['rose'].coordinates;

    // Procedural falling petal particles
    const [petalPositions] = useMemo(() => {
        const prng = createPseudoRandom(333);
        const count = 350;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (prng() - 0.5) * 70;
            pos[i * 3 + 1] = (prng() - 0.5) * 80;
            pos[i * 3 + 2] = (prng() - 0.5) * 70;
        }
        return [pos];
    }, []);

    useFrame((_, delta) => {
        if (roseGroupRef.current) {
            roseGroupRef.current.rotation.y += delta * 0.15;
        }
        if (petalsRef.current) {
            const arr = petalsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < 350; i++) {
                arr[i * 3 + 1] -= delta * 8.0;
                if (arr[i * 3 + 1] < -40) {
                    arr[i * 3 + 1] = 40;
                }
            }
            petalsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group position={coords}>
            {/* Ambient Rose Scent Aura */}
            <pointLight color="#F43F5E" intensity={2.5} distance={140} />
            <pointLight position={[0, -15, 10]} color="#FFD700" intensity={1.0} distance={70} />

            {/* Central Procedural Rose Bloom */}
            <group ref={roseGroupRef}>
                {/* Core Bud */}
                <mesh>
                    <sphereGeometry args={[5, 24, 24]} />
                    <meshStandardMaterial
                        color="#BE123C"
                        roughness={0.4}
                        metalness={0.3}
                    />
                </mesh>

                {/* Layer 1 Inner Petals (3 petals) */}
                {[0, 1, 2].map((idx) => (
                    <mesh
                        key={`layer1-${idx}`}
                        rotation={[0.3, (idx * Math.PI * 2) / 3, 0.4]}
                        position={[
                            Math.cos((idx * Math.PI * 2) / 3) * 3,
                            1,
                            Math.sin((idx * Math.PI * 2) / 3) * 3
                        ]}
                    >
                        <planeGeometry args={[7, 10, 8, 8]} />
                        <meshStandardMaterial
                            color="#E11D48"
                            roughness={0.45}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))}

                {/* Layer 2 Mid Petals (5 petals) */}
                {[0, 1, 2, 3, 4].map((idx) => (
                    <mesh
                        key={`layer2-${idx}`}
                        rotation={[0.5, (idx * Math.PI * 2) / 5, 0.55]}
                        position={[
                            Math.cos((idx * Math.PI * 2) / 5) * 6,
                            0,
                            Math.sin((idx * Math.PI * 2) / 5) * 6
                        ]}
                    >
                        <planeGeometry args={[11, 14, 8, 8]} />
                        <meshStandardMaterial
                            color="#F43F5E"
                            roughness={0.5}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))}

                {/* Layer 3 Outer Velvet Petals (7 petals with gold sheen) */}
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <mesh
                        key={`layer3-${idx}`}
                        rotation={[0.7, (idx * Math.PI * 2) / 7, 0.7]}
                        position={[
                            Math.cos((idx * Math.PI * 2) / 7) * 10,
                            -2,
                            Math.sin((idx * Math.PI * 2) / 7) * 10
                        ]}
                    >
                        <planeGeometry args={[15, 18, 8, 8]} />
                        <meshStandardMaterial
                            color="#FB7185"
                            emissive="#9F1239"
                            emissiveIntensity={0.2}
                            roughness={0.55}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))}
            </group>

            {/* Falling Rose Petals Particles */}
            <points ref={petalsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[petalPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={4.0}
                    color="#FDA4AF"
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

