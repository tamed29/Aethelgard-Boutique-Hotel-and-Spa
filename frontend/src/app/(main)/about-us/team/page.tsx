'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Shield, Sparkles, MapPin, Award, Users } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import MagneticHover from '@/components/ui/MagneticHover';
import Link from 'next/link';

const team = [
    {
        name: 'Alexander Thorne',
        title: 'General Manager',
        image: '/images/team/gm.png',
        bio: 'With over three decades in high-luxury hospitality, Alexander ensures that every element of the Aethelgard experience adheres to our strict codes of silence and sophistication.',
        commitment: 'Preserving the sanctity of heritage for those who seek the profound.',
        icon: <Shield className="w-6 h-6" />
    },
    {
        name: 'Elena Vance',
        title: 'Head Chef',
        image: '/images/team/chef.png',
        bio: 'Elena curates the Aethelgard culinary narrative, focusing on ancestral foraging and zero-kilometer estate-grown ingredients to create dishes that tell a story of the soil.',
        commitment: 'Honoring the rugged honesty of the Cotswold landscape through taste.',
        icon: <Award className="w-6 h-6" />
    },
    {
        name: 'Isadora Moon',
        title: 'Spa Director',
        image: '/images/team/spa.png',
        bio: 'Isadora leads the Sanctuary with a deep understanding of botanical restoration and geothermal healing, bridging the gap between ancient ritual and modern wellness.',
        commitment: 'Returning the soul to its natural state of stillness.',
        icon: <Sparkles className="w-6 h-6" />
    },
    {
        name: 'Julian St. James',
        title: 'Master Sommelier',
        image: '/images/team/sommelier.png',
        bio: 'Julian manages our century-old cellars, sourcing rare vintages and curateing liquid journeys that mirror the depth and history of the estate.',
        commitment: 'Crafting complex dialogues through the lineage of the vine.',
        icon: <Star className="w-6 h-6" />
    },
    {
        name: 'Gareth Oakwood',
        title: 'Estate Warden',
        image: '/images/team/warden.png',
        bio: 'Gareth has walked the Wychwood for forty years. He maintains the fragile balance between the estate gardens and the wild, encroaching forest.',
        commitment: 'Guardianship of the emerald deep and its silent wardens.',
        icon: <MapPin className="w-6 h-6" />
    },
    {
        name: 'Sofia Ross',
        title: 'Lead Concierge',
        image: '/images/experiance/Gemini_Generated_Image_yof49ryof49ryof4.png',
        bio: 'Sofia is the architect of your private stay. She specializes in the "un-Googleable" — those rare, local secrets that define a true Aethelgard journey.',
        commitment: 'Luxury is found in the details that cannot be whispered.',
        icon: <Heart className="w-6 h-6" />
    }
];

export default function TeamPage() {
    const featuredGM = team[0];

    return (
        <main className="min-h-screen bg-[#F5F2ED] text-[#1A1F16] pt-24 pb-16 overflow-x-hidden">
            <section className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
                {/* Header - More Compact */}
                <div className="text-center mb-16">
                    <ScrollReveal>
                        <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#3D4127] mb-4">The Curators</p>
                        <h1 className="text-4xl md:text-6xl font-serif tracking-tighter mb-6 underline decoration-[#D4DE95]/30 underline-offset-8">
                            The Guardians
                        </h1>
                        <p className="text-[#1A1F16]/60 font-serif italic max-w-xl mx-auto text-sm">A collective of specialists dedicated to the preservation of silence, heritage, and the absolute luxury of stillness.</p>
                    </ScrollReveal>
                </div>

                {/* Featured Curator & Grid Combined for Compactness */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Featured Curator (GM) */}
                    <div className="lg:col-span-4">
                        <ScrollReveal>
                            <div className="bg-[#1A1F16] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4DE95]/10 blur-3xl" />
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-8 border border-white/5 shadow-inner">
                                    <Image
                                        src={featuredGM.image}
                                        alt={featuredGM.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[#D4DE95] text-[10px] uppercase tracking-[0.4em] font-black italic">Featured Steward</p>
                                    <h2 className="text-3xl font-serif">{featuredGM.name}</h2>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">— {featuredGM.title}</p>
                                    <p className="text-white/60 text-sm leading-relaxed font-serif italic pt-4 border-t border-white/10">
                                        "{featuredGM.commitment}"
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Compact Curator Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {team.slice(1).map((member, idx) => (
                                <ScrollReveal key={member.name} delay={idx * 0.1}>
                                    <div className="bg-white/40 backdrop-blur-xl border border-black/5 p-6 rounded-3xl flex gap-6 hover:bg-white transition-all duration-500 group shadow-sm">
                                        <div className="relative w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="text-lg font-serif mb-1 group-hover:text-[#3D4127] transition-colors">{member.name}</h3>
                                            <p className="text-[8px] uppercase tracking-widest font-black text-[#3D4127]/40 mb-3">{member.title}</p>
                                            <p className="text-[11px] leading-relaxed text-[#1A1F16]/60 line-clamp-3 italic font-serif">
                                                {member.bio}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        {/* Additional Group Content / Feature */}
                        <ScrollReveal delay={0.4}>
                            <div className="mt-8 bg-[#D4DE95]/10 border border-[#D4DE95]/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
                                <div className="w-20 h-20 bg-[#D4DE95] rounded-full flex items-center justify-center shadow-inner">
                                    <Users className="w-10 h-10 text-[#3D4127]" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-xl font-serif text-[#3D4127] mb-2">The Aethelgard Protocol</h4>
                                    <p className="text-sm text-[#3D4127]/60 italic font-serif max-w-lg">
                                        Our curators operate under a strict code of invisibility. We are here to serve, but our greatest gift is the preservation of your absolute seclusion.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Final Compact CTA */}
                <div className="mt-20 text-center">
                    <ScrollReveal>
                        <div className="inline-block p-1 bg-white rounded-full shadow-2xl">
                            <Link 
                                href="/reservations" 
                                className="px-12 py-5 bg-[#3D4127] text-white rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-black transition-all flex items-center gap-6 group"
                            >
                                Request Private Audence
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}
