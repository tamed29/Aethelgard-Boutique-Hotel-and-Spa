import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Plus, Bed, Users, ChevronDown, ShieldCheck, RefreshCw, Layers, Trash2, Edit2, X } from 'lucide-react';
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
    roomNumber?: string;
    capacity: number;
    price: number;
    units: RoomUnit[];
    floor: number;
}

export function Inventory() {
    const queryClient = useQueryClient();
    const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);

    const { data: rooms = [], isLoading, isFetching } = useQuery<RoomType[]>({
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

    const createRoomMutation = useMutation({
        mutationFn: async (data: Partial<RoomType>) => {
            await axios.post(`${API_URL}/rooms`, data, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setIsModalOpen(false);
        }
    });

    const updateRoomMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<RoomType> }) => {
            await axios.put(`${API_URL}/rooms/${id}`, data, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            setIsModalOpen(false);
        }
    });

    const deleteRoomMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/rooms/${id}`, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });

    const handleSaveRoom = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            roomType: formData.get('roomType') as string,
            roomNumber: formData.get('roomNumber') as string,
            price: Number(formData.get('price')),
            capacity: Number(formData.get('capacity')),
            floor: Number(formData.get('floor')) || 1
        };
        if (editingRoom) {
            updateRoomMutation.mutate({ id: editingRoom._id, data });
        } else {
            createRoomMutation.mutate(data);
        }
    };

    const openAddModal = () => {
        setEditingRoom(null);
        setIsModalOpen(true);
    };

    const openEditModal = (room: RoomType) => {
        setEditingRoom(room);
        setIsModalOpen(true);
    };

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
            <div className="flex flex-col items-center gap-6">
                <RefreshCw className="animate-spin text-sage w-12 h-12" />
                <div className="text-sage tracking-[0.4em] uppercase text-[10px] font-black">Decrypting Inventory...</div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-24">
            {/* System Status HUD */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'System Logic', val: 'Active', color: 'text-emerald-400' },
                    { label: 'Conflict Guard', val: 'Sovereign', color: 'text-emerald-400' },
                    { label: 'Inventory Desync', val: '0.00ms', color: 'text-sage/40' },
                    { label: 'Terminal Mode', val: 'Admin-Aethelgard', color: 'text-sage/60' }
                ].map(stat => (
                    <div key={stat.label} className="bg-moss-dark/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-black tracking-widest text-sage/30">{stat.label}</span>
                        <span className={cn("text-[10px] uppercase font-black tracking-widest", stat.color)}>{stat.val}</span>
                    </div>
                ))}
            </div>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-sage/10 border border-sage/20 rounded-2xl text-sage">
                        <Layers size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif text-cream">Room Inventory</h2>
                        <p className="text-sage/40 text-[10px] mt-1 uppercase tracking-[0.3em] font-black">Manage and allocate hotel rooms</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sage/40 group-focus-within:text-sage transition-colors" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Designation Search..."
                            className="w-full bg-white/[0.03] border border-sage/10 rounded-full py-5 pl-16 pr-6 text-cream outline-none focus:border-sage/40 focus:bg-white/[0.08] transition-all text-sm font-light tracking-wide placeholder:text-sage/20"
                        />
                    </div>
                    <button onClick={openAddModal} className="bg-sage hover:bg-white text-moss-dark font-black px-10 py-5 rounded-full transition-all duration-700 flex items-center gap-4 shadow-2xl shadow-sage/20 hover:shadow-white/10 group active:scale-95 leading-none text-[10px] uppercase tracking-[0.4em]">
                        <Plus size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                        <span>Add Room</span>
                    </button>
                    {isFetching && <RefreshCw className="animate-spin text-sage w-5 h-5 self-center" />}
                </div>
            </header>

            <div className="space-y-6">
                {filteredRooms.map((room) => (
                    <motion.div key={room._id} layout>
                        <GlassCard className="p-0 border-white/5 overflow-hidden bg-white/[0.01] hover:bg-white/[0.03] hover:border-sage/30 transition-all shadow-none">
                            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between cursor-pointer" 
                                onClick={() => toggleExpand(room._id)}>
                                <div className="flex items-center gap-8 p-8 border-b md:border-b-0 md:border-r border-white/5 flex-1">
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-sage/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="relative p-6 rounded-2xl bg-white/5 border border-sage/10 text-sage">
                                            <Bed size={32} strokeWidth={1.2} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif text-cream tracking-tight">{room.name}</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-sage/40 font-black">{room.roomType}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-sage/20" />
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-sage/40 font-black">Level 0{room.floor}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D4DE95]" />
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4DE95] font-black">{room.units.length} Unit Clusters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center divide-x divide-white/5">
                                    <div className="px-6 py-8 flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); openEditModal(room); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sage hover:text-white transition-colors duration-300 pointer-events-auto">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete this room type?')) deleteRoomMutation.mutate(room._id); }} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-rose-400 hover:text-rose-300 transition-colors duration-300 pointer-events-auto">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="px-8 py-8 text-center min-w-[200px]">
                                        <p className="text-[9px] uppercase tracking-[0.4em] text-sage/20 font-black mb-2">Baseline Cost</p>
                                        <p className="text-3xl font-serif text-cream">${room.price}</p>
                                    </div>
                                    <div className={cn("p-12 transition-all duration-700 cursor-pointer pointer-events-auto", expandedRooms.includes(room._id) ? "bg-sage/10 text-sage" : "text-sage/20 hover:text-sage")}>
                                        <ChevronDown size={28} className={cn("transition-transform duration-700", expandedRooms.includes(room._id) && "rotate-180")} />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedRooms.includes(room._id) && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="border-t border-white/5 bg-black/20 overflow-hidden"
                                    >
                                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                            {room.units.map((unit) => (
                                                <div key={unit.number} className="relative bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-6 hover:border-sage/40 transition-all group overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-sage/[0.02] blur-2xl pointer-events-none" />
                                                    
                                                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-sage/30">Unit Designation</span>
                                                            <span className="text-lg font-serif text-cream">{unit.number}</span>
                                                        </div>
                                                        <div className={cn(
                                                            "w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                                                            unit.status === 'available' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                                            unit.status === 'occupied' ? 'bg-rose-500 shadow-rose-500/50' :
                                                            unit.status === 'cleaning' ? 'bg-sky-500 shadow-sky-500/50' : 'bg-amber-500 shadow-amber-500/50'
                                                        )} />
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-2">
                                                        {[
                                                            { id: 'available', label: 'Ready', icon: <Check size={12} /> },
                                                            { id: 'occupied', label: 'Stay-In', icon: <Users size={12} /> },
                                                            { id: 'cleaning', label: 'Restoration', icon: <Sparkles size={12} /> },
                                                            { id: 'maintenance', label: 'Deep Cure', icon: <ShieldCheck size={12} /> },
                                                            { id: 'out_of_service', label: 'Sealed', icon: <Trash2 size={12} /> }
                                                        ].map((s) => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => updateUnit.mutate({ roomId: room._id, unitNumber: unit.number, status: s.id })}
                                                                className={cn(
                                                                    "flex items-center justify-between text-[8px] uppercase tracking-[0.3em] font-black py-3 px-4 rounded-xl border transition-all duration-500 group/btn",
                                                                    unit.status === s.id 
                                                                        ? "bg-sage text-moss-dark border-sage shadow-[0_5px_20px_rgba(186,192,149,0.2)]"
                                                                        : "bg-white/[0.03] text-sage/40 border-transparent hover:border-sage/20 hover:text-sage"
                                                                )}
                                                            >
                                                                <span>{s.label}</span>
                                                                <span className={cn("transition-transform duration-500", unit.status === s.id ? "scale-110" : "scale-0 group-hover/btn:scale-100 opacity-0 group-hover/btn:opacity-100")}>
                                                                    {s.icon}
                                                                </span>
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

            {/* Room Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-2xl bg-[#1A1F16] border border-sage/20 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="text-2xl font-serif text-cream">
                                    {editingRoom ? 'Edit Room Type' : 'Allocate New Room Type'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-sage/40 hover:text-sage transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveRoom} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Room Name</label>
                                        <input required name="name" defaultValue={editingRoom?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="e.g. The Grand Suite" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Room Type</label>
                                        <select required name="roomType" defaultValue={editingRoom?.roomType || 'forest'} className="w-full bg-[#1A1F16] border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors [&>option]:bg-[#1A1F16]">
                                            <option value="forest">Forest</option>
                                            <option value="double">Double</option>
                                            <option value="grand">Grand</option>
                                            <option value="botanical">Botanical</option>
                                            <option value="family">Family</option>
                                            <option value="single">Single</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Designation Number</label>
                                        <input required name="roomNumber" defaultValue={editingRoom?.roomNumber || `${editingRoom?.roomType?.toUpperCase() || 'NEW'}-01`} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="e.g. GRAND-01" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Baseline Price ($)</label>
                                        <input required type="number" name="price" defaultValue={editingRoom?.price} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="e.g. 450" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Capacity</label>
                                        <input required type="number" name="capacity" defaultValue={editingRoom?.capacity || 2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="e.g. 2" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Level (Floor)</label>
                                        <input required type="number" name="floor" defaultValue={editingRoom?.floor || 1} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="e.g. 1" />
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sage hover:bg-white/5 transition-colors font-bold text-sm">Cancel</button>
                                    <button type="submit" disabled={createRoomMutation.isPending || updateRoomMutation.isPending} className="px-6 py-3 rounded-xl bg-sage text-moss-dark hover:bg-white transition-colors font-bold text-sm">
                                        {createRoomMutation.isPending || updateRoomMutation.isPending ? 'Committing...' : 'Commit Unit'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Check({ size, className }: { size?: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>
}

function Sparkles({ size, className }: { size?: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
}
