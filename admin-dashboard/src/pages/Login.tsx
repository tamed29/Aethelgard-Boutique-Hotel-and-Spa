import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            }, { withCredentials: true });

            if (res.data.role === 'admin') {
                login(res.data);
                toast.success('Welcome to the Admin Command Center');
                navigate('/');
            } else {
                toast.error('Access restricted to administrators only.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-moss-dark relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sage/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sage/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md px-4 z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif text-cream tracking-[0.2em] mb-4">AETHELGARD</h1>
                    <p className="text-sage/60 uppercase tracking-widest text-xs">Admin Access Point</p>
                </div>

                <GlassCard className="p-8 border-sage/20 bg-black/40">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-sage/60 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 pl-12 pr-4 text-cream outline-none focus:border-sage/40 focus:bg-white/10 transition-all"
                                    placeholder="admin@aethelgard.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-sage/60 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/40" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-sage/10 rounded-xl py-3 pl-12 pr-4 text-cream outline-none focus:border-sage/40 focus:bg-white/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sage hover:bg-sage-light text-moss-dark font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-sage/10 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Command Center'}
                        </button>
                    </form>
                </GlassCard>

                <p className="text-center mt-8 text-sage/30 text-xs tracking-widest uppercase">
                    &copy; 2026 Aethelgard Boutique Hotel
                </p>
            </motion.div>
        </div>
    );
}
