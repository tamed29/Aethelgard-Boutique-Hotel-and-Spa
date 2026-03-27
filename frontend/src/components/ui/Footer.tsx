'use client';

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MagneticHover from "./MagneticHover";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "The Estate",
            links: [
                { name: "Rooms", href: "/rooms" },
                { name: "Experience", href: "/experience" },
                { name: "Spa", href: "/spa" },
                { name: "Dining", href: "/dining" },
                { name: "Gallery", href: "/gallery" },
            ],
        },
        {
            title: "Navigation",
            links: [
                { name: "About Us", href: "/heritage" },
                { name: "Reservations", href: "/reservations" },
                { name: "Contact", href: "/contact" },
                { name: "Admin", href: "/admin/login" },
            ],
        },
    ];

    return (
        <footer className="bg-zinc-950 text-white pt-32 pb-16 relative overflow-hidden">
            {/* Narrative Background Grain */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            <div className="max-w-[120rem] mx-auto px-6 md:px-16 xl:px-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    {/* Brand Identity */}
                    <div className="lg:col-span-4 space-y-12">
                        <Link href="/" className="inline-block group">
                            <h2 className="text-4xl font-serif tracking-[0.2em] uppercase group-hover:text-moss-100 transition-colors duration-700">Aethelgard</h2>
                        </Link>
                        <p className="text-white/50 text-lg font-serif italic max-w-sm leading-relaxed">
                            A sanctuary where the ancient oaks whisper legends of rest. Centuries of silence, curated for the modern soul.
                        </p>
                        <div className="flex gap-8">
                            {[
                                { Icon: Facebook, href: 'https://www.facebook.com/', label: 'Facebook' },
                                { Icon: Instagram, href: 'https://www.instagram.com/', label: 'Instagram' },
                                { Icon: Twitter, href: 'https://www.twitter.com/', label: 'X / Twitter' },
                            ].map(({ Icon, href, label }) => (
                                <MagneticHover key={label} intensity={0.4}>
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-500"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                </MagneticHover>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-12">
                        {footerLinks.map((section) => (
                            <div key={section.title} className="space-y-10">
                                <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-moss-100">{section.title}</h4>
                                <ul className="space-y-6">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-white/40 hover:text-white transition-colors duration-500 font-serif italic text-lg flex items-center group"
                                            >
                                                {link.name}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-2 transition-all duration-500" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-3 space-y-10">
                        <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-moss-100">The Wychwood Estate</h4>
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start group cursor-pointer">
                                <MapPin className="w-5 h-5 text-moss-100 mt-1 group-hover:scale-110 transition-transform duration-500" />
                                <p className="text-white/60 leading-relaxed font-serif italic group-hover:text-white transition-colors duration-500">
                                    The Wychwood Estate, Cotswolds<br /> Gloucestershire, GL54 1AA
                                </p>
                            </div>
                            <div className="flex gap-6 items-center group cursor-pointer">
                                <Phone className="w-5 h-5 text-moss-100 group-hover:scale-110 transition-transform duration-500" />
                                <p className="text-white/60 font-serif italic group-hover:text-white transition-colors duration-500">+44 (0) 1242 800 100</p>
                            </div>
                            <div className="flex gap-6 items-center group cursor-pointer">
                                <Mail className="w-5 h-5 text-moss-100 group-hover:scale-110 transition-transform duration-500" />
                                <p className="text-white/60 font-serif italic group-hover:text-white transition-colors duration-500">rituals@aethelgard.com</p>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row gap-8 justify-between items-center text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p>© {currentYear} Aethelgard Boutique Hotel &amp; Spa. All Rights Reserved.</p>
                        <Link href="/login" className="hover:text-white/40 transition-colors duration-500 opacity-20 hover:opacity-100">Staff Portal</Link>
                    </div>
                    <div className="flex gap-12">
                        <Link href="/contact" className="hover:text-white transition-colors duration-500">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors duration-500">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
