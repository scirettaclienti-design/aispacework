import { motion } from 'framer-motion';
import { SpatialTitle } from '../SpatialTitle';
import { MaskRevealText } from '../MaskRevealText';
import { MagneticButton } from '../MagneticButton';

export function HeroSection({
    opacity, y, pointerEvents, display, globalRotateX, globalRotateY, isVisible,
    hyperFocus, setHyperFocus, onPrimaryClick
}) {
    return (
        <motion.section 
            style={{ opacity, y, pointerEvents, display }}
            animate={{ 
                x: hyperFocus === 1 ? "-20vw" : "0vw",
                scale: hyperFocus === 1 ? 0.7 : 1,
                opacity: hyperFocus === 1 ? 0.3 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-[10vw] pb-[25vh] md:pb-[15vh] transform-origin-center perspective-[1000px] overflow-hidden"
        >
            {/* HOLOGRAPHIC BACKGROUND LOGO */}
            <motion.div
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                animate={{ 
                    opacity: isVisible ? 0.12 : 0, 
                    scale: isVisible ? 1.4 : 0.5, 
                    rotateY: isVisible ? 0 : 90 
                }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.img 
                    src="/assets/ai_logo_wireframe.png" 
                    alt="Core Hologram" 
                    className="w-[90vw] md:w-[60vw] max-w-[800px] h-auto object-contain mix-blend-screen"
                    style={{ filter: "drop-shadow(0px 0px 30px rgba(34,211,238,0.8)) brightness(150%) hue-rotate(180deg)" }}
                    animate={{ 
                        y: [-20, 20, -20],
                        rotateZ: [-1, 1, -1]
                    }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                />
            </motion.div>

            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
                <MaskRevealText 
                    text="SBLOCCA IL VERO POTERE DELL'INTELLIGENZA ARTIFICIALE" 
                    trigger={isVisible} 
                    element="h2"
                    delay={1.5}
                    className="text-cyan-400/80 font-sans tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm font-medium mb-4 text-center"
                />
                <SpatialTitle 
                    text={["LA TUA EVOLUZIONE", "INIZIA QUI."]} 
                    trigger={isVisible} 
                    delay={1.8}
                    duration={1.2}
                    className="text-[clamp(2.5rem,5vw,4.5rem)] xl:text-[clamp(3.5rem,6vw,6rem)] leading-[0.9] font-display font-black mb-2 md:mb-4 tracking-tighter uppercase text-blue-50 drop-shadow-lg text-center"
                />
                
                <MaskRevealText 
                    text={[
                        "Dimentica la complessità tecnica e mille software diversi.",
                        "AI-SPACE trasforma le tue idee in risultati concreti, al doppio della velocità."
                    ]}
                    trigger={isVisible}
                    delay={2.5}
                    className="text-white/80 font-sans font-medium text-sm md:text-lg max-w-2xl mx-auto mb-8 tracking-wide"
                />

                {/* 3 Concrete Outcomes Array rendering via staggered framer-motion */}
                <motion.div 
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                                delayChildren: 3.0
                            }
                        }
                    }}
                    className="flex flex-col md:flex-row gap-4 mb-10 w-full max-w-3xl justify-center"
                >
                    {[
                        "Crea Siti in 3D Spettacolari",
                        "Automatizza le Vendite",
                        "Delega il Lavoro Operativo"
                    ].map((outcome, idx) => (
                        <motion.div
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-3 rounded-md text-xs md:text-sm font-mono text-white/70"
                        >
                            <span className="text-cyan-400 mr-2">{"//"}</span>{outcome}
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                    transition={{ delay: 3.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                >
                    <button 
                        onClick={onPrimaryClick}
                        className="pointer-events-auto px-8 py-3 bg-white text-black font-sans font-bold tracking-[0.1em] uppercase text-sm rounded-sm hover:bg-cyan-50 hover:text-cyan-900 border border-transparent transition-all duration-300"
                    >
                        Esplora l'Ecosistema
                    </button>
                    
                    <MagneticButton 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ delay: 1 }}
                        onClick={() => setHyperFocus(1)}
                        className={`pointer-events-auto font-mono text-xs text-blue-400 hover:text-white hover:bg-white/10 transition-all border border-blue-400/30 px-6 py-3 rounded-sm tracking-widest ${hyperFocus === 1 ? "hidden" : ""}`}
                    >
                        [ {'>'} ESPANDI_DATI ]
                    </MagneticButton>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
