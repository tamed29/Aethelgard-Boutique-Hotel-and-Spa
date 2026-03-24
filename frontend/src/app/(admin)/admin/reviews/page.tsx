'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { AdminCard } from '@/components/admin/AdminCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Loader2, Quote, BadgeCheck, User, Edit2, XCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
    _id: string;
    user: { name: string } | null;
    rating: number;
    comment: string;
    isVerifiedStay: boolean;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const queryClient = useQueryClient();
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const { data: reviews = [], isLoading } = useQuery<Review[]>({
        queryKey: ['admin-reviews'],
        queryFn: async () => {
            const res = await adminAxios.get('/reviews');
            return res.data;
        }
    });

    const updateReview = useMutation({
        mutationFn: async ({ id, rating, comment }: { id: string, rating: number, comment: string }) => {
            await adminAxios.put(`/reviews/${id}`, { rating, comment });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
            setEditingReview(null);
            toast.success('Narrative updated in the archives.');
        }
    });

    const deleteReview = useMutation({
        mutationFn: async (id: string) => {
            await adminAxios.delete(`/reviews/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
            toast.success('Narrative purged from archives.');
        }
    });

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Guest Voices</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Moderate the chronicles of the estate</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {reviews.map((v, i) => (
                        <motion.div
                            key={v._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <AdminCard className="group">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                {[...Array(5)].map((_, starIndex) => (
                                                    <Star key={starIndex} size={14} className={starIndex < v.rating ? 'fill-current' : 'opacity-20'} />
                                                ))}
                                            </div>
                                            {v.isVerifiedStay && (
                                                <span className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-emerald-400/60 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                                    <BadgeCheck size={10} /> Verified Resident
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-lg font-serif italic text-[var(--admin-text)] opacity-80 leading-relaxed font-light">"{v.comment}"</p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--admin-border)]">
                                            <div className="w-10 h-10 rounded-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-accent)] font-serif">
                                                {v.user?.name?.[0] || 'G'}
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-[var(--admin-text)] font-serif tracking-widest">{v.user?.name || 'Guest Resident'}</p>
                                                <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--admin-accent)] opacity-30 font-black">{new Date(v.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex md:flex-col gap-2">
                                        <button 
                                            onClick={() => setEditingReview(v)}
                                            className="p-4 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-2xl transition-all duration-500 border border-blue-500/20"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button 
                                            onClick={() => { if(confirm('Purge this narrative from the public records?')) deleteReview.mutate(v._id); }}
                                            className="p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all duration-500 border border-rose-500/20"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </AdminCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingReview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[3rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-[var(--admin-border)] flex justify-between items-center bg-[var(--admin-accent)]/5 backdrop-blur-xl">
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">Edit Guest Voice</h3>
                                <button onClick={() => setEditingReview(null)} className="p-2 text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-colors"><XCircle size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target as HTMLFormElement);
                                    updateReview.mutate({
                                        id: editingReview._id,
                                        rating: Number(formData.get('rating')),
                                        comment: formData.get('comment') as string
                                    });
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Rating</label>
                                    <select name="rating" defaultValue={editingReview.rating} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none [&>option]:bg-[var(--admin-bg)]">
                                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Narrative Content</label>
                                    <textarea required name="comment" rows={4} defaultValue={editingReview.comment} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none font-light italic leading-relaxed" />
                                </div>
                                <div className="pt-6 flex justify-end gap-4 border-t border-[var(--admin-border)]">
                                    <button type="button" onClick={() => setEditingReview(null)} className="px-8 py-4 rounded-xl border border-[var(--admin-border)] text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={updateReview.isPending} className="px-10 py-5 rounded-xl bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[var(--admin-accent)]/10 flex items-center gap-3">
                                        {updateReview.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        <span>Deploy Update</span>
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
