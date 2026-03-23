'use client';

import { useState } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar, Check } from 'lucide-react';
import { toast } from 'sonner';
import MagneticHover from '@/components/ui/MagneticHover';
import { useStore } from '@/store/useStore';

// Simplified Zod schema
const bookingSchema = z.object({
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
    guests: z.number().min(1).max(10),
    guestName: z.string().min(2, 'Name is required'),
    guestEmail: z.string().email('Invalid email format'),
    specialRequests: z.string().optional()
});

interface BookingWidgetProps {
    roomId: string;
    pricePerNight: number;
}

export function BookingWidget({ roomId, pricePerNight }: BookingWidgetProps) {
    const showPrices = useStore(state => state.showPrices);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [addons, setAddons] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableAddons = [
        { id: 'champagne', label: 'Champagne on Arrival', price: 120 },
        { id: 'spa', label: 'Couples Spa Day', price: 350 },
        { id: 'late_checkout', label: 'Late Checkout (2PM)', price: 75 },
    ];

    const toggleAddon = (id: string) => {
        setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const addonsTotal = addons.reduce((sum, id) => {
        const item = availableAddons.find(a => a.id === id);
        return sum + (item ? item.price : 0);
    }, 0);

    // Naive days calculation
    const days = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))) : 0;
    const totalEstimate = (days * pricePerNight) + addonsTotal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Zod Validation
            bookingSchema.parse({
                checkIn, checkOut, guests, guestName, guestEmail
            });

            // Make API Call
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomType: roomId,
                    checkIn,
                    checkOut,
                    guestName,
                    guestEmail,
                    guests: guests,
                    addons
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Booking failed');

            toast.success('Your sanctuary awaits. Confirmation sent.', {
                description: `Booking #${data.booking._id.substring(0, 8)} confirmed.`
            });

            // Reset
            setCheckIn(''); setCheckOut(''); setAddons([]); setGuestName(''); setGuestEmail('');

        } catch (error: any) {
            if (error instanceof z.ZodError) {
                toast.error('Validation Error', { description: error.issues[0]?.message || 'Invalid input' });
            } else {
                toast.error('Booking failed', { description: error.message });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass rounded-[3rem] p-10 md:p-12 shadow-2xl backdrop-blur-3xl border border-white/5">
            <h3 className="text-3xl font-serif text-moss-100 mb-8 border-b border-white/10 pb-4">Reserve Sanctuary</h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Arrival & Departure */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-200/50 block ml-1">Arrival</label>
                        <input
                            type="date"
                            required
                            value={checkIn}
                            onChange={e => setCheckIn(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-white/5 border-b border-moss-100/20 py-3 px-1 text-moss-100 outline-none focus:border-moss-200 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-200/50 block ml-1">Departure</label>
                        <input
                            type="date"
                            required
                            value={checkOut}
                            onChange={e => setCheckOut(e.target.value)}
                            min={checkIn || new Date().toISOString().split('T')[0]}
                            className="w-full bg-white/5 border-b border-moss-100/20 py-3 px-1 text-moss-100 outline-none focus:border-moss-200 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-200/50 block ml-1">Guardian Name</label>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            required
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            className="w-full bg-transparent border-b border-moss-100/20 py-2 px-1 text-moss-100 placeholder-moss-100/20 outline-none focus:border-moss-200 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-200/50 block ml-1">Identity Portal</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            required
                            value={guestEmail}
                            onChange={e => setGuestEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-moss-100/20 py-2 px-1 text-moss-100 placeholder-moss-100/20 outline-none focus:border-moss-200 transition-all"
                        />
                    </div>
                </div>

                {/* Enhancements */}
                <div className="pt-4 border-t border-white/5">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-200/60 mb-6 block">Stay Enhancements</label>
                    <div className="space-y-4">
                        {availableAddons.map(addon => (
                            <label 
                                key={addon.id} 
                                className="flex items-center justify-between cursor-pointer group select-none py-2"
                            >
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="checkbox"
                                        checked={addons.includes(addon.id)}
                                        onChange={() => toggleAddon(addon.id)}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${addons.includes(addon.id) ? 'bg-moss-100 border-moss-100 text-moss-900' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {addons.includes(addon.id) && <Check className="w-3 h-3" strokeWidth={4} />}
                                    </div>
                                    <span className={`text-sm font-serif italic transition-colors duration-300 ${addons.includes(addon.id) ? 'text-moss-100' : 'text-moss-100/50 group-hover:text-moss-100/80'}`}>
                                        {addon.label}
                                    </span>
                                </div>
                                <span className={`text-[10px] tracking-widest transition-opacity duration-300 ${addons.includes(addon.id) ? 'text-moss-300 opacity-100' : 'text-moss-300 opacity-40'}`}>
                                    +${addon.price}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Total & Action */}
                <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-moss-200/40">
                            {showPrices ? 'Sanctuary Total' : 'Sanctuary Status'}
                        </p>
                        {showPrices ? (
                            <p className="text-4xl font-serif text-moss-100">${totalEstimate}</p>
                        ) : (
                            <p className="text-2xl font-serif text-moss-100 uppercase tracking-widest">Available</p>
                        )}
                    </div>
                    <MagneticHover intensity={0.4}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-moss-100 text-moss-900 px-10 py-5 uppercase tracking-[0.2em] text-[10px] font-black hover:bg-white transition-all duration-700 shadow-xl disabled:opacity-50"
                        >
                            {isSubmitting ? 'Securing...' : 'Book Sanctuary'}
                        </button>
                    </MagneticHover>
                </div>
            </form>
        </div>
    );
}
