import { useState } from 'react';
import {
    LayoutDashboard,
    Hotel,
    CalendarCheck,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Hotel, label: 'Inventory', path: '/inventory' },
    { icon: CalendarCheck, label: 'Bookings', path: '/bookings' },
    { icon: Sparkles, label: 'Concierge', path: '/concierge' },
    { icon: Settings, label: 'Pricing Engine', path: '/pricing' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside className={cn(
            "glass-sidebar flex flex-col transition-all duration-300 h-screen sticky top-0",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <h1 className="text-2xl font-serif text-sage-light tracking-widest">AETHELGARD</h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-sage"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-8">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-white/10 text-cream border border-sage/20"
                                    : "text-sage/60 hover:bg-white/5 hover:text-sage"
                            )}
                        >
                            <item.icon size={22} className={cn("shrink-0", isActive ? "text-sage" : "group-hover:text-sage")} />
                            {!isCollapsed && <span className="font-medium tracking-wide">{item.label}</span>}
                            {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sage shadow-[0_0_8px_rgba(186,192,149,0.8)]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button className={cn(
                    "flex items-center gap-4 p-3 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <LogOut size={22} />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
