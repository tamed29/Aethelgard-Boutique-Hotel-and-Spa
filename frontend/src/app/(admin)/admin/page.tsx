'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { 
    DollarSign, 
    Bed, 
    TrendingUp, 
    Activity, 
    ShieldCheck, 
    Zap, 
    Users,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { StatCard, AdminCard } from '@/components/admin/AdminCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await adminAxios.get('/admin/analytics');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
                <Loader2 className="animate-spin text-[#D4DE95]" size={48} />
                <p className="text-[#D4DE95]/40 text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Decrypting Estate Analytics...</p>
            </div>
        );
    }

    const stats = [
        { label: 'Total Revenue', value: `$${analytics?.totalRevenue?.toLocaleString()}`, trend: { val: 12, isUp: true }, icon: DollarSign, color: 'text-emerald-400' },
        { label: 'Revenue Forecast', value: `$${analytics?.revenueForecast?.toLocaleString()}`, icon: TrendingUp, color: 'text-[#D4DE95]' },
        { label: 'Occupancy Rate', value: `${analytics?.occupancyData?.[0]?.rate || 88}%`, trend: { val: 4, isUp: true }, icon: Bed, color: 'text-amber-400' },
        { label: 'Active Sessions', value: '42', icon: Zap, color: 'text-indigo-400' },
    ];

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Command Center</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">Full estate telemetry & predictive modelling</p>
                </div>
                <div className="flex items-center gap-4 bg-white/[0.03] border border-[#D4DE95]/10 rounded-full px-6 py-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#D4DE95]/60 font-black">Cluster Stable: Node-01</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={stat.label} {...stat} delay={i * 0.1} />
                ))}
            </div>

            {/* Primary Data Visuals */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Occupancy Chart */}
                <AdminCard title="Occupancy Velocity (30-Day Forecast)" className="xl:col-span-2 min-h-[400px]">
                    <div className="h-[350px] w-full mt-6">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={analytics?.occupancyData}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4DE95" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4DE95" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(212, 222, 149, 0.05)" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#D4DE95', fontSize: 10, opacity: 0.3 }} 
                                    tickFormatter={(val) => val.split('-')[2]}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1A1F16', 
                                        border: '1px solid rgba(212, 222, 149, 0.2)', 
                                        borderRadius: '20px', 
                                        fontSize: '11px',
                                        color: '#F5F2ED'
                                    }} 
                                    itemStyle={{ color: '#D4DE95' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="rate" 
                                    stroke="#D4DE95" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorRate)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </AdminCard>

                {/* Sentiment Engine */}
                <AdminCard title="Guest Sentiment Analysis">
                    <div className="space-y-8 mt-6">
                        <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-[#D4DE95]/5 border border-[#D4DE95]/10">
                            <span className="text-6xl font-serif text-[#D4DE95]">{analytics?.guestSentiment?.score}</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black mt-4">Sentiment Score</span>
                            <div className="flex items-center gap-2 mt-2 text-emerald-400">
                                <ArrowUpRight size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{analytics?.guestSentiment?.trend} Improved</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/20 font-black">Top Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {analytics?.guestSentiment?.topKeywords?.map((k: string) => (
                                    <span key={k} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] uppercase tracking-widest text-[#D4DE95]/60">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/20 font-black">Live Feedback Feed</p>
                            {analytics?.guestSentiment?.recentFeedback?.map((f: any, i: number) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] text-[#D4DE95] font-black uppercase tracking-widest mb-1">{f.guest}</p>
                                    <p className="text-xs text-[#F5F2ED]/40 italic leading-relaxed">"{f.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </AdminCard>
            </div>

            {/* Performance Stats & Live Relay */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Identity Matrix', val: 'Verified (Level 7)', icon: ShieldCheck, color: 'text-emerald-500' },
                        { label: 'Sync Latency', val: '12ms (Internal)', icon: Activity, color: 'text-[#D4DE95]' },
                        { label: 'Node Cluster', val: 'Aethelgard-Main', icon: Users, color: 'text-amber-500' },
                    ].map((item, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            key={item.label} 
                            className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-4 group hover:border-[#D4DE95]/20 hover:bg-white/[0.04] transition-all duration-700"
                        >
                            <div className={cn("w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-700", item.color)}>
                                <item.icon size={18} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/20 font-black">{item.label}</p>
                                <p className="text-xs font-mono text-[#F5F2ED]/60 mt-1 uppercase tracking-widest">{item.val}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#D4DE95]/10 to-transparent p-px">
                    <div className="bg-[#1A1F16] rounded-3xl p-8 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#D4DE95] animate-ping" />
                            <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4DE95] font-black">Live Relay</span>
                        </div>
                        <p className="text-sm font-serif italic text-white/40 leading-relaxed mb-6">
                            "The estate breathes through the data nodes. All systems reporting optimal narrative flow."
                        </p>
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1F16] bg-zinc-800" />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#1A1F16] bg-[#D4DE95] flex items-center justify-center text-[10px] font-black text-[#1A1F16] shadow-xl">
                                +4
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
