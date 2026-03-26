import { motion } from 'framer-motion';
import { SpatialTitle } from '../SpatialTitle';
import { MaskRevealText } from '../MaskRevealText';
import { MagneticButton } from '../MagneticButton';

export function EcosystemModulesSection({
    opacity, y, pointerEvents, display, globalRotateX, globalRotateY, isVisible, hyperFocus,
    setHyperFocus
}) {
    const modules = [
        {
            id: 1,
            title: "LA CENTRALE OPERATIVA",
            category: "SYS.CORE",
            desc: "Il cuore del sistema dove gestisci progetti, memorie e strategie in un solo posto.",
            color: "blue"
        },
        {
            id: 2,
            title: "MOTORE DI CREAZIONE SITI",
            category: "MODULO: WEB DESIGN",
            desc: "L'intelligenza che materializza i tuoi siti web in 3D senza dover scrivere codice.",
            color: "cyan"
        },
        {
            id: 3,
            title: "IL TUO DOCENTE PRIVATO",
            category: "MODULO: FORMAZIONE",
            desc: "Un Tutor personale che ti insegna ad usare l'AI in modo incredibilmente facile e pratico.",
            color: "purple"
        }
    ];

    return (
        <motion.section 
            style={{ opacity, y, pointerEvents, display }}
            animate={{ 
                x: hyperFocus ? "-20vw" : "0vw",
                scale: hyperFocus ? 0.7 : 1,
                opacity: hyperFocus ? 0.3 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-start pl-6 md:pl-[12vw] pr-6 pb-[15vh] transform-origin-left perspective-[1000px]"
        >
            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-4xl">
                <MaskRevealText 
                    text="FUNZIONA TUTTO INSIEME" 
                    trigger={isVisible} 
                    delay={0.1}
                    className="text-white/60 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4"
                />
                <SpatialTitle 
                    text={["L'ECOSISTEMA", "MODULARE."]} 
                    trigger={isVisible}
                    duration={0.8}
                    className="font-display font-black text-3xl sm:text-4xl md:text-7xl lg:text-[7rem] mb-2 uppercase tracking-tighter leading-[0.9] text-blue-50 break-words drop-shadow-lg"
                />
                
                <MaskRevealText 
                    text={[
                        "Dimentica i vari programmi scollegati. Qui tutto collabora per farti crescere."
                    ]}
                    trigger={isVisible}
                    delay={0.3}
                    className="hidden md:block text-white/70 font-sans font-normal text-lg md:text-xl mb-10"
                />

                <div className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-0">
                    {modules.map((mod, idx) => {
                        const bgColors = {
                            blue: "hover:bg-blue-500/10 border-blue-400/20 hover:border-blue-400/50",
                            cyan: "hover:bg-cyan-500/10 border-cyan-400/20 hover:border-cyan-400/50",
                            purple: "hover:bg-purple-500/10 border-purple-400/20 hover:border-purple-400/50"
                        };
                        const textColors = {
                            blue: "text-blue-400",
                            cyan: "text-cyan-400",
                            purple: "text-purple-400"
                        };

                        return (
                            <motion.div 
                                key={mod.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
                                transition={{ delay: 0.6 + (idx * 0.15) }}
                                className={`w-full md:w-[600px] border border-white/5 bg-white/5 backdrop-blur-md p-4 md:p-5 rounded-md flex justify-between items-center group cursor-pointer transition-colors duration-300 ${bgColors[mod.color]}`}
                                onClick={() => setHyperFocus(mod.id === 1 ? 4 : mod.id)} // Mapping to existing focusData panel IDs!
                            >
                                <div>
                                    <div className={`font-mono text-[10px] tracking-[0.2em] mb-1 ${textColors[mod.color]}`}>[{mod.category}]</div>
                                    <div className="text-white font-sans font-bold text-base md:text-xl md:mb-1 tracking-wide">{mod.title}</div>
                                    <div className="hidden md:block text-white/50 text-sm">{mod.desc}</div>
                                </div>
                                <div className="text-white/20 group-hover:text-white transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                <MagneticButton 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => setHyperFocus(3)}
                    className={`mt-10 pointer-events-auto font-mono text-xs text-purple-400 hover:text-white hover:bg-white/10 transition-all border border-purple-400/30 px-6 py-3 rounded-sm tracking-widest ${hyperFocus === 3 ? "hidden" : ""}`}
                >
                    [ {'>'} ESPANDI_DATI ]
                </MagneticButton>
            </motion.div>
        </motion.section>
    );
}
