import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+∑∫∆∞≈Ωµπ<>{}[]";

export function ScrambleText({ text, trigger = true, duration = 0.6, className = "" }) {
    const [displayText, setDisplayText] = useState("");
    const [isScrambling, setIsScrambling] = useState(false);

    useEffect(() => {
        if (!trigger) {
            // Wait until triggered to show anything. 
            // Do NOT clear displayText here, so it can fade out smoothly via Framer Motion.
            return;
        }

        setIsScrambling(true);
        let startTime = Date.now();
        let animationFrameId;

        const updateText = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);

            if (progress < 1) {
                let currentText = "";
                for (let i = 0; i < text.length; i++) {
                    if (text[i] === " ") {
                        currentText += " ";
                    } else if (Math.random() < progress) {
                        currentText += text[i];
                    } else {
                        currentText += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    }
                }
                setDisplayText(currentText);
                animationFrameId = requestAnimationFrame(updateText);
            } else {
                setDisplayText(text);
                setIsScrambling(false);
            }
        };

        animationFrameId = requestAnimationFrame(updateText);

        return () => cancelAnimationFrame(animationFrameId);
    }, [text, duration, trigger]);

    const variants = {
        hidden: { 
            clipPath: "inset(100% 0 0 0)",
            filter: "blur(10px)",
            opacity: 0,
            y: "20px"
        },
        visible: { 
            clipPath: "inset(0% 0 0 0)",
            filter: "blur(0px)",
            opacity: 1,
            y: "0px",
            transition: { 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] // GSAP power4.out equivalent
            }
        }
    };

    return (
        <motion.span 
            variants={variants}
            initial="hidden"
            animate={trigger ? "visible" : "hidden"}
            className={`${isScrambling ? 'text-blue-400 opacity-80' : (className || 'text-current opacity-100')} font-mono transition-colors duration-300 inline-block`}
        >
            {displayText}
        </motion.span>
    );
}
