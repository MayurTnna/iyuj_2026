// ==========================================================================
// QUEEN JIYU'S UNIVERSE - FBM VOLUMETRIC NEBULA
// Layered cosmic clouds with royal violet, moonlight indigo, and champagne gold
// ==========================================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NebulaShader } from '../shaders/nebulaShader';

export const Nebula: React.FC = () => {
    const mat1Ref = useRef<THREE.ShaderMaterial | null>(null);
    const mat2Ref = useRef<THREE.ShaderMaterial | null>(null);

    const uniforms1 = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color('#4C1D95') }, // Royal Violet
            uColorB: { value: new THREE.Color('#1E3A8A') }, // Moonlight Blue
            uColorC: { value: new THREE.Color('#D4AF37') }, // Champagne Gold
            uOpacity: { value: 0.35 }
        }),
        []
    );

    const uniforms2 = useMemo(
        () => ({
            uTime: { value: 100 },
            uColorA: { value: new THREE.Color('#312E81') }, // Deep Indigo
            uColorB: { value: new THREE.Color('#0369A1') }, // Cyan Ice
            uColorC: { value: new THREE.Color('#FFD700') }, // Bright Gold
            uOpacity: { value: 0.28 }
        }),
        []
    );

    useFrame((_, delta) => {
        if (mat1Ref.current) mat1Ref.current.uniforms.uTime.value += delta * 0.5;
        if (mat2Ref.current) mat2Ref.current.uniforms.uTime.value += delta * 0.4;
    });

    return (
        <group>
            {/* Primary Background Cloud */}
            <mesh position={[0, 40, -520]} scale={[1200, 700, 1]}>
                <planeGeometry args={[1, 1, 16, 16]} />
                <shaderMaterial
                    ref={mat1Ref}
                    vertexShader={NebulaShader.vertexShader}
                    fragmentShader={NebulaShader.fragmentShader}
                    uniforms={uniforms1}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Secondary Rotated Cloud Layer */}
            <mesh position={[-60, -30, -480]} rotation={[0, 0, 0.4]} scale={[1100, 650, 1]}>
                <planeGeometry args={[1, 1, 16, 16]} />
                <shaderMaterial
                    ref={mat2Ref}
                    vertexShader={NebulaShader.vertexShader}
                    fragmentShader={NebulaShader.fragmentShader}
                    uniforms={uniforms2}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

