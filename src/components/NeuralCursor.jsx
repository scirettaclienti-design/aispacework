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
            {/* The outer animated, delayed ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
                style={{
                    x: cursorX,
                    y: cursorY,
                    opacity: isVisible ? 1 : 0
                }}
            />
            {/* The exact dot point */}
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
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
