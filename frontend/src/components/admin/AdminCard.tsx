'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminCardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    delay?: number;
}

export function AdminCard({ children, title, className, delay = 0 }: AdminCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
            className={cn(
                "group relative bg-white/[0.02] border border-[#D4DE95]/10 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-3xl transition-all duration-700 hover:bg-white/[0.04] hover:border-[#D4DE95]/20 shadow-2xl shadow-black/20",
                className
            )}
        >
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4DE95]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {title && (
                <div className="flex justify-between items-center mb-8 border-b border-[#D4DE95]/5 pb-4">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#D4DE95]/40 font-black">{title}</h3>
                </div>
            )}
            
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

export function StatCard({ label, value, trend, icon: Icon, color, delay }: {
    label: string,
    value: string | number,
    trend?: { val: number, isUp: boolean },
    icon: any,
    color: string,
    delay?: number
}) {
    return (
        <AdminCard delay={delay}>
            <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-700", color)}>
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                {trend && (
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                        trend.isUp ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                        {trend.isUp ? "+" : "-"}{trend.val}%
                    </div>
                )}
            </div>
            
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4DE95]/30 font-black mb-2">{label}</p>
            <p className="text-4xl font-serif text-[#F5F2ED] tracking-tight">{value}</p>
        </AdminCard>
    );
}
