import { motion, useScroll } from 'framer-motion';

export function ScrollProgress() {
    // This hook automatically taps into the global body scroll progress
    const { scrollYProgress } = useScroll();

    return (
        <div className="fixed right-4 top-1/4 bottom-1/4 w-[1px] bg-white/10 z-[90] hidden md:block pointer-events-none">
            <motion.div
                className="w-full bg-white origin-top"
                style={{ scaleY: scrollYProgress, height: "100%" }}
            />
        </div>
    );
}
