import { useState, useEffect } from 'react';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Calendar, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function Bookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Manual booking form state
    const [roomId, setRoomId] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    // Setup API URL
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bRes, rRes] = await Promise.all([
                    axios.get(`${API_URL}/bookings`, { withCredentials: true }),
                    axios.get(`${API_URL}/rooms`)
                ]);
                setBookings(bRes.data);
                setRooms(rRes.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [API_URL]);

    const handleManualBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/bookings`, {
                roomId,
                checkIn,
                checkOut,
            }, { withCredentials: true });
            toast.success('Manual booking created successfully!');
            // Refresh
            const bRes = await axios.get(`${API_URL}/bookings`, { withCredentials: true });
            setBookings(bRes.data);
            // Reset
            setRoomId('');
            setCheckIn('');
            setCheckOut('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create manual booking');
        }
    };

    if (loading) return <div className="p-12 text-sage/40">Loading bookings...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-serif text-cream">Reservations Engine</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Manual Booking Widget */}
                <GlassCard className="lg:col-span-1 border-sage/10">
                    <h3 className="text-xl font-serif text-cream mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-sage" /> Manual Block
                    </h3>
                    <form onSubmit={handleManualBooking} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-sage/60">Room</label>
                            <select
                                required
                                value={roomId}
                                onChange={e => setRoomId(e.target.value)}
                                className="w-full bg-white/5 border border-sage/10 rounded-xl p-3 text-cream outline-none focus:border-sage/40 custom-select"
                            >
                                <option value="" className="bg-moss-dark">Select a Room...</option>
                                {rooms.map(r => (
                                    <option key={r._id} value={r._id} className="bg-moss-dark">{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase text-sage/60">Check-In</label>
                                <input
                                    type="date"
                                    required
                                    value={checkIn}
                                    onChange={e => setCheckIn(e.target.value)}
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl p-3 text-cream outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase text-sage/60">Check-Out</label>
                                <input
                                    type="date"
                                    required
                                    value={checkOut}
                                    onChange={e => setCheckOut(e.target.value)}
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl p-3 text-cream outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-sage hover:bg-sage-light text-moss-dark font-bold py-3 rounded-xl transition-all">
                            Block Dates
                        </button>
                    </form>
                </GlassCard>

                {/* Bookings List */}
                <GlassCard title="Recent Reservations" className="lg:col-span-2 border-sage/10">
                    <div className="space-y-4 mt-4">
                        {bookings.map((b) => (
                            <div key={b._id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-sage/10 p-3 rounded-lg text-sage">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-cream font-medium">{b.user?.name || 'Manual Block'}</p>
                                        <p className="text-xs text-sage/60">{b.room?.name} • {new Date(b.checkIn).toLocaleDateString()} to {new Date(b.checkOut).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                        {b.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
