import { useState, useEffect } from 'react';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { TrendingUp, Percent, Calendar, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Multiplier {
    _id: string;
    multiplier: number;
    startDate: string;
    endDate: string;
    description: string;
    isActive: boolean;
}

export function Pricing() {
    const [multipliers, setMultipliers] = useState<Multiplier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMultipliers = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/multipliers`, { withCredentials: true });
                setMultipliers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMultipliers();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Dynamic Pricing Engine</h2>
                    <p className="text-sage/40 text-sm mt-1 uppercase tracking-widest">Set Yield Management Parameters</p>
                </div>
                <button className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-sage/10">
                    <Plus size={20} />
                    New Multiplier
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-1 border-sage/10">
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-sage/5 border border-sage/20">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp size={18} className="text-sage" />
                                <h4 className="text-sage font-bold text-xs uppercase tracking-widest">Active Influence</h4>
                            </div>
                            <p className="text-2xl font-serif text-cream">1.2x Premium</p>
                            <p className="text-xs text-sage/40 mt-1">Holiday Season (Dec 15 - Jan 5)</p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs uppercase tracking-widest text-sage/60 font-bold px-1">Quick Insights</h4>
                            <div className="flex items-start gap-3">
                                <Percent size={16} className="text-sage/40 mt-0.5" />
                                <p className="text-sm text-sage/60 leading-tight">Average rate increase vs last year: <span className="text-sage">+14%</span></p>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertCircle size={16} className="text-sage/40 mt-0.5" />
                                <p className="text-sm text-sage/60 leading-tight">Projected revenue uplift: <span className="text-sage">$8,450</span></p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard title="Scheduled Adjustments" className="lg:col-span-2 border-sage/10">
                    <div className="space-y-4">
                        {multipliers.map((m) => (
                            <div key={m._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-lg bg-moss-light flex flex-col items-center justify-center border border-sage/10">
                                        <span className="text-xs font-bold text-sage">{m.multiplier}x</span>
                                    </div>
                                    <div>
                                        <p className="text-cream font-medium">{m.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-sage/40 mt-1">
                                            <Calendar size={12} />
                                            <span>{new Date(m.startDate).toLocaleDateString()} - {new Date(m.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        m.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-white/10"
                                    )} />
                                    <button className="text-sage/40 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {multipliers.length === 0 && !loading && (
                            <div className="text-center py-12 opacity-30 italic text-sm">No scheduled multipliers found.</div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
