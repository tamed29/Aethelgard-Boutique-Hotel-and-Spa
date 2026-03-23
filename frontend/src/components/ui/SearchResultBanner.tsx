'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Calendar, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import MagneticHover from './MagneticHover';

interface SearchResultBannerProps {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
    isAvailable: boolean;
    availableCount?: number;
    onModify: () => void;
    onViewAvailable: () => void;
    onSearchAgain: () => void;
    onViewAll: () => void;
}

export default function SearchResultBanner({
    checkIn,
    checkOut,
    guests,
    isAvailable,
    availableCount = 0,
    onModify,
    onViewAvailable,
    onSearchAgain,
    onViewAll
}: SearchResultBannerProps) {
    if (!checkIn || !checkOut) return null;

    const dateRange = `${format(checkIn, 'MMM dd, yyyy')} — ${format(checkOut, 'MMM dd, yyyy')}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto px-6 mb-12"
        >
            <div className={`relative overflow-hidden rounded-[2.5rem] border backdrop-blur-xl shadow-2xl transition-all duration-700 ${
                isAvailable 
                ? 'bg-moss-900/10 border-moss-500/20' 
                : 'bg-zinc-950/40 border-white/5'
            }`}>
                {/* Decorative Background Element */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-20 ${
                    isAvailable ? 'bg-moss-300' : 'bg-red-500'
                }`} />

                <div className="relative z-10 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        
                        {/* Status & Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                {isAvailable ? (
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-moss-500/10 border border-moss-500/20">
                                        <CheckCircle2 className="w-4 h-4 text-moss-400" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-moss-300">Sanctuary Available</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-red-300">Fully Reserved</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                                    {isAvailable 
                                        ? "Rooms available for your selected dates."
                                        : "Sorry, no rooms are available for the selected dates."
                                    }
                                </h2>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/50 text-sm font-light italic font-serif">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                        {dateRange}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 opacity-50" />
                                        {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                    </div>
                                    {isAvailable && availableCount > 0 && (
                                        <div className="text-moss-300 font-sans not-italic text-[10px] uppercase tracking-widest font-bold">
                                            {availableCount} {availableCount === 1 ? 'Room' : 'Rooms'} Ready
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-4 shrink-0">
                            {isAvailable ? (
                                <>
                                    <button
                                        onClick={onModify}
                                        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-[11px] uppercase tracking-[0.2em] font-bold overflow-hidden group"
                                    >
                                        <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500" />
                                        Modify Dates
                                    </button>
                                    <MagneticHover intensity={0.2}>
                                        <button
                                            onClick={onViewAvailable}
                                            className="flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#D4DE95] text-[#2B2E1C] hover:bg-white transition-all text-[11px] uppercase tracking-[0.2em] font-black shadow-xl shadow-moss-900/20 group"
                                        >
                                            View Available Rooms
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                        </button>
                                    </MagneticHover>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={onSearchAgain}
                                        className="flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-[11px] uppercase tracking-[0.2em] font-black group"
                                    >
                                        Search Different Dates
                                        <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500" />
                                    </button>
                                    <button
                                        onClick={onViewAll}
                                        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/5 text-white/40 hover:text-white/60 transition-all text-[11px] uppercase tracking-[0.2em] font-bold"
                                    >
                                        View All Room Types
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}
