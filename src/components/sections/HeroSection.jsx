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
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-[10vw] pb-[25vh] md:pb-[15vh] transform-origin-center perspective-[1000px]"
        >
            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-4xl mx-auto flex flex-col items-center">
                <MaskRevealText 
                    text="COSTRUISCI CON L'INTELLIGENZA ARTIFICIALE" 
                    trigger={isVisible} 
                    element="h2"
                    delay={0.1}
                    className="text-cyan-400/80 font-sans tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm font-medium mb-4"
                />
                <SpatialTitle 
                    text={["IL TUO", "ECOSISTEMA", "PROMPT-FIRST."]} 
                    trigger={isVisible} 
                    duration={1.2}
                    className="text-[clamp(2.5rem,6vw,5rem)] xl:text-[clamp(3.5rem,6.5vw,6.5rem)] leading-[0.9] font-display font-black mb-2 md:mb-4 tracking-tighter uppercase text-blue-50 drop-shadow-lg"
                />
                
                <MaskRevealText 
                    text={[
                        "Dimentica i tool frammentati.",
                        "AI-SPACE è l'infrastruttura dove intenzione e costruzione coincidono."
                    ]}
                    trigger={isVisible}
                    delay={0.3}
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
                                delayChildren: 0.8
                            }
                        }
                    }}
                    className="flex flex-col md:flex-row gap-4 mb-10 w-full max-w-3xl justify-center"
                >
                    {[
                        "Genera Web App e Piattaforme",
                        "Ottimizza i Processi Creativi",
                        "Scala con Agenti Autonomi"
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
                    transition={{ delay: 1.2, duration: 0.8 }}
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
