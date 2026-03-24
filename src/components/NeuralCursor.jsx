import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export function NeuralCursor() {
    const [isVisible, setIsVisible] = useState(false);
    
    // Core cursor coordinates
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring physics configuration for the trailing ring
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    
    // Derived spring values from the raw raw coordinates
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Hide default cursor across the entire document
        document.body.style.cursor = 'none';
        
        const handleMouseMove = (e) => {
            // Un-hide custom cursor once user interacts
            if (!isVisible) setIsVisible(true);
            
            // Offset by half the cursor size (e.g. 32px / 2 = 16px) to center it
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.body.style.cursor = 'auto'; // Restore on unmount
        };
    }, [isVisible, mouseX, mouseY]);

    return (
        <>
            {/* The outer glowing spotlight */}
            <motion.div
                className="fixed top-0 left-0 w-64 h-64 rounded-full bg-cyan-400/10 blur-[50px] pointer-events-none z-[9998] mix-blend-screen hidden md:block"
                style={{
                    x: useTransform(cursorX, x => x - 128 + 16),
                    y: useTransform(cursorY, y => y - 128 + 16),
                    opacity: isVisible ? 1 : 0
                }}
            />
            {/* The secondary inner purple core */}
            <motion.div
                className="fixed top-0 left-0 w-32 h-32 rounded-full bg-purple-500/10 blur-[30px] pointer-events-none z-[9998] mix-blend-screen hidden md:block"
                style={{
                    x: useTransform(cursorX, x => x - 64 + 16),
                    y: useTransform(cursorY, y => y - 64 + 16),
                    opacity: isVisible ? 1 : 0
                }}
            />
            {/* The exact dot point */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,1)] rounded-full pointer-events-none z-[9999] mix-blend-screen hidden md:block"
                style={{
                    // Centered precisely on the exact mouse coordinate
                    x: useTransform(mouseX, x => x + 16 - 3), 
                    y: useTransform(mouseY, y => y + 16 - 3),
                    opacity: isVisible ? 1 : 0
                }}
            />
        </>
    );
}
