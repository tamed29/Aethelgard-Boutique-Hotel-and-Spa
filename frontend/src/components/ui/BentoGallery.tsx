'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import MagneticHover from './MagneticHover';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

// Room slugs match /rooms/[slug] and ROOM_DATA in RoomClient.tsx
const rooms = [
    {
        slug: 'grand',
        title: 'Grand Estate Suite',
        vibe: 'Sovereign luxury at the pinnacle of the Wychwood.',
        img: '/images/rooms/grand/g1.png',
        defaultPrice: 950,
        colSpan: 2
    },
    {
        slug: 'forest',
        title: 'Forest Retreat',
        vibe: 'Muted luxury amidst the ancient whispering pines.',
        img: '/images/rooms/forest/r1.png',
        defaultPrice: 320,
        colSpan: 1
    },
    {
        slug: 'double',
        title: 'Double Heritage Room',
        vibe: 'Storied comfort in the original 12th-century wing.',
        img: '/images/rooms/double/d1.png',
        defaultPrice: 280,
        colSpan: 1
    },
    {
        slug: 'botanical',
        title: 'Botanical Oasis Suite',
        vibe: 'Secluded sanctuary wrapped in living blossom walls.',
        img: '/images/rooms/botanical/b1.png',
        defaultPrice: 380,
        colSpan: 2
    }
];

export default function BentoGallery() {
    const realtimePrices = useStore(state => state.realtimePrices);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[420px]">
            {rooms.map((room, idx) => (
                <BentoCard
                    key={room.slug}
                    room={room}
                    price={realtimePrices[room.slug] || room.defaultPrice}
                    index={idx}
                />
            ))}
        </div>
    );
}

function BentoCard({ room, price, index }: { room: typeof rooms[0]; price: number; index: number }) {
    const [pulse, setPulse] = useState(false);
    const [prevPrice, setPrevPrice] = useState(price);

    useEffect(() => {
        if (price !== prevPrice) {
            setPulse(true);
            setTimeout(() => setPulse(false), 1000);
            setPrevPrice(price);
        }
    }, [price, prevPrice]);

    return (
        <ScrollReveal delay={index * 0.1} className={room.colSpan === 2 ? 'md:col-span-2' : 'col-span-1'}>
            <MagneticHover intensity={0.1} className="h-full w-full">
                <Link href={`/rooms/${room.slug}`} className="block relative h-full w-full group rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Image
                        src={room.img}
                        alt={room.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                        placeholder="blur"
                        blurDataURL={blurData}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-90" />

                    <motion.div whileTap={{ scale: 0.98 }} className="absolute inset-0 p-10 flex flex-col justify-end">
                        <p className="text-moss-100 uppercase tracking-[0.4em] text-[9px] font-black mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                            The Sanctuary
                        </p>
                        <h3 className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">{room.title}</h3>
                        <p className="text-white/70 font-serif italic text-base mb-6 max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100 translate-y-4 group-hover:translate-y-0">
                            {room.vibe}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <motion.div
                                animate={pulse ? { scale: [1, 1.1, 1], color: ['#fff', '#D4DE95', '#fff'] } : {}}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col"
                            >
                                <span className="text-white/40 text-[9px] uppercase tracking-widest mb-1">Nightly Narrative</span>
                                <span className="text-moss-100 text-xl font-light">Available <span className="text-xs text-white/40">/ sanctuary</span></span>
                            </motion.div>

                            <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700 flex-shrink-0">
                                <ArrowRight className="w-4 h-4 text-white group-hover:text-zinc-950 transition-colors" />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </MagneticHover>
        </ScrollReveal>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
}
