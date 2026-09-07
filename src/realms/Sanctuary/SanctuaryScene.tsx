// ==========================================================================
// REALM 7 - THE SANCTUARY OF CALM (PATIENCE & DEEP LISTENING)
// Crystalline geometric lotus/dome, concentric ripples of peaceful energy,
// and floating attentive light orbs symbolizing her soothing, patient presence.
// ==========================================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';

export const SanctuaryScene: React.FC = () => {
    const domeRef = useRef<THREE.Group | null>(null);
    const ripple1Ref = useRef<THREE.Mesh | null>(null);
    const ripple2Ref = useRef<THREE.Mesh | null>(null);
    const ripple3Ref = useRef<THREE.Mesh | null>(null);
    const orb1Ref = useRef<THREE.Mesh | null>(null);
    const orb2Ref = useRef<THREE.Mesh | null>(null);

    const coords = REALMS['sanctuary'].coordinates;

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Gentle dome breathing oscillation
        if (domeRef.current) {
            domeRef.current.rotation.y += delta * 0.08;
        }

        // Concentric ripples of peace expanding outwards
        const r1 = ((time * 0.4) % 1) * 32;
        const r2 = (((time * 0.4) + 0.33) % 1) * 32;
        const r3 = (((time * 0.4) + 0.66) % 1) * 32;

        if (ripple1Ref.current) {
            ripple1Ref.current.scale.set(r1 / 10 + 0.1, r1 / 10 + 0.1, 1);
            (ripple1Ref.current.material as THREE.Material).opacity = (1 - r1 / 32) * 0.6;
        }
        if (ripple2Ref.current) {
            ripple2Ref.current.scale.set(r2 / 10 + 0.1, r2 / 10 + 0.1, 1);
            (ripple2Ref.current.material as THREE.Material).opacity = (1 - r2 / 32) * 0.6;
        }
        if (ripple3Ref.current) {
            ripple3Ref.current.scale.set(r3 / 10 + 0.1, r3 / 10 + 0.1, 1);
            (ripple3Ref.current.material as THREE.Material).opacity = (1 - r3 / 32) * 0.6;
        }

        // Attentive listening orbs floating gently
        if (orb1Ref.current) {
            orb1Ref.current.position.y = 8 + Math.sin(time * 1.5) * 2.5;
            orb1Ref.current.position.x = Math.cos(time * 0.6) * 16;
            orb1Ref.current.position.z = Math.sin(time * 0.6) * 16;
        }
        if (orb2Ref.current) {
            orb2Ref.current.position.y = 6 + Math.cos(time * 1.3) * 2.2;
            orb2Ref.current.position.x = Math.cos(time * 0.6 + Math.PI) * 16;
            orb2Ref.current.position.z = Math.sin(time * 0.6 + Math.PI) * 16;
        }
    });

    return (
        <group position={coords}>
            {/* Tranquil Emerald & Soft Lavender Lighting */}
            <pointLight position={[0, 15, 0]} color="#34D399" intensity={2.8} distance={160} />
            <pointLight position={[0, -5, 20]} color="#A7F3D0" intensity={1.5} distance={100} />

            {/* Geometric Crystalline Sanctuary Dome */}
            <group ref={domeRef} position={[0, 6, 0]}>
                {/* Outer Crystal Facets */}
                <mesh>
                    <icosahedronGeometry args={[14, 1]} />
                    <meshStandardMaterial
                        color="#059669"
                        emissive="#047857"
                        emissiveIntensity={0.6}
                        roughness={0.15}
                        metalness={0.85}
                        wireframe
                    />
                </mesh>

                {/* Inner Luminous Heart */}
                <mesh>
                    <octahedronGeometry args={[6, 0]} />
                    <meshStandardMaterial
                        color="#34D399"
                        emissive="#10B981"
                        emissiveIntensity={1.2}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </mesh>
            </group>

            {/* Concentric Water/Energy Ripples of Calm */}
            <group position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh ref={ripple1Ref}>
                    <ringGeometry args={[9, 10, 36]} />
                    <meshBasicMaterial
                        color="#6EE7B7"
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh ref={ripple2Ref}>
                    <ringGeometry args={[9, 10, 36]} />
                    <meshBasicMaterial
                        color="#34D399"
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh ref={ripple3Ref}>
                    <ringGeometry args={[9, 10, 36]} />
                    <meshBasicMaterial
                        color="#A7F3D0"
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* Floating Deep Listening Orbs */}
            <mesh ref={orb1Ref}>
                <sphereGeometry args={[2.5, 24, 24]} />
                <meshBasicMaterial
                    color="#D1FAE5"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <mesh ref={orb2Ref}>
                <sphereGeometry args={[2.0, 24, 24]} />
                <meshBasicMaterial
                    color="#A7F3D0"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

