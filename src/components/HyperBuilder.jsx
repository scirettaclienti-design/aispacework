import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const TypewriterText = React.memo(({ text, onComplete }) => {
    const [displayed, setDisplayed] = useState('');
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
    useEffect(() => {
        setDisplayed('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) { setDisplayed(prev => prev + text.charAt(i)); i++; }
            else { clearInterval(interval); if (onCompleteRef.current) onCompleteRef.current(); }
        }, 30);
        return () => clearInterval(interval);
    }, [text]);
    return <span>{displayed}</span>;
});


export function HyperBuilder({ isOpen, onClose }) {
    const [phase, setPhase] = useState(0);

    const rx = useMotionValue(0);
    const rz = useMotionValue(0);
    const s = useMotionValue(1);

    const handleMouseMove = (e) => {
        if (phase < 5) return;
        const targetRx = 60 - (e.clientY - window.innerHeight / 2) * 0.05;
        const targetRz = -45 + (e.clientX - window.innerWidth / 2) * 0.05;
        animate(rx, targetRx, { type: "tween", ease: "easeOut", duration: 0.5 });
        animate(rz, targetRz, { type: "tween", ease: "easeOut", duration: 0.5 });
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setPhase(0);
            rx.set(0);
            rz.set(0);
            s.set(1);
            
            const isMobile = window.innerWidth <= 768;
            const targetScale = isMobile ? 0.6 : 0.9;

            // Phase 1: 2D Entry (0.0s - 1.0s)
            const t1 = setTimeout(() => setPhase(1), 100);
            
            // Phase 2: Isometric 3D Rotation (1.0s - 2.5s)
            const t2 = setTimeout(() => {
                setPhase(2);
                animate(rx, 60, { duration: 1.5, ease: [0.25, 1, 0.5, 1] });
                animate(rz, -45, { duration: 1.5, ease: [0.25, 1, 0.5, 1] });
                animate(s, targetScale, { duration: 1.5, ease: [0.25, 1, 0.5, 1] });
            }, 1000);
            
            // Phase 3: Data Population (2.5s - 3.5s)
            const t3 = setTimeout(() => setPhase(3), 2500);
            
            // Phase 4: Structural Mutation (4.0s - 5.0s)
            const t4 = setTimeout(() => setPhase(4), 4000);
            
            // Phase 5: Floating Tags & Close Button (5.0s)
            const t5 = setTimeout(() => setPhase(5), 5000);

            // Phase 6: Finalization (6.0s)
            const t6 = setTimeout(() => setPhase(6), 6500);

            return () => {
                clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
            };
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const cardsOrder = phase >= 4 ? [2, 1, 0] : [0, 1, 2];

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-[#050a10] flex flex-col items-center justify-center p-4 overflow-hidden"
                style={{ perspective: "1500px" }}
                onMouseMove={handleMouseMove}
            >
                {/* Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBWMGgtLjV2NDB6IiBmaWxsPSJyZ2JhKDM0LCAyMTEsIDIzOCwgMSkiLz48L3N2Zz4=')]" style={{ backgroundSize: '40px 40px' }} />

                {/* Building Container */}
                <motion.div 
                    style={{ rotateX: rx, rotateZ: rz, scale: s, transformStyle: "preserve-3d" }}
                    className="relative w-full max-w-6xl h-[70vh] flex flex-col gap-6 p-6 md:p-12 border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.1)] origin-center"
                >
                    {/* Laser Scanner Effect */}
                    <AnimatePresence>
                        {phase >= 2 && (
                            <motion.div 
                                initial={{ top: "0%" }}
                                animate={{ top: "100%" }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-cyan-400 z-50 pointer-events-none mix-blend-screen"
                                style={{ boxShadow: "0 0 30px 10px rgba(34,211,238,0.6)", transform: "translateZ(10px)" }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Header */}
                    <motion.div 
                        initial={{ y: -50, opacity: 0 }}
                        animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-full h-12 md:h-16 border border-cyan-400/50 bg-cyan-400/10 rounded-lg flex items-center px-6"
                    >
                        <div className="w-12 h-4 bg-cyan-400/40 rounded-sm" />
                        <div className="ml-auto flex gap-4">
                            <AnimatePresence>
                                {phase >= 3 && [0,1,2].map(i => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 32 }}
                                        className="h-2 bg-cyan-400/80 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Hero */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                        className="w-full flex-1 border border-cyan-400/50 bg-cyan-400/20 rounded-xl relative overflow-hidden flex flex-col items-center justify-center gap-6"
                    >
                        <motion.div 
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent skew-x-12"
                        />
                        {/* Skeleton elements inside Hero populated at phase 3 */}
                        <AnimatePresence>
                            {phase >= 6 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-950/80 backdrop-blur-xl z-20 rounded-xl border border-cyan-400/50 p-6 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
                            >
                                {/* Top bar */}
                                <div className="w-full h-8 border-b border-cyan-400/30 flex items-center justify-between mb-6 pb-2">
                                    <div className="text-cyan-300 font-mono text-[10px] md:text-xs uppercase tracking-widest"><TypewriterText text="SYS.DASHBOARD_LIVE" /></div>
                                    <div className="flex gap-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/><div className="w-2 h-2 bg-cyan-400 rounded-full"/></div>
                                </div>
                                
                                {/* Core message */}
                                <div className="flex items-center gap-6 mb-8 w-full justify-center lg:justify-start lg:pl-4">
                                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                                        <div className="w-6 h-10 md:w-8 md:h-12 border-b-4 border-r-4 border-cyan-300 transform rotate-45 -translate-y-2"></div>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-white font-display font-black text-2xl md:text-3xl tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.5)] drop-shadow-lg mb-1">SISTEMA ONLINE</h3>
                                        <p className="text-cyan-200/80 font-mono text-[10px] md:text-[11px] tracking-widest uppercase">Ecosistema Popolato & Ottimizzato</p>
                                    </div>
                                </div>

                                {/* Content Simulation */}
                                <div className="w-full flex gap-4 h-full min-h-[120px] mb-2 pointer-events-auto">
                                    <motion.div whileHover={{ scale: 1.02 }} className="flex-1 bg-black/40 border border-cyan-500/20 rounded-md p-4 flex flex-col justify-end cursor-crosshair">
                                        <div className="flex items-end gap-2 w-full h-[60px]">
                                            {[40, 70, 45, 90, 60, 100].map((h, i) => (
                                                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i*0.1 }} className="flex-1 w-full bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-t-sm" />
                                            ))}
                                        </div>
                                        <div className="mt-4 font-mono text-[9px] md:text-[10px] text-cyan-400 truncate">TRAFFICO AI: +340%</div>
                                    </motion.div>
                                    
                                    <motion.div whileHover={{ scale: 1.02 }} className="flex-[1.5] bg-black/40 border border-purple-500/20 rounded-md p-4 flex flex-col gap-2 cursor-crosshair overflow-hidden">
                                        <div className="font-mono text-[10px] text-purple-400 font-bold mb-1 truncate">LOG GENERAZIONE CONTENUTI</div>
                                         <div className="w-full font-mono text-[8px] md:text-[9px] text-purple-200/70 truncate"><TypewriterText text="[OK] Copywriting SEO generato." /></div>
                                         <div className="w-full font-mono text-[8px] md:text-[9px] text-purple-200/70 truncate"><TypewriterText text="[OK] Layout adattivo compilato." /></div>
                                         <div className="w-full font-mono text-[8px] md:text-[9px] text-purple-200/70 truncate"><TypewriterText text="[OK] Asset 3D texturizzati." /></div>
                                         <div className="mt-auto w-20 md:w-24 h-5 md:h-6 flex items-center justify-center bg-purple-500/80 rounded-sm font-sans text-[8px] text-white">READY</div>
                                    </motion.div>
                                </div>
                            </motion.div>
                            ) : phase >= 3 ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 w-full pointer-events-auto">
                                <motion.div 
                                    whileHover={{ width: "80%", scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-1/2 h-8 md:h-12 bg-cyan-900/60 border border-cyan-400/50 rounded-md shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center cursor-ew-resize overflow-hidden"
                                >
                                    <div className="font-mono text-[10px] md:text-xs text-cyan-200 truncate px-2"><TypewriterText text="<Modulo_Hero_Dinamico />" /></div>
                                </motion.div>
                                
                                <div className="flex gap-4 w-full px-8 md:px-12 justify-center">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, flexGrow: 1 }}
                                        className="w-1/3 h-16 md:h-20 bg-purple-900/40 border border-purple-500/30 rounded-md flex flex-col items-center justify-center cursor-nwse-resize"
                                    >
                                        <div className="font-mono text-[10px] md:text-xs text-purple-300">DATA_LAKE</div>
                                        <div className="font-mono text-[8px] text-purple-400/50 mt-1"><TypewriterText text="Sync in corso..." /></div>
                                    </motion.div>
                                    
                                    <motion.div 
                                        whileHover={{ scale: 1.1, flexGrow: 1 }}
                                        className="w-1/3 h-16 md:h-20 bg-cyan-900/40 border border-cyan-500/30 rounded-md flex flex-col items-center justify-center cursor-nwse-resize"
                                    >
                                        <div className="font-mono text-[10px] md:text-xs text-cyan-300">UI_ENGINE</div>
                                        <div className="font-mono text-[8px] text-cyan-400/50 mt-1"><TypewriterText text="Compiling..." /></div>
                                    </motion.div>
                                </div>

                                <motion.div 
                                    whileHover={{ width: "60%" }}
                                    className="w-40 h-10 mt-2 bg-purple-500/80 rounded-full border border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.8)] cursor-pointer flex items-center justify-center overflow-hidden"
                                >
                                    <div className="font-mono text-[10px] text-white tracking-widest">OTTIMIZZA</div>
                                </motion.div>
                            </motion.div>
                            ) : (
                                <motion.div exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 w-full">
                                    <div className="w-1/2 h-8 md:h-12 bg-cyan-400/30 rounded-md" />
                                    <div className="w-1/3 h-4 bg-cyan-400/20 rounded-md" />
                                    <div className="w-40 h-10 mt-4 bg-cyan-400/40 rounded-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* 3 Cards */}
                    <div className="w-full h-32 md:h-48 flex gap-4 md:gap-6">
                        <AnimatePresence>
                            {cardsOrder.map((id, index) => (
                                <motion.div 
                                    layout
                                    key={`card-${id}`}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: phase >= 4 ? 0 : 0.4 + (index * 0.1) }}
                                    className="flex-1 border border-cyan-400/40 bg-cyan-400/10 rounded-lg p-6 flex flex-col gap-4"
                                >
                                    {phase >= 3 ? (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full h-full">
                                            <div className="w-12 h-12 bg-purple-400/60 shadow-[0_0_15px_rgba(192,132,252,0.6)] rounded-full" />
                                            <div className="w-2/3 h-4 bg-cyan-300/60 rounded-sm" />
                                            <div className="w-1/2 h-2 bg-cyan-200/40 rounded-sm" />
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col gap-4 w-full h-full">
                                            <div className="w-12 h-12 bg-cyan-400/20 rounded-full" />
                                            <div className="w-2/3 h-4 bg-cyan-400/30 rounded-sm" />
                                            <div className="w-1/2 h-2 bg-cyan-400/20 rounded-sm" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Floating Tags & Close Button */}
                <AnimatePresence>
                    {phase >= 5 && (
                        <>
                            {/* Floating Stats Left / Top (Mobile) */}
                            <motion.div 
                                initial={{ opacity: 0, x: window.innerWidth <= 768 ? 0 : -50, y: window.innerWidth <= 768 ? -20 : 0 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute top-12 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-24 md:top-1/3 z-20 flex flex-col md:flex-row items-center group pointer-events-none gap-2 md:gap-0"
                            >
                                <div className="bg-cyan-950/60 border border-cyan-400/40 backdrop-blur-xl px-4 py-3 rounded-md font-mono text-xs md:text-sm text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                    <span className="text-cyan-400">&gt;</span> Setup Architettura: <span className="font-bold tracking-widest text-cyan-200">COMPLETATO</span>
                                </div>
                                <div className="w-[1px] h-12 md:w-32 md:h-[1px] bg-gradient-to-b md:bg-gradient-to-r from-cyan-400/80 to-transparent" />
                            </motion.div>

                            {/* Floating Stats Right / Bottom (Mobile) */}
                            <motion.div 
                                initial={{ opacity: 0, x: window.innerWidth <= 768 ? 0 : 50, y: window.innerWidth <= 768 ? 20 : 0 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="absolute bottom-32 left-1/2 -translate-x-1/2 md:-translate-x-0 md:right-24 md:left-auto md:bottom-1/3 z-20 flex flex-col-reverse md:flex-row-reverse items-center pointer-events-none gap-2 md:gap-0"
                            >
                                <div className="bg-purple-950/60 border border-purple-400/40 backdrop-blur-xl px-4 py-3 rounded-md font-mono text-xs md:text-sm text-white shadow-[0_0_20px_rgba(192,132,252,0.3)]">
                                    <span className="text-purple-400">&gt;</span> Stato Sistema: <span className="font-bold tracking-widest text-purple-200">ONLINE</span>
                                </div>
                                <div className="w-[1px] h-12 md:w-32 md:h-[1px] bg-gradient-to-t md:bg-gradient-to-l from-purple-400/80 to-transparent" />
                            </motion.div>

                            {/* Fixed Close Button at Viewport Bottom */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="fixed bottom-[100px] md:bottom-[12vh] left-1/2 -translate-x-1/2 z-[99999] pointer-events-auto"
                            >
                                <button 
                                    onClick={onClose}
                                    className="text-cyan-400 hover:text-white uppercase text-xs md:text-sm tracking-[0.2em] border border-cyan-400/30 px-8 py-4 bg-black/60 backdrop-blur-2xl hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all font-mono rounded-full font-bold whitespace-nowrap"
                                >
                                    [ CHIUDI SIMULAZIONE ]
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
