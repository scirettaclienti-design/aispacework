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
    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center mb-12" style={{ perspective: "1000px" }}>
            
            {/* Astrolabe Containment Rings */}
            <motion.div 
                className="absolute inset-0 rounded-full border border-cyan-400/20 mix-blend-screen"
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ repeat: Infinity, duration: step === 1 ? 4 : 20, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div 
                className="absolute inset-4 rounded-full border border-cyan-400/20 mix-blend-screen"
                animate={{ rotateX: -360, rotateZ: 360 }}
                transition={{ repeat: Infinity, duration: step === 1 ? 3 : 15, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div 
                className="absolute inset-8 rounded-full border border-purple-400/20 mix-blend-screen"
                animate={{ rotateY: -360, rotateZ: -180 }}
                transition={{ repeat: Infinity, duration: step === 1 ? 5 : 25, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            />

            {/* Inner Face Container */}
            <div className="relative w-40 h-48 md:w-48 md:h-56 flex flex-col items-center justify-center">
                {/* Outline Face Ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: step === 1 ? 5 : 20, ease: "linear" }}
                    className="absolute inset-0 border border-purple-500/30 rounded-[40%] mix-blend-screen"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: step === 1 ? 3 : 15, ease: "linear" }}
                    className="absolute inset-4 border border-cyan-400/30 rounded-[35%] mix-blend-screen"
                />
                
                {/* Eyes */}
                <div className="absolute top-[30%] w-full flex justify-center gap-8 md:gap-12 opacity-80">
                    <motion.div 
                        animate={{ 
                            scale: step === 1 ? [1, 1.5, 1] : [1, 1.1, 1], 
                            opacity: step === 1 ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4],
                            boxShadow: isTalking ? '0 0 40px rgba(34,211,238,1)' : '0 0 20px rgba(34,211,238,0.8)'
                        }}
                        transition={{ repeat: Infinity, duration: step === 1 ? 0.2 : 3 }}
                        className="w-8 h-2 md:w-10 md:h-2 bg-cyan-400 rounded-full"
                    />
                    <motion.div 
                        animate={{ 
                            scale: step === 1 ? [1, 1.5, 1] : [1, 1.1, 1], 
                            opacity: step === 1 ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4],
                            boxShadow: isTalking ? '0 0 40px rgba(192,132,252,1)' : '0 0 20px rgba(192,132,252,0.8)'
                        }}
                        transition={{ repeat: Infinity, duration: step === 1 ? 0.2 : 3, delay: 0.1 }}
                        className="w-8 h-2 md:w-10 md:h-2 bg-purple-400 rounded-full"
                    />
                </div>

                {/* Nose/Center Structure */}
                <div className="absolute top-[50%] w-1 h-6 md:h-8 bg-white/10 rounded-full" />

                {/* Mouth (Spectrum Analyzer) */}
                <div className="absolute bottom-[20%] w-full flex justify-center items-end h-8 md:h-10 gap-2">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={isTalking ? { height: ["20%", "100%", "30%", "80%", "10%"] } : { height: "10%" }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: isTalking ? DURATIONS[i] : 1, 
                                ease: "linear",
                                repeatType: "mirror"
                            }}
                            className="w-1.5 md:w-2 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-sm shadow-[0_0_15px_rgba(232,121,249,0.5)] origin-bottom"
                        />
                    ))}
                </div>
            </div>

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
                className="fixed inset-0 z-[9998] bg-[#020205] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden pointer-events-auto"
            >
                {/* Neural Globe removed, CyberAvatar replacing it */}
                <CyberAvatar step={step} isTalking={isTalking} />

                {/* Interactive Area */}
                <div className="w-full max-w-2xl flex flex-col items-center gap-6 z-10 relative">
                    
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
                        className="mt-12 text-white/50 hover:text-white uppercase text-sm md:text-base tracking-widest border border-white/20 px-8 py-4 hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all font-mono"
                    >
                        [ TERMINA CONNESSIONE NEURALE ]
                    </button>
                    
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
