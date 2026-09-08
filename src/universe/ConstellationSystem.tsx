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

const LABEL_OFFSETS: Record<RealmId, [number, number, number]> = {
    'ascent': [0, 20, 0],
    'first-rhythm': [-20, 18, 0],
    'river': [20, 18, 0],
    'radiance': [-26, 14, 0],
    'rose': [26, 14, 0],
    'silent-language': [-28, -6, 0],
    'sanctuary': [28, -6, 0],
    'retina': [-16, -20, 0],
    'missed-days': [16, -20, 0],
    'queen': [0, 24, 0]
};

export const ConstellationSystem: React.FC = () => {
    const { realmStatuses, activeRealmId, navigateToRealm } = useUniverseStore();
    const groupRef = useRef<THREE.Group | null>(null);
    const audioManager = SoundtrackManager.getInstance();

    const handleNodeClick = (id: RealmId) => {
        audioManager.playCelestialChime();
        navigateToRealm(id);
    };

    // 1. Full Celestial Constellation Trajectory connecting all 10 realms in story sequence
    const allPathPoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < REALM_IDS.length - 1; i++) {
            const r1 = REALMS[REALM_IDS[i]];
            const r2 = REALMS[REALM_IDS[i + 1]];
            points.push(new THREE.Vector3(...r1.coordinates));
            points.push(new THREE.Vector3(...r2.coordinates));
        }
        return points;
    }, []);

    // 2. Identify next realm along the cosmic narrative path
    const nextRealmId = useMemo(() => {
        return REALM_IDS.find((id) => realmStatuses[id] !== 'completed') || null;
    }, [realmStatuses]);

    // 3. Highlighted golden path between completed milestones
    const completedPathPoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < REALM_IDS.length - 1; i++) {
            const id1 = REALM_IDS[i];
            const id2 = REALM_IDS[i + 1];
            if (realmStatuses[id1] === 'completed') {
                const r1 = REALMS[id1];
                const r2 = REALMS[id2];
                points.push(new THREE.Vector3(...r1.coordinates));
                points.push(new THREE.Vector3(...r2.coordinates));
            }
        }
        return points;
    }, [realmStatuses]);

    // 4. Luminous active trajectory beam leading to the next unvisited realm
    const activeGuidePoints = useMemo(() => {
        if (!nextRealmId) return [];
        const nextIdx = REALM_IDS.findIndex((id) => id === nextRealmId);
        if (nextIdx <= 0) return [];
        const prev = REALMS[REALM_IDS[nextIdx - 1]];
        const next = REALMS[REALM_IDS[nextIdx]];
        return [
            new THREE.Vector3(...prev.coordinates),
            new THREE.Vector3(...next.coordinates)
        ];
    }, [nextRealmId]);

    return (
        <group ref={groupRef}>
            {/* Ethereal Full Constellation Path (Guides her through the cosmic story arc) */}
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[
                            new Float32Array(allPathPoints.flatMap((p) => [p.x, p.y, p.z])),
                            3
                        ]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#D4AF37"
                    transparent
                    opacity={0.22}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>

            {/* Glowing Golden Traversed Path */}
            {completedPathPoints.length > 0 && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[
                                new Float32Array(completedPathPoints.flatMap((p) => [p.x, p.y, p.z])),
                                3
                            ]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color="#FFD700"
                        transparent
                        opacity={0.65}
                        blending={THREE.AdditiveBlending}
                    />
                </lineSegments>
            )}

            {/* Radiant Active Guide Beam to Next Realm */}
            {activeGuidePoints.length > 0 && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[
                                new Float32Array(activeGuidePoints.flatMap((p) => [p.x, p.y, p.z])),
                                3
                            ]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial
                        color="#FFF8DC"
                        transparent
                        opacity={0.88}
                        blending={THREE.AdditiveBlending}
                    />
                </lineSegments>
            )}

            {/* 10 Celestial Realm Nodes in Story Sequence */}
            {REALM_IDS.map((id) => {
                const realm = REALMS[id];
                const status = realmStatuses[id];
                const isSelected = activeRealmId === id;
                const isDormant = status === 'dormant';
                const isNext = id === nextRealmId && activeRealmId === null && status !== 'completed';

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
                                    emissiveIntensity={isDormant ? 0.2 : (isNext ? 1.0 : 0.85)}
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

                        {/* Guided Celestial Beacon Ring for Next Unvisited Realm */}
                        {isNext && (
                            <mesh scale={[1.65, 1.65, 1.65]}>
                                <ringGeometry args={[14, 16.5, 32]} />
                                <meshBasicMaterial
                                    color="#FFF8DC"
                                    transparent
                                    opacity={0.75}
                                    side={THREE.DoubleSide}
                                    blending={THREE.AdditiveBlending}
                                />
                            </mesh>
                        )}

                        {/* Interactive Drei HTML Label - Staggered offset prevents collisions */}
                        {activeRealmId === null && (
                            <Html
                                position={LABEL_OFFSETS[id] || [0, 16, 0]}
                                center
                                style={{ pointerEvents: 'auto' }}
                            >
                                <button
                                    className={`constellation-node-btn ${isSelected ? 'active' : ''} ${isNext ? 'next-path-beacon' : ''}`}
                                    onClick={() => handleNodeClick(id)}
                                >
                                    <span>{realm.icon}</span>
                                    <span>{realm.title}</span>
                                    {status === 'completed' && (
                                        <span style={{ color: '#10B981', fontSize: '10px' }}>✓</span>
                                    )}
                                    {isNext && (
                                        <span className="beacon-next-pill">✦ Next</span>
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

