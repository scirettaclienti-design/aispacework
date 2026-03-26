import { motion } from 'framer-motion';
import { SpatialTitle } from '../SpatialTitle';
import { MaskRevealText } from '../MaskRevealText';
import { MagneticButton } from '../MagneticButton';

export function OutcomeSection({
    opacity, y, pointerEvents, display, globalRotateX, globalRotateY, isVisible, hyperFocus, setHyperFocus
}) {
    const outcomes = [
        { 
            title: "Siti Web Mozzafiato", 
            description: "Landing page e siti immersivi in 3D progettati specificamente per far innamorare i tuoi clienti.", 
            icon: "01" 
        },
        { 
            title: "Lancio Immediato", 
            description: "Trasforma le tue idee in prodotti completi in pochissimo tempo, senza dipendere da programmatori.", 
            icon: "02" 
        },
        { 
            title: "Lavoro Automatico", 
            description: "Assistenti intelligenti che lavorano per te giorno e notte, rispondendo ai clienti e gestendo i dati.", 
            icon: "03" 
        },
        { 
            title: "Formazione Veloce", 
            description: "Impara a padroneggiare le nuove tecnologie guidato da un Tutor personale sempre a tua disposizione.", 
            icon: "04" 
        }
    ];

    return (
        <motion.section 
            style={{ opacity, y, pointerEvents, display }}
            animate={{ 
                x: hyperFocus === 2 ? "-15vw" : "0vw",
                scale: hyperFocus === 2 ? 0.7 : 1,
                opacity: hyperFocus === 2 ? 0.3 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-start text-left px-6 md:px-[12vw] pb-[25vh] md:pb-[15vh] transform-origin-left perspective-[1000px]"
        >
            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-6xl w-full mx-auto">
                <MaskRevealText 
                    text="RISULTATI TANGIBILI. DA SUBITO." 
                    trigger={isVisible} 
                    delay={0.1}
                    className="text-purple-400/80 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4 inline-block"
                />
                
                <SpatialTitle 
                    text={["COSA PUOI", "REALIZZARE."]} 
                    trigger={isVisible}
                    duration={0.8}
                    className="font-display font-black text-3xl sm:text-4xl md:text-7xl lg:text-[6.5rem] mb-6 md:mb-12 uppercase tracking-tighter leading-[0.9] text-blue-50 drop-shadow-lg"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl mt-4 md:mt-8 cursor-default">
                    {outcomes.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
                            transition={{ delay: 0.4 + (index * 0.15), duration: 0.6 }}
                            className="bg-purple-900/5 hover:bg-purple-900/20 border border-purple-500/20 backdrop-blur-md p-5 md:p-6 rounded-lg transition-colors group relative overflow-hidden"
                        >
                            <div className="text-purple-400/30 font-display font-bold text-3xl md:text-4xl absolute -right-2 -top-2 select-none group-hover:text-cyan-400/40 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-white font-sans text-lg md:text-xl font-bold md:mb-2 tracking-wide relative z-10">{item.title}</h3>
                            <p className="hidden md:block text-white/60 font-sans text-sm md:text-md leading-relaxed relative z-10">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
                
                <MagneticButton 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => setHyperFocus(2)}
                    className={`mt-10 pointer-events-auto font-mono text-xs text-cyan-400 hover:text-white hover:bg-white/10 transition-all border border-cyan-400/30 px-6 py-3 rounded-sm tracking-widest ${hyperFocus === 2 ? "hidden" : ""}`}
                >
                    [ {'>'} ESPANDI_DATI ]
                </MagneticButton>
            </motion.div>
        </motion.section>
    );
}
