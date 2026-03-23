'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Star, Moon, Footprints, ArrowRight, Sun, CloudRain as Rain, Snowflake, Wind, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticHover from '@/components/ui/MagneticHover';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ParallaxSection from '@/components/ui/ParallaxSection';
import Link from 'next/link';
import ExperienceGallery from '@/components/ui/ExperienceGallery';
import OrganicTransition from "@/components/ui/OrganicTransition";
import ExperienceInquiryForm from '@/components/ui/ExperienceInquiryForm';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

const narrativeExperiences = [
    {
        icon: <Moon className="w-10 h-10" />,
        title: 'Beneath the Ancient Oaks',
        story: 'The Bonfire Narrative',
        duration: '3 hours',
        price: 'From $150',
        desc: 'As the sun dips below the valley\'s edge, our private bonfires flicker to life. A sanctuary for stories, a haven for spirits destined to connect. Our fire-wardens prepare a selection of artisanal mezze and vintage malts for your gathering.',
        img: '/images/experiance/bonfire_pro.png',
        touches: ['Vintage Malts', 'Artisanal Mezze', 'Fire-Warden']
    },
    {
        icon: <Star className="w-10 h-10" />,
        title: 'Celestial Dialogues',
        story: 'Private Stargazing',
        duration: '2 hours',
        price: 'From $180',
        desc: 'The Wychwood valley holds some of the darkest skies in the emerald kingdoms. Guided by our resident astronomer, explore the constellations from our glass-walled observatory or a private clearing, accompanied by thermal blankets and heated spirits.',
        img: '/images/experiance/stargazing_pro.png',
        touches: ['Celestial Dialogue', 'Thermal Blankets', 'Heated Spirits']
    },
    {
        icon: <Footprints className="w-10 h-10" />,
        title: 'The Forest Whisper',
        story: 'Guided Botanical Walks',
        duration: '4 hours',
        price: 'From $90',
        desc: 'Trace the lineage of the Emerald Deep. Our walks are silent meditations led by local naturalists who know where the rarest mosses bloom and where the forest\'s heartbeat is strongest. A journey of observation, not just exploration.',
        img: '/images/experiance/walking_pro.png',
        touches: ['Ancient Lineage', 'Silent Meditation', 'Rarest Mosses']
    }
];

const seasonalInsights = [
    { season: 'Spring', icon: <Wind className="w-6 h-6" />, desc: 'The awakening of the Ancient Deep. Best for botanical rituals and foraging for wild garlic.' },
    { season: 'Summer', icon: <Sun className="w-6 h-6" />, desc: 'Golden hours that linger. Optimal for twilight bonfires and high-altitude stargazing.' },
    { season: 'Autumn', icon: <Wind className="w-6 h-6" />, desc: 'The forest turns to copper. A time for deep reflection and moss-tracing journeys.' },
    { season: 'Winter', icon: <Snowflake className="w-6 h-6" />, desc: 'Silent, frost-covered landscapes. Perfect for cozy observatory sessions and thermal spirits.' },
];

const guestStories = [
    {
        name: 'Arthur Pendelton',
        role: 'Head Forager',
        bio: 'Three generations of Arthur’s family have walked these woods. He knows where every truffle hides and when the wild garlic is sweetest.',
        image: '/images/hotel/h2.png'
    },
    {
        name: 'Lady Beatrice',
        role: 'Estate Historian',
        bio: 'A living encyclopedia of Wychwood’s past. From Tudor scandals to architectural secrets, she brings the manor’s 800-year history to brilliant life.',
        image: '/images/spa/spa1.png'
    },
];

export default function ExperiencePage() {
    return (
        <main className="min-h-screen bg-zinc-950">
            {/* 1. Immersive Narrative Hero */}
            <section className="relative h-screen w-full overflow-hidden bg-black">
                {/* Cinematic Background with Zoom */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/images/experiance/walking_pro.png"
                        alt="The Ancient Deep"
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                </motion.div>

                {/* Sophisticated Gradient Overlays */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-zinc-950" />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 flex items-center h-full relative z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="max-w-4xl pt-20"
                    >
                        <div className="flex items-center gap-6 mb-10">
                            <span className="w-12 h-px bg-moss-100/40" />
                            <p className="text-moss-100 uppercase tracking-[0.8em] text-[12px] md:text-[14px] font-black">The Aethelgard Narrative</p>
                        </div>

                        <h1 className="text-4xl md:text-[5.5rem] font-serif text-white tracking-tighter leading-[0.95] mb-12">
                            The Story <br />
                            <span className="italic text-moss-100">of Stardust</span> <br />
                            & Soil
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-20">
                            <p className="text-xl md:text-2xl text-white/70 font-serif italic max-w-xl leading-relaxed border-l border-white/20 pl-8">
                                In the hollow, time doesn't pass; it breathes. Every experience is a verse in a legend eight centuries in the making.
                            </p>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">Established</span>
                                <span className="text-2xl font-serif text-moss-100 italic">Anno 1142</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
                >
                    <span className="text-[9px] uppercase tracking-[0.6em] text-white/40 font-black">Explore the Narrative</span>
                    <div className="w-px h-12 bg-white/20 relative overflow-hidden">
                        <motion.div
                            animate={{ y: [0, 48] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full h-1/2 bg-moss-100"
                        />
                    </div>
                </motion.div>
            </section>

            <OrganicTransition
                variant="LayeredHorizon"
                topColor="bg-black"
                bottomColor="bg-zinc-950"
                className="z-20"
            />

            {/* 2. Narrative Journey Blocks */}
            <section className="bg-background">
                {narrativeExperiences.map((exp, idx) => (
                    <React.Fragment key={exp.title}>
                        <div className="min-h-[60vh] py-16 md:py-24 flex items-center relative overflow-hidden border-b border-foreground/5 last:border-0">
                            {/* Atmospheric Parallax Layer */}
                            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none grayscale">
                                <motion.div
                                    style={{ position: 'relative' }}
                                    initial={{ y: -100 }}
                                    whileInView={{ y: 100 }}
                                    viewport={{ margin: "300px" }}
                                    transition={{ duration: 20, ease: "linear" }}
                                    className="w-full h-[130%] relative"
                                >
                                    <Image src={exp.img} alt="Experience Texture" fill className="object-cover" />
                                </motion.div>
                            </div>

                            <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

                                <ScrollReveal
                                    delay={0.2}
                                    className={`relative aspect-[4/5] lg:h-[600px] w-full max-w-[500px] mx-auto rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                                >
                                    <Image
                                        src={exp.img}
                                        alt={exp.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover hover:scale-110 transition-transform duration-[4000ms]"
                                        placeholder="blur"
                                        blurDataURL={blurData}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </ScrollReveal>

                                <div className={`space-y-12 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <ScrollReveal delay={0.4} className="flex items-center gap-6 text-moss-700">
                                        <div className="p-4 rounded-full bg-moss-700/5">
                                            {exp.icon}
                                        </div>
                                        <div>
                                            <span className="uppercase tracking-[0.5em] text-[10px] font-black block">{exp.story}</span>
                                            <span className="text-[10px] text-moss-800/60 uppercase tracking-[0.2em] font-medium mt-1 inline-block">{exp.duration} — {exp.price}</span>
                                        </div>
                                    </ScrollReveal>
                                    <ScrollReveal delay={0.6}>
                                        <h2 className="text-4xl md:text-6xl font-serif text-foreground leading-[1.1] tracking-tighter mb-8">
                                            {exp.title}
                                        </h2>
                                        <p className="text-xl text-foreground/70 leading-relaxed font-serif italic max-w-xl">
                                            {exp.desc}
                                        </p>
                                    </ScrollReveal>

                                    {/* Signature Touches Feature */}
                                    <ScrollReveal delay={0.7} className="flex flex-wrap gap-4 pt-4">
                                        {(exp as any).touches?.map((touch: string) => (
                                            <span key={touch} className="px-5 py-2 rounded-full border border-foreground/10 text-[9px] uppercase tracking-[0.3em] font-black text-moss-800 bg-moss-700/5">
                                                {touch}
                                            </span>
                                        ))}
                                    </ScrollReveal>
                                    <ScrollReveal delay={0.8} className="pt-12">
                                        <MagneticHover intensity={0.2} className="inline-block">
                                            <Link href="#inquire" className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.6em] font-black text-foreground py-6 border-b border-foreground/20 hover:border-[#D4DE95] transition-all duration-700">
                                                <motion.span whileTap={{ scale: 0.95 }} className="flex items-center gap-6">
                                                    Curate Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-6 transition-transform duration-700" />
                                                </motion.span>
                                            </Link>
                                        </MagneticHover>
                                    </ScrollReveal>
                                </div>
                            </div>
                        </div>

                    </React.Fragment>
                ))}
            </section>

            {/* 3. The Rhythms of Wychwood (Seasonal Insights) */}
            <section className="py-16 md:py-24 bg-zinc-950 text-white relative overflow-hidden">
                <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                    <ScrollReveal className="text-center mb-20">
                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[15px] font-black mb-8">The Seasonal Pulse</p>
                        <h2 className="text-4xl md:text-7xl font-serif mb-12 tracking-tighter">The Rhythms of <br />Wychwood</h2>
                        <div className="w-32 h-px bg-white/10 mx-auto" />
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {seasonalInsights.map((s, idx) => (
                            <ScrollReveal key={idx} delay={idx * 0.1} className="glass p-12 rounded-[3rem] border-white/5 hover:bg-white/10 transition-all duration-700">
                                <div className="text-moss-100 mb-8">{s.icon}</div>
                                <h3 className="text-3xl font-serif mb-6">{s.season}</h3>
                                <p className="text-white/60 font-serif italic text-lg leading-relaxed">{s.desc}</p>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Fragments of Time (Advanced Gallery) */}
            <ExperienceGallery />

            {/* 5. Voices from the Forest (Testimonials) */}
            <section className="py-16 md:py-24 bg-background relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4">
                    <ScrollReveal className="text-center mb-24">
                        <Quote className="w-16 h-16 text-moss-700/20 mx-auto mb-12" />
                        <h2 className="text-5xl md:text-7xl font-serif text-foreground tracking-tighter">Voices from the Forest</h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                        {guestStories.map((story, idx) => (
                            <ScrollReveal key={idx} delay={idx * 0.2} className="space-y-8">
                                <p className="text-3xl md:text-4xl font-serif text-foreground/80 leading-snug italic">
                                    "{story.bio}"
                                </p>
                                <div className="pt-8 border-t border-foreground/5 flex items-center gap-6">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-lg border border-foreground/5">
                                        <Image src={story.image} alt={story.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-800">{story.name}</p>
                                        <p className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] mt-2">{story.role}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Call to Action: The Concierge Dialogue (Experience Inquiry Form) */}
            <section id="inquire" className="py-16 md:py-24 bg-zinc-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image src="/images/dining/d2.png" alt="Heritage Detail" fill sizes="100vw" className="object-cover" />
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <ScrollReveal className="text-center mb-20">
                        <Sparkles className="w-16 h-16 text-moss-100 mx-auto mb-12" />
                        <h2 className="text-5xl md:text-8xl font-serif mb-12 leading-tight">Begin Your Narrative</h2>
                        <p className="text-2xl text-white/60 font-serif italic max-w-2xl mx-auto">
                            Every soul that enters Aethelgard leaves a new story in the forest canopy. What will yours be?
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.3}>
                        <ExperienceInquiryForm />
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}
