'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminAxios } from '@/lib/adminAxios';
import { 
    Settings, 
    Lock, 
    Shield, 
    User, 
    Bell, 
    ShieldCheck, 
    Terminal,
    Save,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

    const changePassword = useMutation({
        mutationFn: async (data: any) => {
            await adminAxios.post('/admin/change-password', data);
        },
        onSuccess: () => {
            toast.success('Security Protocol Updated', { description: 'Master password has been rotated.' });
            setPasswords({ current: '', next: '', confirm: '' });
        },
        onError: (err: any) => {
            toast.error('Protocol Denial', { description: err.response?.data?.message || 'Access rejected.' });
        }
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.next !== passwords.confirm) {
            toast.error('Validation Mismatch', { description: 'New passwords do not align.' });
            return;
        }
        changePassword.mutate({ 
            currentPassword: passwords.current, 
            newPassword: passwords.next 
        });
    };

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-5xl font-serif text-[var(--admin-text)] tracking-tight mb-2">Terminal Settings</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--admin-accent)] opacity-40 font-black">System configuration & security protocols</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Security Section */}
                <AdminCard title="Identity & Access Control">
                    <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-[0.4em] text-[var(--admin-text)] opacity-40 font-black ml-1">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--admin-accent)] opacity-20" size={16} />
                                    <input 
                                        type="password"
                                        required
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.4em] text-[var(--admin-text)] opacity-40 font-black ml-1">New Password</label>
                                    <input 
                                        type="password"
                                        required
                                        value={passwords.next}
                                        onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                                        className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-4 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.4em] text-[var(--admin-text)] opacity-40 font-black ml-1">Confirm Alignment</label>
                                    <input 
                                        type="password"
                                        required
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full bg-[var(--admin-accent)]/5 border border-[var(--admin-border)] rounded-2xl py-4 px-6 text-[var(--admin-text)] outline-none focus:border-[var(--admin-accent)]/40 transition-all font-light"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={changePassword.isPending}
                            className="w-full py-5 bg-[var(--admin-accent)] text-[var(--admin-bg)] rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-[var(--admin-accent)]/5"
                        >
                            {changePassword.isPending ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                            Synchronize New Protocol
                        </button>
                    </form>
                </AdminCard>

                {/* System Stats / Meta */}
                <div className="space-y-8">
                    <AdminCard title="Encryption Status">
                        <div className="mt-6 flex items-center gap-6 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Shield size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400 font-black mb-1">AES-256 Active</p>
                                <p className="text-xs text-[var(--admin-text)] opacity-40 font-light">All estate communications are currently shielded.</p>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Node Telemetry">
                        <div className="space-y-4 mt-6">
                            {[
                                { label: 'API Version', val: '2.4.0-legacy', icon: Terminal },
                                { label: 'Cluster Connectivity', val: '99.98%', icon: ShieldCheck },
                                { label: 'Last Rotation', val: '14 Days Ago', icon: RefreshCw },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--admin-accent)]/5 border border-[var(--admin-border)]">
                                    <div className="flex items-center gap-4">
                                        <item.icon size={14} className="text-[var(--admin-accent)] opacity-20" />
                                        <span className="text-[9px] uppercase tracking-widest text-[var(--admin-accent)] opacity-60 font-black">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-[var(--admin-text)] opacity-40">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
