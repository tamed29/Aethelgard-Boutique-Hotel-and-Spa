'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import { Leaf, Droplets, Flame, Sparkles, ArrowRight, Sun, Thermometer, Check, Maximize } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticHover from '@/components/ui/MagneticHover';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Variants } from 'framer-motion';
import SpaReservationForm from '@/components/ui/SpaReservationForm';
import StructuredData from '@/components/ui/StructuredData';
import ParallaxSection from '@/components/ui/ParallaxSection';
import OrganicTransition from '@/components/ui/OrganicTransition';
import Link from 'next/link';

const treatments = [
    {
        icon: <Leaf className="w-10 h-10" />,
        title: 'Forest Ritual',
        duration: '90 min',
        description: 'Inspired by ancient woodland rites — a full-body scrub of wild herb and bark extracts, followed by a warm birch-sap wrap. Restores profound cellular hydration.',
        price: 220,
    },
    {
        icon: <Droplets className="w-10 h-10" />,
        title: 'River Stone Massage',
        duration: '60 min',
        description: 'Smooth river stones, heated to the perfect temperature, glide along meridian pathways dissolving tension. The ultimate remedy for travel fatigue.',
        price: 175,
    },
    {
        icon: <Flame className="w-10 h-10" />,
        title: 'Nordic Sauna Journey',
        duration: '120 min',
        description: 'A traditional Scandinavian sauna sequence: steam, plunge, rest — repeated with aromatic birch whisks and forest elixirs to shock the circulatory system into pure wellness.',
        price: 195,
    },
    {
        icon: <Sparkles className="w-10 h-10" />,
        title: 'Royal Radiance Facial',
        duration: '75 min',
        description: 'Cold-pressed botanical serums and ancestral gemstone tools restore luminosity and balance to every skin type, sealing in youth.',
        price: 160,
    },
];

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

export default function SpaPage() {
    const spaSchema = {
        "@context": "https://schema.org",
        "@type": "HealthAndBeautyBusiness",
        "name": "The Sanctuary Spa at Aethelgard",
        "description": "Ancient wellness rituals and botanical restoration.",
        "image": "/images/spa/spa1.png",
        "priceRange": "$$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "The Wychwood Estate",
            "addressLocality": "Cotswolds",
            "addressRegion": "Gloucestershire",
            "postalCode": "GL54 1AA",
            "addressCountry": "GB"
        }
    };

    return (
        <main className="min-h-screen bg-background overflow-x-clip relative">
            <StructuredData data={spaSchema} />
            {/* 1. Immersive Hero */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/spa/spa1.png"
                        alt="Aethelgard Spa Sanctuary"
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center px-4 mt-20">
                    <ScrollReveal>
                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[12px] font-black mb-6">Wellness & Restoration</p>
                        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter leading-[1.1] drop-shadow-2xl">The Sanctuary</h1>
                        <p className="text-xl md:text-2xl text-white/80 italic mt-8 max-w-xl mx-auto font-serif">Return to stillness beneath the old-growth canopy.</p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="mt-12"
                        >
                            <MagneticHover intensity={0.2} className="inline-block">
                                <Link 
                                    href="#reserve-ritual" 
                                    className="px-10 py-4 bg-[#D4DE95] text-[#2B2E1C] font-black uppercase tracking-[0.4em] text-[9px] rounded-full hover:bg-white transition-colors duration-700 shadow-2xl flex items-center gap-6 group"
                                >
                                    <motion.span whileTap={{ scale: 0.95 }} className="flex items-center gap-6">
                                        Reserve Sanctuary
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-700" />
                                    </motion.span>
                                </Link>
                            </MagneticHover>
                        </motion.div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 2. The Philosophy (Parallax Broadening) */}
            <div className="bg-moss-950 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <ScrollReveal>
                        <p className="text-[12px] uppercase tracking-[0.8em] text-moss-200 mb-8 font-black">The Philosophy</p>
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                            "True wellness is not achieved by adding to the self, but by paring away the noise."
                        </h2>
                        <div className="w-16 h-px bg-white/20 mx-auto mb-8" />
                        <p className="text-moss-100/70 text-lg md:text-xl leading-relaxed font-serif italic max-w-2xl mx-auto">
                            Nestled beneath the ancient eaves of Wychwood, the Aethelgard Spa draws upon healing traditions eight centuries in the making.
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            {/* 3. Thermal & Hydrotherapy (Broadened Imagery) */}
            <section className="py-16 md:py-24 bg-background relative overflow-hidden flex items-center">
                <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none grayscale">
                    <Image src="/images/spa/spa3.png" alt="Botanical Texture" fill sizes="100vw" className="object-cover" />
                </div>

                <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                        <ScrollReveal className="relative aspect-[16/10] lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                            <Image
                                src="/images/spa/spa3.png"
                                alt="Thermal Plunge"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover hover:scale-110 transition-transform duration-[4000ms]"
                            />
                            <div className="absolute bottom-8 left-8 glass p-6 rounded-[1.5rem] border-white/10 backdrop-blur-2xl">
                                <Thermometer className="w-8 h-8 text-moss-700 mb-2" />
                                <p className="text-xl font-serif text-foreground">38°C Thermal Veins</p>
                            </div>
                        </ScrollReveal>

                        <div className="space-y-8">
                            <ScrollReveal className="flex items-center gap-4">
                                <Droplets className="w-8 h-8 text-moss-700" />
                                <span className="uppercase tracking-[0.4em] text-[12px] font-black">The Elements</span>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-[1.1] tracking-tighter mb-6">Thermal & Hydrotherapy</h2>
                                <p className="text-lg text-foreground/70 leading-relaxed font-serif italic max-w-xl">
                                    Deep beneath the limestone lies a network of ancient thermal veins. We tap directly into these mineral-rich waters.
                                </p>
                            </ScrollReveal>
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-foreground/10">
                                <ScrollReveal delay={0.4} className="space-y-4">
                                    <div className="relative aspect-video lg:aspect-square rounded-xl overflow-hidden mb-2 opacity-80 shadow-md">
                                        <Image src="/images/spa/spa4.png" alt="Herbal Infusion" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                    </div>
                                    <h4 className="font-serif text-xl text-foreground">Herbal Infusion</h4>
                                    <p className="text-[10px] text-foreground/50 tracking-wide font-light">Custom botanical blends.</p>
                                </ScrollReveal>
                                <ScrollReveal delay={0.6} className="space-y-4">
                                    <div className="relative aspect-video lg:aspect-square rounded-xl overflow-hidden mb-2 opacity-80 shadow-md">
                                        <Image src="/images/spa/spa5.png" alt="Geothermal Flow" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                    </div>
                                    <h4 className="font-serif text-xl text-foreground">Geothermal Flow</h4>
                                    <p className="text-[10px] text-foreground/50 tracking-wide font-light">Spring-fed minerals.</p>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Signature Rituals (Expansive List) */}
            <section className="py-16 md:py-24 bg-zinc-950 text-white relative">
                <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                    <ScrollReveal className="text-center mb-20">
                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[12px] font-black mb-6">Ancestral Rites</p>
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 tracking-tighter">Signature Rituals</h2>
                        <div className="w-24 h-px bg-white/20 mx-auto" />
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        {treatments.map((t, i) => (
                            <ScrollReveal
                                key={t.title}
                                delay={i * 0.1}
                                className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 hover:bg-white/15 transition-all duration-700 hover:border-moss-100/40 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            >
                                <div className="text-moss-100 mb-6 group-hover:scale-110 transition-transform origin-left">{t.icon}</div>
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-moss-100 transition-colors uppercase tracking-tight">{t.title}</h3>
                                        <p className="text-moss-100 text-[9px] uppercase tracking-[0.3em] font-black mt-2">{t.duration}</p>
                                    </div>
                                    <span className="text-[7px] uppercase tracking-[0.3em] font-black text-white/40 mt-2">Bespoke Pricing</span>
                                </div>
                                <p className="text-base text-white/60 leading-relaxed font-serif italic mb-8 h-[4.5rem] line-clamp-3">{t.description}</p>
                                <MagneticHover intensity={0.2} className="inline-block">
                                    <Link href="/contact" className="group flex items-center gap-4 text-[8px] uppercase tracking-[0.4em] font-black text-white hover:text-[#D4DE95] transition-all duration-700 border-b border-white/10 hover:border-[#D4DE95] pb-2">
                                        <motion.span whileTap={{ scale: 0.95 }} className="flex items-center gap-4">
                                            Reserve Ritual <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-700" />
                                        </motion.span>
                                    </Link>
                                </MagneticHover>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            <OrganicTransition
                variant="SineWave"
                topColor="bg-zinc-950"
                bottomColor="bg-background"
                className="z-20"
            />

            {/* 5. Forest Fitness: The Forge (Expansive Rewrite) */}
            <section id="fitness" className="py-16 md:py-24 bg-background relative overflow-hidden flex items-center">
                {/* Background Textures to fill 'blank space' */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none grayscale">
                    <Image src="/images/gym/gym2.png" alt="Gym Texture" fill sizes="100vw" className="object-cover" />
                </div>

                <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
                        <div className="space-y-8 order-2 lg:order-1">
                            <ScrollReveal className="flex items-center gap-6 text-moss-700">
                                <Maximize className="w-10 h-10" />
                                <span className="uppercase tracking-[0.4em] text-[12px] font-black">The Forge</span>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-[1] tracking-tighter mb-8">The Forest <br />Fitness Studio</h2>
                                <p className="text-lg text-foreground/70 leading-relaxed font-serif italic max-w-xl">
                                    A glass-walled sanctuary for the body. Artisan-crafted wooden equipment meeting the elite conditioning of the old world.
                                </p>
                            </ScrollReveal>

                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-foreground/10 max-w-lg">
                                <ScrollReveal delay={0.4} className="space-y-4">
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2 shadow-lg group/img">
                                        <Image src="/images/gym/gym4.png" alt="Elite Prowess" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h4 className="font-serif text-lg text-foreground">Elite Prowess</h4>
                                    <p className="text-[9px] text-foreground/50 tracking-wide font-light">Custom mahogany gear.</p>
                                </ScrollReveal>
                                <ScrollReveal delay={0.6} className="space-y-4">
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2 shadow-lg group/img">
                                        <Image src="/images/gym/gym5.png" alt="Personal Labs" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h4 className="font-serif text-lg text-foreground">Personal Labs</h4>
                                    <p className="text-[9px] text-foreground/50 tracking-wide font-light">Elite conditioning.</p>
                                </ScrollReveal>
                            </div>
                        </div>

                        <ScrollReveal
                            delay={0.4}
                            className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative order-1 lg:order-2 w-full max-w-md ml-auto"
                        >
                             <Image
                                id="fitness-main-image"
                                src="/images/gym/gym1.png"
                                alt="Forest Fitness Studio"
                                fill
                                sizes="(max-width: 1024px) 100vw, 33vw"
                                className="object-cover hover:scale-105 transition-transform duration-[5000ms]"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 6. Reservation Form Contextualized */}
            <section id="reserve-ritual" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 grayscale pointer-events-none">
                    <Image src="/images/spa/spa7.png" alt="Apothecary Lab" fill sizes="100vw" className="object-cover" />
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <ScrollReveal className="text-center mb-12">
                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[12px] font-black mb-6 italic">Bespoke Restoration</p>
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 tracking-tighter">Reserve Your Ritual</h2>
                        <div className="w-20 h-px bg-white/20 mx-auto" />
                    </ScrollReveal>
                    <div className="glass p-8 md:p-12 rounded-[3rem] border-white/5">
                        <SpaReservationForm />
                    </div>
                </div>
            </section>

            {/* 7. Reference Lookup */}
            <ReferenceSearch />
        </main>
    );
}

function ReferenceSearch() {
    const [ref, setRef] = useState('');
    const [result, setResult] = useState<any>(null);
    const [lookupStatus, setLookupStatus] = useState<'idle' | 'loading' | 'found' | 'notfound'>('idle');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ref.trim()) return;
        setLookupStatus('loading');
        setResult(null);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/spa/lookup/${ref.trim().toUpperCase()}`);
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            setResult(data);
            setLookupStatus('found');
        } catch {
            setLookupStatus('notfound');
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
        confirmed: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
        completed: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
        cancelled: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
    };

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="max-w-xl mx-auto px-6">
                <ScrollReveal className="text-center mb-10">
                    <p className="text-moss-700 uppercase tracking-[0.5em] text-[11px] font-black mb-4">Already Booked?</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4 tracking-tighter">Find Your Ritual</h2>
                    <p className="text-foreground/50 font-serif italic text-sm">Enter the reference code from your confirmation to check your booking status.</p>
                </ScrollReveal>

                <form onSubmit={handleLookup} className="flex gap-3">
                    <input
                        type="text"
                        value={ref}
                        onChange={e => setRef(e.target.value.toUpperCase())}
                        placeholder="e.g. SPA-A3F9B2"
                        className="flex-1 bg-moss-50/50 border border-foreground/10 rounded-2xl py-5 px-6 text-foreground outline-none focus:border-moss-700 transition-all uppercase font-mono tracking-widest text-sm"
                        maxLength={10}
                    />
                    <button
                        type="submit"
                        disabled={lookupStatus === 'loading'}
                        className="px-8 py-5 bg-foreground text-background rounded-2xl uppercase tracking-[0.2em] text-[10px] font-black hover:bg-moss-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {lookupStatus === 'loading' ? (
                            <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : 'Find'}
                    </button>
                </form>

                <AnimatePresence>
                    {lookupStatus === 'found' && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 bg-background border border-foreground/10 rounded-3xl p-8 shadow-xl space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-foreground/30 mb-1">Booking Reference</p>
                                    <p className="text-2xl font-serif text-moss-700 font-bold tracking-widest">{result.referenceNumber}</p>
                                </div>
                                <span className={`inline-flex px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[result.status] || ''}`}>
                                    {result.status}
                                </span>
                            </div>
                            <div className="h-px bg-foreground/5" />
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-foreground/30 mb-1">Guest</p>
                                    <p className="text-foreground font-serif">{result.guestName}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-foreground/30 mb-1">Ritual</p>
                                    <p className="text-foreground font-serif italic">{result.therapyType}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-foreground/30 mb-1">Date & Time</p>
                                    <p className="text-foreground font-serif">
                                        {new Date(result.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        {' · '}{result.timeSlot}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-foreground/30 mb-1">Amount Paid</p>
                                    <p className="text-moss-700 font-bold font-serif text-xl">£{result.price || '—'}</p>
                                </div>
                            </div>
                            {result.paymentStatus === 'paid' && (
                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] uppercase tracking-widest font-black">
                                    <Check className="w-4 h-4" />
                                    Payment confirmed
                                </div>
                            )}
                        </motion.div>
                    )}
                    {lookupStatus === 'notfound' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center text-foreground/40 text-sm italic py-8 border border-dashed border-foreground/10 rounded-2xl"
                        >
                            No booking found for <span className="font-mono text-foreground/60 font-bold">{ref}</span>. Please check your reference code.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
