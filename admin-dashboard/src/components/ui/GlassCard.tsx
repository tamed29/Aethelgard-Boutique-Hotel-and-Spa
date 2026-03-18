import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function GlassCard({ children, className, title }: GlassCardProps) {
    return (
        <div className={cn("glass-card p-6 overflow-hidden", className)}>
            {title && <h3 className="text-xl font-semibold mb-6 text-sage">{title}</h3>}
            {children}
        </div>
    );
}
