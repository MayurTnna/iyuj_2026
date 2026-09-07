// ==========================================================================
// REALM 6 - THE DAYS THAT DIDN'T HAPPEN (RAIN & DISTANCE)
// Atmospheric falling rain, wet platform reflection, and diverging light beacons
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { REALMS } from '../../data/realms';
import { createPseudoRandom } from '../../utils/pseudoRandom';

export const MissedDaysScene: React.FC = () => {
    const rainRef = useRef<THREE.Points | null>(null);
    const beacon1Ref = useRef<THREE.Mesh | null>(null);
    const beacon2Ref = useRef<THREE.Mesh | null>(null);
    const coords = REALMS['missed-days'].coordinates;

    const [rainPositions] = useMemo(() => {
        const prng = createPseudoRandom(777);
        const count = 900;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (prng() - 0.5) * 110;
            pos[i * 3 + 1] = (prng() - 0.5) * 100;
            pos[i * 3 + 2] = (prng() - 0.5) * 110;
        }
        return [pos];
    }, []);

    useFrame((state, delta) => {
        // Fall of rain
        if (rainRef.current) {
            const arr = rainRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < 900; i++) {
                arr[i * 3 + 1] -= delta * 95.0;
                if (arr[i * 3 + 1] < -50) {
                    arr[i * 3 + 1] = 50;
                }
            }
            rainRef.current.geometry.attributes.position.needsUpdate = true;
        }

        const time = state.clock.elapsedTime * 0.4;
        const dist = Math.sin(time) * 28; // Oscillates between -28 and +28

        if (beacon1Ref.current) {
            // Moves towards center, almost touches, diverges
            beacon1Ref.current.position.x = -Math.max(4, Math.abs(dist));
            beacon1Ref.current.position.z = Math.sin(time * 2) * 5;
        }
        if (beacon2Ref.current) {
            beacon2Ref.current.position.x = Math.max(4, Math.abs(dist));
            beacon2Ref.current.position.z = -Math.sin(time * 2) * 5;
        }
    });

    return (
        <group position={coords}>
            {/* Wet Platform Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, 0]}>
                <planeGeometry args={[110, 80]} />
                <meshStandardMaterial
                    color="#1E293B"
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Distant Station Streetlight */}
            <pointLight position={[0, 20, -25]} color="#FDE047" intensity={1.8} distance={90} />
            <pointLight position={[0, -10, 0]} color="#38BDF8" intensity={0.8} distance={70} />

            {/* Falling Rain */}
            <points ref={rainRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[rainPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={2.2}
                    color="#94A3B8"
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Light Beacon 1 (Warm Amber) */}
            <mesh ref={beacon1Ref} position={[-15, -4, 0]}>
                <sphereGeometry args={[2.5, 16, 16]} />
                <meshBasicMaterial color="#FBBF24" />
            </mesh>

            {/* Light Beacon 2 (Cornsilk Gold) */}
            <mesh ref={beacon2Ref} position={[15, -4, 0]}>
                <sphereGeometry args={[2.5, 16, 16]} />
                <meshBasicMaterial color="#FFF8DC" />
            </mesh>
        </group>
    );
};

