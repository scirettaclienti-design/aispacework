import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuantumGrid = () => {
    const [grid, setGrid] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
            let newGrid = "";
            for(let i=0; i<400; i++) {
                newGrid += chars[Math.floor(Math.random() * chars.length)] + " ";
            }
            setGrid(newGrid);
        }, 50);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="absolute inset-0 overflow-hidden opacity-10 font-mono text-cyan-500 text-[10px] md:text-sm leading-none break-all pointer-events-none z-0">
            {grid}
            {grid}
            {grid}
            {grid}
            {grid}
            {grid}
        </div>
    );
}

export function Preloader({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        setIsOpen(true);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 8; // Fast Loading
            if (currentProgress >= 100) {
                currentProgress = 100;
                setProgress(currentProgress);
                clearInterval(interval);
                setTimeout(() => {
                    setIsOpen(false);
                }, 300); // Hold at 100 briefly
            } else {
                setProgress(currentProgress);
            }
        }, 60);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence onExitComplete={() => {
            document.body.style.overflow = '';
            onComplete();
        }}>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
                    exit={{ opacity: 0, scale: 1.5, filter: "brightness(500%) blur(10px)", backgroundColor: "#ffffff" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <QuantumGrid />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="font-mono text-[5rem] sm:text-[8rem] md:text-[14rem] font-bold text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] mix-blend-plus-lighter">
                            {Math.floor(progress)}%
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
