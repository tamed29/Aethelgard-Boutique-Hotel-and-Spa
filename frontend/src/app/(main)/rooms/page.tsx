'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Maximize, Bed, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticHover from '@/components/ui/MagneticHover';
import SearchResultBanner from '@/components/ui/SearchResultBanner';
import BookingBar from '@/components/ui/BookingBar';
import type { Variants } from 'framer-motion';

const blurData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8+v//fwAJigPfH3fG1gAAAABJRU5ErkJggg==";

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

// ─── ROOM DATA WITH LOCAL IMAGES ─────────────────────────────────────────────
const STATIC_ROOMS = [
    {
        _id: 'forest',
        name: 'Forest Retreat',
        vibe: 'Earthy & Subterranean',
        sizeSqM: 72,
        bedType: 'California King',
        description: 'Rooted deep within the oldest section of the Wychwood forest, this sanctuary of Cotswold stone and reclaimed timber breathes with the ancient pines. The subterranean copper soaking tub and heated slate floors are designed for deep restoration.',
        price: 320,
        amenities: ['Stone Fireplace', 'Copper Soaking Tub', 'Heated Slate Floors', 'Heritage Garden Portal', 'Yoga Mat Service', 'Forest Foraging Kit'],
        features: ['Subterranean Copper Tub', 'Roaring Stone Hearth', 'Moss-Stone Walls'],
        images: [
            '/images/rooms/forest/r1.png',
            '/images/rooms/forest/r2.png',
            '/images/rooms/forest/r3.png',
            '/images/rooms/forest/r4.png',
            '/images/rooms/forest/r5.png',
            '/images/rooms/forest/r7.png',
            '/images/rooms/forest/r8.png',
            '/images/rooms/forest/r10.png',
        ]
    },
    {
        _id: 'double',
        name: 'Double Heritage Room',
        vibe: 'Storied & Velvet',
        sizeSqM: 52,
        bedType: 'Heritage King',
        description: 'Located in the manor\'s original 12th-century wing, the Double Heritage Room features exposed oak timber beams, deep velvet upholstery, and a marble en-suite bathroom that masterfully bridges the gap between antiquity and contemporary luxury.',
        price: 280,
        amenities: ['Exposed Oak Beams', 'Marble En-Suite', 'Antique Furnishings', 'Manor Courtyard View', 'Artisan Coffee Station', 'Aesop Toiletries'],
        features: ['12th Century Exposed Beams', 'Velvet Suede Upholstery', 'Manor Courtyard Portal'],
        images: [
            '/images/rooms/double/d1.png',
            '/images/rooms/double/d3.png',
            '/images/rooms/double/d4.png',
            '/images/rooms/double/d2.png',
            '/images/rooms/double/d5.png',
            '/images/rooms/double/d6.png',
        ]
    },
    {
        _id: 'grand',
        name: 'Grand Estate Suite',
        vibe: 'Sovereign & Palatial',
        sizeSqM: 145,
        bedType: 'Grand Four-Poster',
        description: 'Our crowning achievement. A majestic handcrafted four-poster bed, a separate private salon, and a palatial bathroom featuring a freestanding copper grand tub with 360-degree views of the Wychwood Forest panorama. This is the pinnacle of the Aethelgard experience.',
        price: 950,
        amenities: ['Four-Poster Bed', 'Private Dining Salon', 'Copper Grand Tub', '360° Forest Panorama', 'Personal Chef On Call', 'Butler Service'],
        features: ['Royal Four-Poster Canopy Bed', 'Private Dining Salon', 'Grand Forest Panorama'],
        images: [
            '/images/rooms/grand/g1.png',
            '/images/rooms/grand/g2.png',
            '/images/rooms/grand/g3.png',
            '/images/rooms/grand/g4.png',
            '/images/rooms/grand/g5.png',
            '/images/rooms/grand/g6.png',
            '/images/rooms/grand/g7.png',
        ]
    },
    {
        _id: 'botanical',
        name: 'Botanical Oasis Suite',
        vibe: 'Floral & Verdant',
        sizeSqM: 78,
        bedType: 'Linen King',
        description: 'Open your doors to the scent of jasmine and wild herb. This ground-floor haven features floor-to-ceiling windows and a living botanical en-suite filled with climbing greenery, a freestanding porcelain tub, and direct access to the walled heritage garden.',
        price: 380,
        amenities: ['Living Botanical Bath', 'Heritage Garden Terrace', 'Circadian Lighting', 'Heritage Herb Bar', 'Aesop Toiletries', 'Floral Butler'],
        features: ['Living Bathroom Walls', 'Heritage Blossom Terrace', 'Sun-Kissed Solarium'],
        images: [
            '/images/rooms/botanical/b1.png',
            '/images/rooms/botanical/b2.png',
            '/images/rooms/botanical/b3.png',
            '/images/rooms/botanical/b5.png',
            '/images/rooms/botanical/b7.png',
            '/images/rooms/botanical/b8.png',
        ]
    },
    {
        _id: 'family',
        name: 'Family Forest Suite',
        vibe: 'Boundless & Shared',
        sizeSqM: 98,
        bedType: 'Double King Suites',
        description: 'An expansive interconnected suite designed for multigenerational families who explore together. Two master chambers connect via a shared family lounge. A dedicated children\'s discovery den and dual heritage baths with soaking tubs ensure every generation thrives.',
        price: 650,
        amenities: ['Connecting Chambers', 'Dual Heritage Baths', 'Children\'s Discovery Den', 'Direct Hollow Access', 'Evening Cocoa Service', 'Family Library'],
        features: ['Interconnected Family Realms', 'Children\'s Discovery Den', 'Dual Heritage Soaking Baths'],
        images: [
            '/images/rooms/family/f1.png',
            '/images/rooms/family/f2.png',
            '/images/rooms/family/f3.png',
            '/images/rooms/family/f4.png',
            '/images/rooms/family/f5.png',
            '/images/rooms/family/f8.png',
            '/images/rooms/family/f9.png',
        ]
    },
    {
        _id: 'single',
        name: 'Single Sanctuary',
        vibe: 'Monastic & Refined',
        sizeSqM: 34,
        bedType: 'Elite Queen',
        description: 'A compact but perfectly formed sanctuary for the reflective soul. Every detail has been curated to maximize stillness: a writing nook beside a rain-streaked window, a compact marble bathroom, and a private view over the quietest corners of the heritage tapestry gardens.',
        price: 195,
        amenities: ['Artisan Writing Nook', 'Compact Marble Bath', 'Curated Library', 'Garden Tapestry View', 'Selection of Heritage Teas', 'Aesop Toiletries'],
        features: ['Reflective Writing Nook', 'Library of Silence', 'Tapestry Garden Vista'],
        images: [
            '/images/rooms/single/s1.png',
            '/images/rooms/single/s4.png',
            '/images/rooms/single/s3.png',
            '/images/rooms/single/s2.png',
            '/images/rooms/single/s5.png',
            '/images/rooms/single/s6.png',
            '/images/rooms/single/s9.png',
        ]
    },
];

export default function RoomsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-t-2 border-foreground rounded-full animate-spin" />
                <p className="text-foreground/50 uppercase tracking-widest text-xs">Preparing the Collection...</p>
            </div>
        }>
            <RoomsContent />
        </Suspense>
    );
}

function RoomsContent() {
    const searchParams = useSearchParams();
    const [rooms, setRooms] = useState<any[]>(STATIC_ROOMS);
    const [loading, setLoading] = useState(false);

    // Parse Search Params
    const checkinStr = searchParams.get('checkin');
    const checkoutStr = searchParams.get('checkout');
    const guestsCount = parseInt(searchParams.get('guests') || '2');

    const checkInDate = checkinStr ? new Date(checkinStr) : null;
    const checkOutDate = checkoutStr ? new Date(checkoutStr) : null;

    // Real Availability Logic
    const isSearchActive = !!(checkInDate && checkOutDate);
    const [availability, setAvailability] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            
            try {
                // 1. Fetch Rooms
                const roomsRes = await fetch(`${API_URL}/rooms`);
                if (roomsRes.ok) {
                    const roomsData = await roomsRes.json();
                    if (Array.isArray(roomsData) && roomsData.length > 0) {
                        setRooms(roomsData);
                    }
                }

                // 2. Fetch Availability if search is active
                if (isSearchActive) {
                    const availRes = await fetch(`${API_URL}/bookings/availability?checkIn=${checkinStr}&checkOut=${checkoutStr}`);
                    if (availRes.ok) {
                        const availData = await availRes.json();
                        setAvailability(availData);
                    }
                }
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [checkinStr, checkoutStr, isSearchActive]);

    const filteredRooms = isSearchActive 
        ? (rooms.length > 0 ? rooms : STATIC_ROOMS).filter(room => {
            const avail = availability.find(a => a.roomType === room.roomType);
            return avail ? avail.isAvailable : true;
          })
        : (rooms.length > 0 ? rooms : STATIC_ROOMS);

    const availableCount = availability.filter(a => a.isAvailable).length;
    const isAnyAvailable = availableCount > 0;

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-t-2 border-foreground rounded-full animate-spin" />
            <p className="text-foreground/50 uppercase tracking-widest text-xs">Loading the Collection...</p>
        </div>
    );

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": "Aethelgard Boutique Hotel & Spa",
        "description": "Experience grand elegance and timeless charm. A sanctuary where classic luxury meets modern comfort.",
        "containsPlace": rooms.map(room => ({
            "@type": "HotelRoom",
            "name": room.name,
            "description": room.description,
            "bed": { "@type": "BedDetails", "typeOfBed": room.bedType || 'King' },
            "occupancy": { "@type": "QuantitativeValue", "value": room.capacity || 2 }
        }))
    };

    return (
        <main className="min-h-screen bg-background">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Hero */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src="/videos/room.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <motion.div initial="hidden" animate="show" variants={staggerContainer} className="relative z-10 text-center px-4 mt-20">
                    <motion.p variants={fadeUp} className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">The Collection</motion.p>
                    <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-serif text-white tracking-wide drop-shadow-lg">Royal Quarters</motion.h1>
                    <motion.p variants={fadeUp} className="text-white/70 italic text-xl mt-6 max-w-xl mx-auto">Sanctuaries crafted from stone, wood, and light.</motion.p>
                </motion.div>
            </section>

            {/* Search Results Banner */}
            <AnimatePresence>
                {isSearchActive && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="pt-12 -mb-8 relative z-20"
                    >
                        <SearchResultBanner
                            checkIn={checkInDate}
                            checkOut={checkOutDate}
                            guests={guestsCount}
                            isAvailable={isAnyAvailable}
                            availableCount={availableCount}
                            onModify={() => window.location.href = '/'}
                            onViewAvailable={() => {
                                const listing = document.getElementById('room-listing');
                                listing?.scrollIntoView({ behavior: 'smooth' });
                                // Clear search to "remove the result of searching"
                                window.history.replaceState({}, '', '/rooms');
                                window.location.reload(); 
                            }}
                            onSearchAgain={() => window.location.href = '/'}
                            onViewAll={() => {
                                window.location.href = '/rooms';
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Philosophy Quote */}
            <section className="py-24 bg-moss-900/10 border-y border-foreground/5 overflow-hidden relative">
                <div className="absolute inset-0 opacity-5">
                    <Image src="/images/rooms/forest/r1.png" alt="Nature Texture" fill sizes="100vw" className="object-cover grayscale" />
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        style={{ position: 'relative' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                    >
                        <p className="text-xs uppercase tracking-[0.5em] text-moss-700 dark:text-moss-200 mb-8">The Philosophy of Rest</p>
                        <h2 className="text-3xl md:text-5xl font-serif text-foreground/80 italic leading-relaxed">
                            Above the forest floor, where the morning mist greets your window first, find a particular kind of silence where the only movement is light.
                        </h2>
                    </motion.div>
                </div>
            </section>

            {/* Room Listing */}
            <section id="room-listing" className="flex flex-col">
                {filteredRooms.map((room, idx) => {
                    // Find static data for variety
                    const staticMatch = STATIC_ROOMS.find(s => 
                        s._id === room._id || 
                        s._id === (room.roomType?.toLowerCase()) ||
                        room.name?.toLowerCase().includes(s._id)
                    );

                    const roomImages = room.images || [];
                    const staticImages = staticMatch?.images || [];
                    
                    // Priority: 1. Admin photo for primary, 2. Unique local photos for 2 and 3
                    const primaryImg = roomImages[0] || staticImages[0] || '/images/rooms/forest/r1.png';
                    const img2 = staticImages[1] || roomImages[1] || primaryImg;
                    const img3 = staticImages[2] || roomImages[2] || primaryImg;
                    const amenities = room.amenities || staticMatch?.amenities || ['Forest View', 'Soaking Tub', 'Butler Service', 'Aesop Toiletries'];

                    return (
                        <div key={room._id || idx} className="py-12 md:py-16 border-b border-foreground/5 last:border-0 relative overflow-hidden">
                            <div className="absolute inset-0 -z-10 overflow-hidden opacity-[0.02] pointer-events-none">
                                <motion.div
                                    style={{ position: 'relative' }}
                                    initial={{ y: -50 }} whileInView={{ y: 50 }} viewport={{ margin: "100px" }}
                                    transition={{ duration: 15, ease: "linear" }}
                                    className="w-full h-[120%] relative grayscale">
                                    <Image src={staticImages[4] || img2} alt="" fill sizes="100vw" className="object-cover" />
                                </motion.div>
                            </div>

                            <div className="w-full max-w-[110rem] mx-auto px-6 md:px-16 xl:px-32">
                                {/* Mobile: stack vertically — image first, then content */}
                                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start lg:items-center`}>

                                    {/* Gallery — on mobile always shows first */}
                                    <motion.div
                                        style={{ position: 'relative' }}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`lg:col-span-7 grid grid-cols-2 gap-2 md:gap-3 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'} order-1`}>
                                        <div className="relative col-span-2 rounded-sm overflow-hidden h-[220px] sm:h-[280px] md:h-[320px]">
                                            <Image src={primaryImg} alt={room.name} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" placeholder="blur" blurDataURL={blurData} />
                                        </div>
                                        <div className="relative rounded-sm overflow-hidden h-[130px] sm:h-[160px] md:h-[200px]">
                                            <Image src={img2} alt={`${room.name} interior`} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" placeholder="blur" blurDataURL={blurData} />
                                        </div>
                                        <div className="relative rounded-sm overflow-hidden h-[130px] sm:h-[160px] md:h-[200px]">
                                            <Image src={img3} alt={`${room.name} detail`} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" placeholder="blur" blurDataURL={blurData} />
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <motion.div
                                        style={{ position: 'relative' }}
                                        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                                        className={`lg:col-span-5 space-y-5 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'} order-2`}>
                                        <div>
                                            <motion.p variants={fadeUp} className="text-moss-700 dark:text-moss-200 text-xs uppercase tracking-[0.25em] mb-2">Ancestral Vibe: {room.vibe}</motion.p>
                                            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif text-foreground leading-tight">{room.name}</motion.h2>
                                        </div>

                                        <motion.div variants={fadeUp} className="flex items-center gap-6 text-foreground/60 text-xs border-y border-foreground/10 py-3">
                                            <div className="flex items-center gap-2"><Maximize className="w-3.5 h-3.5" /> {room.sizeSqM} m²</div>
                                            <div className="flex items-center gap-2"><Bed className="w-3.5 h-3.5" /> {room.bedType}</div>
                                        </motion.div>

                                        <motion.p variants={fadeUp} className="text-foreground/80 leading-relaxed text-sm md:text-base font-light">{room.description}</motion.p>

                                        <motion.div variants={fadeUp} className="space-y-3">
                                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/90">Signature Amenities</h4>
                                            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                {amenities.slice(0, 4).map((a: string) => (
                                                    <li key={a} className="flex items-center gap-2 text-foreground/70 text-xs">
                                                        <div className="w-1 h-1 rounded-full bg-moss-700/50 flex-shrink-0" />
                                                        {a}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>

                                        {/* Price + Button — stacked on mobile, side by side on desktop */}
                                        <motion.div variants={fadeUp} className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-0.5">Starting From</p>
                                                <span className="text-2xl md:text-3xl font-serif text-moss-700 dark:text-moss-200 uppercase tracking-tighter">${room.price} <span className="text-xs">/ night</span></span>
                                            </div>
                                            <MagneticHover intensity={0.3} className="w-full sm:w-auto">
                                                <Link href={`/rooms/${room._id}`} className="group relative block overflow-hidden bg-zinc-950 text-white px-6 py-3 sm:px-8 sm:py-4 border border-white/20 shadow-xl transition-all duration-700 w-full text-center hover:bg-[#D4DE95] hover:text-[#2B2E1C] hover:border-[#D4DE95]">
                                                    <motion.div whileTap={{ scale: 0.95 }} className="relative z-10 flex items-center justify-center gap-4">
                                                        <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold">Explore Suite</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-700" />
                                                    </motion.div>
                                                    <div className="absolute inset-0 bg-[#D4DE95] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                                                </Link>
                                            </MagneticHover>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Footer CTA */}
            <section className="py-24 bg-stone-950 text-moss-100 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <motion.div 
                        style={{ position: 'relative' }}
                        initial={{ y: -50 }} whileInView={{ y: 50 }} viewport={{ margin: "100px" }}
                        transition={{ duration: 20, ease: "linear" }} className="w-full h-[120%] relative mix-blend-screen">
                        <Image src="/images/rooms/forest/r2.png" alt="Estate Experience" fill sizes="100vw" className="object-cover" />
                    </motion.div>
                </div>
                <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10 text-center">
                    <motion.div 
                        style={{ position: 'relative' }}
                        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-6">
                        <p className="uppercase tracking-[0.4em] text-[15px] font-semibold text-moss-300">Beyond the Suite</p>
                        <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight">The Estate Awaits</h2>
                        <p className="text-moss-100/70 text-base md:text-lg font-light italic max-w-3xl mx-auto leading-relaxed">
                            Our 40-acre sanctuary offers everything from moon-lit foraging to ancestral archery.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <MagneticHover intensity={0.2} className="w-full sm:w-auto">
                                <Link href="/experience" className="block w-full border border-moss-100/30 hover:border-[#D4DE95] px-6 py-3 sm:px-8 sm:py-4 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold transition-all duration-500 bg-white/5 backdrop-blur-sm hover:bg-[#D4DE95] hover:text-[#2B2E1C]">
                                    <motion.span whileTap={{ scale: 0.95 }} className="block">
                                        Discover Experiences
                                    </motion.span>
                                </Link>
                            </MagneticHover>
                            <MagneticHover intensity={0.2} className="w-full sm:w-auto">
                                <Link href="/spa" className="block w-full bg-[#D4DE95] text-[#2B2E1C] px-6 py-3 sm:px-8 sm:py-4 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold transition-all duration-500 hover:bg-white hover:scale-105">
                                    <motion.span whileTap={{ scale: 0.95 }} className="block">
                                        Reserve a Ritual
                                    </motion.span>
                                </Link>
                            </MagneticHover>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
