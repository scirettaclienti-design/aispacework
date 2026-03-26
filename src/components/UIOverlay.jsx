import { useState, useEffect, useRef } from 'react';
import { useScroll, useTransform, useMotionValueEvent, useMotionValue, motion, AnimatePresence, useSpring } from 'framer-motion';
import { MaskRevealText } from './MaskRevealText';
import { SpatialTitle } from './SpatialTitle';
import { useHyperFocus } from '../HyperFocusContext';
import { X } from 'lucide-react';
import { TerminalForm } from './TerminalForm';
import { HyperBuilder } from './HyperBuilder';
import { HoloTutor } from './HoloTutor';
import { playHoverSound, playClickSound } from '../utils/audio';

import { HeroSection } from './sections/HeroSection';
import { OutcomeSection } from './sections/OutcomeSection';
import { AudienceSection } from './sections/AudienceSection';
import { EcosystemModulesSection } from './sections/EcosystemModulesSection';
import { PromptFirstSection } from './sections/PromptFirstSection';
import { VisionSection } from './sections/VisionSection';
import { TargetRadar3D } from './TargetRadar3D';
import { TargetMatrix } from './TargetMatrix';

// Helpers for Terminal Effects
const TypewriterText = ({ text }) => {
    return (
        <motion.span 
            initial="hidden" 
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.02 } }
            }}
        >
            {text.split('').map((char, index) => (
                <motion.span 
                    key={index}
                    variants={{
                        hidden: { opacity: 0, display: "none" },
                        visible: { opacity: 1, display: "inline" }
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

const DecodeText = ({ text, delay = 0 }) => {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        let timeout = setTimeout(() => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
            let iter = 0;
            const maxIter = 15;
            const interval = setInterval(() => {
                if(iter >= maxIter) {
                    setDisplayed(text);
                    clearInterval(interval);
                } else {
                    setDisplayed(text.split('').map(c => c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]).join(''));
                    iter++;
                }
            }, 30);
            return () => clearInterval(interval);
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [text, delay]);
    return <span>{displayed}</span>;
};

const AnimatedCounter = ({ value, prefix = "", suffix = "", delay = 0 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime;
        let animationFrame;
        const duration = 1500;
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            if (progress < delay * 1000) {
               animationFrame = requestAnimationFrame(animate);
               return;
            }
            const activeProgress = Math.min((progress - delay * 1000) / duration, 1);
            const ease = activeProgress === 1 ? 1 : 1 - Math.pow(2, -10 * activeProgress);
            setCount(Math.floor(ease * value));
            
            if (activeProgress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, delay]);

    return <span>{prefix}{count}{suffix}</span>;
};

import { MagneticButton } from './MagneticButton';

const BlinkingCursor = () => (
    <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block mr-2 text-white/70"
    >
        {'>'}
    </motion.span>
);

const AutoAssemblerUI = () => {
    return (
        <div className="w-full flex mt-8 gap-4 h-48 md:h-64 border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-md rounded-xl p-4 overflow-hidden relative">
            {/* Fake Code Sidebar */}
            <div className="w-1/3 md:w-1/4 h-full border-r border-cyan-400/20 pr-4 overflow-hidden relative opacity-60">
                <motion.div
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="font-mono text-[8px] md:text-[10px] text-cyan-400 leading-tight whitespace-pre"
                >
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i}>{`Node_${i}: init();\nAlloc: 0x${Math.floor(Math.random()*1000).toString(16)}\nRender(Layer_${i});\n`}</div>
                    ))}
                </motion.div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0a0f16] to-transparent pointer-events-none" />
            </div>

            {/* Canvas Building Area */}
            <div className="flex-1 flex flex-col gap-3 justify-center items-center h-full pt-2">
                {/* Navbar Block */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                    className="w-[90%] h-4 border border-cyan-400/50 bg-cyan-400/10 rounded-sm"
                />
                
                {/* Hero Block */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.5, type: "spring" }}
                    className="w-[90%] h-20 md:h-28 border border-cyan-400/50 bg-cyan-400/20 rounded-md relative overflow-hidden"
                >
                    <motion.div 
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent skew-x-12"
                    />
                </motion.div>

                {/* Grid Blocks */}
                <div className="w-[90%] flex gap-3 h-12 md:h-16">
                    {[1, 2, 3].map((i) => (
                        <motion.div 
                            key={i}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.5 + (i * 0.2), duration: 0.5, type: "spring" }}
                            className="flex-1 border border-cyan-400/40 bg-cyan-400/5 rounded-sm"
                        />
                    ))}
                </div>
            </div>
            
            {/* Overlay Grid lines */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMzQsIDIxMSwgMjM4LCAwLjIpIi8+PC9zdmc+')] opacity-30 mix-blend-screen" />
        </div>
    );
};

const NeuralSimulation = () => {
    const [step, setStep] = useState(0); // 0: init, 1: listening, 2: thinking/replying
    const [inputVal, setInputVal] = useState("");
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputVal.trim()) {
            setStep(2);
            setInputVal("");
        }
    };

    useEffect(() => {
        if (step === 1 && inputRef.current) {
            inputRef.current.focus();
        }
    }, [step]);

    return (
        <div className="w-full h-full flex flex-col justify-end mt-4 items-center relative overflow-hidden">
            {/* HUD Status Header */}
            <div className="absolute top-0 left-0 w-full font-mono text-[10px] md:text-xs text-purple-400 h-4 text-left">
                {step === 0 && <TypewriterText text="> Inizializzazione AI-Tutor in corso..." onComplete={() => setStep(1)} />}
                {step === 1 && <span>&gt; Connessione stabile. Dimmi.</span>}
                {step === 2 && <span className="animate-pulse">&gt; Elaborazione neurale...</span>}
            </div>
            
            {/* Concentric Holo-Avatar Spheres */}
            <div className="flex-1 flex justify-center items-center w-full min-h-[120px] md:min-h-[160px] perspective-[800px]">
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Outer Sphere */}
                    <motion.div 
                        animate={{ 
                            rotateX: [0, 360], 
                            rotateY: [0, 360],
                            scale: step === 2 ? [1.1, 1.4, 1.1] : [1, 1.05, 1]
                        }}
                        transition={{ 
                            rotateX: { repeat: Infinity, duration: step === 2 ? 4 : 10, ease: "linear" },
                            rotateY: { repeat: Infinity, duration: step === 2 ? 5 : 12, ease: "linear" },
                            scale: { repeat: Infinity, duration: step === 2 ? 0.5 : 2, ease: "easeInOut" }
                        }}
                        className="absolute inset-0 rounded-full border border-purple-400/30 border-dashed mix-blend-screen"
                        style={{ borderLeftColor: 'rgba(34,211,238,0.5)', borderRightColor: 'rgba(232,121,249,0.5)' }}
                    />
                    
                    {/* Inner Sphere */}
                    <motion.div 
                        animate={{ 
                            rotateX: [360, 0], 
                            rotateY: [0, 360],
                            scale: step === 2 ? [0.9, 1.2, 0.9] : [1, 0.95, 1]
                        }}
                        transition={{ 
                            rotateX: { repeat: Infinity, duration: step === 2 ? 3 : 8, ease: "linear" },
                            rotateY: { repeat: Infinity, duration: step === 2 ? 4 : 9, ease: "linear" },
                            scale: { repeat: Infinity, duration: step === 2 ? 0.4 : 1.5, ease: "easeInOut" }
                        }}
                        className="absolute inset-2 md:inset-4 rounded-full border-2 border-cyan-400/40 mix-blend-screen"
                    />

                    {/* Core Glow */}
                    <motion.div 
                        animate={{ 
                            opacity: step === 2 ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4] 
                        }}
                        transition={{ repeat: Infinity, duration: step === 2 ? 0.5 : 2, ease: "easeInOut" }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500/50 blur-md shadow-[0_0_30px_rgba(232,121,249,1)]"
                    />
                </div>
            </div>

            {/* Response Text */}
            <div className="font-sans text-xs md:text-sm text-white/90 leading-relaxed text-center min-h-[40px] w-full mb-4">
                {step === 2 && (
                    <TypewriterText text="Analisi completata. Sincronizzazione con AI-SPACE CORE necessaria per eseguire questa istruzione avanzata." />
                )}
            </div>

            {/* Real Interactive Input */}
            <div className={`mt-auto w-full transition-all duration-700 ${step > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-full border border-white/20 bg-black/50 rounded-md p-3 px-4 font-mono text-[10px] md:text-xs text-white flex items-center shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] focus-within:border-cyan-400/50 transition-colors pointer-events-auto">
                    <span className="mr-3 text-purple-400 font-bold">&gt;</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={step !== 1}
                        placeholder={step === 1 ? "Digita la tua richiesta al Tutor..." : "[ CONNESSIONE IN USO ]"}
                        className="bg-transparent outline-none w-full placeholder-white/30"
                    />
                </div>
            </div>
        </div>
    );
};

// Station configs mapping scroll progress to visibility
// Assuming 500vh total scroll length inside App.jsx
// Stations approximate scroll sections based on TrackJourney Waypoints

export function UIOverlay({ isBooted }) {
    const { scrollYProgress } = useScroll();

    // -- STATION 1: HERO (0 - 0.15)
    const heroOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0], { clamp: true });
    const heroY = useTransform(scrollYProgress, [0, 0.05, 0.12], ["0%", "0%", "-30px"], { clamp: true });
    const heroPointerEvents = useTransform(heroOpacity, (v) => v > 0 ? "auto" : "none");
    const heroDisplay = useTransform(scrollYProgress, (v) => v > 0.15 ? "none" : "flex");

    // -- STATION 2: OUTCOMES (0.12 - 0.35)
    const p1Opacity = useTransform(scrollYProgress, [0.08, 0.15, 0.28, 0.35], [0, 1, 1, 0], { clamp: true });
    const p1Y = useTransform(scrollYProgress, [0.08, 0.15, 0.28, 0.35], ["30px", "0px", "0px", "-80px"], { clamp: true });
    const p1PointerEvents = useTransform(p1Opacity, (v) => v > 0 ? "auto" : "none");
    const p1Display = useTransform(scrollYProgress, (v) => v > 0.38 || v < 0.05 ? "none" : "flex");

    // -- STATION 3: AUDIENCE (0.3 - 0.55)
    const authOpacity = useTransform(scrollYProgress, [0.3, 0.38, 0.5, 0.58], [0, 1, 1, 0], { clamp: true });
    const authY = useTransform(scrollYProgress, [0.3, 0.38, 0.5, 0.58], ["30px", "0px", "0px", "-80px"], { clamp: true });
    const authPointerEvents = useTransform(authOpacity, (v) => v > 0 ? "auto" : "none");
    const authDisplay = useTransform(scrollYProgress, (v) => v > 0.6 || v < 0.25 ? "none" : "flex");

    // -- STATION 4: MODULES (0.55 - 0.75)
    const p2Opacity = useTransform(scrollYProgress, [0.55, 0.62, 0.72, 0.78], [0, 1, 1, 0], { clamp: true });
    const p2Y = useTransform(scrollYProgress, [0.55, 0.62, 0.72, 0.78], ["30px", "0px", "0px", "-80px"], { clamp: true });
    const p2PointerEvents = useTransform(p2Opacity, (v) => v > 0 ? "auto" : "none");
    const p2Display = useTransform(scrollYProgress, (v) => v > 0.8 || v < 0.5 ? "none" : "flex");

    // -- STATION 5: PROMPT FIRST (0.75 - 0.9)
    const pfOpacity = useTransform(scrollYProgress, [0.75, 0.82, 0.9, 0.95], [0, 1, 1, 0], { clamp: true });
    const pfY = useTransform(scrollYProgress, [0.75, 0.82, 0.9, 0.95], ["30px", "0px", "0px", "-80px"], { clamp: true });
    const pfPointerEvents = useTransform(pfOpacity, (v) => v > 0 ? "auto" : "none");
    const pfDisplay = useTransform(scrollYProgress, (v) => v > 0.96 || v < 0.7 ? "none" : "flex");

    // -- STATION 6: VISION (0.92 - 1.0)
    const coreOpacity = useTransform(scrollYProgress, [0.92, 0.96, 1.0], [0, 1, 1], { clamp: true });
    const coreY = useTransform(scrollYProgress, [0.92, 0.96, 1.0], ["30px", "0px", "0px"], { clamp: true });
    const corePointerEvents = useTransform(coreOpacity, (v) => v > 0 ? "auto" : "none");
    const coreDisplay = useTransform(scrollYProgress, (v) => v < 0.88 ? "none" : "flex");

    // -- EVENT HORIZON: FINAL WHITEOUT (0.95 - 1.0)
    const ehOpacity = useTransform(scrollYProgress, [0.96, 1.0], [0, 1], { clamp: true });
    const ehPointerEvents = useTransform(ehOpacity, (v) => v > 0.5 ? "auto" : "none");

    // -- PARALLAX PHYSICS
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleGlobalMouse = (e) => {
            mouseX.set(e.clientX / window.innerWidth - 0.5);
            mouseY.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', handleGlobalMouse);
        return () => window.removeEventListener('mousemove', handleGlobalMouse);
    }, [mouseX, mouseY]);

    const globalRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 100, damping: 30 });
    const globalRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 100, damping: 30 });

    // Visibility States to trigger Text Animations
    const [heroVisible, setHeroVisible] = useState(false); // Wait for boot
    
    // React to both scroll position AND boot sequence completion
    useEffect(() => {
        if (isBooted) {
             setHeroVisible(true);
        }
    }, [isBooted]);

    useMotionValueEvent(heroOpacity, "change", (latest) => {
        if (!isBooted) return;
        if (latest > 0.05 && !heroVisible) setHeroVisible(true);
        else if (latest === 0 && heroVisible) setHeroVisible(false);
    });

    const [p1Visible, setP1Visible] = useState(false);
    useMotionValueEvent(p1Opacity, "change", (latest) => {
        if (latest > 0.05 && !p1Visible) setP1Visible(true);
        else if (latest === 0 && p1Visible) setP1Visible(false);
    });

    const [authVisible, setAuthVisible] = useState(false);
    useMotionValueEvent(authOpacity, "change", (latest) => {
        if (latest > 0.05 && !authVisible) setAuthVisible(true);
        else if (latest === 0 && authVisible) setAuthVisible(false);
    });

    const [p2Visible, setP2Visible] = useState(false);
    useMotionValueEvent(p2Opacity, "change", (latest) => {
        if (latest > 0.05 && !p2Visible) setP2Visible(true);
        else if (latest === 0 && p2Visible) setP2Visible(false);
    });

    const [pfVisible, setPfVisible] = useState(false);
    useMotionValueEvent(pfOpacity, "change", (latest) => {
        if (latest > 0.05 && !pfVisible) setPfVisible(true);
        else if (latest === 0 && pfVisible) setPfVisible(false);
    });

    const [coreVisible, setCoreVisible] = useState(false);
    useMotionValueEvent(coreOpacity, "change", (latest) => {
        if (latest > 0.05 && !coreVisible) setCoreVisible(true);
        else if (latest === 0 && coreVisible) setCoreVisible(false);
    });

    const { hyperFocus, setHyperFocus } = useHyperFocus();
    const [panelState, setPanelState] = useState('default'); // 'default', 'holo', 'neural'
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [fullScreenApp, setFullScreenApp] = useState(null);

    // Reset panel state when changing focus
    useEffect(() => {
        setPanelState('default');
    }, [hyperFocus]);

    // The data for the Hyper-Focus panel
    const focusData = {
        1: { 
            header: "SYS.STATUS: OLISTICO_ONLINE",
            title: "L'ARCHITETTURA DEL PENSIERO", 
            text: "Dimentica la frammentazione. AI-SPACE è una singola rete neurale applicata chirurgicamente al tuo business. Tu definisci l'intento strategico tramite un prompt naturale, e il motore orchestra simultaneamente sviluppo architetturale, copy persuasivo e design immersivo. Flusso puro. Esecuzione letale.",
            color: "text-blue-400",
            expandedContent: "[+] Sincronizzazione Dati | [+] Memoria Condivisa | [+] Orchestrazione IA",
            microData: [
                { label: "Frammentazione", value: 0, suffix: "%", type: "number" },
                { label: "Velocità_Execution", value: 400, prefix: "+", suffix: "%", type: "number" }
            ],
            cta: "INIZIALIZZA IL CORE",
            action: () => setIsTerminalOpen(true)
        },
        2: { 
            header: "MODULO: AI-CREATIVE_ATTIVO",
            title: "MOTORE GENERATIVO 3D", 
            text: "Il codice non è più un limite, è una materia plastica. Progettiamo ambienti WebGL profondamente immersivi e landing page ad altissima conversione che si generano in tempo reale. Il nostro ecosistema azzera il debito tecnico: tu dichiari la visione, i nostri algoritmi ne forgiano la geometria.",
            color: "text-cyan-400",
            expandedContent: "[>] Vertex Rendering | [>] React/Three.js | [>] Spatial UI Premium",
            microData: [
                { label: "Rendering_3D", value: "Tempo_Reale" },
                { label: "Architettura", value: "Cloud_Native" }
            ],
            cta: "ESPLORA LE ARCHITETTURE WEB",
            action: () => { setHyperFocus(null); setFullScreenApp('builder'); }
        },
        3: { 
            header: "MODULO: AI-TUTOR_SYNC",
            title: "FORMAZIONE E SCALABILITÀ", 
            text: "L'evoluzione è continua. Il tuo Tutor IA personale mappa le tue competenze e struttura percorsi didattici predittivi per farti dominare le tecnologie emergenti. Nel frattempo, agenti autonomi scalano le tue piattaforme in background. Evolvi la tua mente, mentre la macchina scala il tuo impero.",
            color: "text-purple-400",
            expandedContent: "> Cloni Autonomi Innescati | > Apprendimento Adattivo: Online",
            imageAsset: "/assets/neural_clone.png",
            microData: [
                { label: "Curva_Apprendimento", value: "Verticale" },
                { label: "Automazione", value: "Background_H24" }
            ],
            cta: "ATTIVA IL TUTOR NEURALE",
            action: () => { setHyperFocus(null); setFullScreenApp('tutor'); }
        },
        4: { 
            header: "INFRASTRUTTURA: CORE_MASTER",
            title: "IL TUO VANTAGGIO SLEALE", 
            text: "L'accesso premium che riscrive le regole del gioco. Ottieni il controllo totale su operazioni di marketing, sviluppo creativo avanzato e formazione di élite in un unico ambiente persistente. Il nucleo impara dalle tue iterazioni, si evolve con le tue decisioni e trasforma le operazioni manuali in automatismi autonomi.",
            color: "text-white",
            expandedContent: "NESSUN LIMITE OPERATIVO. DOMINA IL MERCATO DEL DOMANI.",
            microData: [
                { label: "Livello_Sicurezza", value: "Quantistica" },
                { label: "Database_Sinergico", value: "Attivo" }
            ],
            cta: "CANDIDATI PER L'ACCESSO",
            action: () => setIsTerminalOpen(true)
        },
        5: { 
            header: "TARGET_LOCK: ADATTIVO",
            title: "MOTORE 3D ADATTIVO",
            text: "Ogni progetto possiede una sua architettura unica. Per questo motivo AI-SPACE funziona come un motore 3D adattivo: non imponiamo software rigidi, ma modelliamo ambienti spaziali e flussi IA esattamente sulle tue geometrie di business. Che tu sia Founder, Creator o Brand, orientiamo l'intera infrastruttura per farti materialeizzare i tuoi risultati col massimo della potenza.",
            color: "text-emerald-400",
            expandedContent: "[>] Strutture Spaziali Adattive | [>] Sincronizzazione Strategica | [>] Esecuzione Quantistica",
            customComponent: <TargetRadar3D />,
            microData: [
                { label: "Plasticità_3D", value: "Modellazione_RealTime" },
                { label: "Targeting", value: "Matrice_Dinamica" }
            ],
            cta: "GUARDA LA MATRIX IN AZIONE",
            action: () => { setHyperFocus(null); setFullScreenApp('targetMatrix'); }
        }
    };

    return (
        <main className="fixed inset-0 z-10 pointer-events-none flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
            <TerminalForm isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
            
            {/* HYPER-FOCUS GLASSMORPHISM PANEL 3D SPATIAL ENCLOSURE */}
            <div className="fixed inset-0 pointer-events-none z-[60]" style={{ perspective: '1200px' }}>
                <AnimatePresence>
                    {hyperFocus && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 50, y: "-50%", rotateY: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, x: 0, y: "-50%", rotateY: -12, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, x: 50, y: "-50%", rotateY: -5, filter: "blur(10px)" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-auto absolute right-4 md:right-[5%] top-1/2 w-[calc(100%-2rem)] md:w-[450px] max-h-[85vh] bg-black/40 backdrop-blur-[20px] border border-white/15 rounded-2xl flex flex-col p-8 md:p-10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden origin-right"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                        {/* CRT Overlay */}
                        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-0 opacity-30">
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]" />
                            <motion.div 
                                animate={{ y: ["-100%", "500%"] }} 
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute inset-x-0 h-[30%] bg-gradient-to-b from-transparent via-white/10 to-transparent mix-blend-screen"
                            />
                        </div>

                        {/* Content Container (above CRT) */}
                        <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(85vh-5rem)]">
                            <MagneticButton 
                                onClick={() => setHyperFocus(null)}
                                className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-30"
                            >
                                <X size={16} />
                            </MagneticButton>
                            
                            {/* Header with Typewriter */}
                            <div className={`font-mono text-xs mb-4 uppercase tracking-widest mt-2 pr-12 ${focusData[hyperFocus].color}`}>
                                [ <TypewriterText text={focusData[hyperFocus].header} /> ]
                            </div>
                            
                            {/* Title and Text with staggered fade up */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                                className="border-b border-white/10 pb-6 mb-8 mt-4"
                            >
                                <h2 className="text-2xl md:text-3xl font-display font-medium text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    {focusData[hyperFocus].title}
                                </h2>
                                <p className="text-white/85 font-sans text-sm md:text-[15px] leading-relaxed">
                                    {focusData[hyperFocus].text}
                                </p>
                            </motion.div>

                            {/* Panel States Rendering */}
                            <AnimatePresence mode="wait">
                                {panelState === 'default' && (
                                    <motion.div 
                                        key="default"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col flex-1"
                                    >
                                        {/* Optional Image Asset Preview for Advanced Context */}
                                        {focusData[hyperFocus].imageAsset && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="w-full h-32 md:h-40 mb-6 mt-2 relative rounded-lg overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] shrink-0 bg-[#02050a]"
                                            >
                                                <img src={focusData[hyperFocus].imageAsset} alt="Preview Asset" className="w-full h-full object-cover mix-blend-screen scale-110 opacity-90" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent opacity-100" />
                                                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-mono text-cyan-300">
                                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> LIVE DEMO READY
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Custom Interactive Component for unique deep-dives */}
                                        {focusData[hyperFocus].customComponent && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="w-full shrink-0"
                                            >
                                                {focusData[hyperFocus].customComponent}
                                            </motion.div>
                                        )}

                                        {/* Expanded List Items */}
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="mb-8 text-[10px] md:text-xs font-mono text-white/60 tracking-wider leading-loose"
                                        >
                                            {focusData[hyperFocus].expandedContent.split('|').map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-2 mb-2">
                                                    <span className={`${focusData[hyperFocus].color} font-bold`}>{'> '}</span> 
                                                    <span>{item.trim().replace(/^\[[+>\]\[]+\]\s*|>\s*/, '')}</span>
                                                </div>
                                            ))}
                                        </motion.div>

                                        {/* Animated Micro-Data */}
                                        <div className="space-y-3 md:space-y-4 font-mono text-[10px] md:text-[11px] lg:text-xs mb-8">
                                            {focusData[hyperFocus].microData.map((data, index) => (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.7 + (index * 0.2), duration: 0.4 }}
                                                    className="flex justify-between items-center bg-white/5 p-3 py-3 border border-white/5 rounded-sm backdrop-blur-md"
                                                >
                                                    <span className="text-white/50 uppercase flex items-center">
                                                        <BlinkingCursor /> {data.label}
                                                    </span>
                                                    <span className={`font-bold text-sm tracking-wider drop-shadow-md ${focusData[hyperFocus].color}`}>
                                                        {data.type === 'number' ? (
                                                            <AnimatedCounter value={data.value} prefix={data.prefix} suffix={data.suffix} delay={0.7 + (index * 0.2)} />
                                                        ) : (
                                                            <DecodeText text={data.value} delay={0.7 + (index * 0.2)} />
                                                        )}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Tech CTA Magnetic Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.1, duration: 0.6 }}
                                            className="w-full pb-24 md:pb-4 mt-auto"
                                        >
                                            <button 
                                                onClick={focusData[hyperFocus].action}
                                                className="relative overflow-hidden group border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] md:text-xs uppercase px-4 py-4 rounded-sm transition-colors duration-300 w-full shadow-[0_0_20px_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            >
                                                <span className="relative z-10 tracking-[0.2em]">[ {focusData[hyperFocus].cta} ]</span>
                                                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* STATION 1: HERO */}
            <HeroSection 
                opacity={heroOpacity} y={heroY} pointerEvents={heroPointerEvents} display={heroDisplay}
                globalRotateX={globalRotateX} globalRotateY={globalRotateY} isVisible={heroVisible}
                hyperFocus={hyperFocus} setHyperFocus={setHyperFocus} onPrimaryClick={() => setIsTerminalOpen(true)}
            />

            {/* STATION 2: OUTCOMES */}
            <OutcomeSection 
                opacity={p1Opacity} y={p1Y} pointerEvents={p1PointerEvents} display={p1Display}
                globalRotateX={globalRotateX} globalRotateY={globalRotateY} isVisible={p1Visible}
                hyperFocus={hyperFocus} setHyperFocus={setHyperFocus}
            />

            {/* STATION 3: AUDIENCE */}
            <AudienceSection 
                opacity={authOpacity} y={authY} pointerEvents={authPointerEvents} display={authDisplay}
                globalRotateX={globalRotateX} globalRotateY={globalRotateY} isVisible={authVisible}
                hyperFocus={hyperFocus} setHyperFocus={setHyperFocus}
            />

            {/* STATION 4: MODULES */}
            <EcosystemModulesSection 
                opacity={p2Opacity} y={p2Y} pointerEvents={p2PointerEvents} display={p2Display}
                globalRotateX={globalRotateX} globalRotateY={globalRotateY} isVisible={p2Visible}
                hyperFocus={hyperFocus} setHyperFocus={setHyperFocus}
            />

            {/* STATION 5: PROMPT FIRST */}
            <PromptFirstSection 
                opacity={pfOpacity} y={pfY} pointerEvents={pfPointerEvents} display={pfDisplay}
                globalRotateX={globalRotateX} globalRotateY={globalRotateY} isVisible={pfVisible}
                hyperFocus={hyperFocus} setHyperFocus={setHyperFocus}
            />

            {/* STATION 6: VISION / CORE */}
            <VisionSection 
                opacity={coreOpacity} y={coreY} pointerEvents={corePointerEvents} display={coreDisplay}
                globalRotateX={globalRotateX} globalRotateY={globalRotateY} isVisible={coreVisible}
                hyperFocus={hyperFocus} onPrimaryClick={() => setIsTerminalOpen(true)}
            />

            {/* EVENT HORIZON: THE CLIMAX */}
            <motion.section 
                style={{ opacity: ehOpacity, pointerEvents: ehPointerEvents }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[30px] transition-all duration-1000 overflow-hidden perspective-[1000px]"
            >
                {/* Core Singularity Glow */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.6, 1, 0.6],
                        rotate: [0, 90, 180] 
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute z-0 w-[600px] h-[400px] bg-cyan-500/20 rounded-[100%] blur-[120px] mix-blend-screen pointer-events-none"
                />
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                    className="absolute z-0 w-[300px] h-[300px] bg-white/30 rounded-full blur-[80px] mix-blend-overlay pointer-events-none"
                />

                <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="text-center flex flex-col items-center relative z-10 w-full max-w-2xl px-6">
                    <MagneticButton 
                        onClick={() => setIsTerminalOpen(true)}
                        className="group relative pointer-events-auto px-10 md:px-14 py-6 md:py-8 bg-transparent text-white font-sans font-bold tracking-[0.4em] uppercase text-[10px] md:text-sm rounded-full transition-all duration-500 overflow-hidden border border-cyan-400/30 hover:border-cyan-300"
                    >
                        {/* Hover Light Effect */}
                        <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <span className="relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">INIZIALIZZA IL TUO SPAZIO ORA</span>
                    </MagneticButton>
                    
                    <div className="mt-8 text-cyan-200/60 font-mono text-xs tracking-widest uppercase animate-pulse flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-cyan-500/30" />
                        [ SEQUENZA_AVVIO {'>'} STANDBY ]
                        <div className="w-12 h-[1px] bg-cyan-500/30" />
                    </div>
                </motion.div>
            </motion.section>

            <HyperBuilder isOpen={fullScreenApp === 'builder'} onClose={() => setFullScreenApp(null)} />
            <HoloTutor isOpen={fullScreenApp === 'tutor'} onClose={() => setFullScreenApp(null)} />
            <TargetMatrix isOpen={fullScreenApp === 'targetMatrix'} onClose={() => setFullScreenApp(null)} />
        </main>
    );
}
