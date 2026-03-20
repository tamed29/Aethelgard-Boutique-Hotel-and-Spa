import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, CheckCircle, XCircle, Clock, DollarSign, ChevronDown, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

interface Booking {
    _id: string;
    guestName: string;
    guestEmail?: string;
    room: {
        _id: string;
        name: string;
        roomType: string;
    };
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    guests: number;
    isAtomic?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-sage/10 text-sage border-sage/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export function Bookings() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Booking | null>(null);

    const { data: bookings = [], isLoading } = useQuery<Booking[]>({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/bookings`, { withCredentials: true });
            return res.data;
        },
        staleTime: 5000,
    });

    useEffect(() => {
        const socket = io(SOCKET_URL);
        
        socket.on('newBooking', (booking: Booking) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success(`New ${booking.isAtomic ? 'Atomic' : ''} Booking: ${booking.guestName}`, {
                description: `${booking.room.roomType} ${booking.roomNumber}`,
                icon: <Zap className="text-amber-400" size={16} />
            });
        });

        socket.on('bookingUpdate', () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        });

        return () => { socket.disconnect(); };
    }, [queryClient]);

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await axios.put(`${API_URL}/bookings/${id}/status`, { status }, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
    });

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-pulse text-sage tracking-[0.4em] uppercase text-xs font-bold">Synchronizing Guest Records...</div>
        </div>
    );

    const filtered = bookings
        .filter(b => filter === 'all' || b.status === filter)
        .filter(b => 
            b.guestName.toLowerCase().includes(search.toLowerCase()) || 
            (b.room?.name || '').toLowerCase().includes(search.toLowerCase())
        );

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        revenue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0),
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Bookings Control</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-sage/40 text-[10px] uppercase tracking-[0.3em] font-bold">Guest Reservation Management Terminal</p>
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] uppercase tracking-widest text-emerald-400 font-black">Live Sync</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Reservations', value: stats.total, icon: ChevronDown, color: 'text-sage' },
                    { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'text-emerald-400' },
                    { label: 'Awaiting Review', value: stats.pending, icon: Clock, color: 'text-amber-400' },
                    { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-cream' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <GlassCard className="p-5">
                            <div className={cn("mb-2", s.color)}><s.icon size={16} /></div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-sage/40 font-bold">{s.label}</p>
                            <p className="text-2xl font-serif text-cream mt-1">{s.value}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40" size={14} />
                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search guest or room..."
                        className="w-full bg-white/5 border border-sage/10 rounded-2xl py-4 pl-11 pr-4 text-cream outline-none focus:border-sage/40 transition-all text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={cn("px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all border",
                                filter === s ? "bg-sage text-moss-dark border-sage" : "bg-white/5 text-sage/60 border-white/5 hover:border-sage/20")}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden border-sage/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] text-[9px] uppercase tracking-[0.2em] text-sage/50 font-bold border-b border-white/5">
                                <th className="py-5 px-6">Guest</th>
                                <th className="py-5 px-6">Room</th>
                                <th className="py-5 px-6">Check-In</th>
                                <th className="py-5 px-6">Check-Out</th>
                                <th className="py-5 px-6">Total</th>
                                <th className="py-5 px-6">Status</th>
                                <th className="py-5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filtered.map((booking, i) => (
                                    <motion.tr key={booking._id}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="py-5 px-6">
                                            <p className="text-cream font-medium text-sm">{booking.guestName}</p>
                                            <p className="text-sage/30 text-[10px] mt-0.5">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                                        </td>
                                        <td className="py-5 px-6 shrink-0">
                                            <div className="flex flex-col">
                                                <span className="text-sage/70 text-sm">{booking.room?.name || 'Unknown Room'}</span>
                                                <span className="text-[10px] text-sage/30 uppercase tracking-widest">{booking.roomNumber}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-sage/60 text-xs font-mono">{new Date(booking.checkIn).toLocaleDateString()}</td>
                                        <td className="py-5 px-6 text-sage/60 text-xs font-mono">{new Date(booking.checkOut).toLocaleDateString()}</td>
                                        <td className="py-5 px-6 text-cream font-serif">${booking.totalPrice?.toLocaleString()}</td>
                                        <td className="py-5 px-6">
                                            <span className={cn("text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border", STATUS_STYLES[booking.status])}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => setSelected(booking)} className="p-2 hover:bg-white/10 rounded-lg text-sage/60 hover:text-sage transition-all"><Eye size={14} /></button>
                                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                    <button onClick={() => updateStatus.mutate({ id: booking._id, status: 'cancelled' })} className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-400/60 hover:text-rose-400 transition-all"><XCircle size={14} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Guest Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#1A1F16] border border-sage/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                            <h3 className="text-2xl font-serif text-cream mb-1">{selected.guestName}</h3>
                            <p className="text-sage/40 text-xs uppercase tracking-widest mb-6">Reservation Detail</p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Room', value: selected.room?.name || 'Unknown' },
                                    { label: 'Unit', value: selected.roomNumber || 'Manual' },
                                    { label: 'Guests', value: `${selected.guests} persons` },
                                    { label: 'Check-In', value: new Date(selected.checkIn).toLocaleDateString() },
                                    { label: 'Check-Out', value: new Date(selected.checkOut).toLocaleDateString() },
                                    { label: 'Total Charge', value: `$${selected.totalPrice?.toLocaleString()}` },
                                    { label: 'Status', value: selected.status },
                                ].map(f => (
                                    <div key={f.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[9px] uppercase tracking-widest text-sage/40 font-bold mb-1">{f.label}</p>
                                        <p className="text-cream font-medium">{f.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-6">
                                {selected.status === 'pending' && (
                                    <button onClick={() => { updateStatus.mutate({ id: selected._id, status: 'confirmed' }); setSelected(null); }}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all">
                                        Confirm Booking
                                    </button>
                                )}
                                <button onClick={() => setSelected(null)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-sage font-bold py-3 rounded-xl transition-all border border-white/10">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
