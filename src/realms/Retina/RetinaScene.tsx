// ==========================================================================
// REALM 2 - THE RETINA (OPTICAL CONVERGENCE)
// Concentric iris geometry, focused light beam, and refractive starlight
// ==========================================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';

export const RetinaScene: React.FC = () => {
    const irisRingsRef = useRef<THREE.Group | null>(null);
    const beamRef = useRef<THREE.Mesh | null>(null);
    const coords = REALMS['retina'].coordinates;

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (irisRingsRef.current) {
            irisRingsRef.current.rotation.z = time * 0.15;
        }
        if (beamRef.current) {
            // Pulsing optical focus beam
            beamRef.current.scale.set(
                1.0 + Math.sin(time * 2.5) * 0.15,
                1.0,
                1.0 + Math.sin(time * 2.5) * 0.15
            );
        }
    });

    return (
        <group position={coords}>
            {/* Concentric Iris Rings */}
            <group ref={irisRingsRef}>
                <mesh>
                    <ringGeometry args={[12, 16, 64]} />
                    <meshBasicMaterial
                        color="#60A5FA"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.7}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh>
                    <ringGeometry args={[22, 27, 64]} />
                    <meshBasicMaterial
                        color="#3B82F6"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.45}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh>
                    <ringGeometry args={[35, 42, 64]} />
                    <meshBasicMaterial
                        color="#1D4ED8"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.25}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* Central Focused Light Cylinder (Entering the Eye) */}
            <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 40]}>
                <cylinderGeometry args={[2.5, 8.0, 90, 32, 1, true]} />
                <meshBasicMaterial
                    color="#E0F2FE"
                    transparent
                    opacity={0.65}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Focal Point PointLight */}
            <pointLight color="#60A5FA" intensity={2.2} distance={150} />
        </group>
    );
};

