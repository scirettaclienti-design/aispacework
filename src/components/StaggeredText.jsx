import { motion } from 'framer-motion';

export function StaggeredText({ lines, trigger, className = "" }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3 // slight delay so titles scramble first
            }
        }
    };

    const itemVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: {
            y: "0%",
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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
                // Wrapper with overflow-hidden creates the "mask" reveal effect
                <div key={index} className="overflow-hidden py-1">
                    <motion.div variants={itemVariants} className="block">
                        {/* We use dangerouslySetInnerHTML to allow simple bold tags if needed, or just plain text */}
                        <span dangerouslySetInnerHTML={{ __html: line }} />
                    </motion.div>
                </div>
            ))}
        </motion.div>
    );
}
