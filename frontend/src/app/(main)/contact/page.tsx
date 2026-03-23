'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Plane, Train, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticHover from '@/components/ui/MagneticHover';
import type { Variants } from 'framer-motion';
import Link from 'next/link';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/rooms/forest/r2.png"
                        alt="Wychwood Forest Canopy"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={blurData}
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <motion.div
                    initial="hidden" animate="show" variants={staggerContainer}
                    className="relative z-10 text-center px-4 mt-20"
                >
                    <motion.p variants={fadeUp} className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">Connect with the Estate</motion.p>
                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-serif text-white tracking-wide drop-shadow-lg">Enquiries</motion.h1>
                </motion.div>
            </section>

            <section className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 py-32 relative overflow-hidden">
                {/* Selective Background for Form Section */}
                <div className="absolute inset-x-0 top-0 h-[600px] z-0 opacity-[0.03] pointer-events-none">
                    <motion.div
                        style={{ position: 'relative' }}
                        initial={{ y: -50 }}
                        whileInView={{ y: 50 }}
                        viewport={{ margin: "200px" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="w-full h-full relative mix-blend-screen"
                    >
                        <Image src="/images/hotel/h2.png" alt="Atmospheric Texture" fill sizes="100vw" className="object-cover" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">

                    {/* Left: Contact Form */}
                    <motion.div initial="hidden" animate="show" variants={staggerContainer} className="space-y-10">
                        <div>
                            <motion.h2 variants={fadeUp} className="text-4xl font-serif text-foreground mb-4">Connect with the Concierge</motion.h2>
                            <motion.p variants={fadeUp} className="text-foreground/70 font-light leading-relaxed">
                                For guest relations, private event enquiries, or bespoke requests, our team is at your disposal. 
                                For room bookings, please visit our <Link href="/reservations" className="text-moss-700 underline decoration-moss-200 underline-offset-4 font-medium uppercase tracking-widest text-xs">Reservations Portal</Link>.
                            </motion.p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="glass bg-moss-900 text-moss-100 p-12 text-center rounded-3xl space-y-4"
                            >
                                <CheckCircle2 className="w-16 h-16 mx-auto text-moss-200" />
                                <h3 className="text-3xl font-serif">Message Received</h3>
                                <p className="text-moss-100/80 font-light">Your enquiry has been funneled to our Lead Concierge. We will be in touch shortly.</p>
                                <button onClick={() => setStatus('idle')} className="mt-6 text-sm uppercase tracking-widest border-b border-moss-200 pb-1">Send another message</button>
                            </motion.div>
                        ) : (
                            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">First Name</label>
                                        <input required type="text" className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Last Name</label>
                                        <input required type="text" className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Email Address</label>
                                    <input required type="email" className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Subject of Enquiry</label>
                                    <select className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors text-foreground/80 font-light">
                                        <option>General Restorative Enquiries</option>
                                        <option>Private Events & Gatherings</option>
                                        <option>Culinary Narrative Requests</option>
                                        <option>Heritage Tour Bookings</option>
                                        <option>Press & Media</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Message</label>
                                    <textarea rows={4} className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors resize-none" placeholder="How may we assist in your return to stillness?"></textarea>
                                </div>
                                <MagneticHover intensity={0.15}>
                                    <button
                                        disabled={status === 'submitting'}
                                        className="w-full bg-foreground text-background py-5 rounded-sm uppercase tracking-[0.2em] text-sm font-semibold hover:bg-moss-900 hover:text-white transition-colors duration-300 disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? 'Transmitting...' : 'Transmit Enquire'}
                                    </button>
                                </MagneticHover>
                            </motion.form>
                        )}
                    </motion.div>

                    {/* Right: Contact & Location Panel */}
                    <motion.div
                        style={{ position: 'relative' }}
                        initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer}
                        className="bg-moss-900 text-moss-100 p-12 lg:p-16 rounded-[2rem] space-y-12"
                    >
                        <div>
                            <h3 className="text-3xl font-serif mb-6">Direct Contact</h3>
                            <ul className="space-y-6">
                                <li>
                                    <a href="tel:+441234567890" className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-full border border-moss-100/20 flex items-center justify-center group-hover:bg-moss-100 group-hover:text-moss-900 transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-moss-100/60 mb-1">Concierge</p>
                                            <p className="text-lg font-light tracking-wider">+44 (0) 1234 567 890</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:bespoke@aethelgard.com" className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-full border border-moss-100/20 flex items-center justify-center group-hover:bg-moss-100 group-hover:text-moss-900 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-moss-100/60 mb-1">Email</p>
                                            <p className="text-lg font-light tracking-wide">bespoke@aethelgard.com</p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-moss-100/10">
                            <h3 className="text-3xl font-serif mb-6">Location & Transit</h3>
                            <div className="flex items-start gap-4 mb-8">
                                <MapPin className="w-6 h-6 text-moss-200 mt-1 shrink-0" />
                                <p className="text-moss-100 font-light leading-relaxed">
                                    Aethelgard Estate<br />
                                    Wychwood Forest, Oxfordshire<br />
                                    OX7 5UX, United Kingdom
                                </p>
                            </div>

                            <ul className="space-y-4 pt-4 text-sm font-light text-moss-100/80">
                                <li className="flex items-start gap-3">
                                    <Plane className="w-4 h-4 mt-1 text-moss-200 shrink-0" />
                                    <span><strong>London Heathrow (LHR):</strong> 65 minutes by private estate car. Helicopter charter available upon request (15 min flight time).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Train className="w-4 h-4 mt-1 text-moss-200 shrink-0" />
                                    <span><strong>Charlbury Station:</strong> 10 minutes. Direct GWR services from London Paddington (70 mins). Complimentary chauffeur collection.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Compass className="w-4 h-4 mt-1 text-moss-200 shrink-0" />
                                    <span><strong>Coordinates:</strong> 51.8724° N, 1.5173° W</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Expansive Custom Map Image Replacement */}
            <section className="h-[60vh] w-full relative bg-[#1A1A1A]">
                <Image
                    src="/images/spa/spa2.png"
                    alt="Aethelgard Location Map"
                    fill
                    className="object-cover opacity-60 mix-blend-luminosity grayscale"
                    placeholder="blur"
                    blurDataURL={blurData}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

                {/* Custom Map Pin Override */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 bg-moss-900 rounded-full flex items-center justify-center shadow-2xl pulse-ring">
                        <MapPin className="w-8 h-8 text-moss-100" />
                    </div>
                    <div className="mt-4 glass bg-background/80 px-6 py-3 rounded-full border border-foreground/10">
                        <p className="font-serif text-lg text-foreground">Aethelgard Estate</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
