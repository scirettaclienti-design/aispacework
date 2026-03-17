import { useState, useEffect, useRef } from 'react';
import { useScroll, useTransform, useMotionValueEvent, useMotionValue, motion, AnimatePresence } from 'framer-motion';
import { MaskRevealText } from './MaskRevealText';
import { SpatialTitle } from './SpatialTitle';
import { useHyperFocus } from '../HyperFocusContext';
import { X } from 'lucide-react';
import { TerminalForm } from './TerminalForm';
import { HyperBuilder } from './HyperBuilder';
import { HoloTutor } from './HoloTutor';

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

const MagneticButton = ({ children, onClick, className }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width/2);
        const middleY = clientY - (top + height/2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onClick={onClick}
            className={className}
        >
            {children}
        </motion.button>
    );
};

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

    // -- STATION 1: HERO (0 - 0.18)
    // Visible at start, dissolves completely by 0.18, overlapping with Station 2
    const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0], { clamp: true });
    const heroY = useTransform(scrollYProgress, [0, 0.08, 0.18], ["0%", "0%", "-30px"], { clamp: true });
    const heroPointerEvents = useTransform(heroOpacity, (v) => v > 0 ? "auto" : "none");
    const heroDisplay = useTransform(scrollYProgress, (v) => v > 0.2 ? "none" : "flex");

    // -- STATION 2: Piattaforme (0.12 - 0.48)
    // Crossfades in as Hero fades out
    const p1Opacity = useTransform(scrollYProgress, [0.12, 0.22, 0.38, 0.48], [0, 1, 1, 0], { clamp: true });
    const p1Y = useTransform(scrollYProgress, [0.12, 0.22, 0.38, 0.48], ["30px", "0px", "0px", "-80px"], { clamp: true });
    const p1PointerEvents = useTransform(p1Opacity, (v) => v > 0 ? "auto" : "none");

    // -- STATION 3: Sviluppo IA (0.42 - 0.78)
    // Crossfades in as P1 fades out
    const p2Opacity = useTransform(scrollYProgress, [0.42, 0.52, 0.68, 0.78], [0, 1, 1, 0], { clamp: true });
    const p2Y = useTransform(scrollYProgress, [0.42, 0.52, 0.68, 0.78], ["30px", "0px", "0px", "-80px"], { clamp: true });
    const p2PointerEvents = useTransform(p2Opacity, (v) => v > 0 ? "auto" : "none");

    // -- STATION 4: CORE (0.72 - 0.95)
    // Crossfades in as P2 fades out
    const coreOpacity = useTransform(scrollYProgress, [0.72, 0.82, 0.95], [0, 1, 0], { clamp: true });
    const coreY = useTransform(scrollYProgress, [0.72, 0.82, 0.95], ["30px", "0px", "-50px"], { clamp: true });
    const corePointerEvents = useTransform(coreOpacity, (v) => v > 0 ? "auto" : "none");

    // -- EVENT HORIZON: FINAL WHITEOUT (0.95 - 1.0)
    const ehOpacity = useTransform(scrollYProgress, [0.95, 1.0], [0, 1], { clamp: true });
    const ehPointerEvents = useTransform(ehOpacity, (v) => v > 0.5 ? "auto" : "none");

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

    const [p2Visible, setP2Visible] = useState(false);
    useMotionValueEvent(p2Opacity, "change", (latest) => {
        if (latest > 0.05 && !p2Visible) setP2Visible(true);
        else if (latest === 0 && p2Visible) setP2Visible(false);
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
            text: "Non usiamo decine di tool scollegati. AI-SPACE è una singola rete neurale applicata al tuo business. Tu fornisci l'intento tramite un prompt, il sistema orchestra strategia, copy e design all'istante. Nessuna frammentazione, solo un flusso operativo puro e continuo.",
            color: "text-blue-400",
            expandedContent: "[+] Sincronizzazione Dati | [+] Memoria Condivisa | [+] Orchestrazione IA",
            microData: [
                { label: "Frammentazione_Tool", value: 0, suffix: "%", type: "number" },
                { label: "Velocità_Esecuzione", value: 400, prefix: "+", suffix: "%", type: "number" }
            ],
            cta: "RICHIEDI ACCESSO ALL'ECOSISTEMA",
            action: () => setIsTerminalOpen(true)
        },
        2: { 
            header: "MODULO: AI-CREATIVE_ATTIVO",
            title: "MOTORE GENERATIVO 3D & WEB", 
            text: "Il codice non è più un limite. Progettiamo ambienti WebGL immersivi, landing page ad altissima conversione e contenuti visivi in tempo reale. Il nostro ecosistema azzera il debito tecnico: tu definisci la visione, l'adattività della piattaforma forgia il risultato.",
            color: "text-cyan-400",
            expandedContent: "[>] WebGL | [>] React/Three.js | [>] Spatial UI",
            microData: [
                { label: "Rendering", value: "Istantaneo" },
                { label: "UI/UX", value: "Adattiva_Predictiva" }
            ],
            cta: "ESPLORA LE ARCHITETTURE WEB",
            action: () => { setHyperFocus(null); setFullScreenApp('builder'); }
        },
        3: { 
            header: "MODULO: AI-TUTOR_SYNC",
            title: "FORMAZIONE E SCALABILITÀ", 
            text: "L'evoluzione non si ferma mai. Mentre il tuo Tutor IA personale struttura percorsi didattici su misura per farti dominare le ultime tecnologie, i nostri agenti autonomi operano in background. Ottimizzano e scalano le tue piattaforme senza che tu debba muovere un dito. Impari, mentre il business cresce.",
            color: "text-purple-400",
            expandedContent: "> Modelli Cognitivi: Attivi | > Analisi Predittiva: Online",
            microData: [
                { label: "Curva_Apprendimento", value: "Ottimizzata" },
                { label: "Automazione", value: "Silente_H24" }
            ],
            cta: "PARLA CON IL TUTOR IA",
            action: () => { setHyperFocus(null); setFullScreenApp('tutor'); }
        },
        4: { 
            header: "INFRASTRUTTURA: CORE_MASTER",
            title: "IL TUO VANTAGGIO SLEALE", 
            text: "Un singolo account premium per dominare la complessità digitale. Marketing, sviluppo creativo e formazione centralizzati in un ecosistema dotato di memoria persistente, che impara dalle tue decisioni e si evolve con te. Il mercato di domani si conquista oggi.",
            color: "text-white",
            expandedContent: "NESSUN LIMITE OPERATIVO. DOMINA IL MERCATO.",
            microData: [
                { label: "Livello_Accesso", value: "High-Ticket" },
                { label: "Memoria_Condivisa", value: "Attiva" }
            ],
            cta: "CANDIDATI PER L'ACCESSO CORE",
            action: () => setIsTerminalOpen(true)
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
                        <div className="relative z-10 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
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
                                                    <span>{item.trim().replace(/^\[[+>]\]\s*|>\s*/, '')}</span>
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
                                            className="w-full mt-auto"
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
            <motion.section 
                style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointerEvents, display: heroDisplay }}
                animate={{ 
                    x: hyperFocus === 1 ? "-20vw" : "0vw",
                    scale: hyperFocus === 1 ? 0.7 : 1,
                    opacity: hyperFocus === 1 ? 0.3 : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-x-0 top-[40%] md:top-[35%] -translate-y-1/2 flex-col items-center justify-center text-center px-4 md:px-[10vw] transform-origin-center"
            >
                <div className="max-w-4xl mx-auto">
                    <SpatialTitle 
                        text={["IL POTERE", "DEL PROMPT."]} 
                        trigger={heroVisible} 
                        duration={1.2}
                        className="text-5xl sm:text-6xl md:text-8xl lg:text-[8rem] font-display font-black mb-4 md:mb-8 tracking-tighter uppercase text-blue-50 drop-shadow-lg"
                    />
                    <MaskRevealText 
                        text="Ecosistemi Digitali Evoluti" 
                        trigger={heroVisible} 
                        element="h2"
                        delay={0.2}
                        className="text-white/80 font-sans tracking-[0.2em] md:tracking-[0.4em] uppercase text-xs md:text-xl font-medium mb-8"
                    />
                    <MaskRevealText 
                        text={[
                            "Non creiamo semplici siti web. Forgiamo <b class='text-white'>Infrastrutture Intelligenti</b> guidate dall'IA,",
                            "architetture end-to-end progettate per scalare e dominare il mercato di domani."
                        ]}
                        trigger={heroVisible}
                        delay={0.4}
                        className="text-white/70 font-sans font-normal text-sm md:text-xl max-w-2xl mx-auto mb-8"
                    />
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: heroVisible ? 1 : 0 }}
                        transition={{ delay: 1 }}
                        onClick={() => setHyperFocus(1)}
                        className={`pointer-events-auto font-mono text-xs text-blue-400 hover:text-white hover:bg-white/10 transition-all border border-blue-400/30 px-4 py-2 rounded-sm tracking-widest ${hyperFocus === 1 ? "hidden" : ""}`}
                    >
                        [ {'>'} ESPANDI_DATI ]
                    </motion.button>
                </div>
            </motion.section>

            {/* STATION 2: Piattaforme (Strictly Left Aligned) */}
            <motion.section 
                style={{ opacity: p1Opacity, y: p1Y, pointerEvents: p1PointerEvents }}
                animate={{ 
                    x: hyperFocus === 2 ? "-15vw" : "0vw",
                    scale: hyperFocus === 2 ? 0.7 : 1,
                    opacity: hyperFocus === 2 ? 0.3 : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-start pl-6 md:pl-[12vw] pr-6 transform-origin-left"
            >
                <div className="max-w-2xl">
                    <MaskRevealText 
                        text="SYS.PLATFORM_V1" 
                        trigger={p1Visible} 
                        delay={0.1}
                        className="text-cyan-400/80 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4"
                    />
                    <SpatialTitle 
                        text={["COSTRUISCI", "L'IMPOSSIBILE."]} 
                        trigger={p1Visible}
                        duration={0.8}
                        className="font-display font-black text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] mb-8 uppercase tracking-tighter leading-[0.9] text-blue-50 break-words drop-shadow-lg"
                    />
                    <MaskRevealText 
                        text={[
                            "Costruiamo applicazioni web e cloud-native ad altissime prestazioni.",
                            "I nostri ecosistemi non si limitano a esistere, ma sono organismi digitali vivi."
                        ]}
                        trigger={p1Visible}
                        delay={0.3}
                        className="text-white/70 font-sans font-normal text-lg md:text-xl mb-8"
                    />
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: p1Visible ? 1 : 0 }}
                        transition={{ delay: 0.8 }}
                        onClick={() => setHyperFocus(2)}
                        className={`pointer-events-auto font-mono text-xs text-cyan-400 hover:text-white hover:bg-white/10 transition-all border border-cyan-400/30 px-4 py-2 rounded-sm tracking-widest ${hyperFocus === 2 ? "hidden" : ""}`}
                    >
                        [ {'>'} ESPANDI_DATI ]
                    </motion.button>
                </div>
            </motion.section>

            {/* STATION 3: Sviluppo IA (Strictly Right Aligned) */}
            <motion.section 
                style={{ opacity: p2Opacity, y: p2Y, pointerEvents: p2PointerEvents }}
                animate={{ 
                    x: hyperFocus === 3 ? "-15vw" : "0vw",
                    scale: hyperFocus === 3 ? 0.7 : 1,
                    opacity: hyperFocus === 3 ? 0.3 : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-end pr-6 md:pr-[12vw] pl-6 transform-origin-right"
            >
                <div className="max-w-3xl text-right">
                    <MaskRevealText 
                        text="AGENTS & INSIGHTS" 
                        trigger={p2Visible} 
                        delay={0.1}
                        className="text-purple-400/80 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4"
                    />
                    <SpatialTitle 
                        text={["IMPARA E", "ACCELERA."]} 
                        trigger={p2Visible} 
                        duration={0.8}
                        className="font-display font-black text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] mb-8 uppercase tracking-tighter leading-[0.9] text-blue-50 break-words drop-shadow-lg"
                    />
                    <MaskRevealText 
                        text={[
                            "Andiamo oltre il codice tradizionale.",
                            "Sviluppiamo agenti autonomi, automatismi predittivi",
                            "e generatori di insight comportamentali in tempo reale."
                        ]}
                        trigger={p2Visible}
                        delay={0.3}
                        className="text-white/70 font-sans font-normal text-lg md:text-xl flex flex-col items-end mb-8"
                    />
                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: p2Visible ? 1 : 0 }}
                        transition={{ delay: 0.8 }}
                        onClick={() => setHyperFocus(3)}
                        className={`pointer-events-auto font-mono text-xs text-purple-400 hover:text-white hover:bg-white/10 transition-all border border-purple-400/30 px-4 py-2 rounded-sm tracking-widest ${hyperFocus === 3 ? "hidden" : ""}`}
                    >
                        [ {'>'} ESPANDI_DATI ]
                    </motion.button>
                </div>
            </motion.section>

            {/* STATION 4: THE CORE (Center) */}
            <motion.section 
                style={{ opacity: coreOpacity, y: coreY, pointerEvents: corePointerEvents }}
                animate={{ 
                    x: hyperFocus === 4 ? "-20vw" : "0vw",
                    scale: hyperFocus === 4 ? 0.7 : 1,
                    opacity: hyperFocus === 4 ? 0.3 : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-x-0 bottom-[15vh] md:bottom-[25vh] flex flex-col items-center justify-center text-center px-6 transform-origin-bottom"
            >
                 <div className="max-w-5xl w-full flex flex-col items-center">
                    <SpatialTitle 
                        text={["UN ACCOUNT", "INFINITE", "CAPACITÀ."]} 
                        trigger={coreVisible} 
                        duration={1.0}
                        className="font-display font-black text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] mb-8 uppercase tracking-tighter leading-[0.9] text-blue-50 break-words drop-shadow-lg whitespace-nowrap"
                    />
                    <MaskRevealText 
                        text={[
                            "L'Unico Ecosistema Necessario. Dall'analisi concettuale,",
                            "allo sviluppo dell'infrastruttura, fino al rilascio.",
                            "Offriamo un servizio end-to-end chiavi in mano."
                        ]}
                        trigger={coreVisible}
                        delay={0.2}
                        className="text-white/70 font-sans font-normal text-lg md:text-xl mb-12"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: coreVisible ? 1 : 0, y: coreVisible ? 0 : 30 }}
                        transition={{ delay: 0.8, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center gap-6"
                    >
                        <button className="px-12 py-5 bg-white text-black font-sans font-bold tracking-[0.2em] uppercase text-sm rounded-full hover:bg-black hover:text-white border border-transparent hover:border-white transition-all duration-300">
                            Entra in AI SPACE
                        </button>
                        
                        <button 
                            onClick={() => setHyperFocus(4)}
                            className={`pointer-events-auto font-mono text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/30 px-4 py-2 rounded-sm tracking-widest mt-4 ${hyperFocus === 4 ? "hidden" : ""}`}
                        >
                            [ {'>'} ESPANDI_DATI ]
                        </button>
                    </motion.div>
                </div>
            </motion.section>

            {/* EVENT HORIZON: THE CLIMAX */}
            <motion.section 
                style={{ opacity: ehOpacity, pointerEvents: ehPointerEvents }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-white/20 backdrop-blur-xl transition-[backdrop-filter] duration-1000"
            >
                <div className="text-center flex flex-col items-center">
                    <button 
                        onClick={() => setIsTerminalOpen(true)}
                        className="pointer-events-auto px-10 md:px-14 py-5 md:py-6 bg-white text-black font-sans font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm rounded-full hover:bg-black hover:text-white transition-all duration-500 shadow-[0_0_80px_rgba(255,255,255,1)] border border-transparent hover:border-white"
                    >
                        INIZIALIZZA IL TUO SPAZIO ORA
                    </button>
                    <div className="mt-6 text-black/60 font-mono text-xs tracking-widest uppercase animate-pulse">
                        [ SEQUENZA_AVVIO {'>'} AUTORIZZATA ]
                    </div>
                </div>
            </motion.section>

            <HyperBuilder isOpen={fullScreenApp === 'builder'} onClose={() => setFullScreenApp(null)} />
            <HoloTutor isOpen={fullScreenApp === 'tutor'} onClose={() => setFullScreenApp(null)} />
        </main>
    );
}
