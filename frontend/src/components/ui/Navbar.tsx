'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, History, Bed, Map, Sparkles, Utensils, Mail, ChevronDown, ImageIcon, Users } from 'lucide-react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { AethelgardLogo } from './AethelgardLogo';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/rooms', label: 'Rooms', icon: <Bed className="w-5 h-5" /> },
    { href: '/gallery', label: 'Gallery', icon: <ImageIcon className="w-5 h-5" /> },
    { href: '/spa', label: 'Spa', icon: <Sparkles className="w-5 h-5" /> },
    { href: '/dining', label: 'Dining', icon: <Utensils className="w-5 h-5" /> },
    { href: '/contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> },
];

const aboutLinks = [
    { href: '/heritage', label: 'Heritage', icon: <History className="w-5 h-5" /> },
    { href: '/experience', label: 'Experience', icon: <Map className="w-5 h-5" /> },
    { href: '/about-us/team', label: 'Our Team', icon: <Users className="w-5 h-5" /> },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const { scrollY } = useScroll();

    const isLightPage = pathname === '/reservations' || pathname === '/about-us/team' || pathname === '/contact';
    const navTheme = isScrolled ? 'dark' : (isLightPage ? 'light' : 'dark');

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setIsVisible(false);
            setAboutOpen(false);
        } else {
            setIsVisible(true);
        }
        setIsScrolled(latest > 50);
    });

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-8 pointer-events-none"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -120 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <nav className={cn(
                "transition-all duration-700 ease-in-out flex items-center justify-between pointer-events-auto rounded-full px-10 py-4",
                isScrolled
                    ? 'w-[92%] md:w-[85%] bg-[#2B2E1C]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]'
                    : cn(
                        'w-[95%] md:w-[90%] bg-transparent border-transparent',
                        isLightPage && 'bg-white/10 backdrop-blur-md border border-black/5 shadow-sm'
                    )
            )}>
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Link
                        href="/"
                        className={cn("flex items-center gap-3 group transition-colors duration-500", 
                            navTheme === 'dark' ? "text-white" : "text-[#1A1F16]"
                        )}
                    >
                        <AethelgardLogo
                            isDay={navTheme === 'light'}
                            className={cn("w-10 h-10 md:w-11 md:h-11 transition-colors duration-500", 
                                navTheme === 'dark' ? "text-white" : "text-[#1A1F16]"
                            )}
                        />
                        <div className="flex flex-col">
                            <span className={cn("font-serif text-2xl md:text-3xl tracking-[0.2em] leading-none uppercase group-hover:text-[#D4DE95] transition-colors duration-500",
                                navTheme === 'dark' ? "text-white" : "text-[#1A1F16]"
                            )}>
                                Aethelgard
                            </span>
                            <span className={cn("hidden md:block text-[8px] uppercase tracking-[0.4em] font-sans font-light opacity-60 mt-0.5",
                                navTheme === 'dark' ? "text-white/60" : "text-[#1A1F16]/60"
                            )}>
                                Boutique Hotel & Spa
                            </span>
                        </div>
                    </Link>
                </motion.div>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-8">
                        {/* Home Link */}
                        <li>
                            <Link
                                href="/"
                                className={cn("font-serif normal-case text-base tracking-normal transition-all duration-500 relative",
                                    pathname === '/' 
                                        ? 'text-[#D4DE95]' 
                                        : (navTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-[#1A1F16]/60 hover:text-[#1A1F16]')
                                )}
                            >
                                <motion.span className="relative inline-block hover:scale-[0.98] active:scale-95 transition-transform duration-200">
                                    Home
                                    {pathname === '/' && (
                                        <motion.div layoutId="nav-pill" className="absolute -bottom-2 left-0 right-0 h-[1.5px] rounded-full bg-[#D4DE95]/70" />
                                    )}
                                </motion.span>
                            </Link>
                        </li>

                        {navLinks.slice(0, 4).map(link => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn("font-serif normal-case text-base tracking-normal transition-all duration-500 relative",
                                        pathname === link.href
                                            ? 'text-[#D4DE95]'
                                            : (navTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-[#1A1F16]/60 hover:text-[#1A1F16]')
                                    )}
                                >
                                <motion.span className="relative inline-block hover:scale-[0.98] active:scale-95 transition-transform duration-200">
                                    {link.label}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute -bottom-2 left-0 right-0 h-[1.5px] rounded-full bg-[#D4DE95]/70"
                                        />
                                    )}
                                </motion.span>
                                </Link>
                            </li>
                        ))}

                        {/* About Us Dropdown */}
                        <li 
                            className="relative"
                            onMouseEnter={() => setAboutOpen(true)}
                            onMouseLeave={() => setAboutOpen(false)}
                        >
                            <button
                                className={cn("transition-all duration-500 flex items-center gap-2",
                                    aboutLinks.some(link => pathname === link.href)
                                        ? 'text-[#D4DE95]'
                                        : (navTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-[#1A1F16]/60 hover:text-[#1A1F16]')
                                )}
                            >
                                <span className="font-serif normal-case text-base tracking-normal">About Us</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${aboutOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {aboutOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="absolute top-full left-0 mt-4 bg-[#2B2E1C]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 min-w-[200px] shadow-2xl pointer-events-auto"
                                    >
                                        <ul className="space-y-2">
                                            {aboutLinks.map((link, idx) => (
                                                <motion.li 
                                                    key={link.href}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        className={`block font-serif normal-case text-base tracking-normal px-4 py-2 rounded-lg transition-all duration-300 ${
                                                            pathname === link.href
                                                                ? 'bg-[#D4DE95] text-[#2B2E1C]'
                                                                : 'text-white/70 hover:text-white hover:bg-white/5'
                                                        }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>

                        {navLinks.slice(4).map(link => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn("font-serif normal-case text-base tracking-normal transition-all duration-500 relative",
                                        pathname === link.href
                                            ? 'text-[#D4DE95]'
                                            : (navTheme === 'dark' ? 'text-white/60 hover:text-white' : 'text-[#1A1F16]/60 hover:text-[#1A1F16]')
                                    )}
                                >
                                <motion.span className="relative inline-block hover:scale-[0.98] active:scale-95 transition-transform duration-200">
                                    {link.label}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute -bottom-2 left-0 right-0 h-[1.5px] rounded-full bg-[#D4DE95]/70"
                                        />
                                    )}
                                </motion.span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Book Now CTA */}
                <div className="flex items-center gap-4">
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/reservations"
                            className="hidden md:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] px-8 py-3.5 rounded-full font-black transition-all duration-700 bg-[#D4DE95] text-[#2B2E1C] hover:bg-white hover:scale-105 shadow-[0_0_30px_rgba(212,222,149,0.3)] group relative overflow-hidden"
                        >
                            <span className="relative z-10">BOOK NOW</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </Link>
                    </motion.div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-3 rounded-full border transition-all bg-white/10 border-white/20 text-white hover:bg-white/20"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-32 right-6 z-40 p-10 flex flex-col gap-6 md:hidden backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] pointer-events-auto min-w-[280px]"
                        style={{ backgroundColor: 'rgba(43, 46, 28, 0.98)' }}
                    >
                        <div className="space-y-6">
                            <p className="font-serif normal-case text-lg tracking-normal text-white/30 ml-1">Menu</p>
                            {[{ href: '/', label: 'Home', icon: null as any }, ...navLinks.slice(0, 4), ...aboutLinks, ...navLinks.slice(4)].map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={`group flex items-center justify-between font-serif normal-case text-xl tracking-normal transition-all duration-500 ${pathname === link.href
                                            ? 'text-white'
                                            : 'text-white/40 hover:text-white hover:translate-x-2'
                                            }`}
                                    >
                                        <motion.span whileTap={{ scale: 0.95 }} className="flex items-center gap-4">
                                            {link.label}
                                            <span className={`transition-all duration-500 ${pathname === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {link.icon}
                                            </span>
                                        </motion.span>
                                        <div className={`w-8 h-px bg-white/20 transition-all group-hover:w-16 ${pathname === link.href ? 'w-16 bg-white/60' : ''}`} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <Link
                            href="/reservations"
                            onClick={() => setOpen(false)}
                            className="w-full mt-4 bg-[#D4DE95] text-[#2B2E1C] px-8 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_0_30px_rgba(212,222,149,0.15)]"
                        >
                            BOOK NOW
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
