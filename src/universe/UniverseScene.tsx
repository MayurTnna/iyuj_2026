// ==========================================================================
// QUEEN JIYU'S UNIVERSE - MASTER 3D SCENE GRAPH
// Assembles the starfield, galaxy, nebula, constellation system, camera, and all 8 realms
// ==========================================================================

import React from 'react';
import { UniverseCamera } from './UniverseCamera';
import { StarField } from './StarField';
import { Galaxy } from './Galaxy';
import { Nebula } from './Nebula';
import { ConstellationSystem } from './ConstellationSystem';
import { FirstRhythmScene } from '../realms/FirstRhythm/FirstRhythmScene';
import { RetinaScene } from '../realms/Retina/RetinaScene';
import { RiverScene } from '../realms/River/RiverScene';
import { RoseScene } from '../realms/Rose/RoseScene';
import { SilentLanguageScene } from '../realms/SilentLanguage/SilentLanguageScene';
import { RadianceScene } from '../realms/Radiance/RadianceScene';
import { SanctuaryScene } from '../realms/Sanctuary/SanctuaryScene';
import { MissedDaysScene } from '../realms/MissedDays/MissedDaysScene';
import { AscentScene } from '../realms/Ascent/AscentScene';
import { QueenFinaleScene } from '../realms/Queen/QueenFinaleScene';

export const UniverseScene: React.FC = () => {
    return (
        <>
            {/* Cinematic Lighting System */}
            <ambientLight intensity={0.8} color="#0A1128" />
            <directionalLight position={[0, 200, 100]} intensity={1.5} color="#FFF8DC" />
            <pointLight position={[0, 0, 0]} intensity={2.0} color="#FFD700" distance={1200} />
            <pointLight position={[-300, 150, -200]} intensity={1.8} color="#3B82F6" distance={900} />

            {/* GSAP Cinematic Storytelling Camera */}
            <UniverseCamera />

            {/* Deep Cosmic Background Clouds */}
            <Nebula />

            {/* Golden & Violet Spiral Galaxy */}
            <Galaxy />

            {/* 10,000 Twinkling Multicolored Stars */}
            <StarField />

            {/* 8 Celestial Realm Nodes & Crown Constellation */}
            <ConstellationSystem />

            {/* All 8 Realm-Specific 3D Environments */}
            <FirstRhythmScene />
            <RetinaScene />
            <RiverScene />
            <RoseScene />
            <SilentLanguageScene />
            <RadianceScene />
            <SanctuaryScene />
            <MissedDaysScene />
            <AscentScene />
            <QueenFinaleScene />
        </>
    );
};

