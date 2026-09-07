// ==========================================================================
// QUEEN JIYU'S UNIVERSE - CINEMATIC STORYTELLING CAMERA
// Decoupled GSAP flight path animator updating R3F frame state
// ==========================================================================

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import gsap from 'gsap';
import { useUniverseStore } from '../store/universeStore';
import { REALMS } from '../data/realms';

export const UniverseCamera: React.FC = () => {
    const activeRealmId = useUniverseStore((s) => s.activeRealmId);

    const cameraTarget = useRef({
        x: 0,
        y: 35,
        z: 380,
        lookX: 0,
        lookY: 0,
        lookZ: -350,
        fov: 60
    });

    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

    // Handle mouse movement for subtle cosmos parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 40;
            mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 40;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Cinematic GSAP camera transitions when active realm changes
    useEffect(() => {
        if (!activeRealmId) {
            gsap.to(cameraTarget.current, {
                x: 0,
                y: 35,
                z: 380,
                lookX: 0,
                lookY: 0,
                lookZ: -350,
                fov: 60,
                duration: 2.2,
                ease: 'power3.inOut'
            });
        } else {
            const realm = REALMS[activeRealmId];
            gsap.to(cameraTarget.current, {
                x: realm.cameraPosition[0],
                y: realm.cameraPosition[1],
                z: realm.cameraPosition[2],
                lookX: realm.targetLookAt[0],
                lookY: realm.targetLookAt[1],
                lookZ: realm.targetLookAt[2],
                fov: 52,
                duration: 2.4,
                ease: 'power3.inOut'
            });
        }
    }, [activeRealmId]);

    useFrame((state) => {
        const target = cameraTarget.current;
        if (!activeRealmId) {
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
        }

        const posX = target.x + (activeRealmId ? 0 : mouseRef.current.x);
        const posY = target.y - (activeRealmId ? 0 : mouseRef.current.y);
        const posZ = target.z;

        state.camera.position.set(posX, posY, posZ);
        state.camera.lookAt(target.lookX, target.lookY, target.lookZ);

        const persCam = state.camera as THREE.PerspectiveCamera;
        if (persCam.fov && Math.abs(persCam.fov - target.fov) > 0.05) {
            persCam.fov = target.fov;
            persCam.updateProjectionMatrix();
        }
    });

    return null;
};

