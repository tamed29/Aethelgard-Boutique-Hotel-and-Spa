'use client';

import { useState, useEffect, useRef } from 'react';
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
    Moon,
    X,
    CheckCheck,
    Hotel,
    MessageSquare,
    Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from '@/context/NotificationContext';

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

const NOTIF_ICON_MAP = {
    'Booking': <Hotel size={16} />,
    'Inquiry': <MessageSquare size={16} />,
    'Spa Booking': <Leaf size={16} />,
};

function NotificationPanel({ onClose }: { onClose: () => void }) {
    const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: -10, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full top-0 ml-3 w-[360px] bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[1.5rem] shadow-2xl shadow-black/40 overflow-hidden z-[100]"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--admin-border)] bg-[var(--admin-accent)]/5">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--admin-text)]">Signal Log</h3>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--admin-accent)] opacity-40 font-black mt-0.5">
                        {notifications.length === 0 ? 'No transmissions' : `${notifications.length} total · ${notifications.filter(n => !n.read).length} unread`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                        <>
                            <button
                                onClick={markAllAsRead}
                                title="Mark all as read"
                                className="p-2 text-[var(--admin-accent)] opacity-40 hover:opacity-100 rounded-xl hover:bg-[var(--admin-accent)]/10 transition-all"
                            >
                                <CheckCheck size={16} />
                            </button>
                            <button
                                onClick={clearAll}
                                title="Clear all"
                                className="p-2 text-rose-400 opacity-40 hover:opacity-100 rounded-xl hover:bg-rose-500/10 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--admin-text)] opacity-40 hover:opacity-100 rounded-xl hover:bg-[var(--admin-accent)]/10 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                        <Bell size={32} className="mx-auto text-[var(--admin-accent)] opacity-20" strokeWidth={1} />
                        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-[var(--admin-text)] opacity-20">No signals received</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notifications.map((n) => (
                            <motion.a
                                key={n.id}
                                href={n.href}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => markAsRead(n.id)}
                                className={cn(
                                    "flex gap-4 items-start px-6 py-5 border-b border-[var(--admin-border)] transition-all hover:bg-[var(--admin-accent)]/5 cursor-pointer",
                                    !n.read && "bg-[var(--admin-accent)]/[0.04]"
                                )}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                    n.type === 'Booking' ? 'bg-blue-500/15 text-blue-400' :
                                    n.type === 'Inquiry' ? 'bg-amber-500/15 text-amber-400' :
                                    'bg-emerald-500/15 text-emerald-400'
                                )}>
                                    {NOTIF_ICON_MAP[n.type]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-[11px] font-black uppercase tracking-wide text-[var(--admin-text)] leading-tight">{n.title}</p>
                                        {!n.read && (
                                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 shadow-[0_0_6px_rgba(244,63,94,0.7)]" />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-[var(--admin-text)] opacity-60 mt-1 leading-relaxed truncate">{n.description}</p>
                                    <p className="text-[9px] uppercase tracking-widest font-black text-[var(--admin-accent)] opacity-40 mt-2">{timeAgo(n.timestamp)}</p>
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
}

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const { unreadCount, notifications } = useNotifications();

    useEffect(() => {
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
        document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'userRole=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('adminToken');
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
                    // Determine which nav items should show notification badge
                    const navUnread = notifications.filter(n =>
                        (item.href === '/admin/bookings' && n.type === 'Booking') ||
                        (item.href === '/admin/inquiries' && n.type === 'Inquiry') ||
                        (item.href === '/admin/spa' && n.type === 'Spa Booking')
                    ).filter(n => !n.read).length;

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
                            
                            {navUnread > 0 && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                            )}
                            
                            {isActive && (
                                <motion.div 
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-[var(--admin-bg)] rounded-r-full"
                                />
                            )}
                        </Link>
                    );
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
