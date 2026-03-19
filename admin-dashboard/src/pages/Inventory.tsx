import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Plus, MoreVertical, Edit2, Trash2, Video, Tag, Bed, Users, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RoomUnit {
    _id?: string;
    number: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out_of_service';
}

interface RoomType {
    _id: string;
    name: string;
    roomType: string;
    capacity: number;
    price: number;
    units: RoomUnit[];
    floor: number;
}

export function Inventory() {
    const queryClient = useQueryClient();
    const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const { data: rooms = [], isLoading } = useQuery<RoomType[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/rooms`, { withCredentials: true });
            return res.data;
        }
    });

    const updateUnit = useMutation({
        mutationFn: async ({ roomId, unitNumber, status }: { roomId: string, unitNumber: string, status: string }) => {
            await axios.put(`${API_URL}/rooms/unit-status`, { roomId, unitNumber, status }, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });

    const toggleExpand = (id: string) => {
        setExpandedRooms(prev => 
            prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
        );
    };

    const filteredRooms = rooms.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.roomType.toLowerCase().includes(search.toLowerCase())
    );

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter by Designation..."
                            className="w-full bg-white/5 border border-sage/10 rounded-2xl py-4 pl-12 pr-4 text-cream outline-none focus:border-sage/40 focus:bg-white/[0.08] transition-all text-sm"
                        />
                    </div>
                    <button className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-8 py-4 rounded-2xl transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-sage/10 group active:scale-95 whitespace-nowrap">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>Add Type</span>
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {filteredRooms.map((room) => (
                    <motion.div key={room._id} layout h-full>
                        <GlassCard className="p-0 border-sage/10 overflow-hidden bg-moss-light/5 hover:border-sage/30 transition-all cursor-pointer" 
                            onClick={() => toggleExpand(room._id)}>
                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-sage/20 text-sage group-hover:scale-110 transition-transform">
                                        <Bed size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-cream tracking-wide">{room.name}</h3>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-sage/40 font-bold">{room.roomType}</span>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-sage/40 font-bold">Level 0{room.floor}</span>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-sage/60 font-black px-2 py-0.5 bg-sage/10 rounded-md">{room.units.length} Units</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <p className="text-[9px] uppercase tracking-widest text-sage/30 font-bold mb-1">Base Rate</p>
                                        <p className="text-2xl font-serif text-cream">${room.price}</p>
                                    </div>
                                    <div className={cn("p-2 rounded-lg transition-transform duration-500", expandedRooms.includes(room._id) ? "rotate-180 bg-sage/10 text-sage" : "text-sage/40")}>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedRooms.includes(room._id) && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 bg-white/[0.02] overflow-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                            {room.units.map((unit) => (
                                                <div key={unit.number} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-4 hover:border-sage/20 transition-all group">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-sage/60">{unit.number}</span>
                                                        <button className="p-1 text-sage/20 hover:text-sage transition-colors"><MoreVertical size={14} /></button>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-3">
                                                        {['available', 'occupied', 'cleaning', 'maintenance'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => updateUnit.mutate({ roomId: room._id, unitNumber: unit.number, status })}
                                                                className={cn(
                                                                    "text-[8px] uppercase tracking-[0.2em] font-bold py-2 rounded-lg border transition-all",
                                                                    unit.status === status 
                                                                        ? status === 'available' ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" :
                                                                          status === 'occupied' ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20" :
                                                                          status === 'cleaning' ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20" :
                                                                          "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                                                                        : "bg-white/5 text-sage/40 border-transparent hover:border-sage/20"
                                                                )}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
