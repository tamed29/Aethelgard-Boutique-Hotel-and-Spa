'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { 
    Image as ImageIcon, 
    Plus, 
    X, 
    Loader2, 
    Upload, 
    Maximize2,
    Filter,
    Trash2,
    Check,
    Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';

interface GalleryItem {
    _id: string;
    url: string;
    alt: string;
    category: string;
    size: 'square' | 'wide' | 'tall';
}

export default function MediaLibraryPage() {
    const queryClient = useQueryClient();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [filter, setFilter] = useState('all');
    
    // New states for multi-upload
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [bulkCategory, setBulkCategory] = useState('rooms');
    const [applyToAll, setApplyToAll] = useState(true);
    const [individualCategories, setIndividualCategories] = useState<Record<number, string>>({});

    const { data: items = [], isLoading } = useQuery<GalleryItem[]>({
        queryKey: ['gallery'],
        queryFn: async () => {
            const res = await adminAxios.get('/gallery');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    const addItem = useMutation({
        mutationFn: async (formData: FormData) => {
            await adminAxios.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
            setIsUploadOpen(false);
            setSelectedFiles([]);
            setIndividualCategories({});
            toast.success('Assets ingested successfully.');
        }
    });

    const editItem = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<GalleryItem> }) => {
            await adminAxios.put(`/gallery/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
            setEditingItem(null);
            toast.success('Asset updated successfully.');
        }
    });

    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            await adminAxios.delete(`/gallery/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
            toast.error('Asset purged from library.');
        }
    });

    const filteredItems = items.filter(i => filter === 'all' || i.category === filter);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // Fallback for legacy local uploads if any
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || 'http://localhost:5000';
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanUrl}`;
    };

    if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" size={32} /></div>;

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Media Library</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Visual Asset Ingestion & Management</p>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-[var(--admin-accent)] hover:opacity-90 text-[var(--admin-bg)] font-black px-10 py-5 rounded-2xl transition-all duration-700 flex items-center gap-4 shadow-xl shadow-[var(--admin-accent)]/10 uppercase tracking-[0.4em] text-[11px]"
                >
                    <Upload size={18} />
                    <span>Upload Asset</span>
                </button>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--admin-border)]">
                {['all', 'rooms', 'spa', 'dining', 'pool', 'outdoors', 'heritage'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black border transition-all duration-500",
                            filter === cat 
                                ? "bg-[var(--admin-accent)] text-[var(--admin-bg)] border-[var(--admin-accent)]" 
                                : "bg-[var(--admin-accent)]/5 text-[var(--admin-accent)] opacity-40 border-[var(--admin-border)] hover:border-[var(--admin-accent)]/20 hover:opacity-100"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <AnimatePresence>
                    {filteredItems.map((item, i) => (
                        <motion.div 
                            key={item._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.03 }}
                            className="relative group aspect-square rounded-[2rem] overflow-hidden border border-[var(--admin-border)] bg-[var(--admin-accent)]/5"
                        >
                            <img 
                                src={getImageUrl(item.url)} 
                                alt={item.alt} 
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            
                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm" />
                            
                            {/* Blue Edit Button */}
                            <button 
                                onClick={() => setEditingItem(item)}
                                className="absolute top-4 right-16 p-3 bg-blue-500 text-white rounded-xl shadow-xl shadow-blue-500/20 translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 delay-75"
                            >
                                <Edit2 size={16} strokeWidth={3} />
                            </button>

                            {/* Red X Delete Button */}
                            <button 
                                onClick={() => { if(confirm('Purge this asset from the library?')) deleteItem.mutate(item._id); }}
                                className="absolute top-4 right-4 p-3 bg-rose-500 text-white rounded-xl shadow-xl shadow-rose-500/20 translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 z-10">
                                <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--admin-accent)] font-black bg-[var(--admin-bg)]/80 px-4 py-2 rounded-full border border-[var(--admin-border)] backdrop-blur-md">
                                    {item.category}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-xl max-h-[90vh] bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[3rem] shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-[var(--admin-border)] flex justify-between items-center bg-[var(--admin-accent)]/5 flex-shrink-0">
                            <h3 className="text-2xl font-serif text-[var(--admin-text)]">Ingest Media Assets</h3>
                            <button onClick={() => { setIsUploadOpen(false); setSelectedFiles([]); }} className="p-2 text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-colors"><X size={24} /></button>
                        </div>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData();
                                
                                selectedFiles.forEach((file, index) => {
                                    formData.append('images', file);
                                    const cat = applyToAll ? bulkCategory : (individualCategories[index] || bulkCategory);
                                    formData.append('category', cat);
                                    formData.append('alt', file.name.split('.')[0]); // Default alt to filename
                                    formData.append('size', 'square'); // Default size
                                });

                                addItem.mutate(formData);
                            }} 
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Asset Image Files</label>
                                    <div 
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className="w-full aspect-video bg-[var(--admin-accent)]/5 border-2 border-dashed border-[var(--admin-border)] rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[var(--admin-accent)]/10 hover:border-[var(--admin-accent)]/30 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-[var(--admin-bg)] flex items-center justify-center text-[var(--admin-accent)] border border-[var(--admin-border)] group-hover:scale-110 transition-transform">
                                            <Plus size={32} />
                                        </div>
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Select Multiple Files</p>
                                        <input 
                                            id="file-upload"
                                            hidden
                                            required={selectedFiles.length === 0} 
                                            type="file" 
                                            multiple
                                            accept="image/*" 
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setSelectedFiles(Array.from(e.target.files));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2 bg-[var(--admin-accent)]/5 p-4 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${applyToAll ? 'bg-[var(--admin-accent)]' : 'bg-[var(--admin-accent)]/10'}`} onClick={() => setApplyToAll(!applyToAll)}>
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${applyToAll ? 'left-5' : 'left-1'}`} />
                                                </div>
                                                <span className="text-[9px] uppercase tracking-widest font-black text-[var(--admin-text)] opacity-60">Apply category to all</span>
                                            </div>
                                            {applyToAll && (
                                                <select 
                                                    value={bulkCategory}
                                                    onChange={(e) => setBulkCategory(e.target.value)}
                                                    className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl py-2 px-4 text-[10px] text-[var(--admin-text)] outline-none [&>option]:bg-[var(--admin-bg)] [&>option]:text-[var(--admin-text)]"
                                                >
                                                    <option value="rooms">Rooms</option>
                                                    <option value="spa">Spa</option>
                                                    <option value="dining">Dining</option>
                                                    <option value="pool">Pool</option>
                                                    <option value="outdoors">Outdoors</option>
                                                    <option value="heritage">Heritage</option>
                                                </select>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {selectedFiles.map((file, i) => (
                                                <div key={i} className="flex items-center gap-4 bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] p-3 rounded-2xl">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] text-[var(--admin-text)] opacity-40 truncate">{file.name}</p>
                                                    </div>
                                                    {!applyToAll && (
                                                        <select 
                                                            value={individualCategories[i] || bulkCategory}
                                                            onChange={(e) => setIndividualCategories(prev => ({ ...prev, [i]: e.target.value }))}
                                                            className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg py-1.5 px-3 text-[9px] text-[var(--admin-text)] outline-none [&>option]:bg-[var(--admin-bg)] [&>option]:text-[var(--admin-text)]"
                                                        >
                                                            <option value="rooms">Rooms</option>
                                                            <option value="spa">Spa</option>
                                                            <option value="dining">Dining</option>
                                                            <option value="pool">Pool</option>
                                                            <option value="outdoors">Outdoors</option>
                                                            <option value="heritage">Heritage</option>
                                                        </select>
                                                    )}
                                                    <button 
                                                        type="button"
                                                        onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-[var(--admin-accent)]/5 border-t border-[var(--admin-border)] flex justify-end gap-4 flex-shrink-0">
                                <button type="button" onClick={() => { setIsUploadOpen(false); setSelectedFiles([]); }} className="px-8 py-4 rounded-xl border border-[var(--admin-border)] text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                <button type="submit" disabled={addItem.isPending || selectedFiles.length === 0} className="px-10 py-5 rounded-xl bg-[var(--admin-accent)] text-[var(--admin-bg)] hover:opacity-90 transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-[var(--admin-accent)]/10 flex items-center gap-3">
                                    {addItem.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                    <span>Commit {selectedFiles.length} Assets</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[3rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-[var(--admin-border)] flex justify-between items-center bg-[var(--admin-accent)]/5">
                                <h3 className="text-2xl font-serif text-[var(--admin-text)]">Update Media Asset</h3>
                                <button onClick={() => setEditingItem(null)} className="p-2 text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-colors"><X size={24} /></button>
                            </div>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target as HTMLFormElement);
                                    editItem.mutate({
                                        id: editingItem._id,
                                        data: {
                                            url: formData.get('url') as string,
                                            alt: formData.get('alt') as string,
                                            category: formData.get('category') as string,
                                            size: formData.get('size') as any
                                        }
                                    });
                                }} 
                                className="p-10 space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Asset URL</label>
                                    <input required name="url" defaultValue={editingItem.url} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light" placeholder="https://source.unsplash.com/..." />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Category</label>
                                        <select name="category" defaultValue={editingItem.category} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light [&>option]:bg-[var(--admin-bg)]">
                                            <option value="rooms">Rooms</option>
                                            <option value="spa">Spa</option>
                                            <option value="dining">Dining</option>
                                            <option value="pool">Pool</option>
                                            <option value="outdoors">Outdoors</option>
                                            <option value="heritage">Heritage</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Layout Size</label>
                                        <select name="size" defaultValue={editingItem.size} className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light [&>option]:bg-[var(--admin-bg)]">
                                            <option value="square">Square</option>
                                            <option value="wide">Wide Horizon</option>
                                            <option value="tall">Tall Portrait</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black ml-1">Description (Alt)</label>
                                    <input name="alt" defaultValue={editingItem.alt} className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-5 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light" placeholder="e.g. Cinematic view of the lobby" />
                                </div>
                                <div className="pt-6 flex justify-end gap-4 border-t border-[var(--admin-border)]">
                                    <button type="button" onClick={() => setEditingItem(null)} className="px-8 py-4 rounded-xl border border-[var(--admin-border)] text-[var(--admin-accent)] opacity-40 hover:opacity-100 transition-all text-[10px] uppercase tracking-[0.4em] font-black">Abort</button>
                                    <button type="submit" disabled={editItem.isPending} className="px-10 py-5 rounded-xl bg-blue-500 text-white hover:bg-blue-400 transition-all text-[11px] uppercase tracking-[0.4em] font-black shadow-xl shadow-blue-500/20 flex items-center gap-3">
                                        {editItem.isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                        <span>Save Changes</span>
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
