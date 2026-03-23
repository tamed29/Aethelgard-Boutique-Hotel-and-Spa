'use client';

import { use } from 'react';
import Image from 'next/image';
import { Ruler, Eye, Wind, BedDouble, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Link from 'next/link';
import ParallaxSection from '@/components/ui/ParallaxSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

// ─── COMPLETE ROOM DATA — All images used, none left out ─────────────────────
const ROOM_DATA: Record<string, {
    name: string; vibe: string; quote: string; description: string;
    sizeSqM: number; view: string; bedType: string; price: number;
    amenities: string[]; features: { title: string; desc: string }[];
    // Room images (bedroom, living spaces, details)
    roomImages: string[];
    // Dedicated bathroom images
    bathroomImages: string[];
}> = {
    forest: {
        name: 'Forest Retreat',
        vibe: 'Earthy & Subterranean',
        quote: "Rooted in the earth, warmed by the hearth. A sanctuary that breathes with the ancient pines.",
        description: "Deep within the oldest section of the Wychwood forest, this sanctuary of Cotswold stone and reclaimed timber breathes quietly with the pines. The subterranean copper soaking tub—hewn from a single sheet—and hand-laid heated slate floors are designed for deep restoration after a day of forest foraging.",
        sizeSqM: 72,
        view: 'Wychwood Forest',
        bedType: 'California King',
        price: 320,
        amenities: ['Stone Fireplace', 'Copper Soaking Tub', 'Heated Slate Floors', 'Heritage Garden Portal', 'Yoga Mat Service', 'Aesop Toiletries'],
        features: [
            { title: 'Subterranean Copper Soaking Tub', desc: 'Hand-beaten from a single copper sheet, sunk into heated slate flooring.' },
            { title: 'Roaring Stone Hearth', desc: 'A real wood-burning fireplace of Cotswold stone, crackling through damp forest evenings.' },
            { title: 'Nature Mode Climate Control', desc: 'Localized circadian lighting and passive forest airflow management.' },
        ],
        roomImages: [
            '/images/rooms/forest/r1.png',
            '/images/rooms/forest/r2.png',
            '/images/rooms/forest/r3.png',
            '/images/rooms/forest/r4.png',
            '/images/rooms/forest/r5.png',
            '/images/rooms/forest/r7.png',
            '/images/rooms/forest/r8.png',
            '/images/rooms/forest/r10.png',
        ],
        bathroomImages: [
            '/images/rooms/forest/bath1.png',
            '/images/rooms/forest/bath2.png',
        ],
    },

    double: {
        name: 'Double Heritage Room',
        vibe: 'Storied & Velvet',
        quote: "A dialogue between stone and silk, echoing the manor's 12th-century past.",
        description: "Located in the manor's original 12th-century wing, this room features exposed hand-cut oak timber beams, deep velvet upholstery, and a marble en-suite bathroom that bridges antiquity with contemporary luxury. The private Manor Courtyard is accessed through your own stone-framed arch.",
        sizeSqM: 52,
        view: 'Manor Courtyard',
        bedType: 'Heritage King',
        price: 280,
        amenities: ['Exposed Oak Beams', 'Marble En-Suite', 'Antique Furnishings', 'Manor Courtyard View', 'Artisan Coffee Station', 'Aesop Toiletries'],
        features: [
            { title: 'Exposed 12th-Century Oak Beams', desc: 'Original hand-adzed beams from the manor\'s founding century, preserved and illuminated.' },
            { title: 'Marble En-Suite Bathroom', desc: 'Bookmatched Calacatta marble surfaces with heritage brass fittings throughout.' },
            { title: 'Manor Courtyard Portal', desc: 'Direct arched stone doorway to the private walled Elizabethan courtyard.' },
        ],
        roomImages: [
            '/images/rooms/double/d1.png',
            '/images/rooms/double/d2.png',
            '/images/rooms/double/d3.png',
            '/images/rooms/double/d4.png',
            '/images/rooms/double/d5.png',
            '/images/rooms/double/d6.png',
        ],
        bathroomImages: [
            '/images/rooms/double/bath1.png',
            '/images/rooms/double/bath2.png',
        ],
    },

    grand: {
        name: 'Grand Estate Suite',
        vibe: 'Sovereign & Palatial',
        quote: "The pinnacle of the Aethelgard experience. Reserve the sky.",
        description: "Our crowning achievement. A majestic handcrafted four-poster bed draped in antique linen, a separate private dining salon, and a palatial bathroom featuring a freestanding copper grand tub positioned for 360-degree views of the Wychwood Forest canopy. A personal chef is available on call.",
        sizeSqM: 145,
        view: '360° Wychwood Panorama',
        bedType: 'Grand Four-Poster',
        price: 950,
        amenities: ['Four-Poster Canopy Bed', 'Private Dining Salon', 'Copper Grand Tub', '360° Forest Panorama', 'Personal Chef On Call', 'Butler Service'],
        features: [
            { title: 'Royal Four-Poster Canopy Bed', desc: 'Solid English oak canopy with hand-embroidered heritage linen drapes.' },
            { title: 'Freestanding Copper Grand Tub', desc: 'An 8-foot freestanding copper tub with panoramic forest views through floor-to-ceiling glass.' },
            { title: 'Private Dining Salon', desc: 'A separate salon seating up to 6, with direct access to a personal chef service.' },
        ],
        roomImages: [
            '/images/rooms/grand/g1.png',
            '/images/rooms/grand/g2.png',
            '/images/rooms/grand/g3.png',
            '/images/rooms/grand/g4.png',
            '/images/rooms/grand/g5.png',
            '/images/rooms/grand/g6.png',
            '/images/rooms/grand/g7.png',
        ],
        bathroomImages: [
            '/images/rooms/grand/bath1.png',
            '/images/rooms/grand/bath2.png',
        ],
    },

    botanical: {
        name: 'Botanical Oasis Suite',
        vibe: 'Floral & Verdant',
        quote: "Where the garden becomes your chamber and jasmine is your morning alarm.",
        description: "Open your doors to the scent of wild jasmine and heritage herbs. This ground-floor haven features floor-to-ceiling windows framing the walled gardens, and an en-suite alive with climbing greenery, a freestanding porcelain tub, and direct stepping-stone access to the heritage blossom garden.",
        sizeSqM: 78,
        view: 'Heritage Blossom Garden',
        bedType: 'Linen King',
        price: 380,
        amenities: ['Living Botanical Bath', 'Heritage Garden Terrace', 'Circadian Lighting', 'Heritage Herb Bar', 'Aesop Toiletries', 'Floral Butler'],
        features: [
            { title: 'Living Botanical Bathroom Walls', desc: 'Hand-cultivated moss and trailing ferns frame the freestanding porcelain soaking tub.' },
            { title: 'Heritage Blossom Terrace', desc: 'Private stepping-stone terrace directly into the walled Elizabethan flower garden.' },
            { title: 'Circadian Botanical Lighting', desc: 'Tunable LED lighting synced to sunrise and golden hour, enhancing the living plant walls.' },
        ],
        roomImages: [
            '/images/rooms/botanical/b1.png',
            '/images/rooms/botanical/b2.png',
            '/images/rooms/botanical/b3.png',
            '/images/rooms/botanical/b5.png',
            '/images/rooms/botanical/b7.png',
            '/images/rooms/botanical/b8.png',
        ],
        bathroomImages: [
            '/images/rooms/botanical/bath1.png',
            '/images/rooms/botanical/bath2.png',
            '/images/rooms/botanical/bath4.png',
        ],
    },

    family: {
        name: 'Family Forest Suite',
        vibe: 'Boundless & Shared',
        quote: "A space where generations gather, explore, and discover together.",
        description: "An expansive interconnected suite crafted for multigenerational families. Two master chambers connect via a shared family lounge. A dedicated children's discovery den with maps, fossils, and botanical kits ensures younger guests are as engaged as their parents, while dual heritage soaking baths offer restoration.",
        sizeSqM: 98,
        view: 'Hollow Forest Edge',
        bedType: 'Double King Suites',
        price: 650,
        amenities: ['Connecting Chambers', 'Dual Heritage Baths', "Children's Discovery Den", 'Direct Hollow Access', 'Evening Cocoa Service', 'Family Library'],
        features: [
            { title: "Children's Discovery Den", desc: 'A dedicated room with fossil kits, botanical maps, and hand-drawn nature guides of the Wychwood.' },
            { title: 'Dual Heritage Soaking Baths', desc: 'Two separate heritage-style bathrooms, each with a deep soaking tub and underfloor heating.' },
            { title: 'Interconnected Family Realms', desc: 'Two master chambers linked by a private family lounge with reading nooks and forest views.' },
        ],
        roomImages: [
            '/images/rooms/family/f1.png',
            '/images/rooms/family/f2.png',
            '/images/rooms/family/f3.png',
            '/images/rooms/family/f4.png',
            '/images/rooms/family/f5.png',
            '/images/rooms/family/f8.png',
            '/images/rooms/family/f9.png',
        ],
        bathroomImages: [
            '/images/rooms/family/bath1.png',
            '/images/rooms/family/bath2.png',
        ],
    },

    single: {
        name: 'Single Sanctuary',
        vibe: 'Monastic & Refined',
        quote: "An intimate space for the reflective soul who travels to arrive at themselves.",
        description: "A compact but perfectly formed sanctuary. Every detail has been curated to maximize stillness: a writing nook beside a rain-streaked arched window, a curated library of hand-selected titles, a compact marble bathroom with a rainfall shower, and a private garden tapestry view over the quietest corner of the estate.",
        sizeSqM: 34,
        view: 'Tapestry Garden',
        bedType: 'Elite Queen',
        price: 195,
        amenities: ['Artisan Writing Nook', 'Compact Marble Bath', 'Curated Library', 'Garden Tapestry View', 'Heritage Tea Selection', 'Aesop Toiletries'],
        features: [
            { title: 'Reflective Writing Nook', desc: 'A built-in oak writing desk beside a leaded arched window overlooking the tapestry gardens.' },
            { title: 'Library of Silence', desc: 'A hand-curated collection of 40+ titles spanning poetry, natural history, and philosophy.' },
            { title: 'Compact Marble Rainfall Shower', desc: 'Calacatta marble enclosure with an oversized rainfall head and heritage brass fittings.' },
        ],
        roomImages: [
            '/images/rooms/single/s1.png',
            '/images/rooms/single/s2.png',
            '/images/rooms/single/s3.png',
            '/images/rooms/single/s4.png',
            '/images/rooms/single/s5.png',
            '/images/rooms/single/s6.png',
            '/images/rooms/single/s9.png',
        ],
        bathroomImages: [
            '/images/rooms/single/bath.png',
            '/images/rooms/single/bath1.png',
        ],
    },
};

const NUMERIC_TO_SLUG: Record<string, string> = {
    '1': 'forest', '2': 'double', '3': 'grand',
    '4': 'botanical', '5': 'family', '6': 'single',
    '7': 'botanical',
};

export default function RoomClient({ params, initialRoom }: { params: Promise<{ id: string }>, initialRoom?: any }) {
    const { id } = use(params);
    const slug = ROOM_DATA[id] ? id : (NUMERIC_TO_SLUG[id] || 'double');
    const staticRoom = ROOM_DATA[slug];

    // Merge static structure with dynamic data
    const room = {
        ...staticRoom,
        ...(initialRoom || {}),
        price: initialRoom?.price ?? staticRoom.price,
        name: initialRoom?.name ?? staticRoom.name,
        amenities: initialRoom?.amenities ?? staticRoom.amenities,
        description: initialRoom?.description ?? staticRoom.description,
        roomImages: (initialRoom?.images?.length > 0) ? initialRoom.images : staticRoom.roomImages,
        bathroomImages: (initialRoom?.bathroomImages?.length > 0) ? initialRoom.bathroomImages : staticRoom.bathroomImages,
    };

    const { roomImages, bathroomImages, features } = room;
    // Always show: hero + 3 room images + 2 bathroom images in gallery
    const allBathrooms = bathroomImages;
    const galleryRoom = roomImages.slice(1, 5); // indices 1-4

    return (
        <main className="min-h-screen bg-background overflow-x-clip pb-64 relative will-change-transform">

            {/* 1. Hero */}
            <ParallaxSection bgImage={roomImages[0]} height="h-screen" intensity={80} overlayColor="bg-black/40">
                <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 flex items-center h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="max-w-4xl">
                        <p className="text-moss-100 uppercase tracking-[0.5em] text-[10px] font-black mb-8">Boutique Sanctuary</p>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tighter leading-[1.1] mb-12 drop-shadow-2xl">{room.name}</h1>
                        <p className="text-2xl md:text-3xl text-white/80 font-serif italic max-w-2xl leading-relaxed">{room.quote}</p>
                    </motion.div>
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </ParallaxSection>

            {/* 2. At a Glance */}
            <section className="bg-moss-950 text-moss-100 py-24">
                <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { Icon: Ruler, label: 'Size', value: `${room.sizeSqM} m²` },
                        { Icon: Eye, label: 'Orientation', value: room.view },
                        { Icon: BedDouble, label: 'Sleep System', value: room.bedType },
                        { Icon: Wind, label: 'Condition', value: 'Nature Mode' },
                    ].map(({ Icon, label, value }) => (
                        <div key={label} className="space-y-4">
                            <Icon className="w-8 h-8 mx-auto text-moss-300" />
                            <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">{label}</p>
                            <p className="text-2xl md:text-3xl font-serif italic">{value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Full Gallery — ALL images used, none left out */}
            <section className="py-32 w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 space-y-6">
                <div className="text-center mb-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-moss-700 font-black mb-3">Visual Archive</p>
                    <h2 className="text-4xl font-serif text-foreground">Room & Bathroom Gallery</h2>
                </div>

                {/* Row 1: Hero shot spans full width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                    <ScrollReveal className="relative rounded-[2rem] overflow-hidden shadow-2xl md:col-span-2 h-[500px]">
                        <Image src={roomImages[0]} alt={`${room.name} — Main View`} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover hover:scale-105 transition-transform duration-[4000ms]" placeholder="blur" blurDataURL={blurData} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white/90 uppercase tracking-widest text-[10px] font-black">Restoration Chamber</div>
                    </ScrollReveal>
                </div>

                {/* Row 2: Room images */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[320px]">
                    {galleryRoom.map((img, i) => (
                        <ScrollReveal key={img} delay={i * 0.1} className="relative rounded-[1.5rem] overflow-hidden shadow-xl h-[320px]">
                            <Image src={img} alt={`${room.name} — Detail ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-[3000ms]" placeholder="blur" blurDataURL={blurData} />
                        </ScrollReveal>
                    ))}
                </div>

                {/* Row 3: Bathroom images — ALL of them, labeled */}
                <div className="mt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1 bg-foreground/10" />
                        <p className="text-[9px] uppercase tracking-[0.5em] font-black text-moss-700">The Ritual Space — En-Suite</p>
                        <div className="h-px flex-1 bg-foreground/10" />
                    </div>
                    <div className={`grid gap-4 h-[340px] ${allBathrooms.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                        {allBathrooms.map((img, i) => (
                            <ScrollReveal key={img} delay={i * 0.15} className="relative rounded-[1.5rem] overflow-hidden shadow-xl h-[340px]">
                                <Image src={img} alt={`${room.name} — Bathroom ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover hover:scale-105 transition-transform duration-[3000ms]" placeholder="blur" blurDataURL={blurData} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white/90 uppercase tracking-widest text-[10px] font-black">
                                    {i === 0 ? 'En-Suite Ritual' : i === 1 ? 'Sanctuary Bath' : 'Bath Detail'}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Row 4: Remaining room images (if any beyond index 4) */}
                {roomImages.length > 5 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[280px]">
                        {roomImages.slice(5).map((img, i) => (
                            <ScrollReveal key={img} delay={i * 0.1} className="relative rounded-[1.5rem] overflow-hidden shadow-xl h-[280px]">
                                <Image src={img} alt={`${room.name} — View ${i + 5}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover hover:scale-105 transition-transform duration-[3000ms]" placeholder="blur" blurDataURL={blurData} />
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </section>

            {/* 4. Architecture of Rest + Unique Features + Booking */}
            <section className="py-32 w-full max-w-[120rem) mx-auto px-6 md:px-16 xl:px-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-20">

                        {/* Description */}
                        <ScrollReveal>
                            <div className="flex items-center gap-8 text-moss-700 mb-12">
                                <Sparkles className="w-12 h-12" />
                                <span className="uppercase tracking-[0.6em] text-[10px] font-black">Design Philosophy</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif text-moss-100 leading-[1] tracking-tighter mb-10">
                                The Architecture <br />of Rest
                            </h2>
                            <p className="text-xl md:text-2xl font-serif italic text-foreground/70 leading-relaxed">{room.description}</p>
                        </ScrollReveal>

                        {/* Signature Amenities */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-white/10">
                            <ScrollReveal className="space-y-8">
                                <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-moss-200/40">What&apos;s Included</h4>
                                <ul className="space-y-5">
                                    {room.amenities.map((a) => (
                                        <li key={a} className="flex items-center gap-5 text-lg text-moss-100 font-serif italic opacity-80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-moss-200/30 flex-shrink-0" /> {a}
                                        </li>
                                    ))}
                                </ul>
                            </ScrollReveal>

                            {/* Unique features with descriptions */}
                            <ScrollReveal delay={0.2} className="space-y-8">
                                <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-moss-700">Signature Details</h4>
                                <div className="space-y-6">
                                    {features.map((f) => (
                                        <div key={f.title} className="group border-b border-foreground/5 pb-6">
                                            <p className="font-serif text-xl mb-2 transition-colors group-hover:text-moss-300 text-moss-100">{f.title}</p>
                                            <p className="text-sm text-foreground/40 font-light leading-relaxed">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* Booking Widget */}
                    <ScrollReveal delay={0.4} className="lg:col-span-4 sticky top-32 h-fit pb-12">
                        <div className="relative p-[1px] rounded-[3rem] bg-gradient-to-b from-white/20 to-transparent shadow-2xl">
                            <div className="bg-[#1A1F16] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center">
                                <h3 className="text-3xl font-serif text-[#F5F2ED] mb-6">Reserve Sanctuary</h3>
                                <p className="text-[#D4DE95]/60 text-sm font-light italic mb-8">Secure your dates and experience the old-growth restoration.</p>
                                <Link href="/reservations" className="bg-[#D4DE95] text-[#1A1F16] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#F5F2ED] transition-all shadow-xl shadow-[#D4DE95]/10 w-full block">
                                    Book Sanctuary
                                </Link>
                            </div>
                        </div>
                        <div className="mt-8 px-8">
                            <p className="text-[10px] uppercase tracking-widest text-moss-200/40 text-center">
                                Securing this sanctuary requires 48h notice for curated ritual preparation.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 5. Pillow Menu */}
            <section className="py-48 bg-zinc-950 text-moss-100 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 grayscale pointer-events-none">
                    <Image src={allBathrooms[0]} alt="Turndown Detail" fill sizes="100vw" className="object-cover" />
                </div>
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <ScrollReveal>
                        <Wind className="w-16 h-16 text-moss-100 mx-auto mb-16" />
                        <h2 className="text-5xl md:text-8xl font-serif mb-12 tracking-tighter">The Pillow Menu</h2>
                        <p className="text-xl text-white/60 font-serif italic mb-24 max-w-3xl mx-auto">
                            A restful night is the foundation of wellness. Our Turndown Service includes your choice of bespoke support, delivered warm to your suite.
                        </p>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        {[
                            { name: 'Goose Down', desc: 'Plush and malleable for absolute cloud-like comfort' },
                            { name: 'Buckwheat Hull', desc: 'Firm, breathable, perfectly aligning the cervical spine' },
                            { name: 'Lavender Infused', desc: 'A soothing herbal blend for the deepest rest' }
                        ].map((pillow, i) => (
                            <ScrollReveal key={pillow.name} delay={i * 0.2} className="glass p-12 rounded-[2.5rem] border-white/5 hover:bg-white/5 transition-all duration-700">
                                <h4 className="text-2xl font-serif mb-4">{pillow.name}</h4>
                                <p className="text-white/40 font-light leading-relaxed tracking-wide text-sm">{pillow.desc}</p>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
