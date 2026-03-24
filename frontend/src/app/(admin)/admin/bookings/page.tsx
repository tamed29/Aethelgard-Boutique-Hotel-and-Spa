'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { 
    Search, 
    Filter, 
    Calendar, 
    User, 
    CreditCard, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Loader2, 
    MoreHorizontal,
    ArrowUpDown,
    Download,
    Mail,
    Phone,
    MapPin,
    Activity,
    ShieldCheck,
    Edit2,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface Booking {
    _id: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomNumber: string;
    room?: any;
    assignedUnit?: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'checked-in' | 'checked-out';
    addons: string[];
    createdAt: string;
}

export default function ReservationHubPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const { data: bookings = [], isLoading: isBookingsLoading } = useQuery<Booking[]>({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await adminAxios.get('/bookings');
            return res.data;
        }
    });

    const { data: roomsInventory = [] } = useQuery<any[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await adminAxios.get('/rooms');
            return res.data;
        }
    });

    const isLoading = isBookingsLoading;

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            await adminAxios.put(`/bookings/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('System State Updated');
        }
    });

    const updateBookingData = useMutation({
        mutationFn: async (data: any) => {
            await adminAxios.put(`/bookings/${data.id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            setIsModalOpen(false);
            setEditingBooking(null);
            toast.success('Booking Overwritten');
        }
    });

    useEffect(() => {
        const socket = io(SOCKET_URL);
        socket.on('newBooking', () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        });
        return () => { socket.disconnect(); };
    }, [queryClient]);

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const roomName = b.room?.name || b.roomNumber || '';
            const matchesSearch = b.guestName.toLowerCase().includes(search.toLowerCase()) || 
                                 roomName.toLowerCase().includes(search.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' 
                ? true 
                : statusFilter === 'pending-assignment'
                    ? b.assignedUnit === 'Pending Assignment' || !b.assignedUnit
                    : b.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, search, statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'checked-in': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
            case 'checked-out': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'cancelled': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-[#D4DE95]/40 bg-white/5 border-white/10';
        }
    };

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Reservation Hub</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">Unified Stays & Spa Manifest</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-5 bg-white/[0.03] border border-white/5 text-[#D4DE95]/40 hover:text-[#D4DE95] rounded-2xl transition-all">
                        <Download size={20} />
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4DE95]/20" size={18} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Guest Name or Destination..."
                        className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 pl-16 pr-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-light"
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-black uppercase tracking-widest text-[10px] [&>option]:bg-[#1A1F16]"
                >
                    <option value="all">Every Status</option>
                    <option value="pending-assignment text-moss-200">Pending Assignment</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* High-Performance Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 bg-[#3D4127] z-20">
                            <tr>
                                {[
                                    { label: 'Guest Identity', icon: User },
                                    { label: 'Destination', icon: MapPin },
                                    { label: 'Timeline', icon: Calendar },
                                    { label: 'Investment', icon: CreditCard },
                                    { label: 'Current State', icon: Activity },
                                    { label: 'Protocol', icon: ShieldCheck }
                                ].map((h, i) => (
                                    <th key={i} className="px-8 py-6 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <h.icon size={14} className="text-[#D4DE95]/20" />
                                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/60 font-black">{h.label}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredBookings.map((b, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={b._id} 
                                    className="group hover:bg-white/[0.03] transition-colors"
                                >
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[#F5F2ED] font-serif tracking-wide">{b.guestName}</span>
                                            <span className="text-[9px] text-[#D4DE95]/20 font-black uppercase tracking-widest">{b.guestEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black tracking-widest text-[#D4DE95]/60 uppercase">
                                            {b.room?.name || b.roomNumber} | {b.assignedUnit || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-[#F5F2ED]/60 font-mono tracking-tighter">IN: {new Date(b.checkIn).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-[#F5F2ED]/40 font-mono tracking-tighter">OUT: {new Date(b.checkOut).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[#F5F2ED] font-serif">${b.totalPrice.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={cn(
                                            "inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusColor(b.status)
                                        )}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => { setEditingBooking(b); setIsModalOpen(true); }}
                                                className="p-3 bg-white/5 hover:bg-white/20 text-[#D4DE95]/40 hover:text-white rounded-xl transition-all border border-white/5"
                                                title="Edit Booking"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            {b.status === 'confirmed' && (
                                                <button 
                                                    onClick={() => updateStatus.mutate({ id: b._id, status: 'checked-in' })}
                                                    className="p-3 bg-white/5 hover:bg-sky-500/20 text-[#D4DE95]/40 hover:text-sky-400 rounded-xl transition-all border border-white/5"
                                                    title="Check In"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                            )}
                                            {b.status === 'checked-in' && (
                                                <button 
                                                    onClick={() => updateStatus.mutate({ id: b._id, status: 'checked-out' })}
                                                    className="p-3 bg-white/5 hover:bg-amber-500/20 text-[#D4DE95]/40 hover:text-amber-400 rounded-xl transition-all border border-white/5"
                                                    title="Check Out"
                                                >
                                                    <Loader2 size={14} />
                                                </button>
                                            )}
                                            {b.status !== 'cancelled' && b.status !== 'checked-out' && (
                                                <button 
                                                    onClick={() => { if(confirm('Terminate and refund this reservation?')) updateStatus.mutate({ id: b._id, status: 'cancelled' }); }}
                                                    className="p-3 bg-white/5 hover:bg-rose-500/20 text-[#D4DE95]/40 hover:text-rose-400 rounded-xl transition-all border border-white/5"
                                                    title="Cancel & Refund"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            )}
                                            <button className="p-3 bg-white/5 hover:bg-white/10 text-[#D4DE95]/20 hover:text-[#D4DE95] rounded-xl transition-all border border-white/5">
                                                <Mail size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/20 font-black">
                        Displaying {filteredBookings.length} Active Node Records
                    </p>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(p => (
                            <button key={p} className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                                p === 1 ? "bg-[#D4DE95] text-[#1A1F16]" : "bg-white/5 text-[#D4DE95]/40 hover:bg-white/10"
                            )}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-[#3D4127] border border-[#D4DE95]/20 rounded-[3rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-10 backdrop-blur-xl">
                                <h3 className="text-2xl font-serif text-[#F5F2ED]">Edit Manifest Entry</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#D4DE95]/40 hover:text-[#D4DE95] transition-colors"><XCircle size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target as HTMLFormElement);
                                    updateBookingData.mutate({
                                        id: editingBooking?._id,
                                        guestName: formData.get('guestName'),
                                        guestEmail: formData.get('guestEmail'),
                                        roomNumber: formData.get('roomNumber'),
                                        assignedUnit: formData.get('assignedUnit'),
                                        totalPrice: Number(formData.get('totalPrice')),
                                        status: formData.get('status'),
                                        checkIn: formData.get('checkIn'),
                                        checkOut: formData.get('checkOut'),
                                    });
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Guest Name</label>
                                        <input required name="guestName" defaultValue={editingBooking?.guestName} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Email</label>
                                        <input required name="guestEmail" type="email" defaultValue={editingBooking?.guestEmail} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Room Type</label>
                                        <input required name="roomNumber" defaultValue={editingBooking?.room?.name || editingBooking?.roomNumber} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none" readOnly />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Assigned Unit</label>
                                        <select 
                                            required 
                                            name="assignedUnit" 
                                            defaultValue={editingBooking?.assignedUnit || 'Pending Assignment'} 
                                            className="w-full bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none cursor-pointer"
                                        >
                                            <option value="Pending Assignment">Pending Assignment</option>
                                            {roomsInventory
                                                .filter(r => {
                                                    if (editingBooking?.room?.roomType) return r.roomType === editingBooking.room.roomType;
                                                    if (editingBooking?.roomNumber) {
                                                        const rb = editingBooking.roomNumber.toLowerCase();
                                                        return r.roomType.toLowerCase() === rb || 
                                                               r.name.toLowerCase() === rb || 
                                                               r.units.some((u: any) => u.number.toLowerCase() === rb);
                                                    }
                                                    return true; // fallback to all if no info
                                                })
                                                .flatMap(r => r.units)
                                                .map(unit => {
                                                    const isCurrentlyAssigned = editingBooking?.assignedUnit === unit.number;
                                                    const isAvailable = unit.status === 'available' || isCurrentlyAssigned;
                                                    
                                                    return (
                                                        <option 
                                                            key={unit.number} 
                                                            value={unit.number}
                                                            disabled={!isAvailable}
                                                            className={!isAvailable ? 'opacity-50 text-white/20' : ''}
                                                        >
                                                            {unit.number} ({unit.status === 'available' ? 'Available' : isCurrentlyAssigned ? 'Active Assignment' : unit.status})
                                                        </option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Total Price ($)</label>
                                        <input required name="totalPrice" type="number" defaultValue={editingBooking?.totalPrice} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Check In</label>
                                        <input required name="checkIn" type="date" defaultValue={editingBooking?.checkIn ? new Date(editingBooking.checkIn).toISOString().split('T')[0] : ''} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Check Out</label>
                                        <input required name="checkOut" type="date" defaultValue={editingBooking?.checkOut ? new Date(editingBooking.checkOut).toISOString().split('T')[0] : ''} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-3 col-span-2">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Status</label>
                                        <select name="status" defaultValue={editingBooking?.status} className="w-full bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none cursor-pointer">
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="checked-in">Checked In</option>
                                            <option value="checked-out">Checked Out</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl border border-white/5 text-[#D4DE95]/40 hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={updateBookingData.isPending} className="px-10 py-5 rounded-xl bg-[#D4DE95] text-[#1A1F16] hover:bg-[#F5F2ED] transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[#D4DE95]/10 flex items-center gap-3">
                                        {updateBookingData.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        <span>Transmit</span>
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

