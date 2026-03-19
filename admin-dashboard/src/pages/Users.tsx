import { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { UserPlus, UserX, Mail, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { toast } from 'sonner';

const MOCK_USERS = [
    { _id: 'u1', name: 'Aethelgard Admin', email: 'admin@aethelgard.com', role: 'admin', createdAt: '2026-01-01' },
    { _id: 'u2', name: 'Estate Manager', email: 'manager@aethelgard.com', role: 'manager', createdAt: '2026-02-10' },
    { _id: 'u3', name: 'Concierge Staff', email: 'staff@aethelgard.com', role: 'staff', createdAt: '2026-02-14' },
];

const ROLE_STYLES: Record<string, string> = {
    admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    manager: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    staff: 'bg-sage/10 text-sage border-sage/20',
};

interface User { _id: string; name: string; email: string; role: string; createdAt: string; }

export function Users() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('staff');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        const user: User = { _id: `u${Date.now()}`, name: newName, email: newEmail, role: newRole, createdAt: new Date().toISOString().split('T')[0] };
        setUsers(prev => [...prev, user]);
        setNewName(''); setNewEmail(''); setShowInvite(false);
        toast.success(`Invitation sent to ${newEmail}`);
    };

    const changeRole = (id: string, role: string) => {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
        toast.success('Role updated');
    };

    const removeUser = (id: string) => {
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success('User removed');
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-cream">User Management</h2>
                    <p className="text-sage/40 text-[10px] mt-2 uppercase tracking-[0.3em] font-bold">Role-Based Access Control Terminal</p>
                </div>
                <button onClick={() => setShowInvite(true)}
                    className="bg-sage hover:bg-sage-light text-moss-dark font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-3 text-sm group active:scale-95">
                    <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                    Invite User
                </button>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40" size={14} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                    className="w-full md:w-80 bg-white/5 border border-sage/10 rounded-2xl py-3 pl-11 pr-4 text-cream outline-none focus:border-sage/40 transition-all text-sm" />
            </div>

            <GlassCard className="p-0 overflow-hidden border-sage/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] text-[9px] uppercase tracking-[0.2em] text-sage/50 font-bold border-b border-white/5">
                                <th className="py-5 px-6">User</th>
                                <th className="py-5 px-6">Email</th>
                                <th className="py-5 px-6">Role</th>
                                <th className="py-5 px-6">Joined</th>
                                <th className="py-5 px-6 text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filtered.map((user, i) => (
                                    <motion.tr key={user._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
                                        className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center text-sage font-bold text-sm">
                                                    {user.name[0]}
                                                </div>
                                                <p className="text-cream font-medium text-sm">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-sage/60 text-xs font-mono">{user.email}</span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <select value={user.role} onChange={e => changeRole(user._id, e.target.value)}
                                                className={cn("text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border bg-transparent cursor-pointer outline-none", ROLE_STYLES[user.role])}>
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                                <option value="staff">Staff</option>
                                            </select>
                                        </td>
                                        <td className="py-5 px-6 text-sage/40 text-xs font-mono">{user.createdAt}</td>
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2 hover:bg-white/10 rounded-xl text-sage/60 hover:text-sage transition-all"><Mail size={14} /></button>
                                                {user.role !== 'admin' && (
                                                    <button onClick={() => removeUser(user._id)} className="p-2 hover:bg-rose-500/10 rounded-xl text-rose-400/40 hover:text-rose-400 transition-all"><UserX size={14} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInvite && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowInvite(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#1A1F16] border border-sage/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                            <h3 className="text-2xl font-serif text-cream mb-1">Invite Team Member</h3>
                            <p className="text-sage/40 text-xs uppercase tracking-widest mb-6">Grant access to the estate systems</p>
                            <form onSubmit={handleInvite} className="space-y-4">
                                <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name"
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 px-4 text-cream outline-none focus:border-sage/40 transition-all text-sm" />
                                <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email Address"
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 px-4 text-cream outline-none focus:border-sage/40 transition-all text-sm" />
                                <select value={newRole} onChange={e => setNewRole(e.target.value)}
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 px-4 text-cream outline-none focus:border-sage/40 transition-all text-sm">
                                    <option value="staff">Staff</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 bg-sage hover:bg-sage-light text-moss-dark font-bold py-3 rounded-xl transition-all">Send Invitation</button>
                                    <button type="button" onClick={() => setShowInvite(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-sage font-bold py-3 rounded-xl transition-all border border-white/10">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
