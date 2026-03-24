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
        mutationFn: async (formData: FormData) => {
            if (editingItem) {
                await adminAxios.put(`/news/${editingItem._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await adminAxios.post('/news', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || 'http://localhost:5000';
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanUrl}`;
    };

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Operations Log</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Estate News & Event Dispatches</p>
                </div>
                <button 
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="bg-[var(--admin-accent)] hover:opacity-90 text-[var(--admin-bg)] font-black px-10 py-5 rounded-2xl transition-all duration-700 flex items-center gap-4 shadow-xl shadow-[var(--admin-accent)]/10 uppercase tracking-[0.4em] text-[11px]"
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
                            className="bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-[2rem] overflow-hidden group hover:border-[var(--admin-accent)]/20 flex flex-col"
                        >
                            <div className="h-48 w-full relative overflow-hidden">
                                <img src={getImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-[var(--admin-bg)]/80 backdrop-blur-md border border-[var(--admin-border)] text-[var(--admin-text)] px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center gap-2">
                                        {item.type === 'event' ? <Calendar size={12} className="text-[var(--admin-accent)]" /> : <Newspaper size={12} className="text-[var(--admin-accent)]" />}
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-[var(--admin-accent)] opacity-60 text-[10px] uppercase tracking-[0.3em] font-black mb-2">
                                    {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                                <h3 className="text-xl font-serif text-[var(--admin-text)] mb-3 leading-tight">{item.title}</h3>
                                <p className="text-[var(--admin-text)] opacity-40 text-sm line-clamp-3 mb-6 flex-1">{item.content}</p>
                                
                                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
                                    <button 
                                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                        className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-colors"
                                    >
                                        <Edit2 size={16} strokeWidth={2.5} />
                                    </button>
                                    <button 
                                        onClick={() => { if(confirm('Purge this dispatch?')) deleteItem.mutate(item._id); }}
                                        className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors"
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
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="p-8 border-b border-[var(--admin-border)] flex justify-between items-center bg-[var(--admin-accent)]/5 sticky top-0 z-10 backdrop-blur-xl">
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">{editingItem ? 'Update Dispatch' : 'New Dispatch'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-colors"><X size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target as HTMLFormElement);
                                    saveItem.mutate(formData);
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Title</label>
                                    <input required name="title" defaultValue={editingItem?.title} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light" placeholder="Headline..." />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Type</label>
                                        <select name="type" defaultValue={editingItem?.type || 'news'} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light [&>option]:bg-[var(--admin-bg)]">
                                            <option value="news">News Update</option>
                                            <option value="event">Upcoming Event</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Date</label>
                                        <input required type="date" name="date" defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-4 flex items-center px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light [color-scheme:dark]" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Dispatch Banner Image</label>
                                    <input type="file" name="image" accept="image/*" className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light" />
                                    {editingItem?.imageUrl && (
                                        <p className="text-[8px] uppercase tracking-widest text-[var(--admin-accent)] opacity-30 ml-1">Current assets recorded in transmission cluster</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Content</label>
                                    <textarea required name="content" defaultValue={editingItem?.content} rows={5} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light resize-none" placeholder="Detailed description..." />
                                </div>
                                <div className="pt-6 flex justify-end gap-4 border-t border-[var(--admin-border)]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl border border-[var(--admin-border)] text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={saveItem.isPending} className="px-10 py-5 rounded-xl bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[var(--admin-accent)]/10 flex items-center gap-3">
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
