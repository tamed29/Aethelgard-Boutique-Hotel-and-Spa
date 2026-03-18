import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Users, DollarSign, Bed, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// socket io runs on the base URL, so remove /api
const SOCKET_URL = API_URL.replace('/api', '');
const socket = io(SOCKET_URL);

interface Room {
    _id: string;
    name: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
}

interface Analytics {
    totalRevenue: number;
    occupancyData: { date: string; rate: number }[];
}

export function Dashboard() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, analyticsRes] = await Promise.all([
                    axios.get(`${API_URL}/rooms`),
                    axios.get(`${API_URL}/admin/analytics`, { withCredentials: true })
                ]);
                setRooms(roomsRes.data);
                setAnalytics(analyticsRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socket.on('roomStatusUpdate', ({ roomId, status }) => {
            setRooms(prev => prev.map(r => r._id === roomId ? { ...r, status } : r));
        });

        return () => {
            socket.off('roomStatusUpdate');
        };
    }, []);

    const getStatusColor = (status: Room['status']) => {
        switch (status) {
            case 'available': return 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]';
            case 'occupied': return 'bg-red-500 shadow-[0_0_12px_rgba(239,44,44,0.4)]';
            case 'cleaning': return 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.4)]';
            case 'maintenance': return 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]';
            default: return 'bg-gray-500';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-sage tracking-[0.3em] uppercase">Initialising Systems...</div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: DollarSign, label: 'Monthly Revenue', value: `$${analytics?.totalRevenue?.toLocaleString()}`, color: 'text-green-400' },
                    { icon: Users, label: 'Guest Capacity', value: '48/60', color: 'text-sage' },
                    { icon: Bed, label: 'Available Rooms', value: rooms.filter(r => r.status === 'available').length.toString(), color: 'text-blue-400' },
                    { icon: Activity, label: 'Live Sync', value: 'Active', color: 'text-sage-light' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="flex items-center gap-4 py-4 px-6 border-sage/10">
                            <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-sage/40 font-semibold">{stat.label}</p>
                                <p className="text-2xl font-serif text-cream mt-1">{stat.value}</p>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real-time Status Grid */}
                <GlassCard title="Live Room Status" className="lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all duration-300"
                            >
                                <div className={cn("w-3 h-3 rounded-full mb-3", getStatusColor(room.status))} />
                                <p className="text-cream font-medium text-sm truncate w-full">{room.name}</p>
                                <p className="text-[10px] uppercase tracking-widest text-sage/40 mt-1">{room.status}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Analytics Chart */}
                <GlassCard title="Occupancy Forecasting">
                    <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.occupancyData}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#BAC095" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#BAC095" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(186,192,149,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#BAC095', fontSize: 10, opacity: 0.5 }}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#3D4127', border: '1px solid rgba(186,192,149,0.2)', borderRadius: '8px', fontSize: '12px', color: '#BAC095' }}
                                    itemStyle={{ color: '#F5F5F0' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="#BAC095"
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-sage/40 mt-6 text-center italic">Projected occupancy for the next 30 days based on booking trends.</p>
                </GlassCard>
            </div>
        </div>
    );
}
