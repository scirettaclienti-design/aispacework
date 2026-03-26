import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { playHoverSound, playClickSound } from '../utils/audio';

export const MagneticButton = ({ children, onClick, className, ...props }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width/2);
        const middleY = clientY - (top + height/2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    const handleClick = (e) => {
        playClickSound();
        if (onClick) onClick(e);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onMouseEnter={playHoverSound}
            initial={props.initial}
            animate={{ x: position.x, y: position.y, ...(props.animate || {}) }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1, ...(props.transition || {}) }}
            onClick={handleClick}
            className={className}
        >
            {children}
        </motion.button>
    );
};
