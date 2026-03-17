import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Command } from 'lucide-react';

const prompts = [
    "Inizializzazione ecosistema AISPACE...",
    "Calibrazione modulo AI-Marketing...",
    "Caricamento memoria condivisa AI-TUTOR...",
    "Accesso al CORE definitivo..."
];

export function CommandBar() {
    const { scrollYProgress } = useScroll();
    const [textIndex, setTextIndex] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        let index = Math.floor(latest * prompts.length);
        if (index >= prompts.length) index = prompts.length - 1;
        setTextIndex(index);
    });

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl pointer-events-auto">
            <div className="glass-panel rounded-full px-6 py-4 flex items-center justify-between gap-4 bg-black/40 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_40px_rgba(0,102,255,0.15)]">
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <Command className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
                    <motion.div
                        key={textIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 font-mono text-sm md:text-base text-gray-300 truncate"
                    >
                        <span className="text-blue-500 font-bold mr-2">{">"}</span>
                        {prompts[textIndex]}
                        <span className="inline-block w-2 h-4 bg-blue-500 ml-1 translate-y-[2px] animate-ping"></span>
                    </motion.div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-1 text-[10px] uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Prompt-First
                </div>
            </div>
        </div>
    );
}
