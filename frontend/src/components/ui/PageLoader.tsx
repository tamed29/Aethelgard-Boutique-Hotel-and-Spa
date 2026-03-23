'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const hide = () => {
            setTimeout(() => setVisible(false), 300);
        };
        // Give the circle a moment to show, then exit
        const minTimer = setTimeout(() => {
            if (document.readyState === 'complete') {
                hide();
            } else {
                window.addEventListener('load', hide, { once: true });
            }
        }, 800);

        return () => clearTimeout(minTimer);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1A1F16]"
                >
                    {/* Subtle ambient radial glow */}
                    <div
                        className="absolute w-96 h-96 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(212,222,149,0.07) 0%, transparent 65%)',
                        }}
                    />

                    {/* Circle stack */}
                    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>

                        {/* Static dim track */}
                        <svg
                            className="absolute"
                            width="120" height="120"
                            viewBox="0 0 120 120"
                            fill="none"
                        >
                            <circle cx="60" cy="60" r="52" stroke="rgba(212,222,149,0.08)" strokeWidth="2" />
                        </svg>

                        {/* Fast spinning glowing arc */}
                        <motion.svg
                            className="absolute"
                            width="120" height="120"
                            viewBox="0 0 120 120"
                            fill="none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle
                                cx="60" cy="60" r="52"
                                stroke="url(#arcGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray="80 248"
                                strokeDashoffset="0"
                            />
                            <defs>
                                <linearGradient id="arcGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#D4DE95" stopOpacity="0" />
                                    <stop offset="100%" stopColor="#D4DE95" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Slower counter-spinning inner arc */}
                        <motion.svg
                            className="absolute"
                            width="80" height="80"
                            viewBox="0 0 80 80"
                            fill="none"
                            style={{ margin: 'auto' }}
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        >
                            <circle
                                cx="40" cy="40" r="32"
                                stroke="rgba(186,192,149,0.35)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeDasharray="40 160"
                            />
                        </motion.svg>

                        {/* Glowing centre dot */}
                        <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-[#D4DE95]"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ boxShadow: '0 0 14px 4px rgba(212,222,149,0.55)' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
