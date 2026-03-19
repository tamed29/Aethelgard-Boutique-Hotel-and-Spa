import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { Shield, Clock, Activity, Terminal, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuditLog {
    _id: string;
    userId: { name: string; email: string };
    action: string;
    method: string;
    resource: string;
    payload: any;
    timestamp: string;
}

export function Audit() {
    const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
        queryKey: ['audit-logs'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/admin/audit-logs`, { withCredentials: true });
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="animate-pulse text-sage tracking-[0.4em] uppercase text-xs font-bold">Decrypting Audit Trails...</div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-cream">Audit Terminal</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Immutable Record of Administrative Directives</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-sage/10 rounded-full px-4 py-2 text-sage/40">
                    <Shield size={14} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Standard Integrity Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard title="Security Pulse" className="border-sage/20">
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3 mb-2 text-sage/60 uppercase tracking-widest text-[10px] font-bold">
                                    <Activity size={12} />
                                    <span>Ops Velocity</span>
                                </div>
                                <p className="text-2xl font-serif text-cream">14 Active/Hr</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3 mb-2 text-sage/60 uppercase tracking-widest text-[10px] font-bold">
                                    <Clock size={12} />
                                    <span>Last Directive</span>
                                </div>
                                <p className="text-sm font-medium text-cream">{logs[0] ? new Date(logs[0].timestamp).toLocaleTimeString() : 'N/A'}</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Log Feed */}
                <GlassCard className="lg:col-span-3 border-sage/10 p-0 overflow-hidden bg-moss-light/5">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <Terminal size={14} className="text-sage" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-sage/80">Directive Sequence Feed</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left order-collapse">
                            <thead>
                                <tr className="text-[9px] uppercase tracking-[0.2em] text-sage/40 font-bold border-b border-white/5">
                                    <th className="py-5 px-8">Dispatch Timestamp</th>
                                    <th className="py-5 px-8">Authorized Agent</th>
                                    <th className="py-5 px-8">Directive / Resource</th>
                                    <th className="py-5 px-8 text-right">Integrity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log, i) => (
                                    <motion.tr
                                        key={log._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="hover:bg-white/[0.03] transition-colors"
                                    >
                                        <td className="py-5 px-8 text-xs font-mono text-sage/60">
                                            {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center text-[10px] text-sage font-bold">
                                                    {log.userId?.name?.[0] || 'A'}
                                                </div>
                                                <span className="text-xs text-cream font-medium">{log.userId?.name || 'System Admin'}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-sage">{log.action}</span>
                                                <span className="text-[9px] font-mono text-sage/30">{log.resource}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[8px] uppercase font-bold text-emerald-400">
                                                <AlertCircle size={10} />
                                                Verified
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}

                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center">
                                            <p className="text-xs font-serif italic text-sage/20 tracking-[0.3em] uppercase">No directives recorded in this session.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
