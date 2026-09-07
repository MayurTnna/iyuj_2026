import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export interface RoyalUniverseHandle {
    triggerHyperspeedWarp: (onComplete?: () => void) => void;
}

interface PlanetData {
    mesh: THREE.Mesh;
    rotSpeed: number;
    initialY: number;
    sineOffset: number;
}

interface StardustVelocity {
    x: number;
    y: number;
    z: number;
    sineOffset: number;
}

export const RoyalUniverseCanvas = forwardRef<RoyalUniverseHandle>((_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isWarpingRef = useRef<boolean>(false);
    const warpHandlerRef = useRef<((onComplete?: () => void) => void) | null>(null);

    useImperativeHandle(ref, () => ({
        triggerHyperspeedWarp: (onComplete?: () => void) => {
            if (warpHandlerRef.current) {
                warpHandlerRef.current(onComplete);
            } else if (onComplete) {
                onComplete();
            }
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let animationFrameId: number;
        const clock = new THREE.Clock();
        const planets: PlanetData[] = [];
        const texturesToDispose: THREE.Texture[] = [];
        const geometriesToDispose: THREE.BufferGeometry[] = [];
        const materialsToDispose: THREE.Material[] = [];

        // 1. Scene & Fog
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020408, 0.0006);

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
        camera.position.set(0, 0, 400);

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // State for parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        // 4. Lighting
        const ambientLight = new THREE.AmbientLight(0x0A1128, 1.8);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xFFF8DC, 3.0, 1500);
        sunLight.position.set(0, 250, -200);
        scene.add(sunLight);

        const moonLight = new THREE.PointLight(0x3B82F6, 2.2, 1200);
        moonLight.position.set(-200, 180, -200);
        scene.add(moonLight);

        const goldLight = new THREE.PointLight(0xFFD700, 1.8, 800);
        goldLight.position.set(150, -100, 100);
        scene.add(goldLight);

        // 5. Starfield
        const starCount = 4000;
        const starGeo = new THREE.BufferGeometry();
        geometriesToDispose.push(starGeo);
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 1800;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1800;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const starCanvas = document.createElement('canvas');
        starCanvas.width = 32;
        starCanvas.height = 32;
        const starCtx = starCanvas.getContext('2d');
        if (starCtx) {
            const grad = starCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.3, 'rgba(243, 229, 171, 0.8)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            starCtx.fillStyle = grad;
            starCtx.fillRect(0, 0, 32, 32);
        }
        const starTexture = new THREE.CanvasTexture(starCanvas);
        texturesToDispose.push(starTexture);

        const starMaterial = new THREE.PointsMaterial({
            size: 3.5,
            map: starTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materialsToDispose.push(starMaterial);

        const stars = new THREE.Points(starGeo, starMaterial);
        scene.add(stars);

        // 6. Galaxy Nebula
        const galaxyCount = 1500;
        const galaxyGeo = new THREE.BufferGeometry();
        geometriesToDispose.push(galaxyGeo);
        const galaxyPositions = new Float32Array(galaxyCount * 3);

        for (let i = 0; i < galaxyCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 500;
            galaxyPositions[i * 3] = Math.cos(angle) * distance;
            galaxyPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
            galaxyPositions[i * 3 + 2] = -600 + Math.sin(angle) * distance;
        }
        galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));

        const galaxyCanvas = document.createElement('canvas');
        galaxyCanvas.width = 64;
        galaxyCanvas.height = 64;
        const galaxyCtx = galaxyCanvas.getContext('2d');
        if (galaxyCtx) {
            const grad = galaxyCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, 'rgba(147, 51, 234, 0.6)');
            grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.3)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            galaxyCtx.fillStyle = grad;
            galaxyCtx.fillRect(0, 0, 64, 64);
        }
        const galaxyTexture = new THREE.CanvasTexture(galaxyCanvas);
        texturesToDispose.push(galaxyTexture);

        const galaxyMaterial = new THREE.PointsMaterial({
            size: 18,
            map: galaxyTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materialsToDispose.push(galaxyMaterial);

        const galaxy = new THREE.Points(galaxyGeo, galaxyMaterial);
        scene.add(galaxy);

        // 7. 8 Planets
        const createPlanetTexture = (baseColor: string, spotColor: string, cloudColor?: string): THREE.CanvasTexture => {
            const pCanvas = document.createElement('canvas');
            pCanvas.width = 256;
            pCanvas.height = 128;
            const pCtx = pCanvas.getContext('2d');
            if (pCtx) {
                pCtx.fillStyle = baseColor;
                pCtx.fillRect(0, 0, 256, 128);

                pCtx.fillStyle = spotColor;
                for (let i = 0; i < 40; i++) {
                    pCtx.beginPath();
                    pCtx.arc(Math.random() * 256, Math.random() * 128, Math.random() * 20 + 5, 0, Math.PI * 2);
                    pCtx.fill();
                }

                if (cloudColor) {
                    pCtx.fillStyle = cloudColor;
                    for (let i = 0; i < 20; i++) {
                        pCtx.fillRect(Math.random() * 256, Math.random() * 128, Math.random() * 60 + 20, Math.random() * 6 + 2);
                    }
                }
            }
            const pTex = new THREE.CanvasTexture(pCanvas);
            texturesToDispose.push(pTex);
            return pTex;
        };

        const planetConfigs = [
            { name: 'Earth', size: 22, pos: [-240, 160, -360] as [number, number, number], texture: createPlanetTexture('#1E3A8A', '#10B981', 'rgba(255,255,255,0.7)'), emissive: 0x1D4ED8, hasAtmosphere: true },
            { name: 'Saturn', size: 26, pos: [250, 170, -420] as [number, number, number], texture: createPlanetTexture('#D97706', '#FDE047', '#FEF08A'), emissive: 0xB45309, hasRings: true },
            { name: 'Jupiter', size: 32, pos: [310, -90, -480] as [number, number, number], texture: createPlanetTexture('#B45309', '#78350F', '#FEF08A'), emissive: 0x92400E },
            { name: 'Mars', size: 14, pos: [-270, -70, -320] as [number, number, number], texture: createPlanetTexture('#991B1B', '#7F1D1D', '#FCA5A5'), emissive: 0x7F1D1D },
            { name: 'Venus', size: 16, pos: [-160, 220, -380] as [number, number, number], texture: createPlanetTexture('#F59E0B', '#D97706', '#FEF08A'), emissive: 0xB45309 },
            { name: 'Mercury', size: 9, pos: [160, 210, -350] as [number, number, number], texture: createPlanetTexture('#64748B', '#334155', '#94A3B8'), emissive: 0x334155 },
            { name: 'Uranus', size: 18, pos: [-290, -160, -420] as [number, number, number], texture: createPlanetTexture('#0284C7', '#0369A1', '#E0F2FE'), emissive: 0x0369A1 },
            { name: 'Neptune', size: 18, pos: [270, -170, -450] as [number, number, number], texture: createPlanetTexture('#1D4ED8', '#1E40AF', '#93C5FD'), emissive: 0x1E40AF }
        ];

        planetConfigs.forEach(cfg => {
            const geo = new THREE.SphereGeometry(cfg.size, 32, 32);
            geometriesToDispose.push(geo);
            const mat = new THREE.MeshStandardMaterial({
                map: cfg.texture,
                roughness: 0.6,
                metalness: 0.2,
                emissive: cfg.emissive || 0x000000,
                emissiveIntensity: 0.15
            });
            materialsToDispose.push(mat);

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...cfg.pos);

            if (cfg.hasRings) {
                const ringGeo = new THREE.RingGeometry(cfg.size * 1.3, cfg.size * 2.1, 64);
                geometriesToDispose.push(ringGeo);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: 0xFDE047,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.75
                });
                materialsToDispose.push(ringMat);
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.rotation.x = Math.PI / 3;
                mesh.add(ringMesh);
            }

            if (cfg.hasAtmosphere) {
                const haloGeo = new THREE.SphereGeometry(cfg.size * 1.15, 32, 32);
                geometriesToDispose.push(haloGeo);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: 0x60A5FA,
                    transparent: true,
                    opacity: 0.25
                });
                materialsToDispose.push(haloMat);
                const haloMesh = new THREE.Mesh(haloGeo, haloMat);
                mesh.add(haloMesh);
            }

            scene.add(mesh);
            planets.push({
                mesh,
                rotSpeed: Math.random() * 0.01 + 0.005,
                initialY: cfg.pos[1],
                sineOffset: Math.random() * Math.PI * 2
            });
        });

        // 8. Golden Stardust
        const stardustCount = 500;
        const stardustGeo = new THREE.BufferGeometry();
        geometriesToDispose.push(stardustGeo);
        const stardustPos = new Float32Array(stardustCount * 3);
        const stardustVel: StardustVelocity[] = [];

        for (let i = 0; i < stardustCount; i++) {
            stardustPos[i * 3] = (Math.random() - 0.5) * 800;
            stardustPos[i * 3 + 1] = (Math.random() - 0.5) * 800;
            stardustPos[i * 3 + 2] = (Math.random() - 0.5) * 600;

            stardustVel.push({
                x: (Math.random() - 0.5) * 0.2,
                y: Math.random() * 0.4 + 0.1,
                z: (Math.random() - 0.5) * 0.2,
                sineOffset: Math.random() * Math.PI * 2
            });
        }
        stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3));

        const goldCanvas = document.createElement('canvas');
        goldCanvas.width = 32;
        goldCanvas.height = 32;
        const goldCtx = goldCanvas.getContext('2d');
        if (goldCtx) {
            const grad = goldCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, 'rgba(255, 215, 0, 1)');
            grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.6)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            goldCtx.fillStyle = grad;
            goldCtx.fillRect(0, 0, 32, 32);
        }
        const goldTexture = new THREE.CanvasTexture(goldCanvas);
        texturesToDispose.push(goldTexture);

        const goldMaterial = new THREE.PointsMaterial({
            size: 4.5,
            map: goldTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materialsToDispose.push(goldMaterial);

        const stardust = new THREE.Points(stardustGeo, goldMaterial);
        scene.add(stardust);

        // 9. Constellations
        const lineCount = 35;
        const linePoints: THREE.Vector3[] = [];
        for (let i = 0; i < lineCount; i++) {
            linePoints.push(new THREE.Vector3(
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 400
            ));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        geometriesToDispose.push(lineGeo);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xD4AF37,
            transparent: true,
            opacity: 0.18
        });
        materialsToDispose.push(lineMat);

        const constellations = new THREE.LineLoop(lineGeo, lineMat);
        scene.add(constellations);

        // 10. Hyperspeed Warp function
        warpHandlerRef.current = (onComplete?: () => void) => {
            isWarpingRef.current = true;
            gsap.to(camera.position, {
                z: -350,
                duration: 1.8,
                ease: 'power4.in',
                onComplete: () => {
                    camera.position.z = 400;
                    isWarpingRef.current = false;
                    if (onComplete) onComplete();
                }
            });

            gsap.to(camera, {
                fov: 120,
                duration: 1.4,
                ease: 'power3.in',
                onUpdate: () => camera.updateProjectionMatrix(),
                onComplete: () => {
                    gsap.to(camera, {
                        fov: 60,
                        duration: 0.6,
                        ease: 'power2.out',
                        onUpdate: () => camera.updateProjectionMatrix()
                    });
                }
            });
        };

        // 11. Event Listeners
        const handleResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX - windowHalfX;
            mouseY = e.clientY - windowHalfY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        // 12. Animation Loop
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            if (stars) {
                stars.rotation.y = elapsedTime * (isWarpingRef.current ? 0.25 : 0.015);
            }
            if (galaxy) {
                galaxy.rotation.y = elapsedTime * 0.008;
            }

            planets.forEach(p => {
                p.mesh.rotation.y = elapsedTime * p.rotSpeed * 5;
                p.mesh.position.y = p.initialY + Math.sin(elapsedTime * 0.6 + p.sineOffset) * 6;
            });

            if (stardust) {
                const positions = stardustGeo.attributes.position.array as Float32Array;
                for (let i = 0; i < stardustCount; i++) {
                    const vel = stardustVel[i];
                    positions[i * 3 + 1] += vel.y * (isWarpingRef.current ? 6 : 1);
                    positions[i * 3] += Math.sin(elapsedTime + vel.sineOffset) * 0.15;

                    if (positions[i * 3 + 1] > 400) {
                        positions[i * 3 + 1] = -400;
                        positions[i * 3] = (Math.random() - 0.5) * 800;
                    }
                }
                stardustGeo.attributes.position.needsUpdate = true;
            }

            if (!isWarpingRef.current) {
                targetMouseX += (mouseX - targetMouseX) * 0.05;
                targetMouseY += (mouseY - targetMouseY) * 0.05;

                camera.position.x = targetMouseX * 0.15;
                camera.position.y = -targetMouseY * 0.15;
            }

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            warpHandlerRef.current = null;

            texturesToDispose.forEach(t => t.dispose());
            geometriesToDispose.forEach(g => g.dispose());
            materialsToDispose.forEach(m => m.dispose());
            renderer.dispose();
        };
    }, []);

    return <canvas id="webgl-canvas" ref={canvasRef} />;
});
