import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A simple utility to split text into spans (words) for staggering without external libraries
const splitWords = (text) => {
    return text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em] relative align-bottom pb-2">
            <span className="inline-block word-part">{word}</span>
        </span>
    ));
};

export function NarrativeOverlay() {
    const containerRef = useRef(null);

    useEffect(() => {
        const sections = gsap.utils.toArray('.narrative-section');
        
        sections.forEach((section, i) => {
            const isLast = i === sections.length - 1;
            
            // Text animations within section
            const words = section.querySelectorAll('.word-part');
            const graphics = section.querySelectorAll('.graphic-part');
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top center+=20%",
                    end: "bottom center-=20%",
                    scrub: 1.5, // Smoother, slightly elastic scrubbing
                }
            });

            // Very dramatic "reveal from depths" effect
            if (words.length > 0) {
                 tl.fromTo(words, 
                    { opacity: 0, y: "150%", rotateX: -60, filter: "blur(20px)" },
                    { opacity: 1, y: "0%", rotateX: 0, filter: "blur(0px)", duration: 2, stagger: 0.1, ease: "power3.out" }
                );
            }
            
            if (graphics.length > 0) {
                tl.fromTo(graphics,
                    { opacity: 0, scale: 0.5, filter: "blur(30px)" },
                    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" },
                    "<" // Start at the same time as words
                );
            }

            // Fade out
            if (!isLast) {
                tl.to([...words, ...graphics], 
                    { opacity: 0, y: "-100%", filter: "blur(15px)", duration: 1.5, stagger: 0.05, ease: "power2.in" },
                    "+=0.5" // Hold time
                );
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const textDropShadow = "drop-shadow(0px 2px 4px rgba(0,0,0,0.9)) drop-shadow(0px 4px 10px rgba(0,0,0,0.6))";

    return (
        <div ref={containerRef} className="relative z-10 w-full pointer-events-none">
            
            {/* HERO - AISPACE (Sphere nebula) */}
            <section className="narrative-section h-[150vh] flex flex-col items-center justify-start pt-[30vh] px-4">
                <div className="flex flex-col items-center">
                    <svg
                        width="80" height="80" viewBox="0 0 100 100"
                        className="text-white mb-6 animate-[spin_20s_linear_infinite] graphic-part"
                        style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))" }}
                    >
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5"
                             className="text-white animate-[spin_15s_linear_infinite_reverse]" style={{ transformOrigin: '50% 50%' }} />
                        <circle cx="50" cy="50" r="8" fill="currentColor" className="text-white animate-pulse" />
                    </svg>

                    <h1 className="text-[14vw] md:text-[10rem] font-display font-bold text-white uppercase leading-[0.8] tracking-widest relative" style={{ filter: textDropShadow }}>
                        {splitWords("AI SPACE")}
                    </h1>
                    <p className="mt-8 text-[4.5vw] md:text-2xl text-gray-200 font-light tracking-[0.3em] uppercase text-center max-w-[80vw]" style={{ filter: textDropShadow }}>
                        {splitWords("Plasmiamo Ecosistemi Digitali.")}<br/>{splitWords("Guidati dall'Intelligenza Artificiale.")}
                    </p>
                </div>
            </section>

            {/* CHAP 1: Piattaforme (Grid morph) */}
            <section className="narrative-section h-[150vh] flex flex-col items-center justify-center px-[5vw]">
                <div className="flex flex-col items-center">
                    <h2 className="text-[12vw] md:text-[7rem] font-display font-medium text-white uppercase leading-none tracking-tight text-center" style={{ filter: textDropShadow }}>
                        {splitWords("Piattaforme")}
                    </h2>
                    <p className="mt-6 text-[4.5vw] md:text-2xl text-gray-300 font-light tracking-[0.1em] uppercase text-center max-w-4xl leading-relaxed" style={{ filter: textDropShadow }}>
                        {splitWords("Creiamo portali intelligenti.")}<br />{splitWords("Non semplici siti, ma organismi digitali vivi.")}
                    </p>
                </div>
            </section>

            {/* CHAP 2: Sviluppo IA (Helix morph) */}
            <section className="narrative-section h-[150vh] flex flex-col items-center justify-center px-[5vw]">
                <div className="flex flex-col items-center">
                    <h2 className="text-[10vw] md:text-[6rem] font-display font-medium text-white uppercase leading-none tracking-tight text-center" style={{ filter: textDropShadow }}>
                        {splitWords("Sviluppo IA")}
                    </h2>
                    <div className="mt-6 text-[4.5vw] md:text-2xl text-gray-300 font-light tracking-[0.1em] uppercase text-center max-w-4xl leading-relaxed" style={{ filter: textDropShadow }}>
                        {splitWords("Costruiamo strutture complesse tramite forgiatura neurale.")}<br />
                        <span className="font-bold text-white">{splitWords("Velocità. Precisione. Efficienza assoluta.")}</span>
                    </div>
                </div>
            </section>

            {/* CHAP 3: End-to-End (Core Implosion) */}
            <section className="narrative-section h-[150vh] flex flex-col items-center justify-center px-[5vw]">
                <div className="flex flex-col items-center">
                    <h2 className="text-[10vw] md:text-[6.5rem] font-display font-medium text-white uppercase leading-none tracking-tight text-center" style={{ filter: textDropShadow }}>
                        {splitWords("End-to-End")}
                    </h2>
                    <p className="mt-6 text-[4.5vw] md:text-2xl text-gray-300 font-light tracking-[0.1em] uppercase text-center max-w-4xl leading-relaxed" style={{ filter: textDropShadow }}>
                        {splitWords("Dalla prima formazione del modello fino al risultato finale. Un partner unico.")}
                    </p>
                </div>
            </section>

            {/* CORE / CTA */}
            <section className="narrative-section min-h-screen flex flex-col items-center justify-center px-[5vw] pointer-events-auto pb-32">
                <div className="graphic-part flex flex-col items-center justify-center p-8 md:p-16 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md max-w-4xl w-full" style={{ filter: textDropShadow }}>
                    <span className="font-display font-bold tracking-[0.4em] text-white text-[2.5vw] md:text-sm uppercase mb-6">
                        {splitWords("The Core")}
                    </span>
                    <h3 className="text-[9vw] md:text-7xl font-display font-medium text-white mb-10 tracking-tighter text-center leading-[1.1]">
                        {splitWords("L'Unico Ecosistema")}<br />
                        <span className="font-light italic text-gray-400">{splitWords("Necessario.")}</span>
                    </h3>
                    <button className="px-8 md:px-12 py-4 bg-white text-black font-display font-bold tracking-[0.2em] uppercase text-[3vw] md:text-sm rounded-full hover:scale-105 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        Inizia Ora
                    </button>
                </div>
            </section>

        </div>
    );
}
