import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function GlassCard({ children, className, title }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-sage/10 bg-moss-dark/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-sage/20",
                className
            )}
        >
            {title && (
                <h3 className="mb-6 font-serif text-lg tracking-wide text-sage/80 uppercase">
                    {title}
                </h3>
            )}
            <div className="relative z-10">
                {children}
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sage/5 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-moss-dark/10 blur-[100px]" />
        </motion.div>
    );
}
