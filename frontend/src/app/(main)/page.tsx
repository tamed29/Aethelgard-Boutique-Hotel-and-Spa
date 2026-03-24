'use client';

import { ArrowRight, Sparkles, Quote, History, Scroll } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StructuredData from "@/components/ui/StructuredData";
import BookingBar from "@/components/ui/BookingBar";
import BentoGallery from "@/components/ui/BentoGallery";
import GuestVoices from "@/components/ui/GuestVoices";
import MagneticHover from "@/components/ui/MagneticHover";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import ParallaxSection from "@/components/ui/ParallaxSection";
import HeroSlideshow from "@/components/ui/HeroSlideshow";
import OrganicTransition from "@/components/ui/OrganicTransition";
import { AethelgardLogo } from "@/components/ui/AethelgardLogo";
import { useState, useEffect } from "react";

export default function Home() {
  const [isDay, setIsDay] = useState(true);
  const [newsEvents, setNewsEvents] = useState<any[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/news`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsEvents(data);
        }
      })
      .catch(err => console.error('Failed to fetch news:', err));
  }, []);

  const displayEvents = newsEvents.length > 0 
    ? newsEvents.slice(0, 3).map(n => ({
        category: n.type === 'event' ? 'Resort Events' : 'Resort Updates',
        title: n.title,
        desc: n.content,
        image: n.imageUrl || '/images/spa/spa2.png'
      })) 
    : [
        {
          category: "Resort Updates",
          title: "The New Botanical Spa Annex Opens This Fall",
          desc: "Explore our latest wellness sanctuary carved into the living hillside, featuring thermal pools and ancestral ritual chambers.",
          image: "/images/spa/spa2.png"
        },
        {
          category: "Culinary Events",
          title: "Harvest Moon Dinner: An Estate Celebration",
          desc: "Join us for a multi-course dialogue between the forest and the shore, curated by Head Chef Elena Vance under the autumn moon.",
          image: "/images/dining/d1.png"
        },
        {
          category: "Wellness Retreats",
          title: "Forest Bathing & Ancestral Silence Rituals",
          desc: "A three-day immersive journey into the deepest sections of the Wychwood, led by our Master Botanist and Spa Director.",
          image: "/images/spa/spa1.png"
        }
      ];

  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "Aethelgard Boutique Hotel & Spa",
    "description": "An immersive narrative experience hotel in the heart of Wychwood Forest.",
    "image": "/images/spa/spa1.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "The Wychwood Estate",
      "addressLocality": "Cotswolds",
      "addressRegion": "Gloucestershire",
      "postalCode": "GL54 1AA",
      "addressCountry": "GB"
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5"
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-clip relative">
      <StructuredData data={hotelSchema} />
      {/* 1. Cinematic Slideshow Hero */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <HeroSlideshow
          images={[
            "/images/dining/d1.png",
            "/images/spa/spa2.png",
            "/images/rooms/forest/r1.png"
          ]}
        />

        <div className="z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto -mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif tracking-[0.2em] mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white"
          >
            Aethelgard
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-2xl md:text-3xl text-white/80 italic mt-8 max-w-2xl font-serif">
              Centuries of silence, curated for the modern soul. A sanctuary where the ancient oaks whisper legends of rest.
            </p>
            <div className="w-24 h-px bg-white/40" />
          </motion.div>

          <ScrollReveal delay={1.2}>
            <MagneticHover intensity={0.3}>
              <Link href="/reservations">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 group relative flex items-center gap-6 px-8 py-4 sm:px-12 sm:py-5 rounded-full overflow-hidden transition-all duration-700 shadow-2xl z-30 bg-[#BAC095] text-[#2B2E1C] hover:bg-white cursor-pointer"
                >
                  <span className="relative z-10 uppercase tracking-[0.4em] text-[11px] sm:text-[13px] font-black">Reserve Your Stay</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-3 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </motion.div>
              </Link>
            </MagneticHover>
          </ScrollReveal>
        </div>

        {/* Floating Glassmorphism Booking Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-40">
          <BookingBar />
        </div>

        {/* Wavy transition blending into Parallax */}
        <div className="absolute -bottom-[1px] w-full z-30 pointer-events-none text-[#1A1F16]">
          <OrganicTransition
            variant="StackedWaves"
            topColor="bg-transparent"
            bottomColor="text-[#1A1F16]"
            className="w-full"
          />
        </div>
      </section>

      <section className="py-32 md:py-40 bg-gradient-to-br from-[#1A1F16] via-[#20281C] to-[#1A1F16] relative overflow-hidden">
        {/* Subtle Atmospheric Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

        <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center w-full">
            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <ScrollReveal>
                <div className="inline-flex items-center gap-4 text-moss-100 mb-8 px-4 py-2 rounded-full border border-moss-100/20 bg-moss-900/40 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-moss-300 animate-pulse" />
                  <span className="uppercase tracking-[0.5em] text-[15px] font-black">Exclusive Atmosphere</span>
                </div>
                <h2 className="text-4xl md:text-[6rem] font-serif text-white leading-[0.95] mb-10 tracking-tighter drop-shadow-2xl">
                  Gather <br />Beneath <br /><span className="italic text-moss-100">The Oaks</span>
                </h2>
                <p className="text-xl md:text-2xl text-white/80 font-serif italic max-w-xl leading-relaxed mb-16 px-4 border-l-2 border-moss-100/30">
                  As the sun dips below the valley's edge, our private bonfires flicker to life. A sanctuary for stories, a haven for spirits destined to connect beneath the ancestral canopy.
                </p>
                <MagneticHover intensity={0.2} className="inline-block">
                  <Link href="/experience" className="group flex items-center gap-6 sm:gap-8 text-[11px] sm:text-[13px] uppercase tracking-[0.4em] sm:tracking-[0.6em] font-black text-white py-4 px-8 sm:py-6 sm:px-10 rounded-full border border-white/20 hover:border-[#D4DE95] bg-white/5 hover:bg-[#D4DE95] hover:text-[#2B2E1C] transition-all duration-700 backdrop-blur-md">
                    <motion.span whileTap={{ scale: 0.95 }} className="flex items-center gap-6 sm:gap-8">
                      About Aethelgard <ArrowRight className="w-5 h-5 group-hover:translate-x-4 transition-transform duration-700" />
                    </motion.span>
                  </Link>
                </MagneticHover>
              </ScrollReveal>
            </div>

            {/* Right Focal Heritage Asset */}
            <div className="lg:col-span-6 relative h-[700px]">
              <ScrollReveal delay={0.2} className="h-full w-full relative">
                <div className="absolute inset-0 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/10 group">
                  <Image
                    src="/images/hotel/h2.png"
                    alt="Manor Heritage"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-[4000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-moss-950/60 via-transparent to-transparent opacity-80" />

                  {/* Floating Detail Card */}
                  <div className="absolute -bottom-10 -left-10 z-20">
                    <ScrollReveal delay={0.4} className="bg-moss-900/90 backdrop-blur-2xl rounded-[3rem] p-12 text-white border border-white/10 shadow-2xl max-w-sm">
                      <Sparkles className="w-10 h-10 mb-6 text-moss-200" />
                      <h3 className="text-3xl font-serif italic mb-4 leading-tight">The Manor Lineage</h3>
                      <p className="text-xs text-white/60 leading-relaxed mb-6">Eight centuries of whispered elegance, preserved in Cotswold stone.</p>
                      <div className="w-16 h-px bg-white/20" />
                    </ScrollReveal>
                  </div>

                  {/* Aesthetic Badge */}
                  <div className="absolute top-12 right-12 z-20">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 text-[10px] uppercase tracking-[0.4em] text-white font-black">
                      Est. 1142
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>


      {/* 3. The Royal Quarters (Bento Gallery Broadened) */}
      <section className="py-32 md:py-40 px-6 md:px-16 xl:px-32 w-full max-w-[120rem] mx-auto relative overflow-hidden bg-[#1A1F16]">


        <div className="mb-24 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl font-serif text-moss-100 mb-6 tracking-tight">The Royal Quarters</h2>
            <p className="text-moss-100/70 max-w-2xl mx-auto font-serif italic text-xl">Discover chambers designed to transport you to an era where legends were forged in gold and stone.</p>
          </ScrollReveal>
        </div>
        <div className="relative z-10">
          <BentoGallery />
        </div>
      </section>

      {/* 4. Personalized Concierge (Narrative Broadening) */}
      <section className="py-32 md:py-40 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.2] pointer-events-none">
          <motion.div
            style={{ position: 'relative' }}
            initial={{ y: -100 }}
            whileInView={{ y: 100 }}
            viewport={{ margin: "200px" }}
            transition={{ duration: 20, ease: "linear" }}
            className="w-full h-[130%] relative"
          >
            <Image src="/images/dining/d2.png" alt="Heritage Detail" fill sizes="100vw" className="object-cover" />
          </motion.div>
        </div>

        <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10 min-h-[70vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              style={{ position: 'relative' }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <p className="uppercase tracking-[0.5em] text-[15px] font-black text-moss-100 mb-8">Exclusively Curated</p>
              <h2 className="text-6xl md:text-8xl font-serif text-white mb-12 leading-[1.1]">Personalized <br />Concierge</h2>
              <p className="text-2xl text-white/70 mb-16 leading-relaxed font-serif italic">
                At Aethelgard, we believe luxury is a private dialogue. Our dedicated concierge team handpicks the finest local secrets, tailored to your unique rhythm.
              </p>

              <div className="space-y-12">
                {[
                  { title: "Ancient Trails", desc: "Viewpoints known only to the mountain's residents." },
                  { title: "Culinary Narratives", desc: "Chef-led forays into the valley's seasonal offerings." },
                  { title: "Artisan Lineage", desc: "Connect with the craftsmen of the emerald hollow." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-10 group">
                    <div className="w-px h-20 bg-white/10 group-hover:bg-moss-100 transition-colors duration-700" />
                    <div>
                      <h4 className="text-lg uppercase tracking-[0.3em] font-black text-white mb-3 transition-colors group-hover:text-moss-100">{item.title}</h4>
                      <p className="text-sm text-white/40 font-light tracking-wide">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{ position: 'relative' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/spa/spa1.png"
                alt="Concierge Service"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <Sparkles className="text-moss-100 w-8 h-8 mb-6" />
                <p className="text-2xl text-white/60 font-serif italic mb-20 max-w-2xl mx-auto">
                  Every soul that enters Aethelgard leaves a new story in the forest canopy. What will yours be?
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Guest Voices (Refined) */}
      <GuestVoices />

      {/* 6. Latest News & Events */}
      <section className="py-32 md:py-40 relative overflow-hidden bg-[#1A1F16] min-h-screen flex items-center">
        <div className="w-full max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32">
          
          <ScrollReveal className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight mb-6">Latest News & Events</h2>
            <p className="text-white/50 uppercase tracking-[0.4em] text-[12px] font-black">Check out our latest news & events</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayEvents.map((event, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <div className="group space-y-8">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <Image 
                      src={event.image} 
                      alt={event.title} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 33vw" 
                      className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-8 left-8">
                      <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-widest font-black text-white">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 px-2 text-center">
                    <h4 className="text-2xl font-serif text-white group-hover:text-moss-100 transition-colors duration-500 leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-white/50 text-sm italic font-serif leading-relaxed line-clamp-2">
                      {event.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <MagneticHover intensity={0.2} className="inline-block">
              <Link href="/experience" className="px-8 py-4 sm:px-12 sm:py-5 bg-[#D4DE95] text-[#2B2E1C] hover:bg-white border border-white/10 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black transition-all duration-700 block">
                <motion.span whileTap={{ scale: 0.95 }} className="block text-center">
                  View All Stories
                </motion.span>
              </Link>
            </MagneticHover>
          </div>
        </div>
      </section>

    </main >
  );
}
