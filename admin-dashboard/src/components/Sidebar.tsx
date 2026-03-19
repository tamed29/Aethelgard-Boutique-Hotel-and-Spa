import { useState } from 'react';
import {
    LayoutDashboard,
    Hotel,
    CalendarCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sparkles,
    Shield,
    Users,
    Zap,
    Star
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Hotel, label: 'Inventory', path: '/inventory' },
    { icon: CalendarCheck, label: 'Bookings', path: '/bookings' },
    { icon: Sparkles, label: 'Concierge', path: '/concierge' },
    { icon: Zap, label: 'Pricing Engine', path: '/pricing' },
    { icon: Star, label: 'Experiences', path: '/experiences' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Shield, label: 'Audit Terminal', path: '/audit' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside className={cn(
            "relative flex flex-col transition-all duration-500 h-screen sticky top-0 bg-moss-dark border-right border-sage/10 z-20",
            isCollapsed ? "w-24" : "w-72"
        )}>
            {/* Logo Section */}
            <div className="p-8 flex items-center justify-between overflow-hidden">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <h1 className="text-xl font-serif text-cream tracking-[0.3em] font-medium leading-none">AETHELGARD</h1>
                        <span className="text-[8px] uppercase tracking-[0.5em] text-sage/40 mt-2 font-bold ml-1">Boutique Estate</span>
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-full border border-sage/30 flex items-center justify-center text-sage font-serif text-xs">A</div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-full transition-all duration-300 text-sage/40 hover:text-sage"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 space-y-1.5 mt-8">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative",
                                isActive
                                    ? "bg-sage/5 text-sage border border-sage/20 shadow-[0_0_20px_rgba(186,192,149,0.05)]"
                                    : "text-sage/40 hover:bg-white/5 hover:text-sage/70"
                            )}
                        >
                            <item.icon size={20} className={cn("shrink-0 transition-transform duration-500 group-hover:scale-110", isActive ? "text-sage" : "group-hover:text-sage/80")} />
                            {!isCollapsed && (
                                <span className={cn(
                                    "font-serif tracking-widest text-xs uppercase font-medium",
                                    isActive ? "text-cream" : ""
                                )}>
                                    {item.label}
                                </span>
                            )}
                            {isActive && (
                                <motion.div 
                                    layoutId="indicator"
                                    className="absolute right-4 w-1 h-1 rounded-full bg-sage shadow-[0_0_10px_rgba(186,192,149,1)]" 
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / System Status */}
            <div className="p-6 border-t border-white/5 overflow-hidden">
                {!isCollapsed && (
                    <div className="bg-moss-light/30 rounded-2xl p-4 mb-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={14} className="text-sage" />
                            <span className="text-[8px] uppercase tracking-widest font-bold font-sans text-sage/60">System Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]" />
                            <span className="text-[10px] text-cream/60">Encryption: Active</span>
                        </div>
                    </div>
                )}
                <button className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl text-red-500/40 hover:bg-red-500/5 hover:text-red-400 transition-all duration-500 w-full group",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                    {!isCollapsed && <span className="font-serif tracking-widest text-xs uppercase font-bold">Terminate Session</span>}
                </button>
            </div>
            
            {/* Background design element */}
            {!isCollapsed && (
                <div className="absolute top-1/2 left-0 w-full h-full opacity-5 pointer-events-none -z-10 translate-y-1/2">
                    <div className="w-64 h-64 border border-sage rounded-full scale-150" />
                </div>
            )}
        </aside>
    );
}
