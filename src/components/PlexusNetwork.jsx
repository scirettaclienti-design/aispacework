import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PlexusNetwork({ count = 100, radius = 15 }) {
    const pointsRef = useRef();
    const linesRef = useRef();

    const [positions, linePositions] = useMemo(() => {
        const pos = [];
        for(let i=0; i<count; i++) {
            pos.push(
                (Math.random() - 0.5) * radius * 2,
                (Math.random() - 0.5) * radius * 2,
                (Math.random() - 0.5) * radius * 2
            );
        }
        
        const pts = [];
        for(let i=0; i<count; i++) {
            pts.push(new THREE.Vector3(pos[i*3], pos[i*3+1], pos[i*3+2]));
        }
        
        const linePos = [];
        for(let i=0; i<count; i++) {
            for(let j=i+1; j<count; j++) {
                if(pts[i].distanceTo(pts[j]) < radius * 0.4) {
                    linePos.push(
                        pts[i].x, pts[i].y, pts[i].z,
                        pts[j].x, pts[j].y, pts[j].z
                    );
                }
            }
        }
        
        return [new Float32Array(pos), new Float32Array(linePos)];
    }, [count, radius]);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        if(pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.05;
            pointsRef.current.rotation.x += delta * 0.02;
            // Pulsing core nodes
            pointsRef.current.material.opacity = 0.6 + Math.sin(time * 2) * 0.4;
        }
        if(linesRef.current) {
            linesRef.current.rotation.y += delta * 0.05;
            linesRef.current.rotation.x += delta * 0.02;
            // Pulsing connecting lines
            linesRef.current.material.opacity = 0.2 + Math.sin(time * 1.5) * 0.2;
        }
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color={[1, 2, 5]} size={0.15} transparent opacity={1} sizeAttenuation={true} blending={THREE.AdditiveBlending} />
            </points>
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color={[0, 0.5, 2]} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </lineSegments>
        </group>
    );
}
