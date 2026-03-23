'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface ParallaxSectionProps {
    children: ReactNode;
    bgImage: string;
    intensity?: number;
    className?: string;
    overlayColor?: string;
    height?: string;
}

export default function ParallaxSection({
    children,
    bgImage,
    intensity = 100,
    className = "",
    overlayColor = "bg-black/40",
    height = "min-h-[80vh]"
}: ParallaxSectionProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);

    return (
        <section
            ref={ref}
            className={`w-full ${height} flex items-center justify-center overflow-hidden relative ${className}`}
        >
            <motion.div
                style={{ y }}
                className="absolute inset-0 -z-10 h-[120%] w-full"
            >
                <Image
                    src={bgImage || "/images/rooms/forest/r2.png"}
                    alt="Parallax Background"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
                <div className={`absolute inset-0 ${overlayColor}`} />
            </motion.div>

            <div className="relative z-10 w-full">
                {children}
            </div>
        </section>
    );
}
