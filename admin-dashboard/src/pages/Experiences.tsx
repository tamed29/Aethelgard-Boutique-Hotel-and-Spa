import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Plus, Trash2, Edit2, Image as ImageIcon, Star, Compass, Wind, Anchor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Experience {
    _id: string;
    title: string;
    description: string;
    category: 'dining' | 'wellness' | 'adventure' | 'ritual';
    imageUrl: string;
    isFeatured: boolean;
}

const categoryIcons = {
    dining: Anchor,
    wellness: Wind,
    adventure: Compass,
    ritual: Star
};

export function Experiences() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const { data: experiences = [], isLoading } = useQuery<Experience[]>({
        queryKey: ['experiences'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/admin/recommendations`, { withCredentials: true });
            return res.data;
        }
    });

    const createExperience = useMutation({
        mutationFn: async (data: Partial<Experience>) => {
            await axios.post(`${API_URL}/admin/recommendations`, data, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
            setIsModalOpen(false);
        }
    });

    const updateExperience = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<Experience> }) => {
            await axios.put(`${API_URL}/admin/recommendations/${id}`, data, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
            setIsModalOpen(false);
        }
    });

    const deleteExperience = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/admin/recommendations/${id}`, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['experiences'] });
        }
    });

    const handleSaveExperience = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            category: formData.get('category') as Experience['category'],
            imageUrl: formData.get('imageUrl') as string,
            isFeatured: formData.get('isFeatured') === 'on'
        };

        if (editingExp) {
            updateExperience.mutate({ id: editingExp._id, data });
        } else {
            createExperience.mutate(data);
        }
    };

    const openAddModal = () => {
        setEditingExp(null);
        setIsModalOpen(true);
    };

    const openEditModal = (exp: Experience) => {
        setEditingExp(exp);
        setIsModalOpen(true);
    };

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-pulse text-sage tracking-[0.4em] uppercase text-xs font-bold">Summoning Experiences...</div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Experiences</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Manage hotel guest experiences</p>
                </div>
                <button onClick={openAddModal} className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-8 py-4 rounded-2xl transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-sage/10 group active:scale-95">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Add Experience</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {experiences.map((exp, i) => {
                        const Icon = categoryIcons[exp.category] || Star;
                        return (
                            <motion.div
                                layout
                                key={exp._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlassCard className="group h-full flex flex-col p-0 overflow-hidden border-white/5 hover:border-sage/20 transition-all duration-500">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-moss-dark/40 z-10" />
                                        {exp.imageUrl ? (
                                            <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-sage/20">
                                                <ImageIcon size={48} strokeWidth={1} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-moss-dark/80 backdrop-blur-md border border-white/10 text-[8px] uppercase tracking-widest font-bold text-sage">
                                                <Icon size={10} />
                                                {exp.category}
                                            </span>
                                        </div>
                                        {exp.isFeatured && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="p-2 rounded-full bg-sage text-moss-dark shadow-xl shadow-sage/20">
                                                    <Star size={12} fill="currentColor" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-serif text-cream mb-3 tracking-wide">{exp.title}</h3>
                                        <p className="text-xs leading-relaxed text-sage/60 mb-8 line-clamp-3 italic">"{exp.description}"</p>
                                        
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                                            <div className="flex gap-2 z-30">
                                                <button onClick={() => openEditModal(exp)} className="p-2.5 rounded-xl hover:bg-white/5 text-sage/40 hover:text-sage transition-all"><Edit2 size={16} /></button>
                                                <button 
                                                    onClick={() => deleteExperience.mutate(exp._id)}
                                                    className="p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400/40 hover:text-rose-400 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="h-1 w-12 bg-sage/20 rounded-full" />
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {experiences.length === 0 && (
                    <div className="lg:col-span-3 py-24 flex flex-col items-center justify-center opacity-20 grayscale scale-90">
                        <Compass size={64} className="text-sage mb-6" />
                        <p className="text-sm font-serif italic tracking-[0.2em] uppercase">The Collection is currently empty...</p>
                    </div>
                )}
            </div>

            {/* Experience Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-2xl bg-[#1A1F16] border border-sage/20 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h3 className="text-2xl font-serif text-cream">
                                    {editingExp ? 'Edit Experience' : 'Add New Experience'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-sage/40 hover:text-sage transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveExperience} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Title</label>
                                        <input required name="title" defaultValue={editingExp?.title} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="e.g. Forest Bathing Ritual" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Description</label>
                                        <textarea required name="description" defaultValue={editingExp?.description} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors resize-none" placeholder="Experience description..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Category</label>
                                            <select required name="category" defaultValue={editingExp?.category || 'wellness'} className="w-full bg-[#1A1F16] border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors [&>option]:bg-[#1A1F16]">
                                                <option value="dining">Dining</option>
                                                <option value="wellness">Wellness</option>
                                                <option value="adventure">Adventure</option>
                                                <option value="ritual">Ritual</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-sage/60 font-black">Image URL</label>
                                            <input name="imageUrl" defaultValue={editingExp?.imageUrl} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream outline-none focus:border-sage/40 transition-colors" placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={editingExp?.isFeatured} className="w-4 h-4 rounded border-sage/20 bg-white/5 text-sage focus:ring-sage focus:ring-offset-0" />
                                        <label htmlFor="isFeatured" className="text-sm text-sage/80 select-none cursor-pointer">Feature this experience prominently</label>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sage hover:bg-white/5 transition-colors font-bold text-sm">Cancel</button>
                                    <button type="submit" disabled={createExperience.isPending || updateExperience.isPending} className="px-6 py-3 rounded-xl bg-sage text-moss-dark hover:bg-white transition-colors font-bold text-sm">
                                        {createExperience.isPending || updateExperience.isPending ? 'Saving...' : 'Confirm'}
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
