import { motion } from 'framer-motion';
import { SpatialTitle } from '../SpatialTitle';
import { MaskRevealText } from '../MaskRevealText';
import { MagneticButton } from '../MagneticButton';

export function PromptFirstSection({
    opacity, y, pointerEvents, display, globalRotateX, globalRotateY, isVisible, hyperFocus,
    setHyperFocus
}) {
    return (
        <motion.section 
            style={{ opacity, y, pointerEvents, display }}
            animate={{ 
                x: hyperFocus ? "-15vw" : "0vw",
                scale: hyperFocus ? 0.7 : 1,
                opacity: hyperFocus ? 0.3 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-end pr-6 md:pr-[12vw] pl-6 pb-[15vh] transform-origin-right perspective-[1000px]"
        >
            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-3xl text-right flex flex-col items-end">
                <MaskRevealText 
                    text="IL PARADIGMA PROMPT-FIRST" 
                    trigger={isVisible} 
                    delay={0.1}
                    className="text-cyan-400/80 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4"
                />
                <SpatialTitle 
                    text={["IL PONTE TRA", "INTENZIONE E", "COSTRUZIONE."]} 
                    trigger={isVisible} 
                    duration={0.8}
                    className="font-display font-black text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] mb-8 uppercase tracking-tighter leading-[0.9] text-blue-50 break-words drop-shadow-lg text-right"
                />
                
                <div className="flex flex-col items-end gap-6 max-w-2xl">
                    <MaskRevealText 
                        text={[
                            "Un approccio operativo radicale.",
                            "Niente teoria, niente processi lenti. Tu scrivi l'istruzione, l'ecosistema la traduce in prodotto reale."
                        ]}
                        trigger={isVisible}
                        delay={0.3}
                        className="text-white/80 font-sans font-medium text-lg md:text-xl text-right"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="bg-cyan-900/10 border-l-2 border-cyan-400 p-6 backdrop-blur-sm mt-4 text-left mr-0 ml-auto"
                    >
                        <p className="text-white/60 font-sans text-sm italic">
                            "Meno attrito operativo significa arrivare a mercato prima degli altri. L'AI non è solo un tool, è il nuovo motore di esecuzione."
                        </p>
                    </motion.div>
                </div>
                
                <MagneticButton 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => setHyperFocus(4)}
                    className={`mt-10 pointer-events-auto font-mono text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/30 px-6 py-3 rounded-sm tracking-widest ${hyperFocus === 4 ? "hidden" : ""}`}
                >
                    [ {'>'} ESPANDI_DATI ]
                </MagneticButton>
            </motion.div>
        </motion.section>
    );
}
