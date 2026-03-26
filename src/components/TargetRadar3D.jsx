import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function FloatingTarget({ position, color, onLock, isLocked, speedOffset }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    
    useEffect(() => {
        if (hovered && !isLocked) {
            document.body.style.cursor = 'crosshair';
        } else {
            document.body.style.cursor = 'auto';
        }
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered, isLocked]);

    useFrame((state) => {
        if (!meshRef.current) return;
        
        if (!isLocked) {
            const time = state.clock.getElapsedTime();
            meshRef.current.position.y = position[1] + Math.sin(time * 2 + speedOffset) * 0.5;
            meshRef.current.position.x = position[0] + Math.cos(time * 1.5 + speedOffset) * 0.4;
            meshRef.current.position.z = position[2] + Math.sin(time + speedOffset) * 0.3;
            meshRef.current.rotation.x += 0.02;
            meshRef.current.rotation.y += 0.02;
        } else {
            meshRef.current.scale.lerp(new THREE.Vector3(0.5, 0.5, 0.5), 0.1);
            meshRef.current.rotation.x -= 0.05;
            meshRef.current.rotation.y -= 0.05;
        }
    });

    return (
        <group>
            <mesh 
                ref={meshRef} 
                position={position}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} 
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
                onClick={(e) => { e.stopPropagation(); if(!isLocked) onLock(); }}
            >
                <icosahedronGeometry args={[0.3, 1]} />
                <meshBasicMaterial 
                    color={isLocked ? "#10b981" : (hovered ? "#34d399" : color)} 
                    wireframe 
                    transparent 
                    opacity={isLocked ? 0.3 : (hovered ? 1 : 0.6)}
                />
                {isLocked && (
                    <Html center distanceFactor={10} zIndexRange={[100, 0]} className="pointer-events-none">
                        <div className="text-emerald-400 font-mono text-[6px] tracking-widest font-bold bg-emerald-900/40 px-1 rounded border border-emerald-500/30">
                            LOCKED
                        </div>
                    </Html>
                )}
            </mesh>
        </group>
    );
}

function RadarScene({ setLockedCount }) {
    const [targets, setTargets] = useState([
        { id: 1, pos: [-1.4, 0.5, 0], color: "#0ea5e9", locked: false, speedOffset: 0 },
        { id: 2, pos: [0, -0.8, -1.2], color: "#2dd4bf", locked: false, speedOffset: Math.PI / 2 },
        { id: 3, pos: [1.4, 0.2, 0.5], color: "#818cf8", locked: false, speedOffset: Math.PI }
    ]);

    const handleLock = (id) => {
        setTargets(prev => {
            const next = prev.map(t => t.id === id ? { ...t, locked: true } : t);
            setLockedCount(next.filter(t => t.locked).length);
            return next;
        });
    };

    return (
        <>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
            
            {/* Center Core Scanner */}
            <mesh>
                <sphereGeometry args={[1.5, 12, 12]} />
                <meshBasicMaterial color="#020617" wireframe transparent opacity={0.2} />
            </mesh>
            
            {/* Outer Field */}
            <mesh>
                <sphereGeometry args={[2.5, 8, 8]} />
                <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.05} />
            </mesh>

            {targets.map(t => (
                <FloatingTarget 
                    key={t.id} 
                    position={t.pos} 
                    color={t.color} 
                    isLocked={t.locked} 
                    speedOffset={t.speedOffset}
                    onLock={() => handleLock(t.id)} 
                />
            ))}
        </>
    );
}

export function TargetRadar3D() {
    const [lockedCount, setLockedCount] = useState(0);

    return (
        <div className="w-full h-40 md:h-48 mb-6 mt-2 relative rounded-lg overflow-hidden border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] bg-[#02050a] flex items-center justify-center group pointer-events-auto">
            {lockedCount === 3 && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-900/30 backdrop-blur-sm pointer-events-none transition-all duration-1000">
                    <div className="text-emerald-400 font-mono text-sm tracking-widest animate-pulse font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                        PROFILAZIONE COMPLETATA
                    </div>
                    <div className="text-emerald-400/80 font-mono text-[10px] tracking-widest mt-2">
                        ACCESSO CLASSIFICATO AUTORIZZATO
                    </div>
                </div>
            )}
            
            <div className={`absolute inset-0 transition-opacity duration-1000 z-10 ${lockedCount === 3 ? 'opacity-30' : 'opacity-100'}`}>
                <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                    <RadarScene setLockedCount={setLockedCount} />
                </Canvas>
            </div>

            {lockedCount < 3 && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-emerald-500/30 text-[8px] font-mono text-emerald-400 z-20 pointer-events-none">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> 
                    INTERCEPT TARGETS: {lockedCount}/3
                </div>
            )}
            
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-20 pointer-events-none">
                <span className="text-[8px] font-mono text-emerald-400/30">SYS.RADAR_MODULE</span>
                <span className="text-[7px] font-mono text-emerald-400/20">AWAITING_LOCK</span>
            </div>
            
            <div className="absolute bottom-2 left-0 w-full text-center text-[9px] font-mono text-emerald-400/60 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                {lockedCount < 3 ? "CLICCA SUI NODI FLUTTUANTI PER ESEGUIRE IL LOCK" : ""}
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTYsIDE4NSwgMTI5LCAwLjgpIi8+PC9zdmc+')] mix-blend-screen" />
        </div>
    );
}
