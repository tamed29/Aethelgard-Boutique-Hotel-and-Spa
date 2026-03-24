'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const BASE_IMAGES = [
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (4).png', alt: 'Ancient Moss & Stone' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (5).png', alt: 'Misty Forest Path' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (7).png', alt: "The Scholar's Nook" },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (8).png', alt: 'Wild Garden Foraging' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (9).png', alt: 'The Walled Sanctuary' },
    { src: '/images/experiance/bonfire_pro.png', alt: 'Emerald Night' },
];

// Triple the array so we can seamlessly loop: [copy | real | copy]
const IMAGES = [...BASE_IMAGES, ...BASE_IMAGES, ...BASE_IMAGES];

const CARD_WIDTH = 420;
const GAP = 32;
const STRIDE = CARD_WIDTH + GAP; // px per card step
const TOTAL_BASE = BASE_IMAGES.length * STRIDE; // width of one full set

export default function ExperienceGallery() {
    // activeIndex tracks which "real" image (0..5) is the current featured one
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // internalIndex tracks position within the tripled array; starts at BASE_IMAGES.length
    const internalRef = useRef(BASE_IMAGES.length);
    const x = useMotionValue(-BASE_IMAGES.length * STRIDE);
    const controls = useAnimationControls();

    const goToInternal = useCallback(
        async (newInternal: number, skipAnimation = false) => {
            if (isTransitioning && !skipAnimation) return;
            setIsTransitioning(true);

            internalRef.current = newInternal;
            setActiveIndex(((newInternal % BASE_IMAGES.length) + BASE_IMAGES.length) % BASE_IMAGES.length);

            if (skipAnimation) {
                x.set(-newInternal * STRIDE);
                setIsTransitioning(false);
                return;
            }

            await controls.start({
                x: -newInternal * STRIDE,
                transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1] },
            });

            // Silently teleport to the middle copy if we've drifted into the outer copies
            let resetTo: number | null = null;
            if (newInternal >= BASE_IMAGES.length * 2) {
                resetTo = newInternal - BASE_IMAGES.length;
            } else if (newInternal < BASE_IMAGES.length) {
                resetTo = newInternal + BASE_IMAGES.length;
            }

            if (resetTo !== null) {
                internalRef.current = resetTo;
                x.set(-resetTo * STRIDE);
                // No animate, instant snap (invisible because same visual position)
            }

            setIsTransitioning(false);
        },
        [controls, x, isTransitioning]
    );

    const next = useCallback(() => {
        goToInternal(internalRef.current + 1);
    }, [goToInternal]);

    const prev = useCallback(() => {
        goToInternal(internalRef.current - 1);
    }, [goToInternal]);

    // Jump to a specific real index (0..5)
    const jumpTo = useCallback(
        (realIdx: number) => {
            const current = ((internalRef.current % BASE_IMAGES.length) + BASE_IMAGES.length) % BASE_IMAGES.length;
            let diff = realIdx - current;
            // Step via the shortest path within the tripled set
            goToInternal(internalRef.current + diff);
        },
        [goToInternal]
    );

    // Auto-advance every 4 seconds
    useEffect(() => {
        if (isPaused) return;
        const id = setInterval(() => {
            goToInternal(internalRef.current + 1);
        }, 4000);
        return () => clearInterval(id);
    }, [isPaused, goToInternal]);

    // Init x position
    useEffect(() => {
        x.set(-BASE_IMAGES.length * STRIDE);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="py-16 md:py-24 bg-background overflow-hidden relative">
            <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                <ScrollReveal className="text-center mb-20">
                    <p className="text-moss-700 uppercase tracking-[0.5em] text-[15px] font-black mb-8">The Visual Narrative</p>
                    <h2 className="text-4xl md:text-6xl font-serif text-foreground tracking-tighter mb-12">Fragments of Time</h2>
                    <div className="w-32 h-px bg-foreground/10 mx-auto" />
                </ScrollReveal>

                {/* Rail container — clips overflow */}
                <div
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Auto indicator */}
                    <div className="absolute top-4 right-4 z-20">
                        <motion.div
                            animate={{ opacity: isPaused ? 0.4 : 1 }}
                            className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
                        >
                            <motion.span
                                animate={!isPaused ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-2 h-2 rounded-full bg-moss-300"
                            />
                            <span className="text-[9px] uppercase tracking-widest text-white/60 font-black">
                                {isPaused ? 'Paused' : 'Auto'}
                            </span>
                        </motion.div>
                    </div>

                    {/* Infinite rail — translates via motion value */}
                    <motion.div
                        className="flex gap-8 will-change-transform"
                        style={{ x }}
                        animate={controls}
                    >
                        {IMAGES.map((img, idx) => (
                            <motion.div
                                key={idx}
                                className="min-w-[300px] md:min-w-[420px] aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 group/item"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover grayscale group-hover/item:grayscale-0 transition-all duration-1000"
                                    sizes="(max-width: 768px) 100vw, 400px"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700 flex items-end p-8">
                                    <p className="text-white font-serif italic text-xl translate-y-4 group-hover/item:translate-y-0 transition-transform duration-700">
                                        {img.alt}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Navigation arrows */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-2 z-20">
                        <button
                            onClick={prev}
                            aria-label="Previous image"
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 transition-all duration-500"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-2 z-20">
                        <button
                            onClick={next}
                            aria-label="Next image"
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 transition-all duration-500"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Progress dots */}
                <div className="mt-20 flex justify-center gap-4">
                    {BASE_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => jumpTo(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={`h-1 transition-all duration-700 rounded-full ${
                                i === activeIndex ? 'w-12 bg-moss-700' : 'w-4 bg-foreground/10 hover:bg-foreground/30'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
