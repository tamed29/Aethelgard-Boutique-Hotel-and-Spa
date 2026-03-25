'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ConciergeBell, 
    Phone, 
    Mail, 
    Instagram, 
    MessageCircle, 
    X, 
    Send, 
    User,
    Sparkles,
    MessageSquare
} from 'lucide-react';
import { AethelgardLogo } from './AethelgardLogo';

// Color Palette
const COLORS = {
    main: '#BAC095',
    darkMoss: '#3D4127',
    sage: '#D4DE95',
    white: '#FFFFFF',
};

const menuItems = [
    { icon: <Mail className="w-6 h-6" />, label: 'Email', href: 'mailto:stay@aethelgard.com' },
    { icon: <Instagram className="w-6 h-6" />, label: 'Instagram', href: 'https://instagram.com/aethelgard' },
    { icon: <Phone className="w-6 h-6" />, label: 'Inquiries', href: '/contact' },
    { icon: <MessageSquare className="w-6 h-6" />, label: 'Live Chat', action: 'chat' },
];

export default function RadiantConcierge() {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Welcome to Aethelgard. I am your forest guide. How may I assist your retreat today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll Logic
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsOpen(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // AI Logic - Refined for "Radiant" Personality
        // Reduced delay to 1-2 seconds for responsiveness
        const responseDelay = 1000 + Math.random() * 800;
        
        setTimeout(() => {
            let aiResponse = "";
            const query = userMessage.content.toLowerCase();

            if (query.includes('room') || query.includes('stay') || query.includes('suites') || query.includes('booking') || query.includes('reserve')) {
                aiResponse = "Welcome to Aethelgard. Our Royal Quarters are designed as private sanctuaries of stone and light. For more information or to make a reservation, please explore our collection in the 'Rooms' section or navigate to our Contact page for a bespoke booking experience.";
            } else if (query.includes('spa') || query.includes('ritual') || query.includes('massage') || query.includes('wellness')) {
                aiResponse = "The Sanctuary is a haven of profound stillness, offering rituals inspired by the natural rhythms of Wychwood Forest. We invite you to browse our current ritual menu. For bookings and inquiries, please visit our contact portal.";
            } else if (query.includes('dining') || query.includes('food') || query.includes('eat') || query.includes('restaurant') || query.includes('menu')) {
                aiResponse = "Culinary artistry at Aethelgard is a dialogue with the forest. Our menus celebrate the wild bounty of the estate. I highly recommend a visit to The Cellar Vault. To reserve your table, please inquire at the front desk or via our contact page.";
            } else if (query.includes('history') || query.includes('old') || query.includes('heritage') || query.includes('about')) {
                aiResponse = "Aethelgard's lineage traces back to 1142. For eight centuries, these stones have served as wardens of the forest. For a deeper historical tour, please contact our curators via the contact form.";
            } else if (query.includes('name is') || query.includes('i am')) {
                const nameMatch = userMessage.content.match(/(?:name is|i am)\s+([a-zA-Z]+)/i);
                const name = nameMatch ? nameMatch[1] : 'friend';
                aiResponse = `Greetings ${name}, it is a pleasure to meet you. Welcome to Aethelgard. The estate is particularly beautiful today—how can I assist your exploration and ensure your stay is comfortable?`;
            } else if (query.includes('hello') || query.includes('hi') || query.includes('greetings')) {
                aiResponse = "Greetings! It is a profound pleasure to assist you. The estate is particularly beautiful today—how can I guide your exploration or assist with your retreat?";
            } else if (query.includes('thank') || query.includes('thanks')) {
                aiResponse = "It is my honor to serve. May your stay be as serene as the morning mist over the hollow. Is there any other detail I can illuminate for you?";
            } else {
                aiResponse = "I apologize, but I didn't quite catch that. To provide the immediate and detailed assistance you deserve, I recommend reaching out to our 24/7 Concierge team via the phone icon or our Contact page. They will be delighted to help you.";
            }

            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            setIsTyping(false);
        }, responseDelay);
    };

    return (
        <>
            {/* 1. Main Floating Button & Menu */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center">
                <AnimatePresence>
                    {isVisible && (
                        <>
                            {/* Circular Expansion Menu */}
                            {isOpen && (
                                <div className="absolute bottom-24 right-0">
                                    {menuItems.map((item, idx) => {
                                        // Position them in a vertical stack for better clarity given the "4" icons
                                        const yOffset = -(idx + 1) * 70;

                                        return (
                                            <motion.button
                                                key={idx}
                                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, y: yOffset, scale: 1 }}
                                                exit={{ opacity: 0, y: 0, scale: 0.5 }}
                                                transition={{ 
                                                    type: 'spring', 
                                                    stiffness: 300, 
                                                    damping: 25,
                                                    delay: idx * 0.05
                                                }}
                                                onClick={() => {
                                                    if (item.action === 'chat') {
                                                        setIsChatOpen(true);
                                                        setIsOpen(false);
                                                    } else if (item.href) {
                                                        window.location.href = item.href;
                                                    }
                                                }}
                                                className="absolute right-2 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/50 transition-all hover:scale-110 active:scale-95 group/item"
                                                style={{ backgroundColor: COLORS.white, color: COLORS.darkMoss }}
                                                title={item.label}
                                            >
                                                {item.icon}
                                                {/* Label on Hover */}
                                                <span className="absolute right-20 px-4 py-2 rounded-xl bg-white text-darkMoss text-[10px] uppercase tracking-widest font-black opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/20">
                                                    {item.label}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Main Toggle Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: 50 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-2 border-white/20 relative overflow-hidden group"
                                style={{ backgroundColor: COLORS.main, color: COLORS.darkMoss }}
                            >
                                <motion.div
                                    animate={{ rotate: isOpen ? 90 : 0 }}
                                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                >
                                    {isOpen ? <X className="w-8 h-8" /> : <ConciergeBell className="w-8 h-8" />}
                                </motion.div>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Interactive Live Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, x: '50%', right: '2rem' }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[110] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-[12px]"
                        style={{ backgroundColor: `${COLORS.darkMoss}E6` }} // Dark Moss with opacity
                    >
                        {/* Chat Header */}
                        <div className="p-8 flex items-center justify-between border-b border-white/10" style={{ backgroundColor: `${COLORS.darkMoss}33` }}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#BAC095]/20 flex items-center justify-center border border-[#BAC095]/30">
                                    <AethelgardLogo className="w-6 h-6" style={{ color: COLORS.main }} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-white text-lg tracking-wide">Aethelgard Guide</h3>
                                    <p className="text-[10px] text-moss-200 uppercase tracking-widest font-black opacity-60">Digital Concierge</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsChatOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            className="flex-1 overflow-y-auto p-8 space-y-6 relative rounded-b-none scroll-smooth" 
                            style={{ scrollbarWidth: 'thin', scrollbarColor: `${COLORS.main}44 transparent` }}
                            data-lenis-prevent
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`max-w-[80%] p-5 rounded-[1.5rem] text-sm leading-relaxed ${
                                            msg.role === 'user' 
                                            ? 'bg-white/10 text-white rounded-tr-none' 
                                            : 'text-zinc-100 rounded-tl-none border border-white/5 shadow-inner'
                                        }`}
                                        style={msg.role === 'ai' ? { backgroundColor: `${COLORS.darkMoss}99` } : {}}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="flex justify-start"
                                >
                                    <div 
                                        className="max-w-[80%] p-4 rounded-[1.5rem] rounded-tl-none border border-white/5 shadow-inner flex gap-1 items-center"
                                        style={{ backgroundColor: `${COLORS.darkMoss}99` }}
                                    >
                                        <motion.div 
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                            className="w-1.5 h-1.5 rounded-full bg-white/40"
                                        />
                                        <motion.div 
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                            className="w-1.5 h-1.5 rounded-full bg-white/40"
                                        />
                                        <motion.div 
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                            className="w-1.5 h-1.5 rounded-full bg-white/40"
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-black/20 border-t border-white/10">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-2 transition-all focus-within:border-[#BAC095]/50 focus-within:bg-white/10">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Inquire about the estate..."
                                    className="bg-transparent border-none outline-none flex-1 text-white text-sm py-2 placeholder:text-white/20"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim()}
                                    className="p-2 rounded-full hover:bg-[#BAC095] hover:text-[#3D4127] transition-all text-[#BAC095] disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[9px] text-center mt-6 text-white/30 uppercase tracking-widest font-black">Powered by Aethelgard AI</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
