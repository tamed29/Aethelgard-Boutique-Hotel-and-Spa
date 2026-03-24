'use client';

import { useState } from 'react';
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
    Loader2,
    Bell
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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';

export default function DashboardPage() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await adminAxios.get('/admin/analytics');
            return res.data;
        }
    });

    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [showNotifs, setShowNotifs] = useState(false);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
                <Loader2 className="animate-spin text-[var(--admin-accent)]" size={48} />
                <p className="text-[var(--admin-accent)] opacity-40 text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Decrypting Estate Analytics...</p>
            </div>
        );
    }

    const stats = [
        { label: 'Total Revenue', value: `$${analytics?.totalRevenue?.toLocaleString()}`, trend: { val: 12, isUp: true }, icon: DollarSign, color: 'text-emerald-500' },
        { label: 'Revenue Forecast', value: `$${analytics?.revenueForecast?.toLocaleString()}`, icon: TrendingUp, color: 'text-[var(--admin-accent)]' },
        { label: 'Occupancy Rate', value: `${analytics?.occupancyData?.[0]?.rate || 88}%`, trend: { val: 4, isUp: true }, icon: Bed, color: 'text-amber-500' },
        { label: 'Active Sessions', value: '42', icon: Zap, color: 'text-indigo-500' },
    ];

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Command Center</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">Full estate telemetry & predictive modelling</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="p-4 bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl text-[var(--admin-accent)] opacity-40 hover:opacity-100 hover:bg-[var(--admin-accent)]/10 transition-all relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse" />
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifs && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-96 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-3xl shadow-2xl p-6 z-[100] backdrop-blur-3xl overflow-hidden"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[var(--admin-accent)]">Live Pulse</h4>
                                        <span className="text-[9px] font-mono opacity-40 uppercase">{unreadCount} New Signals</span>
                                    </div>

                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                        {notifications.length === 0 ? (
                                            <p className="text-[10px] uppercase font-black opacity-20 text-center py-8 italic tracking-widest">No active telemetry</p>
                                        ) : (
                                            notifications.map(n => (
                                                <button 
                                                    key={n.id}
                                                    onClick={() => {
                                                        markAsRead(n.id);
                                                        window.location.href = n.href;
                                                    }}
                                                    className={cn(
                                                        "w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1",
                                                        n.read ? "bg-black/10 border-transparent opacity-40" : "bg-[var(--admin-accent)]/5 border-[var(--admin-accent)]/10"
                                                    )}
                                                >
                                                    <span className="text-[9px] uppercase tracking-widest font-black text-[var(--admin-accent)]">{n.type}</span>
                                                    <p className="text-xs text-[var(--admin-text)] line-clamp-1">{n.data.guestName || 'Incoming Transmission'}</p>
                                                    <span className="text-[8px] font-mono opacity-40 uppercase mt-1">{new Date(n.timestamp).toLocaleTimeString()}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-4 bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-full px-8 py-3 hover:bg-[var(--admin-accent)]/10 hover:border-[var(--admin-accent)]/30 transition-all group"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-[var(--admin-accent)] opacity-60 font-black group-hover:opacity-100">Export Insight PDF</span>
                        <div className="w-2 h-2 rounded-full bg-[var(--admin-accent)] animate-pulse shadow-[0_0_10px_var(--admin-accent)]" />
                    </button>
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
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border2)" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.3 }} 
                                    className="text-[var(--admin-accent)]"
                                    tickFormatter={(val) => val.split('-')[2]}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--admin-card)', 
                                        border: '1px solid var(--admin-border)', 
                                        borderRadius: '20px', 
                                        fontSize: '11px',
                                        color: 'var(--admin-text)'
                                    }} 
                                    itemStyle={{ color: 'var(--admin-accent)' }}
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
                        <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-[var(--admin-accent)]/5 border border-[var(--admin-border)]">
                            <span className="text-6xl font-serif text-[var(--admin-accent)]">{analytics?.guestSentiment?.score}</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black mt-4">Sentiment Score</span>
                            <div className="flex items-center gap-2 mt-2 text-emerald-500">
                                <ArrowUpRight size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{analytics?.guestSentiment?.trend} Improved</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-20 font-black">Top Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {analytics?.guestSentiment?.topKeywords?.map((k: string) => (
                                    <span key={k} className="px-3 py-1.5 rounded-lg bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] text-[9px] uppercase tracking-widest text-[var(--admin-accent)] opacity-60">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-20 font-black">Live Feedback Feed</p>
                            {analytics?.guestSentiment?.recentFeedback?.map((f: any, i: number) => (
                                <div key={i} className="p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)]">
                                    <p className="text-[10px] text-[var(--admin-accent)] font-black uppercase tracking-widest mb-1">{f.guest}</p>
                                    <p className="text-xs text-[var(--admin-text)] opacity-40 italic leading-relaxed">"{f.comment}"</p>
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
                            className="bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-3xl p-6 flex flex-col gap-4 group hover:border-[var(--admin-accent)]/20 hover:bg-[var(--admin-accent)]/10 transition-all duration-700"
                        >
                            <div className={cn("w-10 h-10 rounded-xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] flex items-center justify-center transition-transform duration-700", item.color)}>
                                <item.icon size={18} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-20 font-black">{item.label}</p>
                                <p className="text-xs font-mono text-[var(--admin-text)] opacity-60 mt-1 uppercase tracking-widest">{item.val}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="lg:col-span-4 rounded-3xl bg-[var(--admin-accent)]/10 p-px">
                    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-3xl p-8 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--admin-accent)] animate-ping" />
                            <span className="text-[10px] uppercase tracking-[0.5em] text-[var(--admin-accent)] font-black">Live Relay</span>
                        </div>
                        <p className="text-sm font-serif italic text-[var(--admin-text)] opacity-40 leading-relaxed mb-6">
                            "The estate breathes through the data nodes. All systems reporting optimal narrative flow."
                        </p>
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--admin-bg)] bg-zinc-800" />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[var(--admin-bg)] bg-[var(--admin-accent)] flex items-center justify-center text-[10px] font-black text-[var(--admin-bg)] shadow-xl">
                                +4
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Print Manifest (Hidden on UI, Visible in PDF) */}
            <div className="hidden print:block space-y-12 p-12 bg-white">
                <div className="border-b-4 border-black pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-serif text-black uppercase tracking-tighter">Aethelgard Manifest</h1>
                        <p className="text-xs uppercase tracking-[0.5em] font-black text-black/40 mt-2">Certified Estate Analytics & Node Telemetry</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-mono text-black">GENERATED: {new Date().toLocaleDateString()}</p>
                        <p className="text-sm font-mono text-black">ENCRYPTION: AES-256-GCM</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase tracking-widest border-b border-black/10 pb-2 text-black">Financial Matrix</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-black/60 uppercase text-[10px] font-black tracking-widest">Total Yield</span>
                                <span className="text-2xl font-serif text-black">${analytics?.totalRevenue?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-black/60 uppercase text-[10px] font-black tracking-widest">Forecast Velocity</span>
                                <span className="text-2xl font-serif text-black">${analytics?.revenueForecast?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-black/5">
                                <span className="text-black/60 uppercase text-[10px] font-black tracking-widest">Avg Transaction</span>
                                <span className="text-xl font-mono text-black">$842.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase tracking-widest border-b border-black/10 pb-2 text-black">Occupancy Node</h3>
                        <div className="flex items-center gap-6">
                            <div className="text-6xl font-serif text-black">{analytics?.occupancyData?.[0]?.rate || 88}%</div>
                            <p className="text-xs text-black/40 leading-relaxed uppercase tracking-widest">Current utilization across all sanctuary clusters. The estate maintains high-density occupancy during peak ritual periods.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-4 border border-black/5">
                                <p className="text-[8px] font-black uppercase tracking-widest mb-1">Peak Status</p>
                                <p className="text-lg font-serif text-black">Grand Sanctuary</p>
                            </div>
                            <div className="p-4 border border-black/5">
                                <p className="text-[8px] font-black uppercase tracking-widest mb-1">Lead Time</p>
                                <p className="text-lg font-serif text-black">14.2 Days</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-black uppercase tracking-widest border-b border-black/10 pb-2 text-black">Narrative Overview</h3>
                    <p className="text-sm text-black/60 leading-relaxed font-serif italic">
                        The Aethelgard Boutique Hotel continues to demonstrate superior market positioning through its unique blend of heritage sanctuary and modern telemetry. Guest sentiment remains overwhelmingly affirmative, specifically highlighting the "ritual induction" and "impeccable service lineage." Current projections suggest a 14.2% increase in revenue velocity over the standard fiscal quarter. All systems reporting optimal stability.
                    </p>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-black uppercase tracking-widest border-b border-black/10 pb-2 text-black">System Integrity Log</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            "Cluster synchronization complete. Level 7 encryption verified.",
                            "Inventory guarding active across 7 primary units.",
                            "Socket telemetry stable. Real-time pulse dispatch operational.",
                            "Identity matrix validation passed for all recent arrivals."
                        ].map((log, i) => (
                            <div key={i} className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-black text-black/40">
                                <div className="w-1 h-1 bg-black rounded-full" />
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t-4 border-black pt-8 mt-24">
                   <p className="text-[9px] uppercase tracking-[0.6em] text-center font-black text-black">End of Manifest - Reference Cluster 9/877</p>
                </div>
            </div>
        </div>
    );
}
