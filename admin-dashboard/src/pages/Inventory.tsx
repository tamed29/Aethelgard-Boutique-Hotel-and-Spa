import { useState, useEffect } from 'react';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Plus, MoreVertical, Edit2, Trash2, Video, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Room {
    _id: string;
    name: string;
    capacity: number;
    price: number;
    status: string;
}

export function Inventory() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await axios.get(`${API_URL}/rooms`);
                setRooms(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-pulse text-sage tracking-widest uppercase text-sm">Loading Inventory...</div>
        </div>
    );

    const filteredRooms = rooms.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 pl-12 pr-4 text-cream outline-none focus:border-sage/40 transition-all"
                    />
                </div>
                <button className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-sage/10 whitespace-nowrap">
                    <Plus size={20} />
                    Add New Room
                </button>
            </div>

            <GlassCard className="p-0 border-sage/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-sage/40 font-bold border-b border-sage/10">
                                <th className="py-4 px-6">Room Identity</th>
                                <th className="py-4 px-6">Occupancy</th>
                                <th className="py-4 px-6">Premium Rate</th>
                                <th className="py-4 px-6">Current Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRooms.map((room, i) => (
                                <motion.tr
                                    key={room._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="py-5 px-6">
                                        <div>
                                            <p className="text-cream font-medium tracking-wide">{room.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                <Video size={12} className="text-sage/30" />
                                                <Tag size={12} className="text-sage/30" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-sage/60 text-sm">{room.capacity} Guests</td>
                                    <td className="py-5 px-6 font-serif text-cream">${room.price}</td>
                                    <td className="py-5 px-6">
                                        <span className={cn(
                                            "text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full",
                                            room.status === 'available' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                room.status === 'occupied' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                                    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        )}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-sage transition-colors"><Edit2 size={16} /></button>
                                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-sage transition-colors"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
