import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import PropTypes from "prop-types";

// Container Variants for Spring Entrance and Staggered Children
const cardVariants = {
    hidden: { 
        scale: 1.15, 
        opacity: 0, 
        y: 60, 
        rotateX: 15,
        rotateY: -5
    },
    visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        rotateY: 0,
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            mass: 1,
            staggerChildren: 0.15,
            delayChildren: 0.2 // Give the card time to settle before text appears
        } 
    }
};

export function SpatialCard({ children, trigger, className = "" }) {
    const cardRef = useRef(null);
    
    // Magnetic Hover State (Internal framer motion values)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [isHovered, setIsHovered] = useState(false);

    // Track mouse over the card
    function handleMouseMove({ clientX, clientY }) {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        
        // Coordinates relative to card center for Tilt (-1 to 1)
        const xPos = (clientX - left) / width - 0.5;
        const yPos = (clientY - top) / height - 0.5;
        
        mouseX.set(xPos);
        mouseY.set(yPos);
    }

    function handleMouseEnter() {
        setIsHovered(true);
    }

    function handleMouseLeave() {
        setIsHovered(false);
        // Reset tilt to zero
        mouseX.set(0);
        mouseY.set(0);
    }

    // Map -0.5 to 0.5 range to rotation degrees (Magnetic Tilt)
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]); // Mouse up -> look up
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]); // Mouse right -> look right

    // Calculate glare position mapping from -0.5/0.5 to 0%/100%
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
    
    const backgroundGlare = useMotionTemplate`radial-gradient(400px circle at ${glareX} ${glareY}, rgba(255,255,255,0.1), transparent 80%)`;

    return (
        <motion.div
            ref={cardRef}
            variants={cardVariants}
            initial="hidden"
            animate={trigger ? "visible" : "hidden"}
            style={{ 
                rotateX, 
                rotateY,
                perspective: 1000 // Ensure 3D tilt feels right
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden bg-[#0a0a0f]/30 backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-3xl ${className}`}
        >
            {/* Dynamic Glare Layer */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                style={{ 
                    background: backgroundGlare,
                    opacity: isHovered ? 1 : 0 
                }}
            />
            
            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

SpatialCard.propTypes = {
    children: PropTypes.node.isRequired,
    trigger: PropTypes.bool.isRequired,
    className: PropTypes.string
};
