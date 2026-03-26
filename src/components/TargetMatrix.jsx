import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { X, Users, Zap, Briefcase, Cpu, ArrowLeft, Terminal, Activity, CheckCircle2, Crosshair, ChevronRight } from 'lucide-react';
import { PlexusNetwork } from './PlexusNetwork';

// Componente finto terminale che scrive codice tangibile
const TangibleCode = ({ code, color }) => {
    const [displayed, setDisplayed] = useState("");
    
    useEffect(() => {
        setDisplayed("");
        let i = 0;
        const interval = setInterval(() => {
            if (i < code.length) {
                setDisplayed(code.substring(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 15);
        return () => clearInterval(interval);
    }, [code]);
    
    return (
        <pre className={`font-mono text-[10px] md:text-sm ${color} whitespace-pre-wrap font-light leading-relaxed`}>
            {displayed}<span className="animate-pulse opacity-70">_</span>
        </pre>
    );
};

export function TargetMatrix({ isOpen, onClose }) {
    const [activeNode, setActiveNode] = useState(null);

    // Reset quando si chiude la modale
    useEffect(() => {
        if (!isOpen) setActiveNode(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const targetNodes = [
        { 
            id: 1, 
            label: "SCALABILITÀ IDENTITÀ",
            title: 'CREATOR & INFLUENCER', 
            desc: "Proiezione spaziale della tua identità. Cloniamo voce e volto per darti un'ubiquità perfetta su ogni piattaforma, operando mentre tu dormi.", 
            icon: <Users size={24} />,
            colors: { text: "text-blue-400", glow: "bg-blue-500/20", border: "border-blue-500/30", hoverBorder: "hover:border-blue-500/60", gradient: "from-blue-500/10", dot: "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" },
            tangible: {
                process: "PROIEZIONE MULTI-DIMENSIONALE",
                agents: [
                    { name: "Mirror_Avatar_3D", desc: "Clona la tua presenza visiva generando un doppio digitale in altissima fedeltà e animato autonomamente." },
                    { name: "Voice_Engine_Neural", desc: "Replica il tuo timbro vocale catturando sfumature, imperfezioni e respiri umani per un realismo assoluto." },
                    { name: "Spatial_Router", desc: "Taglia e distribuisce simultaneamente contenuti virali sulle diverse topologie social (Insta, TikTok, YT)." }
                ],
                output: "La tua presenza evade i limiti fisici: generiamo centinaia di asset narrativi identici al tuo stile in totale autonomia algoritmica.",
                roi: "Copertura visiva x100. Zero usura fisica o tempo extra speso in studio.",
                codeSnippet: `> Booting NeuraClone Protocol...\nconst avatar = Spatial.cloneEntity("Creator_01");\nconst script = "Inizia l'Ecosistema AI-SPACE";\n\nSpatial.render({\n  entity: avatar,\n  dimensions: "Omnichannel_Auto",\n  publish: true\n});\n\n> System: 30 spatial assets currently deploying...`
            }
        },
        { 
            id: 2, 
            label: "ESECUZIONE VELOCITÀ LUCE",
            title: 'FOUNDER & CEO', 
            desc: "Costruzione automatizzata del tuo go-to-market. Il sistema materializza la tua infrastruttura tecnologica in tre dimensioni, pronta a convertire all'istante.", 
            icon: <Zap size={24} />,
            colors: { text: "text-purple-400", glow: "bg-purple-500/20", border: "border-purple-500/30", hoverBorder: "hover:border-purple-500/60", gradient: "from-purple-500/10", dot: "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" },
            tangible: {
                process: "MATERIALIZZAZIONE INFRASTRUTTURA",
                agents: [
                    { name: "WebGL_Architect_Node", desc: "Ingegnerizza e scrive autonomamente il codice sorgente per Landing e SaaS." },
                    { name: "Conv_Engine_AI", desc: "Evita i testi banali. Aggancia la psicologia dell'utente con copy ad astissima conversione." },
                    { name: "Flow_Orchestrator", desc: "Unisce front-end, back-end serverless e chiamate IA in un singolo blocco granitico." }
                ],
                output: "Invece di lottare con agenzie e gestire codici rotti, la piattaforma sputafuoco partorisce un MVP solido, elegante e pronto a fatturare.",
                roi: "Time-to-market annientato. Vai a mercato in 48 ore anziché 3 mesi.",
                codeSnippet: `> Assembling Launch Architecture...\nSystem.constructSpace({\n  stack: "React Fiber + Tailwind 3D",\n  niche: "High-Ticket SaaS"\n});\n\nSystem.injectConversionLogic(Psych.AIDA);\nSystem.deployToOrbit();\n\n> Status: Business Entity Online. Traffic routing ACTIVE.`
            }
        },
        { 
            id: 3, 
            label: "DOMINIO PERCETTIVO",
            title: 'BRAND INNOVATOR', 
            desc: "Elevazione quantistica del posizionamento. Scolpiamo mondi web tridimensionali impossibili da scrollare passivamente per l'utente.", 
            icon: <Briefcase size={24} />,
            colors: { text: "text-emerald-400", glow: "bg-emerald-500/20", border: "border-emerald-500/30", hoverBorder: "hover:border-emerald-500/60", gradient: "from-emerald-500/10", dot: "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" },
            tangible: {
                process: "SCULTURA AMBIENTALE 3D",
                agents: [
                    { name: "Spatial_Sculptor_Z", desc: "Plasma l'ambiente interattivo e gestisce la fisica dei materiali (Glassmorphism, Neon, Metallo)." },
                    { name: "Neural_Brand_Voice", desc: "Impedisce deviazioni del brand: ogni animazione e pixel è perfettamente allineato all'identità." },
                    { name: "HighTicket_Gravity", desc: "Sistema invisibile che ingaggia emotivamente i prospect elitari, filtrando il rumore di fondo." }
                ],
                output: "Il Brand abbandona lo scrolling 2D. Conquisti un territorio digitale palpabile che paralizza e affascina chiunque atterri nel funnel.",
                roi: "Valore percepito irraggiungibile per i competitor. Prezzi premium giustificati.",
                codeSnippet: `> Rendering Supreme Brand Dimension...\nconst scene = Environment.build3D({\n  physics: "SpaceGlass & ParticleWeb",\n  bloom: true \n});\n\nIdentity.lock(scene);\nConversion.attachGravityEngine();\n\n> Output: Elite Spatial Experience LOCKED.`
            }
        },
        { 
            id: 4, 
            label: "ARCHITETTURA ALGORITMICA",
            title: 'OPERATORI AI', 
            desc: "Il ponte di comando vettoriale definitivo. Infrastrutture serverless per pilotare network complessi di LLM in tempo reale, senza latenza.", 
            icon: <Cpu size={24} />,
            colors: { text: "text-cyan-400", glow: "bg-cyan-500/20", border: "border-cyan-500/30", hoverBorder: "hover:border-cyan-500/60", gradient: "from-cyan-500/10", dot: "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]" },
            tangible: {
                process: "CONTROLLO DI SCIAMI NEURALI",
                agents: [
                    { name: "API_Nexus_Gateway", desc: "Smista valanghe di dati e webhook simultanei distribuendo il carico dinamicamente." },
                    { name: "Model_Balancer", desc: "Seleziona in millisecondi il modello ottimale (Claude/GPT/Llama) per rapporto costo/intelligenza sul singolo task." },
                    { name: "Telemetry_3D_Node", desc: "Genera la diagnostica di salute della rete offrendo visibilità vettoriale immediata dei colli di bottiglia." }
                ],
                output: "Hai il pannello Matrix perfetto. Da singola dashboard comandi un esercito silenzioso di decine di agenti IA che operano sotto il cofano.",
                roi: "Scalabilità strutturale pulita. Nessun debito tecnico nelle operations massifiche.",
                codeSnippet: `> Initializing Agent Swarm Logic...\nSwarm.register([VisionNode, LogicNode, ExecNode]);\n\nWorkflow.executeSpatial({\n  topology: "Mesh_Parallel",\n  autoFailover: true,\n  latencyCap: "< 80ms"\n});\n\n> Telemetry: 50,000 Operations Stable.`
            }
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[200] bg-[#02050a] text-white flex overflow-hidden pointer-events-auto"
                >
                    {/* Background 3D Network */}
                    <div className="absolute inset-0 z-0">
                        <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} color={activeNode ? activeNode.colors.text.split('-')[1] : "#10b981"} />
                            <PlexusNetwork count={180} radius={25} />
                            <OrbitControls autoRotate autoRotateSpeed={activeNode ? 1.5 : 0.8} enableZoom={true} enablePan={false} maxDistance={60} minDistance={10} />
                        </Canvas>
                        {/* Vignette & Gradients */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#010306] via-[#010306]/80 to-transparent h-[40%] pointer-events-none" />
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#010306] via-[#010306]/60 to-transparent w-[30%] pointer-events-none" />
                        
                        {/* Dynamic Global Color Wash based on active node */}
                        {activeNode && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`absolute inset-0 bg-gradient-to-br ${activeNode.colors.gradient} via-transparent to-transparent opacity-20 pointer-events-none`}
                            />
                        )}
                    </div>

                    <div className="relative z-10 w-full h-full p-6 md:p-12 xl:p-16 flex flex-col pointer-events-none max-w-[1400px] mx-auto">
                        
                        {/* Header Shared */}
                        <div className="flex justify-between items-start w-full pointer-events-auto shrink-0 mb-8 border-b border-white/5 pb-6">
                            <div>
                                <div className={`font-mono text-[10px] md:text-xs tracking-[0.4em] mb-3 animate-pulse flex items-center gap-3 ${activeNode ? activeNode.colors.text : "text-white/50"}`}>
                                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${activeNode ? activeNode.colors.glow.replace('bg-', 'bg-').replace('/20','') : "bg-white/50"}`} />
                                    SYS.TARGET_MATRIX
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium uppercase tracking-tighter drop-shadow-2xl leading-none text-white">
                                    {activeNode ? (
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
                                            <span className="text-white/40 font-light text-sm md:text-inherit">LOCK:</span> 
                                            <span className={`${activeNode.colors.text} drop-shadow-[0_0_20px_currentColor] leading-tight mt-1 md:mt-0`}>{activeNode.title}</span>
                                        </div>
                                    ) : (
                                        "LO SPAZIO PROGETTUALE"
                                    )}
                                </h1>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {activeNode && (
                                    <button 
                                        onClick={() => setActiveNode(null)}
                                        className={`font-mono text-[10px] md:text-xs text-white/70 hover:text-white flex items-center gap-2 border border-white/10 hover:border-white/40 px-5 py-2.5 rounded bg-black/50 backdrop-blur-xl transition-all shadow-lg uppercase tracking-wider`}
                                    >
                                        <ArrowLeft size={14} /> TORNA ALLA MATRIX
                                    </button>
                                )}
                                <button 
                                    onClick={() => { setActiveNode(null); onClose(); }}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded border border-white/10 bg-white/5 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all backdrop-blur-xl z-50 shadow-2xl shrink-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Views Container - Added Perspective For 3D Expo */}
                        <AnimatePresence mode="wait">
                            {!activeNode ? (
                                <motion.div 
                                    key="grid"
                                    initial={{ opacity: 0, z: -200, rotateX: 20 }}
                                    animate={{ opacity: 1, z: 0, rotateX: 0 }}
                                    exit={{ opacity: 0, z: 200, rotateX: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                                    className="flex-1 flex flex-col pointer-events-auto w-full pt-4"
                                    style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
                                >
                                    <div className="flex items-start gap-6 max-w-2xl mb-12 border-l border-white/20 pl-6 relative transform-gpu translate-z-10">
                                        <div className="absolute top-0 -left-[1.5px] w-[2px] h-1/3 bg-white" />
                                        <p className="text-white/80 font-sans leading-relaxed text-base md:text-lg font-light tracking-wide">
                                            AI-SPACE è un ambiente liquido. Clicca sulla tua entità di appartenenza e osserva come l'intera architettura 3D e il nostro framework si modellino istantaneamente sui tuoi obiettivi critici.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-auto mb-auto">
                                        {targetNodes.map((node, i) => (
                                            <motion.div 
                                                key={node.id}
                                                // 3D entrance and hover physics
                                                initial={{ opacity: 0, z: -100, rotateX: -15, rotateY: i % 2 === 0 ? 15 : -15 }}
                                                animate={{ opacity: 1, z: 0, rotateX: 0, rotateY: 0 }}
                                                whileHover={{ scale: 1.05, z: 50, rotateX: 5, rotateY: i % 2 === 0 ? -5 : 5 }}
                                                transition={{ delay: 0.1 + (i * 0.1), duration: 0.7, type: 'spring', bounce: 0.4 }}
                                                onClick={() => setActiveNode(node)}
                                                className={`group relative overflow-hidden bg-[#020611]/80 border ${node.colors.border} ${node.colors.hoverBorder} backdrop-blur-2xl p-8 rounded-sm cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 transform-gpu`}
                                            >
                                                {/* Ambient Hover Glow */}
                                                <div className={`absolute top-0 right-0 w-64 h-64 ${node.colors.glow} rounded-full blur-[80px] group-hover:blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none mix-blend-screen translate-x-1/4 -translate-y-1/4`} />
                                                
                                                {/* Cyber Crosshairs & Tech Decals */}
                                                <Crosshair size={12} strokeWidth={1} className={`absolute top-4 left-4 text-white/20 group-hover:${node.colors.text} transition-colors duration-500`} />
                                                <Crosshair size={12} strokeWidth={1} className={`absolute bottom-4 right-4 text-white/20 group-hover:${node.colors.text} transition-colors duration-500`} />
                                                <div className="absolute top-0 left-0 w-8 h-[1px] bg-white/20 group-hover:w-full transition-all duration-700 absolute" />
                                                
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className={`font-mono text-[9px] uppercase tracking-[0.2em] border border-white/10 px-2.5 py-1 rounded-sm bg-black/40 ${node.colors.text}`}>
                                                            {node.label}
                                                        </div>
                                                        <div className={`w-10 h-10 rounded border border-white/5 bg-black/50 flex items-center justify-center ${node.colors.text} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                                            {node.icon}
                                                        </div>
                                                    </div>

                                                    <h2 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">
                                                        {node.title}
                                                    </h2>
                                                    
                                                    <p className="text-white/60 font-sans text-sm md:text-base leading-relaxed group-hover:text-white/90 transition-colors duration-300 font-light pr-4">
                                                        {node.desc}
                                                    </p>
                                                    
                                                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                                                        <div className={`font-mono text-[10px] tracking-widest uppercase flex items-center gap-2 ${node.colors.text} opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500`}>
                                                            <Terminal size={12} /> INITIALIZE DASHBOARD
                                                        </div>
                                                        <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    <div className="font-mono text-[10px] md:text-xs text-white/30 flex items-center gap-6 mt-4">
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> 
                                            TOPOLOGIA DI RETE: STABILE
                                        </span>
                                        <span className="flex items-center gap-2 opacity-50">
                                            <div className="w-1 h-1 bg-white/50" /> 
                                            COORDINAMENTO IA: ESECUTIVO
                                        </span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="tangible-dashboard"
                                    initial={{ opacity: 0, z: -500, scale: 0.8 }}
                                    animate={{ opacity: 1, z: 0, scale: 1 }}
                                    exit={{ opacity: 0, z: 500, scale: 1.2, filter: "blur(20px)" }}
                                    transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                                    className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 pointer-events-auto h-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-10"
                                    style={{ perspective: "2500px", transformStyle: "preserve-3d" }}
                                >
                                    {/* LEFT COLUMN: Holographic Process Map */}
                                    <motion.div 
                                        initial={{ rotateY: 30, x: -100, opacity: 0 }}
                                        animate={{ rotateY: 10, x: 0, opacity: 1 }}
                                        transition={{ duration: 1, delay: 0.1, type: "spring" }}
                                        className="flex-1 flex flex-col relative z-10 w-full transform-gpu origin-left"
                                    >
                                        <div className={`relative p-8 md:p-10 h-full rounded border ${activeNode.colors.border} bg-[#02050A]/80 backdrop-blur-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col`}>
                                            
                                            {/* Subdued Glow Background */}
                                            <div className={`absolute -top-40 -left-40 w-96 h-96 ${activeNode.colors.glow} rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-50`} />
                                            
                                            <h3 className={`relative z-10 font-mono text-[10px] md:text-xs tracking-[0.25em] uppercase mb-4 ${activeNode.colors.text} flex items-center gap-2`}>
                                                <Activity size={14} /> ADATTAMENTO_STRUTTURALE
                                            </h3>
                                            
                                            <div className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-10 tracking-tight leading-none uppercase drop-shadow-lg">
                                                {activeNode.tangible.process}
                                            </div>
                                            
                                            {/* Core Neural Node Agents */}
                                            <div className="relative z-10 flex-1 flex flex-col justify-center">
                                                <div className="font-mono text-xs text-white/40 mb-6 tracking-widest uppercase">
                                                    // Nodi Neurali Operativi Allocati:
                                                </div>
                                                
                                                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-white/20 before:to-transparent">
                                                    {activeNode.tangible.agents.map((ag, idx) => (
                                                        <motion.div 
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.4 + (idx*0.15) }}
                                                            key={idx} 
                                                            className="relative group"
                                                        >
                                                            {/* Glowing Dot on Line */}
                                                            <div className={`absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-black border-2 ${activeNode.colors.dot} z-10`} />
                                                            
                                                            <div className={`font-mono text-sm md:text-base font-bold ${activeNode.colors.text} mb-2 tracking-wide flex items-center gap-2`}>
                                                                {ag.name}
                                                            </div>
                                                            <div className="font-sans text-sm md:text-base font-light text-white/70 leading-relaxed border-l border-white/5 pl-4 ml-1">
                                                                {ag.desc}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* RIGHT COLUMN: Terminal Glass & Output Block */}
                                    <motion.div 
                                        initial={{ rotateY: -30, x: 100, opacity: 0 }}
                                        animate={{ rotateY: -10, x: 0, opacity: 1 }}
                                        transition={{ duration: 1, delay: 0.2, type: "spring" }}
                                        className="flex-1 flex flex-col gap-6 relative z-10 w-full min-h-[500px] transform-gpu origin-right"
                                    >
                                        
                                        {/* Cinematic Execution Terminal */}
                                        <div className="flex-1 bg-[#010204]/90 rounded border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col relative overflow-hidden group">
                                            {/* Top Bar Terminal */}
                                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Terminal size={14} className="text-white/40" />
                                                    <span className="font-mono text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase">Executive Code Manifest</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 overflow-auto bg-black/40 p-4 rounded border border-white/5 shadow-inner">
                                                <TangibleCode code={activeNode.tangible.codeSnippet} color={activeNode.colors.text} />
                                            </div>
                                        </div>

                                        {/* Tangible Holo-Results */}
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className={`bg-gradient-to-br ${activeNode.colors.gradient} border ${activeNode.colors.border} rounded p-6 md:p-8 backdrop-blur-3xl relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]`}
                                        >
                                            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                                                
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`p-1.5 bg-black rounded ${activeNode.colors.border} border`}>
                                                            <CheckCircle2 size={18} className={`${activeNode.colors.text}`} />
                                                        </div>
                                                        <span className="font-mono text-sm tracking-[0.2em] font-bold text-white">OUTPUT MATERIALIZZATO</span>
                                                    </div>
                                                    <p className="font-sans text-base md:text-lg text-white/90 font-light leading-relaxed">
                                                        {activeNode.tangible.output}
                                                    </p>
                                                </div>
                                                
                                                <div className="border-t border-white/10 pt-5">
                                                    <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase mb-2">
                                                        RETURN_ON_INVESTMENT:
                                                    </div>
                                                    <div className={`font-display text-xl md:text-2xl font-bold uppercase ${activeNode.colors.text} tracking-wide drop-shadow-md`}>
                                                        {activeNode.tangible.roi}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
