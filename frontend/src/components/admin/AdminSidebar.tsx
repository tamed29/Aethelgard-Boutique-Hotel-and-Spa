'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Bed, 
    Image as ImageIcon, 
    BookOpen, 
    Settings, 
    LogOut, 
    Bell,
    ChevronRight,
    Zap,
    Users,
    Quote,
    Newspaper,
    Bath,
    Mail,
    Sun,
    Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNotifications } from '@/context/NotificationContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const NAV_ITEMS = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Room Control', href: '/admin/rooms', icon: Bed },
    { label: 'Media Library', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Reservation Hub', href: '/admin/bookings', icon: BookOpen },
    { label: 'Communication Hub', href: '/admin/inquiries', icon: Mail },
    { label: 'Spa Reservations', href: '/admin/spa', icon: Bath },
    { label: 'Guest Voices', href: '/admin/reviews', icon: Quote },
    { label: 'News & Events', href: '/admin/news', icon: Newspaper },
    { label: 'Experience Desk', href: '/admin/experiences', icon: Zap },
    { label: 'Staff & Roles', href: '/admin/users', icon: Users },
    { label: 'Terminal Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [notifications, setNotifications] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const { unreadCount } = useNotifications();

    useEffect(() => {
        // Load theme preference
        const savedTheme = localStorage.getItem('admin-theme') as 'dark' | 'light';
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('admin-theme', next);
        document.documentElement.classList.toggle('light-theme', next === 'light');
    };

    const handleLogout = async () => {
        // Clear JWT cookie and redirect
        document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'userRole=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
    };

    return (
        <aside 
            className={cn(
                "h-screen bg-[var(--admin-bg)] brightness-95 border-r border-[var(--admin-border)] transition-all duration-700 flex flex-col z-50 sticky top-0",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Header / Logo */}
            <div className="p-8 flex items-center gap-4 border-b border-[var(--admin-border)] bg-[var(--admin-accent)]/5">
                <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/10 border border-[var(--admin-border)] flex items-center justify-center shrink-0">
                    <span className="text-[var(--admin-accent)] font-serif text-xl">A</span>
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <span className="text-[var(--admin-text)] font-serif text-lg tracking-widest uppercase">Admin</span>
                        <span className="text-[8px] uppercase tracking-[0.4em] text-[var(--admin-text)] opacity-40 font-black">Control Terminal</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto relative">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    // Check if this link should show notifications
                    const showNotifications = (item.href === '/admin/bookings' || item.href === '/admin/reviews' || item.href === '/admin/inquiries') && unreadCount > 0;

                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 group relative",
                                isActive 
                                    ? "bg-[var(--admin-accent)] text-[var(--admin-bg)] shadow-xl shadow-black/5" 
                                    : "text-[var(--admin-text)] opacity-40 hover:text-[var(--admin-text)] hover:opacity-100 hover:bg-[var(--admin-accent)]/5"
                            )}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                            {!isCollapsed && (
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black">{item.label}</span>
                            )}
                            
                            {/* Notification Badge with Pulse Animation */}
                            {showNotifications && (
                                <span className="absolute right-4 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                                    {unreadCount}
                                </span>
                            )}

                            {isActive && (
                                <motion.div 
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-[var(--admin-bg)] rounded-r-full"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[var(--admin-border)] bg-[var(--admin-accent)]/5 space-y-2">
                <button 
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-4 px-4 py-4 text-[var(--admin-text)] opacity-40 hover:opacity-100 hover:bg-[var(--admin-accent)]/5 rounded-2xl transition-all group"
                >
                    <div className="group-hover:rotate-12 transition-transform duration-500 text-[var(--admin-accent)]">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    {!isCollapsed && <span className="text-[9px] uppercase tracking-[0.4em] font-black">{theme === 'dark' ? 'Switch to Light' : 'Return to Dark'}</span>}
                </button>

                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center gap-4 px-4 py-4 text-[var(--admin-text)] opacity-40 hover:opacity-100 hover:bg-[var(--admin-accent)]/5 rounded-2xl transition-all group"
                >
                    <div className={cn("transition-transform duration-700", isCollapsed ? "rotate-0" : "rotate-180")}>
                        <ChevronRight size={20} />
                    </div>
                    {!isCollapsed && <span className="text-[9px] uppercase tracking-[0.4em] font-black">Collapse Terminal</span>}
                </button>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all group"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="text-[9px] uppercase tracking-[0.4em] font-black">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
