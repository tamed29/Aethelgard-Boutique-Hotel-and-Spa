'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { Plus, X, Loader2, Edit2, Trash2, Check, Calendar, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface NewsItem {
    _id: string;
    title: string;
    content: string;
    date: string;
    imageUrl: string;
    type: 'news' | 'event';
    createdAt: string;
}

export default function NewsManagementPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    const { data: items = [], isLoading } = useQuery<NewsItem[]>({
        queryKey: ['news'],
        queryFn: async () => {
            const res = await adminAxios.get('/news');
            return res.data;
        }
    });

    const saveItem = useMutation({
        mutationFn: async (data: Partial<NewsItem>) => {
            if (editingItem) {
                await adminAxios.put(`/news/${editingItem._id}`, data);
            } else {
                await adminAxios.post('/news', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            setIsModalOpen(false);
            setEditingItem(null);
            toast.success('Dispatch successful.');
        }
    });

    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            await adminAxios.delete(`/news/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            toast.error('Dispatch purged.');
        }
    });

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Operations Log</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">Estate News & Event Dispatches</p>
                </div>
                <button 
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="bg-[#D4DE95] hover:bg-[#F5F2ED] text-[#1A1F16] font-black px-10 py-5 rounded-2xl transition-all duration-700 flex items-center gap-4 shadow-xl shadow-[#D4DE95]/10 uppercase tracking-[0.4em] text-[11px]"
                >
                    <Plus size={18} />
                    <span>New Dispatch</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {items.map((item, i) => (
                        <motion.div 
                            key={item._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-[#D4DE95]/20 flex flex-col"
                        >
                            <div className="h-48 w-full relative overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-[#1A1F16]/80 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center gap-2">
                                        {item.type === 'event' ? <Calendar size={12} className="text-[#D4DE95]" /> : <Newspaper size={12} className="text-[#D4DE95]" />}
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-[#D4DE95]/60 text-[10px] uppercase tracking-[0.3em] font-black mb-2">
                                    {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                                <h3 className="text-xl font-serif text-[#F5F2ED] mb-3 leading-tight">{item.title}</h3>
                                <p className="text-white/40 text-sm line-clamp-3 mb-6 flex-1">{item.content}</p>
                                
                                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                        className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-colors"
                                    >
                                        <Edit2 size={16} strokeWidth={2.5} />
                                    </button>
                                    <button 
                                        onClick={() => { if(confirm('Purge this dispatch?')) deleteItem.mutate(item._id); }}
                                        className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-[#3D4127] border border-[#D4DE95]/20 rounded-[3rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-10 backdrop-blur-xl">
                                <h3 className="text-2xl font-serif text-[#F5F2ED]">{editingItem ? 'Update Dispatch' : 'New Dispatch'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#D4DE95]/40 hover:text-[#D4DE95] transition-colors"><X size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target as HTMLFormElement);
                                    saveItem.mutate({
                                        title: formData.get('title') as string,
                                        content: formData.get('content') as string,
                                        imageUrl: formData.get('imageUrl') as string,
                                        date: formData.get('date') as string,
                                        type: formData.get('type') as any
                                    });
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Title</label>
                                    <input required name="title" defaultValue={editingItem?.title} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-light" placeholder="Headline..." />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Type</label>
                                        <select name="type" defaultValue={editingItem?.type || 'news'} className="w-full bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-light [&>option]:bg-[#1A1F16]">
                                            <option value="news">News Update</option>
                                            <option value="event">Upcoming Event</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Date</label>
                                        <input required type="date" name="date" defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full bg-[#1A1F16] border border-[#D4DE95]/10 rounded-2xl py-4 flex items-center px-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-light [color-scheme:dark]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Image URL</label>
                                    <input required name="imageUrl" defaultValue={editingItem?.imageUrl} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-light" placeholder="https://..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black ml-1">Content</label>
                                    <textarea required name="content" defaultValue={editingItem?.content} rows={5} className="w-full bg-white/[0.03] border border-[#D4DE95]/10 rounded-2xl py-5 px-6 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 transition-all font-light resize-none" placeholder="Detailed description..." />
                                </div>
                                <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl border border-white/5 text-[#D4DE95]/40 hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={saveItem.isPending} className="px-10 py-5 rounded-xl bg-[#D4DE95] text-[#1A1F16] hover:bg-[#F5F2ED] transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[#D4DE95]/10 flex items-center gap-3">
                                        {saveItem.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
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
