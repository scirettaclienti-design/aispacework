import { motion } from 'framer-motion';
import { SpatialTitle } from '../SpatialTitle';
import { MaskRevealText } from '../MaskRevealText';

export function VisionSection({
    opacity, y, pointerEvents, display, globalRotateX, globalRotateY, isVisible, hyperFocus,
    onPrimaryClick
}) {
    return (
        <motion.section 
            style={{ opacity, y, pointerEvents, display }}
            animate={{ 
                x: hyperFocus ? "-20vw" : "0vw",
                scale: hyperFocus ? 0.7 : 1,
                opacity: hyperFocus ? 0.3 : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-x-0 bottom-[15vh] md:bottom-[25vh] flex flex-col items-center justify-center text-center px-6 transform-origin-bottom perspective-[1000px]"
        >
            <motion.div style={{ rotateX: globalRotateX, rotateY: globalRotateY, transformStyle: "preserve-3d" }} className="max-w-5xl w-full flex flex-col items-center">
                <MaskRevealText 
                    text="LA VISIONE ESTESA" 
                    trigger={isVisible} 
                    delay={0.1}
                    className="text-white/50 text-xs md:text-sm font-mono uppercase tracking-[0.3em] mb-4"
                />
                
                <SpatialTitle 
                    text={["IL MERCATO", "DI DOMANI", "SI CREA OGGI."]} 
                    trigger={isVisible} 
                    duration={1.0}
                    className="font-display font-black text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] mb-6 uppercase tracking-tighter leading-[0.9] text-blue-50 break-words drop-shadow-lg whitespace-nowrap"
                />
                
                <MaskRevealText 
                    text={[
                        "Spazio infinito per chi osa dominare la complessità digitale."
                    ]}
                    trigger={isVisible}
                    delay={0.2}
                    className="text-white/70 font-sans font-medium text-lg md:text-2xl mb-16"
                />
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                    transition={{ delay: 0.8, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-6"
                >
                    <button 
                        onClick={onPrimaryClick}
                        className="pointer-events-auto px-12 py-5 bg-white text-black font-sans font-bold tracking-[0.2em] uppercase text-sm rounded-sm hover:bg-cyan-500 hover:text-white border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
                    >
                        Attiva il Tuo Sistema
                    </button>
                    
                    <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-4">
                        Connessione Neurale Pronta
                    </div>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
