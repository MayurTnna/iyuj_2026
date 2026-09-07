// ==========================================================================
// REALM 3 - THE RIVER (AHMEDABAD SABARMATI RIVERFRONT)
// Animated reflective water surface, city night glow, and memory reflection
// ==========================================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';

export const RiverScene: React.FC = () => {
    const waterMeshRef = useRef<THREE.Mesh | null>(null);
    const reflectionOrbRef = useRef<THREE.Mesh | null>(null);
    const coords = REALMS['river'].coordinates;

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (reflectionOrbRef.current) {
            // Gentle water bobbing motion
            reflectionOrbRef.current.position.y = -6 + Math.sin(time * 1.8) * 1.5;
        }
        if (waterMeshRef.current) {
            // Subtle water tilt
            waterMeshRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
        }
    });

    return (
        <group position={coords}>
            {/* Water Surface Plane */}
            <mesh ref={waterMeshRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -10, 0]}>
                <planeGeometry args={[140, 90, 32, 32]} />
                <meshStandardMaterial
                    color="#0891B2"
                    roughness={0.15}
                    metalness={0.85}
                    transparent
                    opacity={0.75}
                />
            </mesh>

            {/* Glowing Memory Reflection in the River */}
            <mesh ref={reflectionOrbRef} position={[0, -6, 10]}>
                <sphereGeometry args={[5, 24, 24]} />
                <meshBasicMaterial
                    color="#A5F3FC"
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Sabarmati Promenade River Lights */}
            <pointLight position={[0, 15, 20]} color="#06B6D4" intensity={2.0} distance={140} />
            <pointLight position={[-30, -5, -15]} color="#FFD700" intensity={1.2} distance={80} />
            <pointLight position={[30, -5, -15]} color="#FFD700" intensity={1.2} distance={80} />
        </group>
    );
};

