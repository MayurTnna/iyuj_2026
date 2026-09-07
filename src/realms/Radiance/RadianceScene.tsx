// ==========================================================================
// REALM 6 - THE RADIANT AURA (QUEEN JIYU'S SUNSHINE & POSITIVITY)
// Pulsing solar golden core, radiant prominence flares, and upward
// dancing sunshine particles symbolizing her transformative optimism.
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const RadianceScene: React.FC = () => {
    const sunCoreRef = useRef<THREE.Mesh | null>(null);
    const coronaRingRef1 = useRef<THREE.Mesh | null>(null);
    const coronaRingRef2 = useRef<THREE.Mesh | null>(null);
    const sunshinePointsRef = useRef<THREE.Points | null>(null);

    const coords = REALMS['radiance'].coordinates;
    const particleCount = 260;

    const [positions, speeds] = useMemo(() => {
        const prng = createPseudoRandom(888);
        const pos = new Float32Array(particleCount * 3);
        const spd = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const radius = 10 + prng() * 30;
            const theta = prng() * Math.PI * 2;
            pos[i * 3] = Math.cos(theta) * radius;
            pos[i * 3 + 1] = (prng() - 0.5) * 40;
            pos[i * 3 + 2] = Math.sin(theta) * radius;
            spd[i] = 12 + prng() * 18;
        }

        return [pos, spd];
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Pulsing warm solar core
        if (sunCoreRef.current) {
            const pulse = 1.0 + Math.sin(time * 2.2) * 0.08;
            sunCoreRef.current.scale.set(pulse, pulse, pulse);
            sunCoreRef.current.rotation.y += delta * 0.2;
        }

        // Counter-rotating solar corona rings
        if (coronaRingRef1.current) {
            coronaRingRef1.current.rotation.z += delta * 0.4;
            coronaRingRef1.current.rotation.x = Math.sin(time * 0.8) * 0.2;
        }
        if (coronaRingRef2.current) {
            coronaRingRef2.current.rotation.z -= delta * 0.35;
            coronaRingRef2.current.rotation.y = Math.cos(time * 0.7) * 0.2;
        }

        // Upward floating sunshine stardust
        if (sunshinePointsRef.current) {
            const arr = sunshinePointsRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                arr[i * 3 + 1] += delta * speeds[i];
                if (arr[i * 3 + 1] > 25) {
                    arr[i * 3 + 1] = -25;
                }
            }
            sunshinePointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group position={coords}>
            {/* Warm Golden Sunshine Lighting */}
            <pointLight position={[0, 0, 0]} color="#FBBF24" intensity={3.5} distance={200} />
            <pointLight position={[0, 20, 15]} color="#FFFBEB" intensity={1.8} distance={120} />

            {/* Radiant Sun Core */}
            <mesh ref={sunCoreRef}>
                <sphereGeometry args={[11, 32, 32]} />
                <meshStandardMaterial
                    color="#FDE047"
                    emissive="#D97706"
                    emissiveIntensity={1.4}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Inner Corona Glow Halo */}
            <mesh scale={[1.45, 1.45, 1.45]}>
                <sphereGeometry args={[11, 24, 24]} />
                <meshBasicMaterial
                    color="#FEF08A"
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Solar Prominence Corona Ring 1 */}
            <mesh ref={coronaRingRef1} rotation={[Math.PI / 4, 0, 0]}>
                <ringGeometry args={[16, 20, 48]} />
                <meshBasicMaterial
                    color="#F59E0B"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Solar Prominence Corona Ring 2 */}
            <mesh ref={coronaRingRef2} rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
                <ringGeometry args={[22, 25, 48]} />
                <meshBasicMaterial
                    color="#FFD700"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Dancing Golden Sunshine Particles */}
            <points ref={sunshinePointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={3.2}
                    color="#FEF08A"
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

