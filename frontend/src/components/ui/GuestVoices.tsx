'use client';

import { useEffect, useState } from 'react';
import { Quote, BadgeCheck, Star, User } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
    _id: string;
    user: { name: string } | null;
    rating: number;
    comment: string;
    isVerifiedStay: boolean;
    image?: string;
}

export default function GuestVoices() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500); // Fail fast
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/reviews`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!res.ok) throw new Error('API Error');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setReviews(data);
                } else {
                    setReviews([]);
                }
            } catch (err) {
                // Silently fallback if API is unavailable
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    // Fallback if no real DB data
    const allReviews = reviews.length > 0 ? reviews : [
        { _id: '1', user: { name: "Eleanor Vance" }, rating: 5, comment: "Aethelgard isn't just a stay; it's an immersion. The way the light hits the moss in the morning is something I've never captured before. Pure magic.", isVerifiedStay: true, image: '/images/rooms/forest/r2.png' },
        { _id: '2', user: { name: "Julian Thorne" }, rating: 5, comment: "The restoration is impeccable. They haven't just saved the building; they've preserved the soul of the estate. Every stone tells a story.", isVerifiedStay: true, image: '/images/rooms/grand/g1.png' },
        { _id: '3', user: { name: "Sienna Blake" }, rating: 5, comment: "Finally, a place that understands silent luxury. No noise, just the crackle of the hearth and the rustle of the ancient oaks.", isVerifiedStay: false, image: '/images/spa/spa1.png' },
        { _id: '4', user: { name: "Marcus Reid" }, rating: 5, comment: "An absolutely stunning experience. The dining room alone is worth the trip, but the service elevates it to another level entirely.", isVerifiedStay: true, image: '/images/dining/d1.png' },
        { _id: '5', user: { name: "Diana Prince" }, rating: 5, comment: "It feels like stepping back in time, yet with all the modern comforts you could possibly desire. A true hidden gem.", isVerifiedStay: true, image: '/images/hotel/h2.png' },
        { _id: '6', user: { name: "Oliver Grant" }, rating: 5, comment: "The spa rituals are transformative. I left feeling completely renewed and deeply connected to nature.", isVerifiedStay: true, image: '/images/spa/spa2.png' }
    ];

    useEffect(() => {
        if (allReviews.length <= 3) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 3) % allReviews.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [allReviews.length]);

    const displayReviews = allReviews.slice(currentIndex, currentIndex + 3);
    if (displayReviews.length < 3) {
        displayReviews.push(...allReviews.slice(0, 3 - displayReviews.length));
    }

    return (
        <section className="py-24 bg-[#1A1F16] text-white overflow-hidden">
            <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                <div className="text-center mb-16">
                    <Quote className="w-10 h-10 mx-auto mb-6 text-white/20" />
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">Guest Voices</h2>
                    <p className="text-white/40 uppercase tracking-[0.2em] text-xs">Stories from the Hollow</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-t-2 border-white/20 border-r-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayReviews.map((v, i) => (
                            <motion.div
                                key={`${v._id}-${currentIndex}`}
                                style={{ position: 'relative' }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col h-full"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-6 text-amber-400">
                                        {[...Array(5)].map((_, starIndex) => (
                                            <Star
                                                key={starIndex}
                                                className={`w-4 h-4 ${starIndex < (v.rating || 5) ? 'fill-current' : 'opacity-30'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-lg font-light italic mb-8 leading-relaxed opacity-80">{v.comment}</p>
                                </div>
                                <div className="border-t border-white/10 pt-6 mt-auto flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg group-hover:border-white transition-colors duration-700">
                                        {v.image ? (
                                            <Image src={v.image} alt={v.user?.name || 'Guest'} fill className="object-cover" sizes="48px" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                <User className="w-6 h-6 text-white/40" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg leading-tight">{v.user?.name || 'Anonymous Guest'}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Private Guest</p>
                                            {v.isVerifiedStay && (
                                                <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-emerald-400/70 py-0.5 rounded-[4px]">
                                                    <BadgeCheck className="w-2.5 h-2.5" /> Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
