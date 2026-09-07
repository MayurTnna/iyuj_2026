// ==========================================================================
// QUEEN JIYU'S UNIVERSE - INTERACTIVE CONSTELLATION SYSTEM
// 10 Celestial realm nodes in 3D space with dynamic status, halos, and crown lines
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { REALMS, REALM_IDS } from '../data/realms';
import { useUniverseStore } from '../store/universeStore';
import { SoundtrackManager } from '../audio/SoundtrackManager';
import type { RealmId } from '../types/universe.types';

export const ConstellationSystem: React.FC = () => {
    const { realmStatuses, activeRealmId, navigateToRealm } = useUniverseStore();
    const groupRef = useRef<THREE.Group | null>(null);
    const audioManager = SoundtrackManager.getInstance();

    const handleNodeClick = (id: RealmId) => {
        audioManager.playCelestialChime();
        navigateToRealm(id);
    };

    // Calculate connecting constellation lines between discovered nodes
    const linePoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        const discovered = REALM_IDS.filter((id) => realmStatuses[id] !== 'dormant');

        if (discovered.length > 1) {
            for (let i = 0; i < discovered.length - 1; i++) {
                const r1 = REALMS[discovered[i]];
                const r2 = REALMS[discovered[i + 1]];
                points.push(new THREE.Vector3(...r1.coordinates));
                points.push(new THREE.Vector3(...r2.coordinates));
            }
            // Loop last back to first to form constellation closure
            if (discovered.length >= 4) {
                const rFirst = REALMS[discovered[0]];
                const rLast = REALMS[discovered[discovered.length - 1]];
                points.push(new THREE.Vector3(...rLast.coordinates));
                points.push(new THREE.Vector3(...rFirst.coordinates));
            }
        }
        return points;
    }, [realmStatuses]);

    return (
        <group ref={groupRef}>
            {/* Constellation Connecting Line Segments */}
            {linePoints.length > 0 && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[
                                new Float32Array(
                                    linePoints.flatMap((p) => [p.x, p.y, p.z])
                                ),
                                3
                            ]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={0.35}
                        blending={THREE.AdditiveBlending}
                    />
                </lineSegments>
            )}

            {/* 8 Celestial Realm Nodes */}
            {REALM_IDS.map((id) => {
                const realm = REALMS[id];
                const status = realmStatuses[id];
                const isSelected = activeRealmId === id;
                const isDormant = status === 'dormant';

                return (
                    <group key={id} position={realm.coordinates}>
                        {/* Core Celestial Sphere - Hidden when currently visiting this realm */}
                        {activeRealmId !== id && (
                            <mesh
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNodeClick(id);
                                }}
                            >
                                <sphereGeometry args={[10, 32, 32]} />
                                <meshStandardMaterial
                                    color={isDormant ? '#334155' : realm.color}
                                    emissive={isDormant ? '#0F172A' : realm.emissiveColor}
                                    emissiveIntensity={isDormant ? 0.2 : 0.85}
                                    roughness={0.3}
                                    metalness={0.7}
                                />
                            </mesh>
                        )}

                        {/* Outer Glowing Halo - Shown only in Cosmos overview */}
                        {!isDormant && activeRealmId === null && (
                            <mesh scale={[1.35, 1.35, 1.35]}>
                                <sphereGeometry args={[10, 24, 24]} />
                                <meshBasicMaterial
                                    color={realm.accentColor}
                                    transparent
                                    opacity={0.25}
                                    blending={THREE.AdditiveBlending}
                                    depthWrite={false}
                                />
                            </mesh>
                        )}

                        {/* Orbiting Stardust Ring - Shown only in Cosmos overview */}
                        {!isDormant && activeRealmId === null && (
                            <mesh rotation={[Math.PI / 3, 0, 0]}>
                                <ringGeometry args={[14, 17, 32]} />
                                <meshBasicMaterial
                                    color="#FFD700"
                                    transparent
                                    opacity={0.4}
                                    side={THREE.DoubleSide}
                                    blending={THREE.AdditiveBlending}
                                />
                            </mesh>
                        )}

                        {/* Interactive Drei HTML Label - Only active in Cosmos view */}
                        {activeRealmId === null && (
                            <Html
                                position={[0, 16, 0]}
                                center
                                style={{ pointerEvents: 'auto' }}
                            >
                                <button
                                    className={`constellation-node-btn ${isSelected ? 'active' : ''}`}
                                    onClick={() => handleNodeClick(id)}
                                >
                                    <span>{realm.icon}</span>
                                    <span>{realm.title}</span>
                                    {status === 'completed' && (
                                        <span style={{ color: '#10B981', fontSize: '10px' }}>✓</span>
                                    )}
                                </button>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
};

