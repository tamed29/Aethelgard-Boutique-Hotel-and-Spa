'use client';

import Image from 'next/image';
import { History, Leaf, Clock, Castle } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticHover from '@/components/ui/MagneticHover';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Variants } from 'framer-motion';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const timeline = [
    {
        id: '1',
        title: 'The Great Hall',
        year: '1142',
        desc: 'Originally serving as the central gathering place for the ruling family, its timber-framed vaulted ceiling remains fully intact. The heart-stone fireplace, added in the 14th century, is the largest in the county.',
        img: '/images/rooms/double/d1.png'
    },
    {
        id: '2',
        title: 'The Solarium Corridor',
        year: '1480',
        desc: 'Built during the Tudor period to connect the eastern and western wings, flooded with morning light. Look closely at the carved oak panels—each depicts a different botanical specimen found in the Wychwood.',
        img: '/images/rooms/botanical/b1.png'
    },
    {
        id: '3',
        title: 'The Undercroft',
        year: '12th Century',
        desc: 'The oldest remaining stone structure of the estate. Originally used for cold storage and occasionally as a chapel during times of strife. Now, it serves as our atmospheric wine cellar and private dining space.',
        img: '/images/dining/d2.png'
    },
    {
        id: '4',
        title: 'Lady Eleanor\'s Walk',
        year: '1620',
        desc: 'A walled terrace overlooking the formal gardens. Named after Eleanor Aethelgard, who personally cultivated the first collection of rare medicinal herbs that now form the basis of our spa rituals.',
        img: '/images/spa/spa1.png'
    }
];

export default function HeritagePage() {
    return (
        <main className="min-h-screen bg-moss-900 text-moss-100 selection:bg-moss-100 selection:text-moss-900 relative overflow-hidden">
            {/* Hero */}
            <section className="relative h-screen flex border-b border-moss-100/10">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 z-10">
                    <motion.div initial="hidden" animate="show" variants={staggerContainer} className="space-y-6 max-w-xl">
                        <motion.div variants={fadeUp} className="flex items-center gap-4 text-moss-200">
                            <History className="w-6 h-6" />
                            <span className="uppercase tracking-[0.3em] text-xs font-semibold">Our Story</span>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-serif text-white tracking-wide">The Estate</motion.h1>
                        <motion.p variants={fadeUp} className="text-moss-100/80 text-xl font-light leading-relaxed pt-6">
                            Some places are built. Aethelgard was grown. Discover eight centuries of history carved into the heart of the Wychwood.
                        </motion.p>
                    </motion.div>
                </div>
                <div className="hidden lg:block w-1/2 relative overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src="/images/hotel/h2.png"
                            alt="Vintage Estate Grounds"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover grayscale opacity-60 mix-blend-luminosity"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-moss-900 via-transparent to-transparent" />
                </div>
            </section>

            {/* Ancestral Timeline */}
            <section className="py-48 w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative overflow-hidden">
                {/* Selective Background Texture for Timeline */}
                <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
                    <motion.div
                        style={{ position: 'relative' }}
                        initial={{ y: -80 }}
                        whileInView={{ y: 80 }}
                        viewport={{ margin: "200px" }}
                        transition={{ duration: 15, ease: "linear" }}
                        className="w-full h-[120%] relative mix-blend-screen"
                    >
                        <Image src="/images/rooms/forest/r2.png" alt="Forest Lore Texture" fill sizes="100vw" className="object-cover" />
                    </motion.div>
                </div>

                {/* Central Line */}
                <div className="absolute left-4 md:left-1/2 top-40 bottom-32 w-px bg-moss-100/10 -translate-x-1/2 z-0" />

                <div className="space-y-32">
                    {timeline.map((item, idx) => (
                        <div key={item.year} className={`relative flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
                            {/* Marker */}
                            <motion.div
                                style={{ position: 'relative' }}
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-200px" }}
                                className="absolute left-4 md:left-1/2 w-4 h-4 bg-moss-100 rounded-full shadow-[0_0_20px_rgba(233,234,228,0.5)] -translate-x-1/2 mt-2 md:mt-0 z-10"
                            />

                            {/* Content */}
                            <motion.div
                                style={{ position: 'relative' }}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                            >
                                <p className="text-6xl font-serif text-moss-100/20 mb-2">{item.year}</p>
                                <h3 className="text-4xl font-serif text-white mb-4">{item.title}</h3>
                                <p className="text-moss-100/70 leading-relaxed font-light text-lg">{item.desc}</p>
                            </motion.div>

                            {/* Image */}
                            <motion.div
                                style={{ position: 'relative' }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1 }}
                                className="w-full pl-12 md:pl-0 md:w-1/2"
                            >
                                <div className="relative h-80 md:h-[400px] w-full rounded-sm overflow-hidden shadow-2xl">
                                    <Image src={item.img} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" placeholder="blur" blurDataURL={blurData} />
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
