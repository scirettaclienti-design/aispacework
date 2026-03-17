import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vortexVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const vortexFragmentShader = `
    uniform float iTime;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Pseudo-random noise
    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
    }

    void main() {
        vec2 uv = vUv;
        // Flow upwards
        float flow = fract(uv.y * 3.0 - iTime * 1.5);
        // Add noise for a "data stream" broken effect
        float n = noise(vec2(uv.x * 20.0, uv.y * 10.0 - iTime * 2.0));
        
        float intensity = smoothstep(0.4, 0.6, flow) * smoothstep(0.8, 0.6, flow);
        intensity *= (0.3 + 0.7 * n); 
        
        // Fade out at top and bottom edges
        float edgeFade = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
        
        // Output HDR color
        gl_FragColor = vec4(mix(color1, color2, vUv.x), intensity * edgeFade);
    }
`;

export function SpinningWireframe() {
    const groupRef = useRef();
    
    const uniforms1 = useMemo(() => ({
        iTime: { value: 0 },
        color1: { value: new THREE.Color(0, 0.5, 3) }, // HDR base
        color2: { value: new THREE.Color(0.2, 1.0, 5) }  // HDR highlight
    }), []);
    
    const uniforms2 = useMemo(() => ({
        iTime: { value: 0 },
        color1: { value: new THREE.Color(0.5, 1.5, 5) },
        color2: { value: new THREE.Color(1.0, 2.0, 6) }
    }), []);
    
    const uniforms3 = useMemo(() => ({
        iTime: { value: 0 },
        color1: { value: new THREE.Color(2, 2, 5) },
        color2: { value: new THREE.Color(3, 3, 6) }
    }), []);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        
        uniforms1.iTime.value = time;
        uniforms2.iTime.value = time * 1.2;
        uniforms3.iTime.value = time * 0.8;
        
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x += delta * 0.1;
            
            if (groupRef.current.children[0]) {
                groupRef.current.children[0].rotation.z -= delta * 0.3;
            }
            if (groupRef.current.children[1]) {
                groupRef.current.children[1].rotation.x += delta * 0.4;
            }
        }
    });

    return (
        <group ref={groupRef} scale={window.innerWidth < 768 ? 1 : 1.5}>
            <mesh>
                <cylinderGeometry args={[2, 2, 6, 32, 1, true]} />
                <shaderMaterial 
                    vertexShader={vortexVertexShader} 
                    fragmentShader={vortexFragmentShader} 
                    uniforms={uniforms1}
                    transparent 
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <cylinderGeometry args={[1.5, 1.5, 8, 32, 1, true]} />
                <shaderMaterial 
                    vertexShader={vortexVertexShader} 
                    fragmentShader={vortexFragmentShader} 
                    uniforms={uniforms2}
                    transparent 
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <cylinderGeometry args={[1, 1, 10, 16, 1, true]} />
                <shaderMaterial 
                    vertexShader={vortexVertexShader} 
                    fragmentShader={vortexFragmentShader} 
                    uniforms={uniforms3}
                    transparent 
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}
