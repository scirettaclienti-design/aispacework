import { motion } from 'framer-motion';
import { SpatialTitle } from '../SpatialTitle';
import { MaskRevealText } from '../MaskRevealText';
import { MagneticButton } from '../MagneticButton';

export function AudienceSection({
    opacity, y, pointerEvents, display, globalRotateX, globalRotateY, isVisible, hyperFocus,
    setHyperFocus
}) {
    const roles = [
        "CREATOR DIGITALI",
        "FOUNDER & CEO",
        "BRAND INNOVATOR",
        "PROFESSIONISTI AI"
    ];

    return (
        <motion.section 
            style={{ opacity, y, pointerEvents, display }}
            animate={{ 
                x: hyperFocus ? "-10vw" : "0vw",
                scale: hyperFocus ? 0.8 : 1,
                opacity: hyperFocus ? 0.3 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center pr-6 md:pr-[12vw] pl-6 pb-[15vh] transform-origin-center perspective-[1000px] text-center"
        >
            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-3xl flex flex-col items-center">
                <MaskRevealText 
                    text="IL TARGET OPERATIONALE" 
                    trigger={isVisible} 
                    delay={0.1}
                    className="text-cyan-400/80 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4"
                />
                
                <SpatialTitle 
                    text={["PER CHI", "È PROGETTATO."]} 
                    trigger={isVisible} 
                    duration={0.8}
                    className="font-display font-black text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] mb-6 uppercase tracking-tighter leading-[0.9] text-blue-50 drop-shadow-lg"
                />
                
                <MaskRevealText 
                    text={[
                        "Costruito per chi esige risultati estremi, senza possedere un team tecnico interno."
                    ]}
                    trigger={isVisible}
                    delay={0.3}
                    className="text-white/80 font-sans font-medium text-lg md:text-2xl mb-12 text-center"
                />

                <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl px-4">
                    {roles.map((role, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9, y: isVisible ? 0 : 15 }}
                            transition={{ delay: 0.6 + (idx * 0.1), duration: 0.5, type: 'spring' }}
                            className="bg-[#0a0f16]/80 text-white border border-cyan-400/20 px-6 py-4 rounded-sm font-sans text-sm md:text-lg tracking-widest uppercase hover:border-cyan-400 transition-colors"
                        >
                            {role}
                        </motion.div>
                    ))}
                </div>

                <MagneticButton 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => setHyperFocus(5)}
                    className={`mt-10 pointer-events-auto font-mono text-xs text-cyan-400 hover:text-white hover:bg-white/10 transition-all border border-cyan-400/30 px-6 py-3 rounded-sm tracking-widest ${hyperFocus === 5 ? "hidden" : ""}`}
                >
                    [ {'>'} ESPANDI_DATI ]
                </MagneticButton>
            </motion.div>
        </motion.section>
    );
}
