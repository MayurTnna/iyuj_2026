// ==========================================================================
// QUEEN JIYU'S UNIVERSE - MASTER CANVAS & POSTPROCESSING
// R3F Canvas with adaptive postprocessing bloom, vignette & quality scaling
// ==========================================================================

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { UniverseScene } from './UniverseScene';
import { useUniverseStore } from '../store/universeStore';

export const UniverseCanvas: React.FC = () => {
    const qualityTier = useUniverseStore((s) => s.qualityTier);
    const hasPostprocessing = qualityTier === 'ultra' || qualityTier === 'high';

    return (
        <Canvas
            camera={{ position: [0, 35, 380], fov: 60, near: 0.1, far: 3500 }}
            dpr={qualityTier === 'ultra' ? [1, 2] : [1, 1.5]}
            gl={{
                alpha: true,
                antialias: qualityTier !== 'low',
                powerPreference: 'high-performance'
            }}
            className="universe-canvas"
        >
            <Suspense fallback={null}>
                <UniverseScene />

                {/* Adaptive Post-processing */}
                {hasPostprocessing && (
                    <EffectComposer multisampling={0}>
                        <Bloom
                            intensity={0.6}
                            luminanceThreshold={0.45}
                            luminanceSmoothing={0.8}
                            mipmapBlur
                        />
                        <Vignette eskil={false} offset={0.15} darkness={0.85} />
                    </EffectComposer>
                )}
            </Suspense>
        </Canvas>
    );
};

