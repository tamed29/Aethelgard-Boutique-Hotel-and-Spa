'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminAxios } from '@/lib/adminAxios';
import { Lock, Mail, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { AethelgardLogo } from '@/components/ui/AethelgardLogo';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('from') || '/admin';
    const errorParam = searchParams.get('error');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await adminAxios.post('/auth/login', {
                email,
                password,
            });

            if (res.data.role === 'admin') {
                setLoginError(null);
                toast.success('Access Granted. Welcome, Warden.');
                window.location.href = redirectTo;
            } else {
                setLoginError('Wrong email/password.');
            }
        } catch {
            setLoginError('Wrong email/password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1F16] relative overflow-hidden font-sans">
            {/* 1. Atmospheric Deep Forest Background (Royal Quarter Theme) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,58,41,0.2),transparent)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
            
            {/* Floating Orbs for "Nature Night" feel */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4DE95]/5 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-black/40 rounded-full blur-[160px]" />

            {/* Back Navigation */}
            <Link href="/" className="absolute top-12 left-6 md:left-12 flex items-center gap-4 text-[#D4DE95]/30 hover:text-[#D4DE95] transition-all group z-50">
                <div className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center group-hover:border-[#D4DE95]/30 transition-colors">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.5em] font-black hidden md:inline">Return to Estate</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-[480px] px-6 z-10"
            >
                {/* Branding Section */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mb-8 p-6 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl relative"
                    >
                        <AethelgardLogo className="w-16 h-16 text-[#D4DE95]" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4DE95] rounded-full blur-[4px] animate-pulse" />
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-5xl font-serif text-[#F5F2ED] tracking-[0.15em] mb-3 uppercase">Aethelgard</h1>
                    <p className="text-[#D4DE95]/40 uppercase tracking-[0.5em] text-[10px] font-black">Staff Sanctuary & Control</p>
                </div>

                {/* Login Form Card */}
                <div className="relative p-[1px] rounded-[3rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl overflow-hidden group">
                    <div className="bg-[#1A1F16]/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14">
                        <form onSubmit={handleLogin} className="space-y-10">
                            {errorParam === 'unauthorized' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-200 text-[10px] uppercase tracking-widest text-center py-4 rounded-xl font-bold"
                                >
                                    Authentication Required for Access
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.5em] text-[#D4DE95]/30 font-black ml-1">Imperial Email</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4DE95]/20 group-focus-within/input:text-[#D4DE95] transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
                                        className={`w-full bg-black/20 border ${loginError ? 'border-red-500/40' : 'border-white/5'} rounded-2xl py-6 pl-16 pr-8 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 focus:bg-white/[0.05] transition-all text-base font-light placeholder:text-white/10`}
                                        placeholder="curator@aethelgard.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.5em] text-[#D4DE95]/30 font-black ml-1">Cipher Key</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4DE95]/20 group-focus-within/input:text-[#D4DE95] transition-colors" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                                        className={`w-full bg-black/20 border ${loginError ? 'border-red-500/40' : 'border-white/5'} rounded-2xl py-6 pl-16 pr-8 text-[#F5F2ED] outline-none focus:border-[#D4DE95]/40 focus:bg-white/[0.05] transition-all text-base font-light placeholder:text-white/10`}
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Inline error message */}
                                <AnimatePresence>
                                    {loginError && (
                                        <motion.div
                                            key="login-error"
                                            initial={{ opacity: 0, height: 0, y: -8 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -8 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 mt-2"
                                        >
                                            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                            </svg>
                                            <p className="text-red-300 text-[11px] font-semibold leading-relaxed">{loginError}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#D4DE95] hover:bg-[#F5F2ED] text-[#1A1F16] font-black py-6 rounded-2xl transition-all duration-700 flex items-center justify-center gap-4 shadow-xl shadow-[#D4DE95]/5 disabled:opacity-50 uppercase tracking-[0.5em] text-[12px] group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Initiate Sequence</span>
                                        <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="mt-16 text-center">
                    <p className="text-[#D4DE95]/10 text-[9px] tracking-[0.8em] uppercase font-black mb-4">
                        Aethelgard Administrative Node
                    </p>
                    <div className="h-px w-12 bg-white/5 mx-auto" />
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#1A1F16] flex items-center justify-center"><Loader2 className="animate-spin text-[#D4DE95]" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
