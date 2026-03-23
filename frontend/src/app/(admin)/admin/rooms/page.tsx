'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { 
    Bed, 
    Sparkles, 
    ShieldCheck, 
    Users, 
    Trash2, 
    Clock, 
    Check, 
    Loader2, 
    ChevronDown,
    Search,
    Layers,
    Edit2,
    XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RoomUnit {
    number: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
}

interface RoomType {
    _id: string;
    name: string;
    roomType: string;
    units: RoomUnit[];
    floor: number;
    price: number;
    images: string[];
    bathroomImages: string[];
}

export default function RoomControlPage() {
    const queryClient = useQueryClient();
    const [expandedTypes, setExpandedTypes] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [cleaningTimers, setCleaningTimers] = useState<Record<string, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);

    const { data: rooms = [], isLoading } = useQuery<RoomType[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await adminAxios.get('/rooms');
            return res.data;
        }
    });

    const updateStatus = useMutation({
        mutationFn: async ({ roomId, unitNumber, status }: { roomId: string, unitNumber: string, status: string }) => {
            await adminAxios.put('/rooms/unit-status', { roomId, unitNumber, status });
        },
        onMutate: async ({ roomId, unitNumber, status }) => {
            await queryClient.cancelQueries({ queryKey: ['rooms'] });
            const previousRooms = queryClient.getQueryData<RoomType[]>(['rooms']);
            
            queryClient.setQueryData<RoomType[]>(['rooms'], old => {
                if (!old) return [];
                return old.map(room => {
                    if (room._id !== roomId) return room;
                    return { ...room, units: room.units.map(u => u.number === unitNumber ? { ...u, status: status as any } : u) };
                });
            });
            return { previousRooms };
        },
        onError: (err, variables, context) => {
            if (context?.previousRooms) queryClient.setQueryData(['rooms'], context.previousRooms);
            toast.error('Failed to update status');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });

    const updateRoomDetails = useMutation({
        mutationFn: async (formData: FormData) => {
            const id = formData.get('id');
            await adminAxios.put(`/rooms/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onMutate: async (formData) => {
            const id = formData.get('id');
            await queryClient.cancelQueries({ queryKey: ['rooms'] });
            const previousRooms = queryClient.getQueryData<RoomType[]>(['rooms']);
            
            // Note: Optimistic update is harder with FormData, but we can skip it or do a partial one
            return { previousRooms };
        },
        onError: (err, newData, context) => {
            if (context?.previousRooms) queryClient.setQueryData(['rooms'], context.previousRooms);
            toast.error('Failed to update room details');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
        onSuccess: () => {
            setIsModalOpen(false);
            setEditingRoom(null);
            toast.success('Room Updated (Sync Active)');
        }
    });
    

    // Quick Clean Logic (30 min timer)
    const handleQuickClean = (roomId: string, unitNumber: string) => {
        const key = `${roomId}-${unitNumber}`;
        updateStatus.mutate({ roomId, unitNumber, status: 'cleaning' });
        setCleaningTimers(prev => ({ ...prev, [key]: 1800 })); // 30 mins in seconds
        toast.success(`Restoration Protocol Initiated for ${unitNumber}`, {
            description: '30-minute countdown active.'
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCleaningTimers(prev => {
                const next = { ...prev };
                let changed = false;
                Object.keys(next).forEach(key => {
                    if (next[key] > 0) {
                        next[key] -= 1;
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleExpand = (id: string) => {
        setExpandedTypes(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Room Control</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">7-Unit Inventory Cluster Management</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4DE95]/20" size={16} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search designations..."
                        className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-full py-5 pl-16 pr-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all text-sm font-light"
                    />
                </div>
            </header>

            <div className="space-y-6">
                {rooms.map((room) => (
                    <div key={room._id} className="group">
                        <div 
                            onClick={() => toggleExpand(room._id)}
                            className={cn(
                                "flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] cursor-pointer transition-all duration-700 hover:bg-white/[0.05] hover:border-[#D4DE95]/20",
                                expandedTypes.includes(room._id) && "rounded-b-none border-b-transparent bg-white/[0.05]"
                            )}
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 rounded-2xl bg-[#D4DE95]/10 border border-[#D4DE95]/20 flex items-center justify-center text-[#D4DE95]">
                                    <Bed size={32} strokeWidth={1.2} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif text-[#F5F2ED] tracking-tight">{room.name}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[9px] uppercase tracking-widest text-[#D4DE95]/40 font-black px-3 py-1 bg-white/5 rounded-full border border-white/5">{room.roomType}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-[#D4DE95]/40 font-black px-3 py-1 bg-white/5 rounded-full border border-white/5">Floor 0{room.floor}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setEditingRoom(room); setIsModalOpen(true); }}
                                            className="p-1.5 ml-2 hover:bg-[#D4DE95]/20 text-[#D4DE95]/40 hover:text-[#D4DE95] rounded-lg transition-colors"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-right flex items-center gap-6">
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#D4DE95]/20 font-black mb-1">Units</p>
                                        <p className="text-lg font-serif text-[#F5F2ED]">{room.units?.length || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] uppercase tracking-[0.4em] text-[#D4DE95]/20 font-black mb-1">Base Price</p>
                                        <p className="text-2xl font-serif text-[#F5F2ED]">${room.price}</p>
                                    </div>
                                </div>
                                <ChevronDown 
                                    size={24} 
                                    className={cn("text-[#D4DE95]/20 transition-transform duration-700", expandedTypes.includes(room._id) && "rotate-180 text-[#D4DE95]")} 
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedTypes.includes(room._id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-white/[0.03] border-x border-b border-white/5 rounded-b-[2.5rem] overflow-hidden"
                                >
                                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                                        {room.units?.map((unit, idx) => {
                                            const timerKey = `${room._id}-${unit.number}`;
                                            const timeLeft = cleaningTimers[timerKey];

                                            return (
                                                <div key={idx} className="relative group/unit bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:border-[#D4DE95]/40 transition-all duration-700">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <p className="text-[7px] uppercase tracking-widest text-[#D4DE95]/30 font-black">Unit</p>
                                                            <p className="text-lg font-serif text-[#F5F2ED]">{unit.number}</p>
                                                        </div>
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            unit.status === 'available' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                                                            unit.status === 'occupied' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                                                            unit.status === 'cleaning' ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                                                        )} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        {[
                                                            { id: 'available', label: 'Ready', icon: Check },
                                                            { id: 'occupied', label: 'Occupied', icon: Users },
                                                            { id: 'cleaning', label: 'Cleaning', icon: Sparkles },
                                                            { id: 'maintenance', label: 'Repair', icon: ShieldCheck }
                                                        ].map((s) => (
                                                            <button 
                                                                key={s.id}
                                                                onClick={() => updateStatus.mutate({ roomId: room._id, unitNumber: unit.number, status: s.id })}
                                                                className={cn(
                                                                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[8px] uppercase tracking-widest font-black transition-all duration-500",
                                                                    unit.status === s.id 
                                                                        ? "bg-[#D4DE95] text-[#1A1F16]" 
                                                                        : "bg-white/5 text-[#D4DE95]/30 hover:bg-white/10 hover:text-[#D4DE95]"
                                                                )}
                                                            >
                                                                <span>{s.label}</span>
                                                                <s.icon size={10} strokeWidth={3} />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Quick Clean Trigger */}
                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                        {timeLeft ? (
                                                            <div className="flex items-center justify-center gap-2 text-sky-400 font-mono text-[10px] bg-sky-400/5 py-2 rounded-xl border border-sky-400/10">
                                                                <Clock size={12} className="animate-pulse" />
                                                                <span>{formatTime(timeLeft)}</span>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleQuickClean(room._id, unit.number)}
                                                                className="w-full py-2 bg-[#D4DE95]/5 hover:bg-[#D4DE95]/10 text-[#D4DE95]/40 hover:text-[#D4DE95] rounded-xl border border-dashed border-[#D4DE95]/10 flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest font-black transition-all"
                                                            >
                                                                <Sparkles size={12} />
                                                                <span>Quick Clean</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-[#3D4127] border border-[#D4DE95]/20 rounded-[3rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-10 backdrop-blur-xl">
                                <h3 className="text-2xl font-serif text-[#F5F2ED]">Edit Room Inventory</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#D4DE95]/40 hover:text-[#D4DE95] transition-colors"><XCircle size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const formData = new FormData(form);
                                    
                                    formData.append('id', editingRoom?._id || '');
                                    
                                    // Parse units list (name is 'units_string' to avoid conflict)
                                    const rawUnits = formData.get('units_string') as string;
                                    const unitNames = rawUnits.split(',').map(s => s.trim()).filter(Boolean);
                                    
                                    // Re-map units trying to preserve old statuses
                                    const newUnitsArray = unitNames.map(num => {
                                        const existing = editingRoom?.units?.find(u => u.number === num);
                                        return existing || { number: num, status: 'available' };
                                    });
                                    
                                    formData.set('units', JSON.stringify(newUnitsArray));
                                    // Pass current images as JSON so backend knows what to keep
                                    formData.set('current_images', JSON.stringify(editingRoom?.images || []));
                                    formData.set('current_bathroomImages', JSON.stringify(editingRoom?.bathroomImages || []));

                                    updateRoomDetails.mutate(formData);
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Room Designation</label>
                                    <input required name="name" defaultValue={editingRoom?.name} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none font-serif" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Base Nightly Rate ($)</label>
                                        <input required name="price" type="number" defaultValue={editingRoom?.price} className="w-full bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none font-serif" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Floor Level</label>
                                        <input required name="floor" type="number" defaultValue={editingRoom?.floor} className="w-full bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none font-serif" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1 flex justify-between">
                                        <span>Inventory Units (Comma Separated)</span>
                                    </label>
                                    <textarea 
                                        required 
                                        name="units_string" 
                                        rows={2}
                                        defaultValue={editingRoom?.units?.map(u => u.number).join(', ')} 
                                        className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none font-mono text-sm leading-relaxed resize-none" 
                                    />
                                </div>
                                <div className="space-y-6 pt-4 border-t border-white/5">
                                    <h4 className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Visual Assets (Cloudinary Synergy)</h4>
                                    
                                    {/* Main Images */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Bedroom Gallery (Files)</label>
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            {editingRoom?.images?.map((img: string, i: number) => (
                                                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = editingRoom.images.filter((_: any, idx: number) => idx !== i);
                                                            setEditingRoom({ ...editingRoom, images: newImages });
                                                        }}
                                                        className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={16} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl hover:border-[#D4DE95]/40 cursor-pointer transition-all bg-white/[0.02]">
                                                <Plus size={16} className="text-[#D4DE95]/40" />
                                                <input type="file" name="images" multiple accept="image/*" className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Bathroom Images */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Bathroom Ritual Gallery (Files)</label>
                                        <div className="flex flex-wrap gap-3">
                                            {editingRoom?.bathroomImages?.map((img: string, i: number) => (
                                                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = editingRoom.bathroomImages.filter((_: any, idx: number) => idx !== i);
                                                            setEditingRoom({ ...editingRoom, bathroomImages: newImages });
                                                        }}
                                                        className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={16} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl hover:border-[#D4DE95]/40 cursor-pointer transition-all bg-white/[0.02]">
                                                <Plus size={16} className="text-[#D4DE95]/40" />
                                                <input type="file" name="bathroomImages" multiple accept="image/*" className="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl border border-white/5 text-[#D4DE95]/40 hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={updateRoomDetails.isPending} className="px-10 py-5 rounded-xl bg-[#D4DE95] text-[#1A1F16] hover:bg-[#F5F2ED] transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[#D4DE95]/10 flex items-center gap-3">
                                        {updateRoomDetails.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        <span>Deploy Changes</span>
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
