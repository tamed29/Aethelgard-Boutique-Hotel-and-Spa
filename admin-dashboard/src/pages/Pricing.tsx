import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { TrendingUp, Calendar, AlertCircle, Plus, Trash2, ArrowUpRight, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Multiplier {
    _id: string;
    multiplier: number;
    startDate: string;
    endDate: string;
    description: string;
    isActive: boolean;
}

interface PricingRule {
    _id: string;
    type: 'occupancy_above' | 'occupancy_below';
    threshold: number;
    adjustment: number;
    isActive: boolean;
    description: string;
}

export function Pricing() {
    const queryClient = useQueryClient();

    const { data: multipliers = [], isLoading: multipliersLoading } = useQuery<Multiplier[]>({
        queryKey: ['multipliers'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/admin/multipliers`, { withCredentials: true });
            return res.data;
        }
    });

    const { data: rules = [], isLoading: rulesLoading } = useQuery<PricingRule[]>({
        queryKey: ['pricing-rules'],
        queryFn: async () => {
            // Placeholder: Assume an endpoint for rules exists or will be created
            try {
                const res = await axios.get(`${API_URL}/admin/pricing-rules`, { withCredentials: true });
                return res.data;
            } catch {
                return [
                    { _id: '1', type: 'occupancy_above', threshold: 80, adjustment: 1.15, isActive: true, description: 'Occupancy Surge (80%+)' }
                ];
            }
        }
    });

    const deleteMultiplier = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/admin/multipliers/${id}`, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['multipliers'] });
        }
    });

    if (multipliersLoading || rulesLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-pulse text-sage tracking-[0.3em] uppercase text-xs">Accessing Yield Engine...</div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Dynamic Yield Engine</h2>
                    <p className="text-sage/40 text-sm mt-1 uppercase tracking-[0.2em] font-bold">Rule-Based Pricing & Seasonal Multipliers</p>
                </div>
                <button className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-8 py-4 rounded-2xl transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-sage/10 group active:scale-95">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>New Parameter</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rule-Based Controls */}
                <div className="lg:col-span-1 space-y-8">
                    <GlassCard title="Rule-Based Automation" className="border-sage/20 bg-moss-light/10">
                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-sage/5 border border-sage/20 relative overflow-hidden group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-sage/10 text-sage group-hover:scale-110 transition-transform duration-500">
                                        <Zap size={18} fill="currentColor" opacity={0.2} />
                                    </div>
                                    <h4 className="text-sage font-bold text-[10px] uppercase tracking-widest">Active Yield Rule</h4>
                                </div>
                                {rules.map(rule => (
                                    <div key={rule._id} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <p className="text-2xl font-serif text-cream">{rule.adjustment}x Rate</p>
                                            <ArrowUpRight size={20} className="text-emerald-400 opacity-50 mb-1" />
                                        </div>
                                        <p className="text-xs text-sage/60 font-medium">Trigger: {rule.type.replace('_', ' ')} {rule.threshold}%</p>
                                        <div className="mt-4 flex gap-2">
                                            <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-sage shadow-[0_0_10px_rgba(186,192,149,0.5)] w-[84%]" />
                                            </div>
                                            <span className="text-[8px] text-sage/40 uppercase font-bold">84% Current</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="absolute right-[-20px] bottom-[-20px] opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                    <Zap size={120} />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h4 className="text-[10px] uppercase tracking-widest text-sage/40 font-bold px-1">Optimization Insights</h4>
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-help group">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-cream font-medium group-hover:text-emerald-400 transition-colors">Yield Optimization</p>
                                        <p className="text-[10px] text-sage/40 mt-1 leading-relaxed">+14% revenue uplift projected this weekend based on Surrounds Ritual bookings.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-help group">
                                    <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-cream font-medium group-hover:text-amber-400 transition-colors">Market Awareness</p>
                                        <p className="text-[10px] text-sage/40 mt-1 leading-relaxed">Competitor rates in Moss Hallow area increased by 10%. Threshold recommendation: 1.1x.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Scheduled Multipliers */}
                <GlassCard title="Seasonal Performance Multipliers" className="lg:col-span-2 border-sage/10">
                    <div className="space-y-4 mt-6">
                        {multipliers.map((m) => (
                            <motion.div 
                                layout
                                key={m._id} 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 hover:border-sage/20 transition-all duration-500"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-moss-light/50 flex flex-col items-center justify-center border border-sage/10 group-hover:border-sage/30 transition-all">
                                        <span className="text-xl font-serif text-sage font-bold">{m.multiplier}x</span>
                                    </div>
                                    <div>
                                        <p className="text-cream font-serif text-lg tracking-wide">{m.description}</p>
                                        <div className="flex items-center gap-3 text-[10px] text-sage/40 mt-2 uppercase tracking-widest font-bold">
                                            <Calendar size={12} className="text-sage" />
                                            <span>{new Date(m.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(m.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={cn(
                                            "text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border",
                                            m.isActive 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/20" 
                                                : "bg-white/10 text-sage/20 border-white/5"
                                        )}>
                                            {m.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => deleteMultiplier.mutate(m._id)}
                                        className="text-sage/20 hover:text-rose-400 p-3 rounded-full hover:bg-rose-400/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {multipliers.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="p-4 rounded-full bg-white/5 border border-white/5 text-sage/20 mb-4">
                                    <Calendar size={32} />
                                </div>
                                <p className="text-sage/30 font-serif italic uppercase tracking-widest text-xs">No scheduled event-based multipliers found.</p>
                                <button className="text-sage font-bold text-[10px] uppercase tracking-widest mt-4 hover:text-cream transition-colors">Schedule Surge Rate</button>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
