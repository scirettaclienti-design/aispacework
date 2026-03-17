import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+∑∫∆∞≈Ωµπ<>{}[]";

export function SpatialTitle({ 
    text, 
    trigger = true, 
    duration = 0.8, 
    className = "", 
    delay = 0 
}) {
    const lines = Array.isArray(text) ? text : [text];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // word by word stagger
                delayChildren: delay
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={trigger ? "visible" : "hidden"}
            className={`flex flex-col ${className}`}
            style={{ wordBreak: 'keep-all', overflowWrap: 'normal', whiteSpace: 'pre-line' }}
        >
            {lines.map((line, index) => (
                <div key={index} className="py-1 lg:py-4 leading-[1.0] lg:leading-[0.9]">
                    <ScrambleWord word={line} trigger={trigger} duration={duration} />
                </div>
            ))}
        </motion.div>
    );
}

// Inner component to handle the physics and scrambling per word
function ScrambleWord({ word, trigger, duration }) {
    const [displayText, setDisplayText] = useState("");
    const [isScrambling, setIsScrambling] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!trigger) {
            setIsFinished(false);
            return;
        }

        setIsScrambling(true);
        setIsFinished(false);
        let startTime = Date.now();
        let animationFrameId;

        const updateText = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);

            if (progress < 1) {
                let currentText = "";
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === " ") {
                        currentText += " ";
                    } else if (Math.random() < progress) {
                        currentText += word[i];
                    } else {
                        currentText += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    }
                }
                setDisplayText(currentText);
                animationFrameId = requestAnimationFrame(updateText);
            } else {
                setDisplayText(word);
                setIsScrambling(false);
                setIsFinished(true); // Triggers the removal of the filter to fix bg-clip-text bugs
            }
        };

        animationFrameId = requestAnimationFrame(updateText);

        return () => cancelAnimationFrame(animationFrameId);
    }, [word, duration, trigger]);

    // Stable 2D Split-Flap Peel (No 3D transforms to avoid WebKit bg-clip-text bugs)
    const itemVariants = {
        hidden: { 
            y: "100%", 
            opacity: 0 
        },
        visible: {
            y: "0%",
            opacity: 1,
            transition: { 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1] 
            }
        }
    };

    // The styling of the inner text
    // While scrambling, we use a glowing blue data style.
    const innerStyle = isScrambling 
        ? "text-blue-400 opacity-90 font-mono tracking-widest drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" 
        : "text-inherit";

    return (
        <motion.div 
            variants={itemVariants} 
            className="block origin-bottom"
        >
            <span 
                className={`transition-all duration-300 ${innerStyle} block relative z-10`}
                style={{ 
                    WebkitTransform: "translateZ(0) translate3d(0,0,0)", 
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                    isolation: "isolate"
                }}
            >
                {displayText}
            </span>
        </motion.div>
    );
}
