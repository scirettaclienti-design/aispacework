import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export function MaskRevealText({ 
    text, 
    trigger, 
    className = "", 
    element: Element = "div",
    delay = 0 
}) {
    // Determine if it's a single string or an array of strings
    const lines = Array.isArray(text) ? text : [text];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay
            }
        }
    };

    const itemVariants = {
        hidden: { 
            y: "120%", 
            scale: 0.9,
            rotateX: -45,
            filter: "blur(10px)",
            opacity: 0 
        },
        visible: {
            y: "0%",
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            opacity: 1,
            transition: { 
                type: "spring",
                damping: 20,
                stiffness: 100,
                mass: 1.2
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={trigger ? "visible" : "hidden"}
            className={className}
        >
            {lines.map((line, index) => (
                <div key={index} className="overflow-hidden py-2 leading-[1.1]" style={{ perspective: "1000px" }}>
                    <motion.div variants={itemVariants} className="block origin-bottom">
                        <Element dangerouslySetInnerHTML={{ __html: line }} />
                    </motion.div>
                </div>
            ))}
        </motion.div>
    );
}

MaskRevealText.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    trigger: PropTypes.bool.isRequired,
    className: PropTypes.string,
    element: PropTypes.string,
    delay: PropTypes.number
};
