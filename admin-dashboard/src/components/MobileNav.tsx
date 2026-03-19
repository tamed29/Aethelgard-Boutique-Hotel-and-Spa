import { 
    LayoutDashboard, 
    Hotel, 
    CalendarCheck, 
    Settings, 
    Sparkles,
    Menu,
    X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dash', path: '/' },
    { icon: Hotel, label: 'Inv', path: '/inventory' },
    { icon: CalendarCheck, label: 'Book', path: '/bookings' },
    { icon: Sparkles, label: 'Chat', path: '/concierge' },
    { icon: Settings, label: 'Price', path: '/pricing' },
];

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-md">
            {/* Bottom Floating Bar */}
            <div className="bg-moss-dark/80 backdrop-blur-2xl border border-sage/20 rounded-2xl p-2 flex justify-between items-center shadow-2xl">
                {menuItems.slice(0, 4).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300",
                                isActive ? "bg-sage/10 text-sage" : "text-sage/40 hover:text-sage/60"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="text-[8px] uppercase tracking-widest mt-1 font-bold">{item.label}</span>
                        </Link>
                    );
                })}
                
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-sage text-moss-dark rounded-xl shadow-lg shadow-sage/20 transition-transform active:scale-95"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Bottom Sheet Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-20 left-0 right-0 bg-moss-dark border border-sage/10 rounded-3xl p-6 -z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="w-12 h-1.5 bg-sage/10 rounded-full mx-auto mb-6" />
                            <h3 className="font-serif text-xl text-cream mb-6 text-center uppercase tracking-widest">Estate Management</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {menuItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300",
                                                isActive 
                                                    ? "bg-sage/5 border-sage/30 text-sage shadow-inner" 
                                                    : "bg-white/5 border-white/5 text-sage/40 hover:bg-white/10"
                                            )}
                                        >
                                            <item.icon size={24} />
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-center">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center text-sage font-serif text-sm">MC</div>
                                    <div>
                                        <p className="text-[10px] text-cream font-medium uppercase tracking-widest">Master Concierge</p>
                                        <p className="text-[8px] text-sage/30 uppercase tracking-tighter">System Access: Root</p>
                                    </div>
                                </div>
                                <button className="text-red-400/60 hover:text-red-400 flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-widest font-bold font-serif">Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
