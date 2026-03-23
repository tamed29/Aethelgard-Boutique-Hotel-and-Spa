'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { AdminCard } from '@/components/admin/AdminCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Loader2, Quote, BadgeCheck, User } from 'lucide-react';
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

    const { data: reviews = [], isLoading } = useQuery<Review[]>({
        queryKey: ['admin-reviews'],
        queryFn: async () => {
            const res = await adminAxios.get('/reviews');
            return res.data;
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
                <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Guest Voices</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">Moderate the chronicles of the estate</p>
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
                                        <p className="text-lg font-serif italic text-white/80 leading-relaxed font-light">"{v.comment}"</p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#D4DE95] font-serif">
                                                {v.user?.name[0] || 'A'}
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-[#F5F2ED] font-serif tracking-widest">{v.user?.name || 'Anonymous'}</p>
                                                <p className="text-[8px] uppercase tracking-[0.3em] text-[#D4DE95]/30 font-black">{new Date(v.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { if(confirm('Purge this narrative from the public records?')) deleteReview.mutate(v._id); }}
                                        className="p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all duration-500 border border-rose-500/20"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </AdminCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
