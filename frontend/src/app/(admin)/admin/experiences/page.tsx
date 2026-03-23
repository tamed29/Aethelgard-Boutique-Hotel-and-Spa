'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { motion } from 'framer-motion';
import { Sparkles, Map, Clock, ArrowRight, Plus } from 'lucide-react';

export default function AdminExperiencesPage() {
    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Experience Desk</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">Manage narrative journeys & seasonal rituals</p>
                </div>
                <button className="flex items-center gap-3 bg-[#D4DE95] text-[#1A1F16] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F5F2ED] transition-all">
                    <Plus size={16} />
                    Draft New Experience
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: 'The Forager\'s Dawn', status: 'Active', category: 'Seasonal', icon: Clock },
                    { title: 'Wychwood Star-Gazing', status: 'Active', category: 'Nightly', icon: Map },
                    { title: 'Ancient Pottery Ritual', status: 'Draft', category: 'Craft', icon: Sparkles },
                ].map((exp, i) => (
                    <AdminCard key={exp.title} title={exp.title} className="group cursor-pointer hover:border-[#D4DE95]/30 transition-all">
                        <div className="mt-4 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase tracking-widest text-[#D4DE95]/40">{exp.category}</span>
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${exp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {exp.status}
                                </span>
                            </div>
                            <div className="p-12 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center">
                                <exp.icon className="w-12 h-12 text-[#D4DE95]/10 group-hover:text-[#D4DE95]/40 transition-all duration-700" />
                            </div>
                            <button className="w-full py-4 border border-[#D4DE95]/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#D4DE95]/60 group-hover:bg-[#D4DE95] group-hover:text-[#1A1F16] transition-all flex items-center justify-center gap-3">
                                Edit Experience Core <ArrowRight size={12} />
                            </button>
                        </div>
                    </AdminCard>
                ))}
            </div>
        </div>
    );
}
