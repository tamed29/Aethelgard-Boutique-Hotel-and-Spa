'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface HeroSlideshowProps {
    images: string[];
    interval?: number;
}

export default function HeroSlideshow({ images, interval = 5000 }: HeroSlideshowProps) {
    const [index, setIndex] = useState(0);

    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [images.length, interval]);

    return (
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={images[index] || "/images/rooms/forest/r1.png"}
                        alt={`Hero Slide ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
