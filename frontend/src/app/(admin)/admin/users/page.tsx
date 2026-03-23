'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { motion } from 'framer-motion';
import { Users, Shield, Key, ArrowRight, UserPlus, MoreVertical } from 'lucide-react';

export default function AdminUsersPage() {
    const users = [
        { name: 'Aethelgard Admin', email: 'admin@aethelgard.com', role: 'Arch-Curator', status: 'Verified' },
        { name: 'Estate Concierge', email: 'service@aethelgard.com', role: 'Guest Ops', status: 'Active' },
    ];

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-serif text-[#F5F2ED] tracking-tight mb-2">Staff & Roles</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">Access control & cluster identity management</p>
                </div>
                <button className="flex items-center gap-3 bg-[#D4DE95] text-[#1A1F16] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F5F2ED] transition-all">
                    <UserPlus size={16} />
                    Invite Staff Node
                </button>
            </div>

            <AdminCard title="Authorized Personnel" className="overflow-hidden">
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-6 text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/30 font-black pl-4">Designation</th>
                                <th className="pb-6 text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/30 font-black">Clearance</th>
                                <th className="pb-6 text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/30 font-black">Status</th>
                                <th className="pb-6 text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/30 font-black text-right pr-4">Matrix</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user, i) => (
                                <tr key={user.email} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-8 pl-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#D4DE95]/10 border border-[#D4DE95]/20 flex items-center justify-center text-[#D4DE95] font-serif">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#F5F2ED] font-serif tracking-wide">{user.name}</p>
                                                <p className="text-[10px] text-[#D4DE95]/30 font-mono tracking-tighter">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8">
                                        <div className="flex items-center gap-2">
                                            <Shield size={12} className="text-[#D4DE95]/40" />
                                            <span className="text-[10px] uppercase tracking-widest text-[#D4DE95]/60">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="py-8">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-tighter border border-emerald-500/20">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-8 text-right pr-4">
                                        <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-[#D4DE95]/30 hover:text-[#D4DE95]">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminCard>
        </div>
    );
}
