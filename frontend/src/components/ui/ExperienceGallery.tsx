'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const galleryImages = [
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (4).png', alt: 'Ancient Moss & Stone' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (5).png', alt: 'Misty Forest Path' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (7).png', alt: 'The Scholar\'s Nook' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (8).png', alt: 'Wild Garden Foraging' },
    { src: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4 (9).png', alt: 'The Walled Sanctuary' },
    { src: '/images/experiance/bonfire_pro.png', alt: 'Emerald Night' },
];

export default function ExperienceGallery() {
    const [index, setIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const next = () => {
        setIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <section className="py-16 md:py-24 bg-background overflow-hidden relative">
            <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                <ScrollReveal className="text-center mb-20">
                    <p className="text-moss-700 uppercase tracking-[0.5em] text-[15px] font-black mb-8">The Visual Narrative</p>
                    <h2 className="text-4xl md:text-6xl font-serif text-foreground tracking-tighter mb-12">Fragments of Time</h2>
                    <div className="w-32 h-px bg-foreground/10 mx-auto" />
                </ScrollReveal>

                {/* Horizontal Rail */}
                <div className="relative group">
                    <motion.div
                        ref={containerRef}
                        className="flex gap-8 cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: -1000, right: 0 }} // Dynamic constraint would be better but this is a start
                        style={{ x: -index * 400 }} // Simplified movement for now
                        animate={{ x: -index * (typeof window !== 'undefined' && window.innerWidth < 768 ? 320 : 450) }}
                        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                    >
                        {galleryImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                className="min-w-[300px] md:min-w-[420px] aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 group/item"
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

                    {/* Navigation Arrows */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-6 md:-ml-12 z-20">
                        <button 
                            onClick={prev}
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 transition-all duration-500"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-6 md:-mr-12 z-20">
                        <button 
                            onClick={next}
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 transition-all duration-500"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-20 flex justify-center gap-4">
                   {galleryImages.map((_, i) => (
                       <div 
                         key={i} 
                         className={`h-1 transition-all duration-700 rounded-full ${i === index ? 'w-12 bg-moss-700' : 'w-4 bg-foreground/10'}`} 
                       />
                   ))}
                </div>
            </div>
        </section>
    );
}
