'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, User, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isBefore, startOfDay } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import 'react-day-picker/dist/style.css';

export default function BookingBar() {
    const router = useRouter();
    const [range, setRange] = useState<DateRange | undefined>();
    const [showCalendar, setShowCalendar] = useState(false);
    const [guests, setGuests] = useState(2);
    const [showGuests, setShowGuests] = useState(false);

    const handleSearch = () => {
        if (!range?.from || !range?.to) {
            toast.error("Selection Required", {
                description: "Please select both check-in and check-out dates.",
                className: "bg-zinc-950 border-white/10 text-white font-serif"
            });
            return;
        }

        const today = startOfDay(new Date());
        if (isBefore(range.from, today)) {
            toast.error("Invalid Date", {
                description: "Check-in date cannot be in the past.",
                className: "bg-zinc-950 border-white/10 text-white font-serif"
            });
            return;
        }

        // Navigate with search params
        const params = new URLSearchParams({
            checkin: range.from.toISOString(),
            checkout: range.to.toISOString(),
            guests: guests.toString()
        });
        
        router.push(`/rooms?${params.toString()}`);
    };

    const dateDisplay = range?.from
        ? `${format(range.from, 'LLL dd')} - ${range.to ? format(range.to, 'LLL dd') : '...'}`
        : "Select dates";

    return (
        <div className="relative w-full">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="glass rounded-3xl md:rounded-full p-4 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full shadow-2xl relative z-40 border-white/10"
            >
                {/* Date Selection */}
                <div
                    className="flex-1 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 px-2 md:px-4 cursor-pointer hover:bg-white/5 transition-colors rounded-2xl md:rounded-none"
                    onClick={() => {
                        setShowCalendar(!showCalendar);
                        setShowGuests(false);
                    }}
                >
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-moss-200 mb-2 font-black">Check In - Check Out</label>
                    <div className="flex items-center gap-3 text-white">
                        <CalendarIcon className="w-5 h-5 text-moss-100" />
                        <span className="text-sm font-serif italic truncate">{dateDisplay}</span>
                    </div>
                </div>

                {/* Guest Selection */}
                <div
                    className="flex-1 pb-4 md:pb-0 px-2 md:px-4 cursor-pointer hover:bg-white/5 transition-colors rounded-2xl md:rounded-none"
                    onClick={() => {
                        setShowGuests(!showGuests);
                        setShowCalendar(false);
                    }}
                >
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-moss-200 mb-2 font-black">Guests</label>
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-moss-100" />
                            <span className="text-sm font-serif italic">{guests} Adults</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${showGuests ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="bg-moss-700 hover:bg-moss-900 text-white p-5 rounded-full transition-all duration-500 flex items-center justify-center group shadow-lg hover:shadow-moss-900/40"
                >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="md:hidden ml-3 uppercase tracking-widest text-[10px] font-black">Explore Chambers</span>
                </button>
            </motion.div>

            {/* Overlays */}
            <AnimatePresence>
                {showCalendar && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-6 left-0 md:left-4 z-50 bg-zinc-900/95 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden calendar-dark"
                    >
                        <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            numberOfMonths={2}
                            styles={{
                                months: { display: 'flex', gap: '2rem', flexWrap: 'wrap' }
                            }}
                        />
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="text-[10px] uppercase tracking-widest font-black text-white px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                            >
                                Confirm Dates
                            </button>
                        </div>
                    </motion.div>
                )}

                {showGuests && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-6 right-0 md:right-[15%] z-50 bg-zinc-900/95 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-3xl w-72"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-serif italic text-white/60">Adults</span>
                            <div className="flex items-center gap-6">
                                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all text-white">–</button>
                                <span className="text-white font-serif text-xl">{guests}</span>
                                <button onClick={() => setGuests(guests + 1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all text-white">+</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .calendar-dark .rdp {
                    --rdp-cell-size: 40px;
                    --rdp-accent-color: #4a5d4e;
                    --rdp-background-color: #1a1a1a;
                    --rdp-outline: 2px solid var(--rdp-accent-color);
                    --rdp-outline-selected: 3px solid var(--rdp-accent-color);
                    color: white;
                }
                .calendar-dark .rdp-day_selected {
                    background-color: var(--rdp-accent-color) !important;
                    color: white !important;
                }
                .calendar-dark .rdp-day:hover {
                    background-color: rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </div>
    );
}
