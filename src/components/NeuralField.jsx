/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NeuralField() {
    const pointsRef = useRef();
    
    // Generate particles
    const particleCount = 2000;
    const [positions, scales] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const sc = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            // Distribute points in a wide, deep volume
            pos[i * 3] = (Math.random() - 0.5) * 40; // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 40; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10; // z (pushed back)
            
            sc[i] = Math.random() * 1.5;
        }
        
        return [pos, sc];
    }, [particleCount]);

    // Simple vertex shader to handle sizes
    const vertexShader = `
        attribute float scale;
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = scale * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    // Fragment shader for smooth, glowing dots
    const fragmentShader = `
        void main() {
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float ll = length(xy);
            if(ll > 0.5) discard;
            
            // Soft glow effect (white/cyan tint)
            float intensity = pow(1.0 - (ll * 2.0), 1.5);
            gl_FragColor = vec4(0.3, 0.6, 1.0, intensity * 0.6);
        }
    `;

    useFrame((state) => {
        if (!pointsRef.current) return;
        
        const time = state.clock.getElapsedTime();
        
        // Gentle, slow rotation
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.x = time * 0.01;
        
        // Subtle breathing effect
        const breath = Math.sin(time * 0.5) * 0.05 + 1;
        pointsRef.current.scale.set(breath, breath, breath);
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-scale"
                    count={scales.length}
                    array={scales}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
