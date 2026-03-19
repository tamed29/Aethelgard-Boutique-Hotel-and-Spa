import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Plus, MoreVertical, Edit2, Trash2, Video, Tag, Bed, Users, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Room {
    _id: string;
    name: string;
    capacity: number;
    price: number;
    status: 'available' | 'occupied' | 'maintenance';
}

export function Inventory() {
    const queryClient = useQueryClient();
    const { data: rooms = [], isLoading } = useQuery<Room[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/rooms`, { withCredentials: true });
            return res.data;
        }
    });

    const deleteRoom = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/admin/rooms/${id}`, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-pulse text-sage tracking-[0.4em] uppercase text-xs font-bold">Accessing Estate Records...</div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Inventory Control</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Suite & Chamber Management Terminal</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by Designation..."
                            className="w-full bg-white/5 border border-sage/10 rounded-2xl py-4 pl-12 pr-4 text-cream outline-none focus:border-sage/40 focus:bg-white/[0.08] transition-all text-sm"
                        />
                    </div>
                    <button className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-8 py-4 rounded-2xl transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-sage/10 group active:scale-95 whitespace-nowrap">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>Add Unit</span>
                    </button>
                </div>
            </header>

            <GlassCard className="p-0 border-sage/10 overflow-hidden bg-moss-light/5">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] text-[10px] uppercase tracking-[0.25em] text-sage/60 font-bold border-b border-white/5">
                                <th className="py-6 px-8">Unit Designation</th>
                                <th className="py-6 px-8">Configurations</th>
                                <th className="py-6 px-8">Floor Level</th>
                                <th className="py-6 px-8">Premium Rate</th>
                                <th className="py-6 px-8">Status Protocol</th>
                                <th className="py-6 px-8 text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {rooms.map((room, i) => (
                                    <motion.tr
                                        key={room._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/[0.03] transition-colors group relative"
                                    >
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-moss-light/50 border border-sage/10 group-hover:border-sage/30 transition-all">
                                                    <Bed size={18} className="text-sage" />
                                                </div>
                                                <div>
                                                    <p className="text-cream font-serif text-lg tracking-wide">{room.name}</p>
                                                    <div className="flex gap-3 mt-2">
                                                        <Video size={10} className="text-sage/20 group-hover:text-sage/40 transition-colors" />
                                                        <Tag size={10} className="text-sage/20 group-hover:text-sage/40 transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 shrink-0">
                                            <div className="flex items-center gap-2 text-sage/60">
                                                <Users size={14} className="opacity-40" />
                                                <span className="text-xs font-medium uppercase tracking-widest">{room.capacity} Cap</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 shrink-0">
                                            <span className="text-xs text-sage/40 font-bold uppercase tracking-widest">Level 0{(room as any).floor || 1}</span>
                                        </td>
                                        <td className="py-6 px-8 shrink-0">
                                            <div className="flex items-center gap-1 text-cream font-serif text-lg group-hover:text-sage transition-colors">
                                                <DollarSign size={14} className="text-sage/40" />
                                                <span>{room.price}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 shrink-0">
                                            <span className={cn(
                                                "text-[9px] uppercase tracking-[0.15em] font-bold px-4 py-1.5 rounded-full border shadow-sm",
                                                room.status === 'available' ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/20 shadow-emerald-500/5" :
                                                    room.status === 'occupied' ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5" :
                                                        "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5"
                                            )}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right shrink-0">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="p-2.5 hover:bg-white/10 rounded-xl text-sage/60 hover:text-sage transition-all"><Edit2 size={16} /></button>
                                                <button 
                                                    onClick={() => deleteRoom.mutate(room._id)}
                                                    className="p-2.5 hover:bg-rose-500/10 rounded-xl text-rose-400/60 hover:text-rose-400 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2.5 hover:bg-white/10 rounded-xl text-sage/60 hover:text-sage transition-all"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
