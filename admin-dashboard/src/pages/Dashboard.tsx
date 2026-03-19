import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Bed, Activity, TrendingUp, AlertTriangle, ExternalLink, Star, BookOpen, Users, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MAIN_SITE_URL = 'http://localhost:3000';
const SOCKET_URL = API_URL.replace('/api', '');

const MOCK_ROOMS: Room[] = [
    { _id: '1', name: 'Mossy Hollow Suite', status: 'occupied', floor: 1 },
    { _id: '2', name: 'The Canopy Retreat', status: 'available', floor: 1 },
    { _id: '3', name: 'Runestone Loft', status: 'cleaning', floor: 2 },
    { _id: '4', name: 'Birchwood Chamber', status: 'available', floor: 2 },
    { _id: '5', name: 'Ember Suite', status: 'occupied', floor: 3 },
    { _id: '6', name: 'Heather Bower', status: 'maintenance', floor: 3 },
    { _id: '7', name: 'Stone Haven', status: 'available', floor: 4 },
    { _id: '8', name: 'Fern Grotto', status: 'occupied', floor: 4 },
];

const MOCK_ANALYTICS: Analytics = {
    totalRevenue: 84200,
    revenueForecast: 117880,
    occupancyData: [
        { date: 'Mon', rate: 72 }, { date: 'Tue', rate: 68 }, { date: 'Wed', rate: 85 },
        { date: 'Thu', rate: 91 }, { date: 'Fri', rate: 88 }, { date: 'Sat', rate: 95 }, { date: 'Sun', rate: 79 }
    ],
    guestSentiment: {
        score: 88,
        trend: '+4%',
        topKeywords: ['Tranquil', 'Authentic', 'Impeccable Service', 'Heritage'],
        recentFeedback: [
            { guest: 'Elowen T.', comment: 'The ritual induction was transformative.', sentiment: 'positive' },
            { guest: 'Cyrus V.', comment: 'Exquisite attention to detail in the Grand Suite.', sentiment: 'positive' }
        ]
    }
};

// Helper: fetch with 2-second timeout, fallback to mock data
async function fetchWithFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    return Promise.race([
        fn(),
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]).catch(() => fallback);
}

let socket: any;
try {
    socket = io(SOCKET_URL, { timeout: 2000, reconnectionAttempts: 2 });
} catch {
    socket = { on: () => {}, off: () => {} };
}

interface Room {
    _id: string;
    name: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    floor: number;
}

interface Analytics {
    totalRevenue: number;
    occupancyData: { date: string; rate: number }[];
    revenueForecast?: number;
    guestSentiment?: {
        score: number;
        trend: string;
        topKeywords: string[];
        recentFeedback: { guest: string; comment: string; sentiment: string }[];
    };
}

const QUICK_LINKS = [
    { label: 'View Main Site', href: MAIN_SITE_URL, external: true, icon: ExternalLink, color: 'text-sage' },
    { label: 'Manage Rooms', to: '/inventory', icon: Bed, color: 'text-amber-400' },
    { label: 'Bookings', to: '/bookings', icon: BookOpen, color: 'text-emerald-400' },
    { label: 'Experiences', to: '/experiences', icon: Star, color: 'text-rose-400' },
    { label: 'Pricing Engine', to: '/pricing', icon: Zap, color: 'text-indigo-400' },
    { label: 'Users', to: '/users', icon: Users, color: 'text-orange-400' },
];

export function Dashboard() {
    const queryClient = useQueryClient();

    const { data: rooms = MOCK_ROOMS } = useQuery<Room[]>({
        queryKey: ['rooms'],
        queryFn: () => fetchWithFallback(
            async () => { const r = await axios.get(`${API_URL}/rooms`); return r.data; },
            MOCK_ROOMS
        ),
        staleTime: 30000,
        retry: false,
    });

    const { data: analytics = MOCK_ANALYTICS } = useQuery<Analytics>({
        queryKey: ['analytics'],
        queryFn: () => fetchWithFallback(
            async () => { const r = await axios.get(`${API_URL}/admin/analytics`, { withCredentials: true }); return r.data; },
            MOCK_ANALYTICS
        ),
        staleTime: 60000,
        retry: false,
    });

    useEffect(() => {
        socket.on('roomStatusUpdate', ({ roomId, status }: any) => {
            queryClient.setQueryData(['rooms'], (prev: Room[] | undefined) =>
                prev ? prev.map(r => r._id === roomId ? { ...r, status } : r) : MOCK_ROOMS
            );
        });
        return () => { socket.off('roomStatusUpdate'); };
    }, [queryClient]);

    const getStatusColor = (status: Room['status']) => {
        switch (status) {
            case 'available': return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
            case 'occupied': return 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]';
            case 'cleaning': return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]';
            case 'maintenance': return 'bg-orange-600 shadow-[0_0_12px_rgba(234,88,12,0.5)]';
            default: return 'bg-zinc-600';
        }
    };

    const floors = [4, 3, 2, 1].map(floorNum => ({
        floor: floorNum,
        rooms: rooms.filter(r => r.floor === floorNum)
    }));

    const occupancyRate = (rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100 || 0;

    const pieData = [
        { name: 'Available', value: rooms.filter(r => r.status === 'available').length, color: '#10b981' },
        { name: 'Occupied', value: rooms.filter(r => r.status === 'occupied').length, color: '#f43f5e' },
        { name: 'Cleaning', value: rooms.filter(r => r.status === 'cleaning').length, color: '#fbbf24' },
        { name: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: '#ea580c' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-cream tracking-tight">Command Center</h1>
                    <p className="text-sage/60 text-sm mt-1">Full estate control & live monitoring</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-sage/10 rounded-full px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-sage/80 font-semibold">Live Estate Sync</span>
                </div>
            </div>

            {/* Quick Access Bar - Website Control */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {QUICK_LINKS.map((link) => {
                    const Icon = link.icon;
                    const content = (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-sage/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 group"
                        >
                            <Icon size={18} className={cn("shrink-0 transition-transform group-hover:scale-110", link.color)} />
                            <span className="text-[11px] uppercase tracking-widest text-sage/70 group-hover:text-cream transition-colors font-bold">{link.label}</span>
                        </motion.div>
                    );
                    return link.external ? (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{content}</a>
                    ) : (
                        <Link key={link.label} to={link.to!}>{content}</Link>
                    );
                })}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { icon: DollarSign, label: 'Monthly Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, trend: +12, color: 'text-emerald-400' },
                    { icon: TrendingUp, label: 'Revenue Forecast', value: `$${(analytics.revenueForecast || 0).toLocaleString()}`, trend: +5, color: 'text-sage' },
                    { icon: Bed, label: 'Room Occupancy', value: `${occupancyRate.toFixed(0)}%`, color: 'text-amber-400' },
                    { icon: Activity, label: 'System Health', value: 'Nominal', color: 'text-emerald-400' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <GlassCard className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10", stat.color)}>
                                    <stat.icon size={18} />
                                </div>
                                {stat.trend && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                                        +{stat.trend}%
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-sage/40 font-bold">{stat.label}</p>
                            <p className="text-2xl font-serif text-cream mt-1">{stat.value}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Occupancy Heatmap */}
                <GlassCard title="Live Occupancy Heatmap" className="lg:col-span-2">
                    <div className="space-y-5 mt-4">
                        {floors.map((floorData) => (
                            <div key={floorData.floor} className="flex gap-4 items-center">
                                <div className="w-14 flex-shrink-0 text-right">
                                    <p className="text-[9px] uppercase tracking-widest text-sage/30 font-bold">Floor {floorData.floor}</p>
                                </div>
                                <div className="grid grid-cols-4 flex-grow gap-2">
                                    <AnimatePresence mode="popLayout">
                                        {floorData.rooms.map((room) => (
                                            <motion.div
                                                layout key={room._id}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.9, opacity: 0 }}
                                                className="group relative h-14 rounded-xl bg-white/5 border border-white/5 p-2 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 overflow-hidden cursor-crosshair"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[9px] font-medium text-cream/80 truncate pr-1">{room.name.split(' ').pop()}</span>
                                                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getStatusColor(room.status))} />
                                                </div>
                                                <span className="text-[7px] uppercase tracking-tighter text-sage/30">{room.status}</span>
                                                <div className="absolute inset-0 bg-moss-dark/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <p className="text-[9px] text-cream font-medium text-center px-1">{room.name}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {floorData.rooms.length === 0 && (
                                            <div className="col-span-4 h-14 border border-dashed border-sage/10 rounded-xl flex items-center justify-center">
                                                <p className="text-[9px] text-sage/20 uppercase tracking-widest">No rooms on this floor</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/5">
                        {[
                            { label: 'Available', color: 'bg-emerald-500' },
                            { label: 'Occupied', color: 'bg-rose-500' },
                            { label: 'Cleaning', color: 'bg-amber-400' },
                            { label: 'Maintenance', color: 'bg-orange-600' },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-2">
                                <div className={cn('w-2 h-2 rounded-full', s.color)} />
                                <span className="text-[9px] uppercase tracking-widest text-sage/40 font-bold">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Room Distribution Pie */}
                    <GlassCard title="Room Distribution">
                        <div className="flex items-center justify-center mt-2">
                            <ResponsiveContainer width={160} height={160}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1A1F16', border: '1px solid rgba(186,192,149,0.2)', borderRadius: 12, fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {pieData.map(d => (
                                <div key={d.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                    <div>
                                        <p className="text-[8px] uppercase tracking-widest text-sage/40">{d.name}</p>
                                        <p className="text-sm font-serif text-cream">{d.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Revenue Velocity */}
                    <GlassCard title="Revenue Velocity">
                        <div className="h-[140px] w-full mt-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.occupancyData}>
                                    <defs>
                                        <linearGradient id="colorRate2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#BAC095" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#BAC095" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(186,192,149,0.05)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#BAC095', fontSize: 8, opacity: 0.5 }} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1A1F16', border: '1px solid rgba(186,192,149,0.2)', borderRadius: '12px', fontSize: '11px' }} itemStyle={{ color: '#BAC095' }} />
                                    <Area type="monotone" dataKey="rate" stroke="#BAC095" strokeWidth={2} fillOpacity={1} fill="url(#colorRate2)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {occupancyRate > 75 && (
                            <div className="mt-3 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10 flex gap-3">
                                <AlertTriangle className="text-amber-400 flex-shrink-0" size={16} />
                                <p className="text-[10px] text-amber-400/80 leading-relaxed">High occupancy ({occupancyRate.toFixed(0)}%). Activate Dynamic Pricing.</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>

            {/* Guest Sentiment */}
            <GlassCard title="Guest Sentiment (NLP Engine)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="text-5xl font-serif text-emerald-400">{analytics.guestSentiment?.score}</div>
                        <div className="text-[10px] uppercase tracking-widest text-emerald-400/60 mt-2">Sentiment Score</div>
                        <div className="text-xs text-emerald-400 font-bold mt-1">{analytics.guestSentiment?.trend} this week</div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest text-sage/40 font-bold mb-3">Top Keywords</p>
                        <div className="flex flex-wrap gap-2">
                            {analytics.guestSentiment?.topKeywords.map(k => (
                                <span key={k} className="text-[8px] uppercase tracking-widest py-1 px-2 rounded-lg bg-white/5 border border-white/5 text-sage/60">{k}</span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[9px] uppercase tracking-widest text-sage/40 font-bold">Recent Feedback</p>
                        {analytics.guestSentiment?.recentFeedback.map((f, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[9px] uppercase tracking-widest text-sage font-bold mb-1">{f.guest}</p>
                                <p className="text-xs text-sage/40 italic leading-relaxed">"{f.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
