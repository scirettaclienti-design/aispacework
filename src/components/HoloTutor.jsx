import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterText = React.memo(({ text, onComplete }) => {
    const [displayed, setDisplayed] = useState('');
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        setDisplayed('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayed(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
                if (onCompleteRef.current) onCompleteRef.current();
            }
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayed}</span>;
});

const DURATIONS = [0.25, 0.32, 0.28, 0.35, 0.22];

const CyberAvatar = ({ step, isTalking }) => {
    // Parallax mouse effect
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 15;
        const y = (clientY / window.innerHeight - 0.5) * 15;
        setMousePos({ x, y });
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="relative w-[220px] h-[300px] sm:w-72 sm:h-[380px] md:w-80 md:h-[420px] mb-8 md:mb-12 flex flex-col items-center justify-center cursor-crosshair shrink-0" 
            style={{ perspective: "1000px" }}
        >
            <motion.div 
                animate={{ rotateX: -mousePos.y, rotateY: mousePos.x }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
                className="w-full h-full relative rounded-2xl border border-cyan-500/30 bg-[#02050a] shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Neural Clone Image */}
                <img 
                    src="/assets/neural_clone.png" 
                    alt="Neural Clone System" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen scale-105"
                />

                {/* Glitch / Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-black/40 z-10" />

                {/* Scanning Line */}
                <motion.div 
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 z-20 shadow-[0_0_20px_10px_rgba(34,211,238,0.4)] mix-blend-screen"
                />

                {/* Tracking Dots Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen">
                    <motion.div animate={isTalking ? { scale: [1, 2, 1], opacity: [0.5, 1, 0.5] } : {}} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute top-[42%] left-[38%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,1)]" />
                    <motion.div animate={isTalking ? { scale: [1, 2, 1], opacity: [0.5, 1, 0.5] } : {}} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="absolute top-[42%] right-[38%] w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_10px_2px_rgba(168,85,247,1)]" />
                    <motion.div animate={isTalking ? { height: ["10%", "100%", "30%", "80%", "10%"] } : { height: "10%" }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear", repeatType: "mirror" }} className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-8 h-1 flex justify-between gap-1">
                        <div className="w-1 bg-cyan-400 h-full rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <div className="w-1 bg-purple-400 h-[60%] rounded-sm shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        <div className="w-1 bg-cyan-400 h-[80%] rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    </motion.div>
                </div>

                {/* API Logs Output */}
                <div className="absolute bottom-4 left-4 right-4 z-30 font-mono text-[9px] md:text-[10px] text-cyan-300/80 flex flex-col gap-1.5 bg-black/60 backdrop-blur-md p-3 rounded border border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${step >= 1 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} /> [API] HEYGEN_TTS_V4</span>
                        <span className={step >= 1 ? 'text-green-400' : 'text-gray-500'}>{step >= 1 ? 'ACTIVE' : 'IDLE'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isTalking ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`} /> [LLM] SYNC_OPENAI_GPT4</span>
                        <span className={isTalking ? 'text-purple-400' : 'text-gray-500'}>{isTalking ? '12ms' : '--'}</span>
                    </div>
                </div>

                {/* UI Frame Accents */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/30 z-30" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/30 z-30" />
            </motion.div>

            {/* Floating Interaction Widgets */}
            <AnimatePresence>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, y: [-5, 5] }} transition={{ opacity: {duration: 1}, y: {repeat: Infinity, duration: 3, repeatType: "mirror", delay: 0} }}
                    className="absolute -left-12 md:-left-32 top-[10%] bg-black/80 border border-cyan-500/50 backdrop-blur-md px-3 py-2 rounded-md font-mono text-[10px] md:text-xs text-cyan-100 flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-105 transition-transform cursor-crosshair z-20"
                >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    SLA: 24/7 ACTIVE
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, y: [5, -5] }} transition={{ opacity: {duration: 1}, y: {repeat: Infinity, duration: 4, repeatType: "mirror", delay: 1} }}
                    className="absolute -right-12 md:-right-32 top-[40%] bg-black/80 border border-purple-500/50 backdrop-blur-md px-3 py-2 rounded-md font-mono text-[10px] md:text-xs text-purple-100 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-105 transition-transform cursor-crosshair z-20"
                >
                    <div className="w-2 h-2 border border-purple-400 rotate-45" />
                    SYNC: DATI AZIENDALI
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [-5, 5] }} transition={{ opacity: {duration: 1}, y: {repeat: Infinity, duration: 3.5, repeatType: "mirror", delay: 2} }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-2 md:-bottom-8 bg-black/80 border border-white/20 backdrop-blur-md px-3 py-2 rounded-full font-mono text-[10px] md:text-xs text-white/80 flex items-center gap-2 hover:scale-105 transition-transform cursor-crosshair z-20 whitespace-nowrap"
                >
                    <div className="w-1 h-3 bg-white/50" />
                    TASK: WORKFLOW OPTIMIZATION
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export function HoloTutor({ isOpen, onClose }) {
    const [step, setStep] = useState(0); // 0: idle, 1: processing, 2: completed
    const [isTalking, setIsTalking] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(0);
            setIsTalking(false);
            setInputVal("");
            
            // Auto focus input
            const timer = setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 500);
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputVal.trim() && step === 0) {
            setStep(1);
            
            setTimeout(() => {
                setIsTalking(true);
            }, 600);

            // Simulate processing
            setTimeout(() => {
                setStep(2);
                setInputVal("");
            }, 4000);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-[#020205] flex flex-col items-center justify-start md:justify-center pt-20 pb-40 px-6 md:p-12 overflow-y-auto overflow-x-hidden pointer-events-auto custom-scrollbar"
            >
                <div className="w-full flex-1 max-w-4xl flex flex-col items-center min-h-max">
                    <CyberAvatar step={step} isTalking={isTalking} />

                    {/* Interactive Area */}
                    <div className="w-full max-w-2xl flex flex-col items-center gap-6 z-10 relative mt-4 md:mt-0 pb-12">
                    
                    {/* Chat Input */}
                    <div className={`w-full transition-all duration-500 ${step === 0 || step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none absolute'}`}>
                        {/* Live Processing Log */}
                        <AnimatePresence>
                            {step === 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full text-left font-mono text-[10px] md:text-xs text-cyan-300/80 mb-3 pl-2 overflow-hidden"
                                >
                                    <TypewriterText text="> Analisi semantica della query aziendale completata..." onComplete={() => {}} />
                                    <br />
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                                       <TypewriterText text="> Elaborazione architettura del workflow ottimizzata..." onComplete={() => {}} />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="w-full border border-purple-500/50 bg-black/60 backdrop-blur-md rounded-lg p-5 font-mono text-base md:text-xl text-white flex items-center shadow-[0_0_40px_rgba(168,85,247,0.2)] focus-within:border-cyan-400/80 focus-within:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all">
                            <span className="mr-4 text-cyan-400 font-bold">&gt;</span>
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={step !== 0}
                                placeholder="Scrivi un comando al Tutor..."
                                className="bg-transparent outline-none w-full placeholder-white/30"
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {/* Typewriter Response */}
                    <div className={`w-full min-h-[120px] text-center font-mono text-lg md:text-2xl text-white/90 leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-white/10 transition-all duration-500 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        {step === 2 && (
                            <TypewriterText text="> Richiesta acquisita. Sono in grado di guidarti passo-passo nella creazione di questa infrastruttura. Inizializza il tuo account CORE per sbloccare la mia memoria completa." onComplete={() => setIsTalking(false)} />
                        )}
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="mt-8 md:mt-12 text-white/50 hover:text-white uppercase text-xs md:text-base tracking-widest border border-white/20 px-6 py-3 md:px-8 md:py-4 hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all font-mono"
                    >
                        [ TERMINA CONNESSIONE NEURALE ]
                    </button>
                    
                </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
