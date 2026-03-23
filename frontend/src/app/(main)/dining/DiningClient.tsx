'use client';

import Image from 'next/image';
import { Clock, MapPin, ChefHat, Wine, ChevronDown, Utensils, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticHover from '@/components/ui/MagneticHover';
import ScrollReveal from '@/components/ui/ScrollReveal';
import type { Variants } from 'framer-motion';
import { useState } from 'react';
import ParallaxSection from '@/components/ui/ParallaxSection';
import Link from 'next/link';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

export default function DiningPage() {
    const [activeMenu, setActiveMenu] = useState<'starters' | 'mains' | 'desserts'>('mains');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const menuDetails: Record<string, any> = {
        "Hand-Dived Scallops": {
            img: "/images/dining/d1.png",
            story: "Harvested at dawn from the icy waters of the Jurassic Coast, our scallops are served with an apple reduction from the manor's own orchard."
        },
        "Wychwood Venison Loin": {
            img: "/images/dining/d2.png",
            story: "A wild-sourced loin, matured for 21 days and smoked over applewood embers. A dish that echoes the forest's rugged soul."
        },
        "Honey & Thyme Panna Cotta": {
            img: "/images/dining/d3.png",
            story: "Infused with honeycomb from the estate bees and wild mountain thyme. A delicate whisper of the Wychwood meadows."
        },
        "Foraged Mushroom Tart": {
            img: "/images/dining/d6.png",
            story: "A crisp pastry shell cradling the earth's secrets. Hand-picked from the Wychwood floor and glazed with aged balsamic."
        },
        "Line-Caught Halibut": {
            img: "/images/dining/d7.png",
            story: "Sourced from the Atlantic's edge, pan-seared and served with a reduction of coastal botanicals."
        },
        "Heritage Carrot Risotto": {
            img: "/images/dining/d8.png",
            story: "A celebration of our estate gardens. Vibrant, earthy, and layered with textures of raw, roasted, and pickled heritage carrots."
        },
        "Dark Chocolate Delice": {
            img: "/images/dining/d9.png",
            story: "70% cacao paired with a hint of sea salt and smoked vanilla ice cream. A decadent conclusion to your journey."
        }
    };

    return (
        <main className="min-h-screen bg-background overflow-x-clip relative">
            {/* 1. Cinematic Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/dining/d1.png"
                        alt="High-End Dining Aethelgard"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 text-center px-4 mt-20">
                    <ScrollReveal>
                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[15px] font-black mb-8">Taste the Estate</p>
                        <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-[1.1] drop-shadow-2xl">Culinary Journey</h1>
                        <p className="text-2xl md:text-3xl text-white/80 italic mt-12 max-w-2xl mx-auto font-serif">
                            Where centuries of heritage meet the wild bounty of the Wychwood.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* 2. The Philosophy (Parallax Broadening) */}
            <ParallaxSection
                bgImage="/images/dining/d2.png"
                height="min-h-[80vh]"
                intensity={120}
                overlayColor="bg-moss-950/90"
            >
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <ScrollReveal>
                        <p className="text-[15px] uppercase tracking-[0.6em]  mb-12 font-black mb-8">The Philosophy</p>
                        <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-10 leading-tight">
                            Sourced from <br />Soil to Silverware
                        </h2>
                        <div className="w-24 h-px bg-white/20 mx-auto mb-12" />
                        <p className="text-moss-100/70 text-2xl md:text-2xl leading-relaxed font-serif italic max-w-2xl mx-auto">
                            True luxury is knowing exactly where your food comes from. Every dawn, we harvest what the forest offers.
                        </p>
                    </ScrollReveal>
                </div>
            </ParallaxSection>

            {/* 3. The Great Hall (Text-over-Image Layout) */}
            <section className="py-24 relative flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10 grayscale">
                    <Image src="/images/dining/d3.png" alt="Culinary Texture" fill sizes="100vw" className="object-cover" />
                </div>

                <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                        <ScrollReveal className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                            <Image
                                src="/images/dining/d10.png"
                                alt="Great Hall Dining"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover hover:scale-110 transition-transform duration-[4000ms]"
                            />
                            <div className="absolute bottom-12 left-12 glass p-10 rounded-[2rem] border-white/10 backdrop-blur-2xl max-w-sm">
                                <ChefHat className="w-10 h-10 text-moss-700 mb-4" />
                                <p className="text-2xl font-serif text-foreground">The Great Hall</p>
                                <p className="text-sm text-foreground/60 mt-2 italic">Refined elegance beneath ancestral beams.</p>
                            </div>
                        </ScrollReveal>

                        <div className="space-y-12">
                            <ScrollReveal className="flex items-center gap-8 text-moss-700">
                                <Utensils className="w-12 h-12" />
                                <span className="uppercase tracking-[0.6em] text-[15px] font-black">Cuisine D'Heritage</span>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <h2 className="text-6xl md:text-7xl font-serif text-foreground leading-[1] tracking-tighter mb-10">The Narrative <br />of Taste</h2>
                                <p className="text-2xl md:text-2xl text-foreground/70 leading-relaxed font-serif italic max-w-2xl">
                                    Our menus change with the forest's breath. Spring brings wild garlic; winter whispers of smoked venison and root elixirs.
                                </p>
                            </ScrollReveal>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-foreground/10">
                                <ScrollReveal delay={0.4} className="space-y-6">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 opacity-80 shadow-md">
                                        <Image src="/images/dining/d5.png" alt="Wild Forage" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                    </div>
                                    <h4 className="font-serif text-2xl text-foreground">Wild Forage</h4>
                                    <p className="text-sm text-foreground/50 tracking-wide font-light">Daily harvests from the Wychwood floor, brought straight to the pass.</p>
                                </ScrollReveal>
                                <ScrollReveal delay={0.6} className="space-y-6">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 opacity-80 shadow-md">
                                        <Image src="/images/dining/d11.png" alt="The Vault" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                    </div>
                                    <h4 className="font-serif text-2xl text-foreground">The Vault</h4>
                                    <p className="text-sm text-foreground/50 tracking-wide font-light">Rare vintages and low-intervention wines from the manor's original cellar.</p>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery Section */}
            <section className="py-12 bg-background overflow-hidden leading-[0]">
                <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {["d4.png", "d5.png", "d6.png"].map((img, i) => (
                            <ScrollReveal key={i} delay={i * 0.2} className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group">
                                <Image
                                    src={`/images/dining/${img}`}
                                    alt={`Dining Detail ${i + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Interactive Sample Menu (Premium) */}
            <section className="py-32 bg-zinc-950 text-moss-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <ScrollReveal className="mb-20">
                        <p className="text-[15px] uppercase tracking-[0.5em] text-moss-100/60 mb-8 font-black">Sample Provisions</p>
                        <h2 className="text-5xl md:text-7xl font-serif text-white mb-12 tracking-tighter">The Weekly Scroll</h2>
                        <div className="w-24 h-px bg-white/20 mx-auto mb-10" />
                    </ScrollReveal>

                    <div className="flex items-center justify-center gap-12 border-b border-white/10 mb-20 pb-6 relative z-10">
                        {['starters', 'mains', 'desserts'].map(tab => (
                            <motion.button
                                key={tab}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveMenu(tab as any)}
                                className={`uppercase tracking-[0.4em] text-[10px] font-black pb-6 -mb-[25px] transition-all duration-500 ${activeMenu === tab ? 'text-moss-100 border-b border-moss-100' : 'text-moss-100/30 hover:text-moss-100/80'}`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>

                    <div className="space-y-16 min-h-[400px] text-left relative z-10">
                        {activeMenu === 'starters' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <MenuItem title="Hand-Dived Scallops" desc="Estate apple, wild fennel, hazelnut butter" price="£24" onClick={() => setSelectedItem({ title: "Hand-Dived Scallops", desc: "Estate apple, wild fennel, hazelnut butter", price: "£24", ...menuDetails["Hand-Dived Scallops"] })} />
                                <MenuItem title="Foraged Mushroom Tart" desc="Aethelgard truffles, aged cheddar custard" price="£18" onClick={() => setSelectedItem({ title: "Foraged Mushroom Tart", desc: "Aethelgard truffles, aged cheddar custard", price: "£18", ...menuDetails["Foraged Mushroom Tart"] })} />
                            </motion.div>
                        )}
                        {activeMenu === 'mains' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <MenuItem title="Wychwood Venison Loin" desc="Blackberry jus, smoked celeraic, crisp kale" price="£45" onClick={() => setSelectedItem({ title: "Wychwood Venison Loin", desc: "Blackberry jus, smoked celeraic, crisp kale", price: "£45", ...menuDetails["Wychwood Venison Loin"] })} />
                                <MenuItem title="Line-Caught Halibut" desc="Sea herbs, lemon verbena beurre blanc, charred leeks" price="£42" onClick={() => setSelectedItem({ title: "Line-Caught Halibut", desc: "Sea herbs, lemon verbena beurre blanc, charred leeks", price: "£42", ...menuDetails["Line-Caught Halibut"] })} />
                                <MenuItem title="Heritage Carrot Risotto" desc="Tarragon oil, whipped local ricotta, puffed wild rice" price="£28" onClick={() => setSelectedItem({ title: "Heritage Carrot Risotto", desc: "Tarragon oil, whipped local ricotta, puffed wild rice", price: "£28", ...menuDetails["Heritage Carrot Risotto"] })} />
                            </motion.div>
                        )}
                        {activeMenu === 'desserts' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <MenuItem title="Honey & Thyme Panna Cotta" desc="Estate honey, rhubarb compote, pistachio crumb" price="£14" onClick={() => setSelectedItem({ title: "Honey & Thyme Panna Cotta", desc: "Estate honey, rhubarb compote, pistachio crumb", price: "£14", ...menuDetails["Honey & Thyme Panna Cotta"] })} />
                                <MenuItem title="Dark Chocolate Delice" desc="Sea salt caramel, smoked vanilla bean ice cream" price="£16" onClick={() => setSelectedItem({ title: "Dark Chocolate Delice", desc: "Sea salt caramel, smoked vanilla bean ice cream", price: "£16", ...menuDetails["Dark Chocolate Delice"] })} />
                            </motion.div>
                        )}
                    </div>

                    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: selectedItem ? 1 : 0 }}
                            className={`absolute inset-0 bg-black/95 backdrop-blur-xl ${selectedItem ? 'pointer-events-auto' : ''}`}
                            onClick={() => setSelectedItem(null)}
                        />
                        <motion.div
                            layoutId={selectedItem?.title}
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: selectedItem ? 1 : 0, scale: selectedItem ? 1 : 0.9, y: selectedItem ? 0 : 40 }}
                            className={`relative bg-zinc-900 w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row ${selectedItem ? 'pointer-events-auto' : ''}`}
                        >
                            {selectedItem && (
                                <>
                                    <div className="md:w-1/2 relative h-[400px] md:h-auto">
                                        <Image src={selectedItem.img || "/images/dining/d1.png"} alt={selectedItem.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                                    </div>
                                    <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-left">
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSelectedItem(null)} className="absolute top-12 right-12 text-white/40 hover:text-white pb-1 border-b border-transparent hover:border-white transition-all uppercase tracking-[0.4em] text-[10px] font-black">Close</motion.button>
                                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[10px] font-black mb-6">Plate Narrative</p>
                                        <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">{selectedItem.title}</h3>
                                        <p className="text-xl text-white/60 font-serif italic mb-12 leading-relaxed">{selectedItem.story || "A dish crafted with ancestral passion."}</p>
                                        <div className="flex items-center justify-between pt-12 border-t border-white/10">
                                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Market Valuation</span>
                                            <span className="text-3xl font-serif text-moss-100">{selectedItem.price}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>

                    <div className="mt-24 text-center">
                        <MagneticHover intensity={0.2} className="inline-block">
                            <Link href="/contact" className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.5em] font-black text-white py-6 border-b border-white/20 hover:border-[#D4DE95] transition-all duration-700">
                                <motion.span whileTap={{ scale: 0.95 }} className="flex items-center gap-6">
                                    Reserve Your Table <ArrowRight className="w-5 h-5 group-hover:translate-x-4 transition-transform duration-700" />
                                </motion.span>
                            </Link>
                        </MagneticHover>
                    </div>
                </div>
            </section>

            {/* 5. The Cellar Bar (Moody Broadened) */}
            <section className="py-24 bg-black relative overflow-hidden flex items-center">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 grayscale grayscale-50">
                    <motion.div
                        style={{ position: 'relative' }}
                        initial={{ y: -100 }}
                        whileInView={{ y: 100 }}
                        viewport={{ margin: "300px" }}
                        transition={{ duration: 25, ease: "linear" }}
                        className="w-full h-[130%] relative"
                    >
                        <Image src="/images/dining/d4.png" alt="Cellar Bar Background" fill sizes="100vw" className="object-cover" />
                    </motion.div>
                </div>

                <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 grid grid-cols-1 lg:grid-cols-2 gap-40 items-center relative z-10">
                    <ScrollReveal
                        delay={0.2}
                        className="relative h-[800px] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] lg:order-2"
                    >
                        <Image
                            src="/images/dining/d5.png"
                            alt="The Cellar Bar"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover opacity-80 hover:scale-110 transition-transform duration-[4000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    </ScrollReveal>

                    <div className="space-y-16 lg:order-1">
                        <ScrollReveal className="flex items-center gap-8 text-moss-200">
                            <Wine className="w-12 h-12" />
                            <span className="uppercase tracking-[0.6em] text-[15px] font-black">After Hours Dialogue</span>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tighter leading-[1]">The Cellar <br />Vault</h2>
                            <p className="text-2xl md:text-3xl text-white/60 leading-relaxed font-serif italic max-w-xl">
                                Descend into the 14th-century keep. A sanctuary of rare malts and foraged cocktails served in absolute intimacy.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4} className="pt-12">
                            <ul className="space-y-8 pt-8 border-t border-white/10">
                                <li className="flex justify-between items-center text-[10px] uppercase tracking-[0.5em] font-black"><span className="text-white/40 italic">Atmosphere</span> <span className="text-white">Dark Jazz & Velvet</span></li>
                                <li className="flex justify-between items-center text-[10px] uppercase tracking-[0.5em] font-black"><span className="text-white/40 italic">Vintages</span> <span className="text-white">Marcus Thorne's Vault</span></li>
                                <li className="flex justify-between items-center text-[10px] uppercase tracking-[0.5em] font-black"><span className="text-white/40 italic">Hours</span> <span className="text-white">Until the last story ends</span></li>
                            </ul>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </main>
    );
}

function MenuItem({ title, desc, price, onClick }: { title: string, desc: string, price: string, onClick?: () => void }) {
    return (
        <motion.div
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className="flex items-end justify-between gap-8 group cursor-pointer hover:bg-white/5 p-8 rounded-[2rem] transition-all duration-500"
        >
            <div className="flex-1">
                <h4 className="text-3xl md:text-4xl font-serif mb-4 group-hover:text-white transition-colors tracking-tight">{title}</h4>
                <p className="text-moss-100/40 font-serif italic text-lg leading-relaxed group-hover:text-moss-100/80 transition-colors">{desc}</p>
            </div>
            <div className="text-2xl font-serif shrink-0 border-b border-white/10 group-hover:border-moss-100/50 transition-all pb-2 text-white/60 group-hover:text-moss-100">
                {price}
            </div>
        </motion.div>
    );
}
