'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    yOffset?: number;
}

export default function ScrollReveal({ children, className = "", delay = 0, yOffset = 50 }: ScrollRevealProps) {
    const variants: Variants = {
        hidden: { opacity: 0, y: yOffset },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants}
            style={{ position: 'relative' }}
            className={`relative will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
}
