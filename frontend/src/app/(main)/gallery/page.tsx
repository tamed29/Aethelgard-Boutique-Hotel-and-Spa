'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const categories = [
    { id: 'pool', label: 'Pool', bg: '/images/swim/swim.png' },
    { id: 'rooms', label: 'Rooms', bg: '/images/rooms/forest/r1.png' },
    { id: 'spa', label: 'Spa', bg: '/images/spa/spa1.png' },
    { id: 'dining', label: 'Dining', bg: '/images/dining/d1.png' },
    { id: 'outdoors', label: 'Outdoors', bg: '/images/spa/spa2.png' },
];



export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState('pool');
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [galleryItems, setGalleryItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/gallery`);
                const data = await res.json();
                setGalleryItems(data);
            } catch (err) {
                console.error('Failed to fetch gallery', err);
            }
        };
        fetchGallery();
    }, []);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').split('/api')[0];
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanUrl}`;
    };

    const filteredItems = galleryItems.filter(item => item.category === activeCategory);

    return (
        <main className="min-h-screen bg-[#1A1F16] text-white pt-32 pb-24 relative overflow-hidden">
            {/* Immersive Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${categories.find(c => c.id === activeCategory)?.bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(100px) scale(1.1)',
                    }}
                />
            </AnimatePresence>

            <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <ScrollReveal>
                        <p className="text-[15px] uppercase tracking-[0.6em] font-black text-[#BAC095] mb-8">Visual Narrative</p>
                        <h1 className="text-5xl md:text-8xl font-serif leading-[1.1] tracking-tighter mb-12">
                            The <span className="italic text-[#BAC095]">Living</span> Gallery
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic text-white/60 leading-relaxed max-w-2xl mx-auto">
                            A curated sequence of moments, preserved from the heart of Wychwood.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-6 mb-20">
                    {categories.map((cat, idx) => (
                        <ScrollReveal key={cat.id} delay={idx * 0.05}>
                            <button
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-700 border ${activeCategory === cat.id
                                    ? 'bg-[#BAC095] text-[#1A1F16] border-[#BAC095] shadow-[0_0_40px_rgba(186,192,149,0.3)]'
                                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/40 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Masonry Grid */}
                <motion.div
                    layout
                    className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item._id || idx}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{
                                    opacity: { duration: 0.5, delay: idx * 0.05 },
                                    layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                }}
                                className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/5 shadow-2xl break-inside-avoid aspect-square"
                                onClick={() => setSelectedImage(item)}
                            >
                                <Image
                                    src={getImageUrl(item.url || item.src)}
                                    alt={item.alt || "Gallery Item"}
                                    fill
                                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                        <Maximize2 className="text-white w-6 h-6" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 md:p-20"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-10 h-10" />
                        </button>

                        <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full h-full overflow-hidden rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                            >
                                <Image
                                    src={getImageUrl(selectedImage.url || selectedImage.src)}
                                    alt="Selected Gallery Image"
                                    fill
                                    className="object-contain md:object-cover"
                                />
                            </motion.div>

                            <div className="absolute -bottom-16 left-0 right-0 flex justify-between items-center text-white/40">
                                <p className="text-[10px] uppercase tracking-[0.5em] font-black">Category: {selectedImage.category}</p>
                                <div className="flex gap-8">
                                    <button className="hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black">
                                        <ChevronLeft className="w-4 h-4" /> Prev
                                    </button>
                                    <button className="hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black">
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
