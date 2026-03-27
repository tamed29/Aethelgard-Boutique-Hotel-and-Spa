'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { Search, Loader2, Edit2, Check, XCircle, Bath, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';

interface SpaReservation {
    _id: string;
    guestName: string;
    guestEmail: string;
    therapyType: string;
    date: string;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    specialRequests: string;
    price: number;
    referenceNumber?: string;
    paymentStatus?: 'unpaid' | 'paid';
    createdAt: string;
}

export default function SpaManagementPage() {
    const queryClient = useQueryClient();
    const { socket } = useNotifications();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRes, setEditingRes] = useState<SpaReservation | null>(null);

    const { data: reservations = [], isLoading } = useQuery<SpaReservation[]>({
        queryKey: ['spaReservations'],
        queryFn: async () => {
            const res = await adminAxios.get('/spa');
            return res.data;
        }
    });

    const updateReservationData = useMutation({
        mutationFn: async (data: any) => {
            await adminAxios.put(`/spa/${data.id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spaReservations'] });
            setIsModalOpen(false);
            setEditingRes(null);
            toast.success('Thermal Protocol Updated');
        }
    });

    const deleteReservation = useMutation({
        mutationFn: async (id: string) => {
            await adminAxios.delete(`/spa/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spaReservations'] });
            toast.success('Reservation Purged');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    });
    
    useEffect(() => {
        if (!socket) return;
        
        const handleNewSpaBooking = (data: any) => {
            console.log('Incoming Spa Sync:', data);
            queryClient.invalidateQueries({ queryKey: ['spaReservations'] });
        };

        socket.on('newSpaBooking', handleNewSpaBooking);
        return () => { socket.off('newSpaBooking', handleNewSpaBooking); };
    }, [socket, queryClient]);

    const filteredReservations = reservations
        .filter(r => {
            const matchesSearch = r.guestName.toLowerCase().includes(search.toLowerCase()) || 
                                  r.therapyType.toLowerCase().includes(search.toLowerCase()) ||
                                  r._id.toLowerCase().includes(search.toLowerCase()) ||
                                  r.referenceNumber?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'completed': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
            case 'cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-[var(--admin-accent)] opacity-40 bg-[var(--admin-accent)]/5 border-[var(--admin-border)]';
        }
    };

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Thermal Protocols</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Spa & Restoration Engagements</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--admin-accent)] opacity-20" size={18} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Guest Name or Therapy..."
                        className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 pl-16 pr-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light"
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-black uppercase tracking-widest text-[10px] [&>option]:bg-[var(--admin-bg)]"
                >
                    <option value="all">Every State</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full border-collapse text-left min-w-[800px]">
                        <thead className="sticky top-0 bg-[var(--admin-accent)] z-20">
                            <tr>
                                {[
                                    { label: 'Individuation', icon: Bath },
                                    { label: 'Therapy Class', icon: MapPin },
                                    { label: 'Execution Time', icon: Clock },
                                    { label: 'Reference', icon: Check },
                                    { label: 'Rate', icon: Check },
                                    { label: 'Current State', icon: Check }
                                ].map((h, i) => (
                                    <th key={i} className="px-8 py-6 border-b border-[var(--admin-border)]">
                                        <div className="flex items-center gap-3">
                                            <h.icon size={14} className="text-[var(--admin-bg)] opacity-30" />
                                            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-bg)] font-black">{h.label}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--admin-border)]">
                            {filteredReservations.map((r, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={r._id} 
                                    className="group hover:bg-[var(--admin-accent)]/5 transition-colors"
                                >
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[var(--admin-text)] font-serif tracking-wide">{r.guestName}</span>
                                            <span className="text-[9px] text-[var(--admin-accent)] opacity-20 font-black uppercase tracking-widest">{r.guestEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[var(--admin-text)] opacity-80 font-serif text-sm italic">{r.therapyType}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-[var(--admin-text)] opacity-60 font-mono tracking-tighter">{new Date(r.date).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-[var(--admin-accent)] opacity-60 font-mono tracking-tighter">{r.timeSlot}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            {r.referenceNumber ? (
                                                <span className="text-[10px] font-mono text-[var(--admin-accent)] tracking-widest font-bold">{r.referenceNumber}</span>
                                            ) : <span className="text-[9px] opacity-20 italic">—</span>}
                                            {r.paymentStatus === 'paid' && (
                                                <span className="text-[8px] uppercase tracking-widest text-emerald-400 font-black">✓ Paid</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[var(--admin-accent)] font-serif text-lg font-bold">
                                            {r.price ? `£${r.price.toLocaleString()}` : <span className="text-xs opacity-30 italic">Not set</span>}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                getStatusColor(r.status)
                                            )}>
                                                {r.status}
                                            </span>
                                            <button 
                                                onClick={() => { setEditingRes(r); setIsModalOpen(true); }}
                                                className="p-3 bg-[var(--admin-accent)]/5 hover:bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] opacity-40 hover:opacity-100 rounded-xl transition-all border border-[var(--admin-border)]"
                                                title="Edit Reservation"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            {['completed', 'cancelled'].includes(r.status) && (
                                                <button 
                                                    onClick={() => { if(confirm('Purge this completed record?')) deleteReservation.mutate(r._id); }}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="p-8 border-b border-[var(--admin-border)] flex justify-between items-center bg-[var(--admin-accent)]/5 sticky top-0 z-10 backdrop-blur-xl">
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">Edit Thermal Protocol</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-colors"><XCircle size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target as HTMLFormElement);
                                    updateReservationData.mutate({
                                        id: editingRes?._id,
                                        guestName: formData.get('guestName'),
                                        guestEmail: formData.get('guestEmail'),
                                        therapyType: formData.get('therapyType'),
                                        timeSlot: formData.get('timeSlot'),
                                        status: formData.get('status'),
                                        date: formData.get('date'),
                                        price: Number(formData.get('price')) || 0,
                                    });
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Guest Name</label>
                                        <input required name="guestName" defaultValue={editingRes?.guestName} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Email</label>
                                        <input required name="guestEmail" type="email" defaultValue={editingRes?.guestEmail} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Therapy Mode</label>
                                        <select name="therapyType" defaultValue={editingRes?.therapyType} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none cursor-pointer">
                                            <option value="Forest Ritual">Forest Ritual</option>
                                            <option value="River Stone Massage">River Stone Massage</option>
                                            <option value="Nordic Sauna Journey">Nordic Sauna Journey</option>
                                            <option value="Royal Radiance Facial">Royal Radiance Facial</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Time Slot</label>
                                        <input required name="timeSlot" defaultValue={editingRes?.timeSlot} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Execution Date</label>
                                        <input required name="date" type="date" defaultValue={editingRes?.date ? new Date(editingRes.date).toISOString().split('T')[0] : ''} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none [color-scheme:dark]" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Rate (£)</label>
                                        <input name="price" type="number" min="0" step="1" defaultValue={(editingRes as any)?.price || ''} placeholder="e.g. 220" className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Status</label>
                                        <select name="status" defaultValue={editingRes?.status} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none cursor-pointer">
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="pt-6 flex justify-end gap-4 border-t border-[var(--admin-border)]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl border border-[var(--admin-border)] text-[var(--admin-accent)] opacity-40 hover:bg-[var(--admin-accent)]/5 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={updateReservationData.isPending} className="px-10 py-5 rounded-xl bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[var(--admin-accent)]/10 flex items-center gap-3">
                                        {updateReservationData.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
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
