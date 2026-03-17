/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpinningWireframe } from './SpinningWireframe';
import { PlexusNetwork } from './PlexusNetwork';
import { useHyperFocus } from '../HyperFocusContext';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

gsap.registerPlugin(ScrollTrigger);

// Helper component to fade elements based on distance to camera
function FadeSection({ position, children, fadeEnd = 20, fadeStart = 0 }) {
    const group = useRef();
    const target = useMemo(() => new THREE.Vector3(), []);

    useFrame(({ camera }) => {
        if (group.current) {
            group.current.getWorldPosition(target);
            const dist = camera.position.distanceTo(target);
            
            // Calculate opacity: 1 at fadeStart, 0 at fadeEnd
            let opacity = 1.0 - ((dist - fadeStart) / (fadeEnd - fadeStart));
            opacity = Math.max(0, Math.min(1, opacity));

            // Hide everything if too far (helps performance)
            group.current.visible = opacity > 0.001;

            // Fade Materials in this group
            if (opacity > 0.001) {
                group.current.traverse((child) => {
                    if (child.isMesh && child.material) {
                        if (!child.userData.originalOpacity) {
                            child.userData.originalOpacity = child.material.opacity !== undefined ? child.material.opacity : 1;
                        }
                        child.material.transparent = true;
                        child.material.opacity = child.userData.originalOpacity * Math.pow(opacity, 1.5);
                    }
                });
            }
        }
    });

    return (
        <group position={position} ref={group}>
            {children}
        </group>
    );
}

FadeSection.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    children: PropTypes.node.isRequired,
    fadeEnd: PropTypes.number,
    fadeStart: PropTypes.number,
};

// --- LEVEL 8: SPACE DEBRIS INSTANCED MESH ---
const SpaceDebris = () => {
    const meshRef = useRef();
    const count = 1400;
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 80;
            const y = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 200;
            temp.push({
                x, y, z,
                rx: Math.random() * Math.PI,
                ry: Math.random() * Math.PI,
                rz: Math.random() * Math.PI,
                scale: Math.random() * 0.3 + 0.1,
                speedX: (Math.random() - 0.5) * 0.005,
                speedY: (Math.random() - 0.5) * 0.005,
                speedZ: (Math.random() - 0.5) * 0.005
            });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if (!meshRef.current) return;
        particles.forEach((p, i) => {
            p.rx += p.speedX;
            p.ry += p.speedY;
            p.rz += p.speedZ;
            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.set(p.rx, p.ry, p.rz);
            dummy.scale.set(p.scale, p.scale, p.scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial 
                transmission={1} 
                roughness={0.1} 
                metalness={0.8}
                ior={1.5} 
                thickness={0.5}
                color="#ffffff"
                transparent
                opacity={0.8}
            />
        </instancedMesh>
    );
};

export function TrackJourney() {
    const { camera, scene } = useThree();
    const groupRef = useRef();
    const chromaRef = useRef();
    const bloomRef = useRef();
    const { hyperFocus } = useHyperFocus();

    // Color definitions (Subtle, dark space tints to preserve stars/particles visibility)
    const colorStops = useMemo(() => [
        new THREE.Color('#000005'), // 0: Deep Space Blue (Base)
        new THREE.Color('#000a12'), // 1: Very Dark Cyan hint
        new THREE.Color('#120012'), // 2: Very Dark Magenta/Purple hint
        new THREE.Color('#111111'), // 3: Dark Grey/Gold aura (Core)
    ], []);

    // 1. Define the Spline Curve (The Track)
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 5),        // Start slightly pulled back
            new THREE.Vector3(0, 0, 0),        // Hero
            new THREE.Vector3(15, 3, -25),     // Curve right to platforms
            new THREE.Vector3(-15, -6, -55),   // Curve left, go deep down
            new THREE.Vector3(0, 0, -80),      // Straighten out
            new THREE.Vector3(30, 15, -110),   // Up and right
            new THREE.Vector3(0, 0, -140)      // Final Core
        ]);
    }, []);

    // 2. Tracking the scroll progress
    const progressRef = useRef(0);
    const lastProgressRef = useRef(0);
    const scrollVelocityRef = useRef(0);

    useEffect(() => {
        ScrollTrigger.create({
            trigger: "#story-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 2.5, // Cinematographic inertia
            onUpdate: (self) => {
                progressRef.current = self.progress;
            }
        });

        // Set initial camera position
        camera.position.copy(curve.getPointAt(0));
        camera.lookAt(curve.getPointAt(0.01));

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [camera, curve]);

    // 3. Move Camera along the curve and handle colors
    useFrame(() => {
        const t = progressRef.current;
        
        // --- WARP SPEED POST-PROCESSING & FOV ---
        const velocity = Math.abs(t - lastProgressRef.current);
        scrollVelocityRef.current = THREE.MathUtils.lerp(scrollVelocityRef.current, velocity * 200, 0.1);
        lastProgressRef.current = t;

        // Base FOV is 60. Add scroll velocity factor.
        const targetFov = hyperFocus ? 60 : 60 + (scrollVelocityRef.current * 15);
        camera.fov = THREE.MathUtils.lerp(camera.fov, Math.min(targetFov, 90), 0.1);
        camera.updateProjectionMatrix();

        if (chromaRef.current) {
            const aberrationStrength = hyperFocus ? 0.002 : 0.002 + (scrollVelocityRef.current * 0.03);
            chromaRef.current.offset.set(aberrationStrength, aberrationStrength);
        }

        // --- AMBIENT COLOR SHIFT ---
        // Interpolate background and fog based on scroll progress
        let targetColor;
        if (t < 0.3) {
            targetColor = colorStops[0].clone().lerp(colorStops[1], t / 0.3);
        } else if (t < 0.6) {
            targetColor = colorStops[1].clone().lerp(colorStops[2], (t - 0.3) / 0.3);
        } else {
            targetColor = colorStops[2].clone().lerp(colorStops[3], (t - 0.6) / 0.4);
        }

        if (scene.background) scene.background.lerp(targetColor, 0.1);
        if (scene.fog) scene.fog.color.lerp(targetColor, 0.1);


        // --- CAMERA MOVEMENT ---
        // Determine Target Position and LookAt
        let targetPos = new THREE.Vector3();
        let targetLookAt = new THREE.Vector3();
        let targetBloomIntensity = 1.5;
        let targetBloomThreshold = 0.2;

        if (hyperFocus) {
            // Hyper-Focus Mode: Zoom into the current station
            switch (hyperFocus) {
                case 1: // Hero
                    targetPos.set(0, 0, 1);
                    targetLookAt.set(0, 0, -5);
                    break;
                case 2: // Piattaforme
                    targetPos.set(window.innerWidth < 768 ? 0 : -3, window.innerWidth < 768 ? 4 : 0, -25);
                    targetLookAt.set(window.innerWidth < 768 ? 0 : -6, window.innerWidth < 768 ? 4 : 0, -30);
                    break;
                case 3: // Sviluppo IA
                    targetPos.set(window.innerWidth < 768 ? 0 : 2, window.innerWidth < 768 ? 5 : 0, -55);
                    targetLookAt.set(window.innerWidth < 768 ? 0 : 5, window.innerWidth < 768 ? 5 : 0, -62);
                    break;
                case 4: // Core
                    targetPos.set(0, window.innerWidth < 768 ? 2 : 0, -125);
                    targetLookAt.set(0, window.innerWidth < 768 ? 6 : 4, -137);
                    break;
                default:
                    // Fallback to curve
                    targetPos.copy(curve.getPointAt(Math.min(t, 0.999)));
                    targetLookAt.copy(curve.getPointAt(Math.min(t + 0.05, 1.0)));
            }
        } else {
            // Normal Curve Scrolling
            if (t > 0.95 && t <= 1.0) {
                // Event Horizon Dive
                const ehProgress = (t - 0.95) / 0.05; // 0 to 1
                
                const startDive = curve.getPointAt(0.95);
                const coreCenter = new THREE.Vector3(0, window.innerWidth < 768 ? 6 : 4, -137);
                
                // Accelerate into the core
                targetPos.lerpVectors(startDive, coreCenter, Math.pow(ehProgress, 2)); 
                targetLookAt.copy(coreCenter).add(new THREE.Vector3(0,0,-10)); // Look past it
                
                // Massive bloom
                targetBloomIntensity = 1.5 + (ehProgress * 30); 
                targetBloomThreshold = Math.max(0, 0.2 - (ehProgress * 0.2));
            } else {
                targetPos.copy(curve.getPointAt(Math.min(t, 0.999)));
                targetLookAt.copy(curve.getPointAt(Math.min(t + 0.05, 1.0)));
            }
        }

        // Apply camera lerps
        const posLerpFactor = hyperFocus ? 0.08 : 0.03; 
        const lookLerpFactor = hyperFocus ? 0.1 : 0.05;

        camera.position.lerp(targetPos, posLerpFactor);
        
        const currentLookAt = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
        currentLookAt.lerp(targetLookAt, lookLerpFactor);
        camera.lookAt(currentLookAt);

        // Apply Bloom
        if (bloomRef.current) {
            bloomRef.current.intensity = THREE.MathUtils.lerp(bloomRef.current.intensity, targetBloomIntensity, 0.1);
            bloomRef.current.luminanceThreshold = THREE.MathUtils.lerp(bloomRef.current.luminanceThreshold, targetBloomThreshold, 0.1);
        }
    });

    // 4. Background Particles (Space dust)
    const dustCount = 3000;
    const [dustPositions, dustScales] = useMemo(() => {
        const pos = new Float32Array(dustCount * 3);
        const sc = new Float32Array(dustCount);
        for(let i=0; i<dustCount; i++) {
            pos[i*3] = (Math.random() - 0.5) * 150;
            pos[i*3+1] = (Math.random() - 0.5) * 150;
            pos[i*3+2] = (Math.random() - 0.5) * 200; // Spread along Z
            sc[i] = Math.random() * 0.5 + 0.1;
        }
        return [pos, sc];
    }, []);

    return (
        <group ref={groupRef}>
            {/* --- CINEMATIC ENVIRONMENT --- */}
            <fog attach="fog" args={['#000002', 10, 80]} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={200} scale={50} size={2} speed={0.4} opacity={0.2} color="#4da6ff" />

            {/* Ambient Stars / Dust (moving with camera) */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={dustPositions.length / 3} array={dustPositions} itemSize={3} />
                    <bufferAttribute attach="attributes-scale" count={dustScales.length} array={dustScales} itemSize={1} />
                </bufferGeometry>
                <pointsMaterial size={0.1} color={[0, 0.5, 2]} transparent opacity={0.6} sizeAttenuation={true} blending={THREE.AdditiveBlending} />
            </points>

            {/* --- WAYPOINT 1: HERO (z: -5) --- */}
            {/* Kept empty or with pure 3D elements if needed. Texts are in UIOverlay now. */}
            <FadeSection position={[0, -0.5, -5]} fadeStart={5} fadeEnd={20}>
                {null}
            </FadeSection>

            {/* --- WAYPOINT 2: PIATTAFORME (z: -30) --- */}
            <FadeSection position={[0, 0, -30]} fadeStart={8} fadeEnd={25}>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
                    <group>
                        {/* Visual Representation (Left side) */}
                        <group position={[window.innerWidth < 768 ? 0 : -6, window.innerWidth < 768 ? 4 : 0, 0]}>
                            <SpinningWireframe />
                        </group>
                    </group>
                </Float>
            </FadeSection>

            {/* --- WAYPOINT 3: SVILUPPO IA (z: -60) --- */}
            <FadeSection position={[0, -1, -60]} fadeStart={8} fadeEnd={25}>
                <group>
                    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
                        <group position={[window.innerWidth < 768 ? 0 : 5, window.innerWidth < 768 ? 5 : 0, -2]}>
                            {/* Neural Network Plexus Effect */}
                            <PlexusNetwork count={window.innerWidth < 768 ? 50 : 120} radius={window.innerWidth < 768 ? 8 : 15} />
                        </group>
                    </Float>
                </group>
            </FadeSection>

            {/* --- WAYPOINT 4: END-TO-END / CORE (z: -130) --- */}
            <FadeSection position={[0, -2, -132]} fadeStart={15} fadeEnd={45}>
                <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
                    <group>
                        <mesh position={[0, window.innerWidth < 768 ? 6 : 4, -5]}>
                            <sphereGeometry args={[window.innerWidth < 768 ? 1.5 : 2.5, 64, 64]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                        {/* Inner Glow sphere */}
                        <mesh position={[0, window.innerWidth < 768 ? 6 : 4, -5]} scale={1.2}>
                            <sphereGeometry args={[window.innerWidth < 768 ? 1.5 : 2.5, 64, 64]} />
                            <meshBasicMaterial color="#0066ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                        </mesh>
                        {/* Outer aura */}
                        <mesh position={[0, window.innerWidth < 768 ? 6 : 4, -5]} scale={2.5}>
                            <sphereGeometry args={[window.innerWidth < 768 ? 1.5 : 2.5, 32, 32]} />
                            <meshBasicMaterial color="#0066ff" transparent opacity={0.2} wireframe blending={THREE.AdditiveBlending} />
                        </mesh>
                    </group>
                </Float>
            </FadeSection>

            {/* --- LEVEL 8: SPACE DEBRIS --- */}
            <SpaceDebris />

            {/* --- LEVEL 8: POST PROCESSING WITHIN JOURNEY --- */}
            <EffectComposer disableNormalPass>
                <Bloom 
                    ref={bloomRef}
                    luminanceThreshold={0.2} 
                    luminanceSmoothing={0.9} 
                    height={300} 
                    intensity={1.5}
                />
                <ChromaticAberration 
                    ref={chromaRef}
                    offset={new THREE.Vector2(0.002, 0.002)} 
                    blendFunction={BlendFunction.NORMAL} 
                />
                <Noise opacity={0.03} />
            </EffectComposer>
        </group>
    );
}
