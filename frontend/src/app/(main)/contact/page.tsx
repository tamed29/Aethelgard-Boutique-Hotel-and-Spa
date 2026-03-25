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
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Restorative Enquiries');
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMsg('');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, subject, message }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Submission failed');
            }

            setStatus('success');
            // Reset fields
            setFirstName(''); setLastName(''); setEmail('');
            setMessage(''); setSubject('General Restorative Enquiries');
        } catch (err: unknown) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
        }
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hotel/h2.png"
                        alt="Aethelgard Estate Exterior"
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
                    <motion.p variants={fadeUp} className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">A Legacy of Connection</motion.p>
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
                                        <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors" placeholder="Gwendolyn" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Last Name</label>
                                        <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors" placeholder="Thorne" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Email Address</label>
                                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors" placeholder="yourname@domain.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Subject of Enquiry</label>
                                    <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors text-foreground/80 font-light">
                                        <option>General Restorative Enquiries</option>
                                        <option>Private Events &amp; Gatherings</option>
                                        <option>Culinary Narrative Requests</option>
                                        <option>Heritage Tour Bookings</option>
                                        <option>Press &amp; Media</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-medium">Message</label>
                                    <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 focus:border-moss-700 py-3 outline-none transition-colors resize-none" placeholder="How may we assist in your return to stillness?" />
                                </div>
                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-light">{errorMsg || 'Transmission failed. Please try again.'}</p>
                                )}
                                <MagneticHover intensity={0.15}>
                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-foreground text-background py-5 rounded-sm uppercase tracking-[0.2em] text-sm font-semibold hover:bg-moss-900 hover:text-white transition-colors duration-300 disabled:opacity-50"
                                    >
                                        {status === 'submitting' ? 'Transmitting...' : 'Transmit Enquiry'}
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

            {/* Correct Map Embed */}
            <section className="h-[60vh] w-full relative bg-zinc-950 overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.5!2d37.5384637!3d6.0097247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17babb8b24687a2b:0xb4a961edb70f2c7e!2sEthiopian%20Insurance%20Corporation!5e0!3m2!1sen!2set!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.8) invert(0.9) contrast(1.2) brightness(0.8)' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Aethelgard Location Map"
                    className="opacity-70"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background" />
                
                {/* Overlay Pin indicator to keep the 'Aethelgard' feel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <div className="w-16 h-16 bg-moss-900/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-moss-100/20 pulse-ring">
                        <MapPin className="w-8 h-8 text-moss-100" />
                    </div>
                </div>
            </section>
        </main>
    );
}
