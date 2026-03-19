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
                <div className="text-center mb-10 flex flex-col items-center gap-4">
                    {/* Logo Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 10L15 45H20L30 18L40 45H45L30 10Z" fill="#BAC095"/>
                            <path d="M22 35H38" stroke="#BAC095" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M45 45C50 40 50 30 40 25C35 22 25 25 20 30C15 35 15 45 25 45" stroke="#BAC095" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                            <path d="M42 32C44 30 44 26 41 24C38 22 34 24 33 27C32 30 34 34 38 35C42 36 45 32 42 32Z" fill="#BAC095" fillOpacity="0.3"/>
                            <circle cx="30" cy="10" r="1.5" fill="#BAC095"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif text-cream tracking-[0.2em] mb-1">AETHELGARD</h1>
                        <p className="text-sage/60 uppercase tracking-widest text-xs">Admin Access Point</p>
                    </div>
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
