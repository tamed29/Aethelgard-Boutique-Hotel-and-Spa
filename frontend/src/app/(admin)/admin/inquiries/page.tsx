'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { AdminCard } from '@/components/admin/AdminCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Loader2, User, Clock, MessageSquare, Phone, AtSign } from 'lucide-react';
import { toast } from 'sonner';

interface Inquiry {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function CommunicationHubPage() {
    const queryClient = useQueryClient();

    const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
        queryKey: ['admin-inquiries'],
        queryFn: async () => {
            const res = await adminAxios.get('/inquiries');
            return res.data;
        }
    });

    const deleteInquiry = useMutation({
        mutationFn: async (id: string) => {
            await adminAxios.delete(`/inquiries/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
            toast.success('Inquiry removed from terminal.');
        }
    });

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Communication Hub</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Guest Inquiries & Transmission Log</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {inquiries.length > 0 ? (
                        inquiries.map((inq, i) => (
                            <motion.div
                                key={inq._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AdminCard className="group relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[var(--admin-accent)]/10 flex items-center justify-center text-[var(--admin-accent)] border border-[var(--admin-border)]">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-serif text-[var(--admin-text)]">{inq.firstName} {inq.lastName}</h3>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[var(--admin-accent)] opacity-40 font-black">
                                                                <AtSign size={10} /> {inq.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-[var(--admin-accent)] opacity-20 font-black bg-[var(--admin-accent)]/5 px-4 py-2 rounded-full border border-[var(--admin-border)]">
                                                    <Clock size={10} /> {new Date(inq.createdAt).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="inline-block px-4 py-1.5 bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-lg">
                                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--admin-accent)] font-black">Subject: {inq.subject}</span>
                                                </div>
                                                <p className="text-lg font-serif italic text-[var(--admin-text)] opacity-80 leading-relaxed font-light pl-6 border-l-2 border-[var(--admin-border)]">
                                                    "{inq.message}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 pt-6 border-t border-[var(--admin-border)]">
                                                <button 
                                                    onClick={() => window.location.href = `mailto:${inq.email}?subject=Re: ${inq.subject}`}
                                                    className="flex items-center gap-2 px-6 py-3 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-xl text-[10px] uppercase tracking-widest font-black hover:opacity-90 transition-all duration-500"
                                                >
                                                    <Mail size={14} /> Respond via Email
                                                </button>
                                                <button 
                                                    onClick={() => { if(confirm('Purge this transmission from the logs?')) deleteInquiry.mutate(inq._id); }}
                                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all duration-500 border border-rose-500/20"
                                                    title="Delete Inquiry"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </AdminCard>
                            </motion.div>
                        ))
                    ) : (
                        <div className="h-[40vh] border-2 border-dashed border-[var(--admin-border)] rounded-[3rem] flex flex-col items-center justify-center text-[var(--admin-accent)] opacity-20 gap-4">
                            <MessageSquare size={48} strokeWidth={1} />
                            <p className="text-[10px] uppercase tracking-[0.5em] font-black italic">No transmissions recorded in the current cycle</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
