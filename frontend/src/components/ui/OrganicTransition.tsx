'use client';

import { motion } from 'framer-motion';

interface OrganicTransitionProps {
    variant: 'LazySlope' | 'ConcaveArc' | 'LayeredHorizon' | 'SineWave' | 'StackedWaves';
    topColor: string; // Tailwind class or hex
    bottomColor: string; // Tailwind class or hex
    className?: string;
    inverted?: boolean;
}

export default function OrganicTransition({
    variant,
    topColor,
    bottomColor,
    className = '',
    inverted = false
}: OrganicTransitionProps) {
    const renderPath = () => {
        switch (variant) {
            case 'LazySlope':
                // High left, sweeps down to right
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        className={`w-full h-auto block ${inverted ? 'scale-y-[-1]' : ''}`}
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0 C480,100 960,120 1440,20 L1440,120 L0,120 Z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case 'ConcaveArc':
                // Scoop design
                return (
                    <svg
                        viewBox="0 0 1440 160"
                        className={`w-full h-auto block ${inverted ? 'scale-y-[-1]' : ''}`}
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0 C240,120 1200,120 1440,0 L1440,160 L0,160 Z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case 'SineWave':
                return (
                    <svg
                        viewBox="0 0 1440 120"
                        className={`w-full h-auto block ${inverted ? 'scale-y-[-1]' : ''}`}
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,60 Q360,120 720,60 T1440,60 L1440,120 L0,120 Z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case 'LayeredHorizon':
                // Overlapping curves an asymmetrical deep wave
                return (
                    <div className={`relative w-full overflow-hidden ${inverted ? 'scale-y-[-1]' : ''}`}>
                        {/* Faded Background Wave */}
                        <svg
                            viewBox="0 0 1440 180"
                            className="w-full h-auto block absolute top-0 left-0 opacity-20 z-0"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,60 C400,160 900,140 1440,20 L1440,180 L0,180 Z"
                                fill="currentColor"
                            />
                        </svg>
                        {/* Solid Foreground Wave */}
                        <svg
                            viewBox="0 0 1440 180"
                            className="w-full h-auto block relative z-10"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,100 C480,240 1080,10 1440,80 L1440,180 L0,180 Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                );
            case 'StackedWaves':
                // Multiple layered waves refined for a "pro" look: more subtle, better overlap
                return (
                    <div className={`relative w-full overflow-hidden ${inverted ? 'scale-y-[-1]' : ''}`}>
                        {/* Layer 1 - Deepest/Most Faded with slow animation */}
                        <motion.svg
                            viewBox="0 0 1440 160"
                            className="w-full h-auto block absolute top-0 left-0 opacity-[0.03] z-0"
                            preserveAspectRatio="none"
                            animate={{ 
                                x: [-20, 20, -20],
                                scaleX: [1, 1.05, 1]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M0,80 C360,140 720,140 1080,80 T1440,80 L1440,160 L0,160 Z"
                                fill="currentColor"
                            />
                        </motion.svg>
                        {/* Layer 2 - Mid Faded */}
                        <motion.svg
                            viewBox="0 0 1440 160"
                            className="w-full h-auto block absolute top-0 left-0 opacity-[0.06] z-10"
                            preserveAspectRatio="none"
                            animate={{ 
                                x: [20, -20, 20],
                                scaleX: [1, 0.95, 1]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M0,60 C420,100 1020,120 1440,40 L1440,160 L0,160 Z"
                                fill="currentColor"
                            />
                        </motion.svg>
                        {/* Layer 3 - Subtle Contrast */}
                        <motion.svg
                            viewBox="0 0 1440 160"
                            className="w-full h-auto block absolute top-0 left-0 opacity-[0.09] z-20"
                            preserveAspectRatio="none"
                            animate={{ 
                                y: [-5, 5, -5]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M0,100 C320,160 1120,60 1440,100 L1440,160 L0,160 Z"
                                fill="currentColor"
                            />
                        </motion.svg>
                        {/* Layer 4 - Foreground Wave (Solid base for transition) */}
                        <svg
                            viewBox="0 0 1440 160"
                            className="w-full h-auto block relative z-30"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0,120 C480,220 960,20 1440,80 L1440,160 L0,160 Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const safeBottomColor = bottomColor.startsWith('bg-') 
        ? bottomColor.replace('bg-', 'text-') 
        : bottomColor;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`w-full -mt-[1px] ${topColor} ${className} text-current`}
            style={{ 
                color: bottomColor.startsWith('#') ? bottomColor : undefined,
                position: 'relative'
            }}
        >
            <div className={`w-full ${bottomColor.startsWith('#') ? '' : safeBottomColor} text-current fill-current`}>
                {renderPath()}
            </div>
        </motion.div>
    );
}
