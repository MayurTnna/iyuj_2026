// ==========================================================================
// REALM 7 - THE ASCENT (AMBITION & THE SUMMIT)
// Mountain climb, storm clouds, ticking cosmic clock, and sunrise arrival silhouette
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const AscentScene: React.FC = () => {
    const clockHandRef = useRef<THREE.Mesh | null>(null);
    const windRef = useRef<THREE.Points | null>(null);
    const coords = REALMS['ascent'].coordinates;

    const [windPositions] = useMemo(() => {
        const prng = createPseudoRandom(888);
        const count = 400;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (prng() - 0.5) * 80;
            pos[i * 3 + 1] = prng() * 60 - 20;
            pos[i * 3 + 2] = (prng() - 0.5) * 80;
        }
        return [pos];
    }, []);

    useFrame((state, delta) => {
        // Ticking cosmic clock hand visualizing time anxiety
        if (clockHandRef.current) {
            clockHandRef.current.rotation.z -= delta * 1.8;
        }

        // Swirling mountain wind particles
        if (windRef.current) {
            const arr = windRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < 400; i++) {
                const angle = state.clock.elapsedTime * 0.8 + i;
                arr[i * 3] += Math.cos(angle) * 0.4;
                arr[i * 3 + 2] += Math.sin(angle) * 0.4;
                arr[i * 3 + 1] += delta * 4.0;
                if (arr[i * 3 + 1] > 40) {
                    arr[i * 3 + 1] = -20;
                }
            }
            windRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <group position={coords}>
            {/* Sunrise Summit Glow */}
            <pointLight position={[0, 35, 10]} color="#FEF08A" intensity={2.8} distance={180} />
            <pointLight position={[0, -10, -20]} color="#B45309" intensity={1.5} distance={120} />

            {/* The Mountain Mass (Cone with rough facets) */}
            <mesh position={[0, -5, 0]}>
                <coneGeometry args={[45, 55, 16, 8]} />
                <meshStandardMaterial
                    color="#475569"
                    roughness={0.8}
                    metalness={0.2}
                    flatShading
                />
            </mesh>

            {/* Summit Snow & Sunrise Peak */}
            <mesh position={[0, 22, 0]}>
                <coneGeometry args={[14, 18, 16, 4]} />
                <meshStandardMaterial
                    color="#FEF9C3"
                    emissive="#EAB308"
                    emissiveIntensity={0.35}
                    roughness={0.4}
                    flatShading
                />
            </mesh>

            {/* Cosmic Clock Dial (Symbol of Overcoming Time Anxiety) */}
            <group position={[0, 12, 28]}>
                {/* Dial Rim */}
                <mesh>
                    <ringGeometry args={[10, 11.5, 32]} />
                    <meshBasicMaterial
                        color="#F3E5AB"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.6}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                {/* Rotating Clock Hand */}
                <mesh ref={clockHandRef} position={[0, 0, 0.2]}>
                    <planeGeometry args={[1.2, 8.5]} />
                    <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} />
                </mesh>
            </group>

            {/* Subtle Luxury Arrival Silhouette at Summit (Mercedes S-Class Motif) */}
            <group position={[0, 31, 2]} scale={[0.7, 0.7, 0.7]}>
                {/* Aerodynamic Chassis */}
                <mesh position={[0, 1.5, 0]}>
                    <boxGeometry args={[12, 2.2, 5]} />
                    <meshStandardMaterial color="#0A0F1D" metalness={0.95} roughness={0.1} />
                </mesh>
                {/* Coupe Cabin Roofline */}
                <mesh position={[0, 3.2, 0]}>
                    <boxGeometry args={[6.5, 1.8, 4.2]} />
                    <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Headlight Beacons */}
                <mesh position={[5.8, 1.2, 1.8]}>
                    <sphereGeometry args={[0.5, 12, 12]} />
                    <meshBasicMaterial color="#E0F2FE" />
                </mesh>
                <mesh position={[5.8, 1.2, -1.8]}>
                    <sphereGeometry args={[0.5, 12, 12]} />
                    <meshBasicMaterial color="#E0F2FE" />
                </mesh>
            </group>

            {/* Swirling Mountain Wind Particles */}
            <points ref={windRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[windPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={2.5}
                    color="#FEF9C3"
                    transparent
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

